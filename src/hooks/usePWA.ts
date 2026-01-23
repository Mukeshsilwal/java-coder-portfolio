import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

interface PWAInstallPrompt extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [wb, setWb] = useState<Workbox | null>(null);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Register service worker
        if ('serviceWorker' in navigator) {
            const workbox = new Workbox('/sw.js');

            // Listen for waiting service worker
            workbox.addEventListener('waiting', () => {
                setUpdateAvailable(true);
            });

            // Listen for controlling service worker
            workbox.addEventListener('controlling', () => {
                window.location.reload();
            });

            workbox.register();
            setWb(workbox);
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as PWAInstallPrompt);
            setIsInstallable(true);
        };

        // Listen for app installed
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        // Listen for online/offline
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return false;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsInstallable(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error installing app:', error);
            return false;
        }
    };

    const updateApp = () => {
        if (wb) {
            wb.messageSkipWaiting();
        }
    };

    return {
        isInstallable,
        isInstalled,
        isOnline,
        updateAvailable,
        installApp,
        updateApp,
    };
};

// Hook for tracking user engagement for install prompt
export const useInstallPromptTrigger = () => {
    const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
    const [scrollCount, setScrollCount] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);

    useEffect(() => {
        // Track time spent
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);

        // Track scroll events
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) > 100) {
                setScrollCount((prev) => prev + 1);
                lastScrollY = currentScrollY;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        // Show prompt after 30 seconds OR 2 scrolls
        if (timeSpent >= 30 || scrollCount >= 2) {
            setShouldShowPrompt(true);
        }
    }, [timeSpent, scrollCount]);

    return { shouldShowPrompt, setShouldShowPrompt };
};

// Hook for push notifications
export const usePushNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    };

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications not supported');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
                ),
            });
            setSubscription(sub);
            return sub;
        } catch (error) {
            console.error('Error subscribing to push:', error);
            return null;
        }
    };

    const unsubscribeFromPush = async () => {
        if (subscription) {
            await subscription.unsubscribe();
            setSubscription(null);
        }
    };

    return {
        permission,
        subscription,
        requestPermission,
        subscribeToPush,
        unsubscribeFromPush,
    };
};

// Utility function for VAPID key conversion
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Background sync hook
export const useBackgroundSync = () => {
    const syncData = async (tag: string, data: unknown) => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await (registration as any).sync.register(tag);

                // Store data in IndexedDB for later sync
                const db = await openDB();
                await db.put('sync-queue', data, tag);

                return true;
            } catch (error) {
                console.error('Background sync failed:', error);
                return false;
            }
        }
        return false;
    };

    return { syncData };
};

// Simple IndexedDB wrapper
async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pwa-db', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('sync-queue')) {
                db.createObjectStore('sync-queue');
            }
        };
    });
}
