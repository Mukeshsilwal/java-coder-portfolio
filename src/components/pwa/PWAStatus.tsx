import { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Wifi, WifiOff, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * PWA Status Component
 * Displays current PWA status for debugging and user information
 * Can be added to admin panel or settings page
 */
export const PWAStatus = () => {
    const { isInstallable, isInstalled, isOnline } = usePWA();
    const [swStatus, setSwStatus] = useState<'none' | 'registered' | 'active'>('none');
    const [cacheSize, setCacheSize] = useState<number>(0);

    useEffect(() => {
        // Check service worker status
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    if (registration.active) {
                        setSwStatus('active');
                    } else {
                        setSwStatus('registered');
                    }
                }
            });
        }

        // Estimate cache size
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then((estimate) => {
                setCacheSize(estimate.usage || 0);
            });
        }
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    PWA Status
                </CardTitle>
                <CardDescription>
                    Progressive Web App features and capabilities
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isOnline ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                            <WifiOff className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="text-sm font-medium">Connection</span>
                    </div>
                    <Badge variant={isOnline ? 'default' : 'secondary'}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                </div>

                {/* Installation Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Installation</span>
                    </div>
                    <Badge variant={isInstalled ? 'default' : isInstallable ? 'secondary' : 'outline'}>
                        {isInstalled ? 'Installed' : isInstallable ? 'Installable' : 'Not Available'}
                    </Badge>
                </div>

                {/* Service Worker Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {swStatus === 'active' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">Service Worker</span>
                    </div>
                    <Badge variant={swStatus === 'active' ? 'default' : 'secondary'}>
                        {swStatus === 'active' ? 'Active' : swStatus === 'registered' ? 'Registered' : 'None'}
                    </Badge>
                </div>

                {/* Cache Size */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cache Size</span>
                    <span className="text-sm text-muted-foreground">
                        {formatBytes(cacheSize)}
                    </span>
                </div>

                {/* PWA Features */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Enabled Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Offline Mode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Caching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Install Prompt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Auto Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Push Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs">Background Sync</span>
                        </div>
                    </div>
                </div>

                {/* Browser Support */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Browser Capabilities</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Service Worker:</span>
                            <span className="text-green-500">
                                {'serviceWorker' in navigator ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Push Notifications:</span>
                            <span className="text-green-500">
                                {'PushManager' in window ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Background Sync:</span>
                            <span className="text-green-500">
                                {'SyncManager' in window ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>IndexedDB:</span>
                            <span className="text-green-500">
                                {'indexedDB' in window ? '✓' : '✗'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
