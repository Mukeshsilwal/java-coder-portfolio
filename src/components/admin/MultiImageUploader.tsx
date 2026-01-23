import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { axiosInstance } from '@/api/axios';

interface MultiImageUploaderProps {
    folder: string;
    onUploadSuccess?: (urls: string[]) => void;
    maxFiles?: number;
    existingImages?: string[];
}

export const MultiImageUploader = ({
    folder,
    onUploadSuccess,
    maxFiles = 5,
    existingImages = []
}: MultiImageUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Validate total files
        if (selectedFiles.length + acceptedFiles.length > maxFiles) {
            toast.error('Too many files', {
                description: `Maximum ${maxFiles} files allowed`
            });
            return;
        }

        // Validate each file
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        acceptedFiles.forEach(file => {
            // Check size
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large`, {
                    description: 'Maximum file size is 5MB'
                });
                return;
            }

            // Check type
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                toast.error(`${file.name} is not a valid image`, {
                    description: 'Only JPG, PNG, WEBP, and SVG files are allowed'
                });
                return;
            }

            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    }, [selectedFiles, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'image/svg+xml': ['.svg']
        },
        maxFiles,
        multiple: true
    });

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeUploadedImage = async (url: string) => {
        try {
            // Extract publicId from URL
            const publicId = extractPublicId(url);
            if (publicId) {
                await axiosInstance.delete('/admin/media/by-public-id', {
                    params: { publicId }
                });
            }
            setUploadedUrls(prev => prev.filter(u => u !== url));
            toast.success('Image deleted');
        } catch (error) {
            toast.error('Failed to delete image');
        }
    };

    const extractPublicId = (url: string): string | null => {
        try {
            const parts = url.split('/upload/');
            if (parts.length < 2) return null;
            let path = parts[1];
            if (path.match(/^v\d+\//)) {
                path = path.replace(/^v\d+\//, '');
            }
            const lastDot = path.lastIndexOf('.');
            if (lastDot !== -1) {
                path = path.substring(0, lastDot);
            }
            return path;
        } catch {
            return null;
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', folder);

                const { data } = await axiosInstance.post('/admin/media/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Handle ApiResponse format: { status, message, data }
                if (data.status === 'SUCCESS' && data.data) {
                    uploadedUrls.push(data.data.url);
                }
            }

            setUploadedUrls(prev => [...prev, ...uploadedUrls]);
            setSelectedFiles([]);
            setPreviews(prev => {
                prev.forEach(p => URL.revokeObjectURL(p));
                return [];
            });

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
            onUploadSuccess?.(uploadedUrls);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upload images';
            toast.error('Upload failed', {
                description: errorMessage
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-sm">Drop images here...</p>
                    ) : (
                        <>
                            <p className="text-sm font-medium">
                                Drag & drop images, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, WEBP, SVG (max 5MB each, up to {maxFiles} files)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleUpload} disabled={uploading} className="w-full">
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            `Upload ${selectedFiles.length} Image(s)`
                        )}
                    </Button>
                </div>
            )}

            {/* Uploaded Images */}
            {uploadedUrls.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploaded Images ({uploadedUrls.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {uploadedUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Uploaded ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeUploadedImage(url)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
