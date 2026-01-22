import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ImageUploaderProps {
    currentImageUrl?: string;
    onUpload: (file: File) => Promise<any>;
    aspectRatio?: "video" | "square" | "portrait";
    label?: string;
    className?: string;
}

export function ImageUploader({
    currentImageUrl,
    onUpload,
    aspectRatio = "video",
    label = "Upload Image",
    className
}: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            setUploading(true);
            setProgress(10); // Start progress

            // We pass the file to the parent handler
            await onUpload(file);

            setProgress(100);
            toast.success("Image uploaded successfully");
            setPreview(null); // Clear preview implies we expect parent to update currentImageUrl
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
            setPreview(null);
        } finally {
            setUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg']
        },
        maxFiles: 1,
        multiple: false
    });

    const aspectRatioClass = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]"
    }[aspectRatio];

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{label}</label>
            </div>

            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isDragActive ? 'border-primary bg-zinc-100 dark:bg-zinc-800' : 'border-zinc-200 dark:border-zinc-800'
                    }`}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="p-4 bg-background rounded-full border shadow-sm">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {isDragActive ? "Drop the image here" : "Click or drag to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF (max. 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            {(preview || currentImageUrl) && !uploading && (
                <div className="relative rounded-lg overflow-hidden border bg-zinc-100 dark:bg-zinc-900 group">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {preview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                                className="p-1 rounded-full bg-background/80 hover:bg-background text-foreground shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className={`relative w-full ${aspectRatioClass} flex items-center justify-center`}>
                        <img
                            src={preview || currentImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
