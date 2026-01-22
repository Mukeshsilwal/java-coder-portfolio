import { useState, useEffect } from 'react';
import { resumeService, ResumeMetadata } from '@/services/resumeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Trash2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress"

const ResumeManager = () => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<ResumeMetadata | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        setLoading(true);
        try {
            const data = await resumeService.getMetadata();
            setMetadata(data);
        } catch (error) {
            console.error(error);
            // Ignore 404
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                toast({
                    variant: "destructive",
                    title: "Invalid file type",
                    description: "Please upload a PDF file.",
                });
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Max size is 5MB.",
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            await resumeService.uploadResume(file);
            toast({
                title: "Success",
                description: "Resume uploaded successfully.",
            });
            setFile(null);
            fetchMetadata();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "Something went wrong.",
            });
        } finally {
            setUploading(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upload Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Resume</CardTitle>
                        <CardDescription>
                            Upload a new PDF resume. This will replace the existing active resume.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                            <div className="space-y-2">
                                <label
                                    htmlFor="resume-upload"
                                    className="cursor-pointer text-sm font-medium text-primary hover:underline"
                                >
                                    Select PDF File
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    PDF up to 5MB
                                </p>
                            </div>
                        </div>

                        {file && (
                            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/20">
                                <FileText className="h-5 w-5 text-primary" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setFile(null)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            disabled={!file || uploading}
                            onClick={handleUpload}
                        >
                            {uploading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                            {uploading ? 'Uploading...' : 'Upload & Replace'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Active Resume</CardTitle>
                        <CardDescription>
                            Details of the currently available resume.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-6"><RefreshCw className="animate-spin" /></div>
                        ) : metadata ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-medium">Active</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Last updated: {new Date(metadata.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="ml-auto border-green-200 text-green-700 bg-green-50 mb-auto">
                                        Active
                                    </Badge>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Filename</p>
                                            <p className="font-medium truncate">{metadata.fileName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Size</p>
                                            <p className="font-medium">{formatBytes(metadata.fileSize)}</p>
                                        </div>
                                    </div>

                                    <a
                                        href={resumeService.getDownloadUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button variant="outline" className="w-full">
                                            <Download className="mr-2 h-4 w-4" />
                                            Preview / Download
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                                <h3 className="font-medium text-lg">No Resume Found</h3>
                                <p className="text-muted-foreground text-sm">
                                    Upload a resume to get started.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResumeManager;
