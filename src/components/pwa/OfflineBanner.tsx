import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner = () => {
    const { isOnline } = usePWA();
    const [showBanner, setShowBanner] = useState(!isOnline);

    useEffect(() => {
        if (!isOnline) {
            setShowBanner(true);
        } else {
            // Delay hiding to show "Back online" message
            const timer = setTimeout(() => setShowBanner(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 z-50"
                >
                    <div
                        className={`${isOnline
                                ? 'bg-gradient-to-r from-green-600 to-green-500'
                                : 'bg-gradient-to-r from-orange-600 to-red-600'
                            } text-white py-3 px-4 shadow-lg`}
                    >
                        <div className="container mx-auto flex items-center justify-center gap-3">
                            {isOnline ? (
                                <>
                                    <Wifi className="w-5 h-5 animate-pulse" />
                                    <span className="font-medium">You're back online!</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-5 h-5 animate-pulse" />
                                    <span className="font-medium">
                                        You're offline - Viewing cached content
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
