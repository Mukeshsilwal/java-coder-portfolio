import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UpdatePrompt = () => {
    const { updateAvailable, updateApp } = usePWA();

    useEffect(() => {
        if (updateAvailable) {
            console.log('New version available!');
        }
    }, [updateAvailable]);

    const handleUpdate = () => {
        updateApp();
    };

    return (
        <AnimatePresence>
            {updateAvailable && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50"
                >
                    <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white rounded-2xl shadow-2xl p-5 backdrop-blur-lg border border-purple-500/20">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <RefreshCw className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">Update Available</h3>
                                <p className="text-sm text-purple-100 mb-3">
                                    A new version of the app is ready. Update now for the latest features!
                                </p>

                                <Button
                                    onClick={handleUpdate}
                                    className="bg-white text-purple-900 hover:bg-purple-50 font-semibold"
                                    size="sm"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Update Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
