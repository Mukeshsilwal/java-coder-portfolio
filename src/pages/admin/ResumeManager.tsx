import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CVUploader } from '@/components/admin/CVUploader';
import { axiosInstance } from '@/api/axios';

interface CVMetadata {
    url: string;
    publicId: string;
    uploadedAt: string;
}

const ResumeManager = () => {
    const [cvMetadata, setCvMetadata] = useState<CVMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCVMetadata();
    }, []);

    const fetchCVMetadata = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/admin/media/cv/active');
            // Handle ApiResponse format: { status, message, data }
            if (data.status === 'SUCCESS' && data.data) {
                setCvMetadata({
                    url: data.data.url,
                    publicId: data.data.publicId,
                    uploadedAt: data.data.uploadedAt
                });
            }
        } catch (error) {
            console.error('No active CV found:', error);
            setCvMetadata(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (url: string) => {
        fetchCVMetadata();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
                <p className="text-muted-foreground mt-2">
                    Upload and manage your CV/Resume. Only one CV can be active at a time.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upload Section */}
                <CVUploader
                    onUploadSuccess={handleUploadSuccess}
                    currentCVUrl={cvMetadata?.url}
                />

                {/* Status Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Status</CardTitle>
                        <CardDescription>
                            Details of your currently active resume
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : cvMetadata ? (
                            <div className="space-y-4">
                                {/* Active Status */}
                                <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-medium text-green-900 dark:text-green-100">
                                            CV Active
                                        </h3>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Your resume is live and available for download
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                        Active
                                    </Badge>
                                </div>

                                {/* Metadata */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <span className="font-medium">
                                            {new Date(cvMetadata.uploadedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="pt-2 space-y-2">
                                        <a
                                            href={cvMetadata.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button variant="outline" className="w-full">
                                                <Download className="mr-2 h-4 w-4" />
                                                Preview / Download CV
                                            </Button>
                                        </a>

                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Public Download URL:</p>
                                            <code className="text-xs break-all bg-background px-2 py-1 rounded border">
                                                {window.location.origin}/api/public/media/cv/download
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                                <div className="p-3 rounded-full bg-muted">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">No Resume Found</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Upload your CV to get started
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Information Card */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
                <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100">
                        How It Works
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Upload your CV in PDF format (maximum 10MB)</li>
                        <li>Only one CV can be active at a time - uploading a new CV automatically replaces the old one</li>
                        <li>Your CV is stored securely on Cloudinary CDN for fast global access</li>
                        <li>The public download link is automatically available on your portfolio</li>
                        <li>All uploads are validated for file type and size before processing</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumeManager;
