import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA, useInstallPromptTrigger } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
    const { isInstallable, isInstalled, installApp } = usePWA();
    const { shouldShowPrompt, setShouldShowPrompt } = useInstallPromptTrigger();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed before
        const wasDismissed = localStorage.getItem('pwa-install-dismissed');
        if (wasDismissed) {
            setDismissed(true);
        }
    }, []);

    const handleInstall = async () => {
        const success = await installApp();
        if (success) {
            setShouldShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShouldShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Don't show if already installed, not installable, dismissed, or shouldn't show yet
    if (isInstalled || !isInstallable || dismissed || !shouldShowPrompt) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
            >
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl shadow-2xl p-5 backdrop-blur-lg border border-blue-500/20">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                            <Smartphone className="w-6 h-6" />
                        </div>

                        <div className="flex-1 pr-6">
                            <h3 className="font-bold text-lg mb-1">Install Portfolio App</h3>
                            <p className="text-sm text-blue-100 mb-4">
                                Install this app on your device for quick access and offline viewing!
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleInstall}
                                    className="bg-white text-blue-900 hover:bg-blue-50 font-semibold"
                                    size="sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Install Now
                                </Button>
                                <Button
                                    onClick={handleDismiss}
                                    variant="ghost"
                                    className="text-white hover:bg-white/10"
                                    size="sm"
                                >
                                    Maybe Later
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Benefits list */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-3 gap-2 text-xs text-blue-100">
                            <div className="flex items-center gap-1">
                                <span className="text-green-400">✓</span>
                                <span>Offline Access</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-green-400">✓</span>
                                <span>Fast Loading</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-green-400">✓</span>
                                <span>App-like Feel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export const InstallButton = () => {
    const { isInstallable, isInstalled, installApp } = usePWA();

    if (isInstalled || !isInstallable) {
        return null;
    }

    const handleInstall = async () => {
        await installApp();
    };

    return (
        <Button
            onClick={handleInstall}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            <Download className="w-4 h-4" />
            Install App
        </Button>
    );
};
