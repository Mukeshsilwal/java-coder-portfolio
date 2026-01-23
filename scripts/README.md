# PWA Icon Generator

This script generates all required PWA icons from a single source image.

## Requirements

- Node.js 14+
- Source image (PNG, JPG, or SVG) - minimum 512x512px recommended

## Installation

The script will automatically install `sharp` if not already installed.

Or install manually:
```bash
npm install sharp
```

## Usage

### Basic Usage
```bash
node scripts/generate-icons.js <path-to-source-image>
```

### Example
```bash
# Using a PNG file
node scripts/generate-icons.js ./logo.png

# Using a JPG file
node scripts/generate-icons.js ./assets/icon-source.jpg

# Using an SVG file
node scripts/generate-icons.js ./icon.svg
```

## Generated Icons

The script generates the following icons in `public/icons/`:

### Standard Icons
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### Maskable Icons (for Android)
- icon-192x192-maskable.png
- icon-512x512-maskable.png

### Favicon
- icon-32x32.png

## Source Image Requirements

For best results, your source image should:
- Be at least 512x512 pixels
- Have a square aspect ratio (1:1)
- Be in PNG, JPG, or SVG format
- Have transparent background (for PNG)
- Use simple, recognizable design
- Look good at small sizes

## Maskable Icons

Maskable icons include a safe zone (20% padding) to ensure the icon looks good on all Android devices, even when masked to different shapes (circle, squircle, etc.).

## Troubleshooting

### Error: "Sharp is not installed"
Run: `npm install sharp`

### Error: "Source image not found"
Check the path to your source image is correct

### Error: "Failed to generate icon"
Ensure your source image is valid and not corrupted

## Manual Icon Generation

If you prefer to generate icons manually:

### Option 1: Online Tools
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

### Option 2: ImageMagick
```bash
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 512x512 icon-512x512.png
# ... repeat for all sizes
```

### Option 3: Photoshop/GIMP
1. Open source image
2. Resize to each required size
3. Export as PNG
4. Save to public/icons/

## Verification

After generating icons:

1. Check `public/icons/` directory
2. Verify all icon sizes exist
3. Open icons to ensure they look correct
4. Test PWA installation
5. Run Lighthouse audit

## Next Steps

After generating icons:
1. Update `manifest.json` if needed
2. Build your app: `npm run build`
3. Test locally: `npm run preview`
4. Deploy to production
5. Test PWA installation on real devices
