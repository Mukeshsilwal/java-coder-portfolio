#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * 
 * This script generates all required PWA icons from a source image.
 * 
 * Usage:
 *   node scripts/generate-icons.js <source-image-path>
 * 
 * Example:
 *   node scripts/generate-icons.js ./icon-source.png
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes required for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');

// Colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkSharpInstalled() {
    try {
        await import('sharp');
        return true;
    } catch (e) {
        return false;
    }
}

function installSharp() {
    log('Installing sharp...', 'yellow');
    try {
        execSync('npm install sharp', { stdio: 'inherit' });
        log('✓ Sharp installed successfully', 'green');
        return true;
    } catch (error) {
        log('✗ Failed to install sharp', 'red');
        return false;
    }
}

async function generateIcons(sourcePath) {
    const { default: sharp } = await import('sharp');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        log(`✓ Created directory: ${OUTPUT_DIR}`, 'green');
    }

    // Validate source image
    if (!fs.existsSync(sourcePath)) {
        log(`✗ Source image not found: ${sourcePath}`, 'red');
        process.exit(1);
    }

    log(`\nGenerating PWA icons from: ${sourcePath}`, 'cyan');
    log('━'.repeat(50), 'cyan');

    // Get source image metadata
    const metadata = await sharp(sourcePath).metadata();
    log(`Source image: ${metadata.width}x${metadata.height} (${metadata.format})`, 'bright');

    // Generate each icon size
    for (const size of ICON_SIZES) {
        const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

        try {
            await sharp(sourcePath)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 30, g: 58, b: 138, alpha: 1 } // #1e3a8a
                })
                .png({ quality: 100 })
                .toFile(outputPath);

            log(`✓ Generated: icon-${size}x${size}.png`, 'green');
        } catch (error) {
            log(`✗ Failed to generate icon-${size}x${size}.png: ${error.message}`, 'red');
        }
    }

    log('━'.repeat(50), 'cyan');
    log('✓ All icons generated successfully!', 'green');
    log(`\nIcons saved to: ${OUTPUT_DIR}`, 'bright');
}

async function generateMaskableIcons(sourcePath) {
    const { default: sharp } = await import('sharp');

    log('\nGenerating maskable icons...', 'cyan');

    // Maskable icons need extra padding (safe zone)
    const maskableSizes = [192, 512];

    for (const size of maskableSizes) {
        const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`);
        const iconSize = Math.floor(size * 0.8); // 80% of canvas for safe zone
        const padding = Math.floor((size - iconSize) / 2);

        try {
            // Create a canvas with background color
            const canvas = sharp({
                create: {
                    width: size,
                    height: size,
                    channels: 4,
                    background: { r: 30, g: 58, b: 138, alpha: 1 }
                }
            });

            // Resize source image to fit safe zone
            const resizedIcon = await sharp(sourcePath)
                .resize(iconSize, iconSize, { fit: 'contain' })
                .toBuffer();

            // Composite resized icon onto canvas
            await canvas
                .composite([{
                    input: resizedIcon,
                    top: padding,
                    left: padding
                }])
                .png({ quality: 100 })
                .toFile(outputPath);

            log(`✓ Generated: icon-${size}x${size}-maskable.png`, 'green');
        } catch (error) {
            log(`✗ Failed to generate maskable icon: ${error.message}`, 'red');
        }
    }
}

async function generateFavicon(sourcePath) {
    const { default: sharp } = await import('sharp');

    log('\nGenerating favicon...', 'cyan');

    const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');

    try {
        // Generate 32x32 PNG first
        const pngBuffer = await sharp(sourcePath)
            .resize(32, 32, { fit: 'contain' })
            .png()
            .toBuffer();

        // Note: Converting to .ico requires additional library
        // For now, we'll just create a 32x32 PNG
        const png32Path = path.join(OUTPUT_DIR, 'icon-32x32.png');
        await sharp(pngBuffer).toFile(png32Path);

        log(`✓ Generated: icon-32x32.png`, 'green');
        log(`ℹ For .ico file, use an online converter or install 'to-ico' package`, 'yellow');
    } catch (error) {
        log(`✗ Failed to generate favicon: ${error.message}`, 'red');
    }
}

async function main() {
    log('\n🎨 PWA Icon Generator', 'bright');
    log('━'.repeat(50), 'cyan');

    // Check if source image is provided
    const sourcePath = process.argv[2];

    if (!sourcePath) {
        log('Usage: node scripts/generate-icons.js <source-image-path>', 'yellow');
        log('Example: node scripts/generate-icons.js ./icon-source.png', 'yellow');
        process.exit(1);
    }

    // Check if sharp is installed
    const sharpInstalled = await checkSharpInstalled();
    if (!sharpInstalled) {
        log('Sharp is not installed. It is required for image processing.', 'yellow');
        const installed = installSharp();
        if (!installed) {
            log('\nPlease install sharp manually:', 'red');
            log('  npm install sharp', 'yellow');
            process.exit(1);
        }
    }

    // Generate icons
    try {
        await generateIcons(sourcePath);
        await generateMaskableIcons(sourcePath);
        await generateFavicon(sourcePath);

        log('\n✅ Icon generation complete!', 'green');
        log('\nNext steps:', 'bright');
        log('1. Verify icons in public/icons/', 'cyan');
        log('2. Update manifest.json if needed', 'cyan');
        log('3. Test PWA installation', 'cyan');
    } catch (error) {
        log(`\n✗ Error: ${error.message}`, 'red');
        process.exit(1);
    }
}

main();
