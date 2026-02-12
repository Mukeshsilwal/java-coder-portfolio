import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { axiosInstance } from '@/api/axios';

interface CVUploaderProps {
    onUploadSuccess?: (url: string) => void;
    currentCVUrl?: string;
}

export const CVUploader = ({ onUploadSuccess, currentCVUrl }: CVUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentCVUrl || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File too large', {
                    description: 'Maximum file size is 10MB'
                });
                return;
            }

            // Validate file type (PDF Only)
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                toast.error('Invalid file type', {
                    description: 'Only PDF files are allowed'
                });
                return;
            }

            setSelectedFile(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const { data } = await axiosInstance.post('/admin/media/upload/cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                }
            });

            // Handle ApiResponse format: { status, message, data }
            if (data.status === 'SUCCESS' && data.data) {
                setPreviewUrl(data.data.url);
                setSelectedFile(null);
                toast.success('CV uploaded successfully', {
                    description: data.message || 'Your resume has been uploaded and is now active'
                });
                onUploadSuccess?.(data.data.url);
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to upload CV';
            toast.error('Upload failed', {
                description: errorMessage
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>CV / Resume Upload</CardTitle>
                <CardDescription>
                    Upload your CV in PDF format (max 10MB). Only one CV can be active at a time.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Drag & Drop Zone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        {isDragActive ? (
                            <p className="text-sm font-medium">Drop your CV here...</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium">
                                    Drag & drop your CV here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Supports PDF files up to 10MB
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                        <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearSelection}
                            disabled={uploading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uploading...</span>
                            <span className="font-medium">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}

                {/* Current CV Status */}
                {previewUrl && !selectedFile && (
                    <div className="flex items-start gap-3 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Active CV
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                Your CV is currently active and available for download
                            </p>
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                            >
                                View Current CV
                            </a>
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="w-full"
                >
                    {uploading ? 'Uploading...' : currentCVUrl ? 'Replace CV' : 'Upload CV'}
                </Button>
            </CardContent>
        </Card>
    );
};
