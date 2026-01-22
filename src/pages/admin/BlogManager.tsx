
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Trash2, Edit2, FileText, Eye } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { adminApi } from '@/api/services';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string;
    isPublished: boolean;
    viewCount: number;
    createdAt: string;
}

const BlogManager = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        content: '',
        coverImage: '',
        tags: '',
        isPublished: false
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            // Admin endpoint to get all
            const { data } = await axiosInstance.get('/blogs/admin');
            setPosts(data.content || data); // Handle Page response
        } catch (err) {
            console.error(err);
            // toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosInstance.put(`/blogs/${editingId}`, formData);
                toast.success('Post updated');
            } else {
                await axiosInstance.post('/blogs', formData);
                toast.success('Post created');
            }
            setIsDialogOpen(false);
            resetForm();
            loadPosts();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        try {
            await axiosInstance.delete(`/blogs/${id}`);
            toast.success('Post deleted');
            loadPosts();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const openEdit = (post: BlogPost) => {
        setFormData(post);
        setEditingId(post.id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            content: '',
            coverImage: '',
            tags: '',
            isPublished: false
        });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>+ New Post</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Post' : 'New Post'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (Optional)</Label>
                                    <Input id="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content (Markdown)</Label>
                                <Textarea id="content" className="min-h-[300px] font-mono" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input id="tags" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                            </div>
                            {editingId ? (
                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    <ImageUploader
                                        currentImageUrl={formData.coverImage}
                                        onUpload={async (file) => {
                                            const { url } = await adminApi.uploadBlogThumbnail(editingId, file);
                                            setFormData(prev => ({ ...prev, coverImage: url }));
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg bg-muted/50 text-center">
                                    Save first to upload image.
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox id="pub" checked={formData.isPublished} onCheckedChange={(c) => setFormData({ ...formData, isPublished: c === true })} />
                                <Label htmlFor="pub">Publish immediately</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{editingId ? 'Save' : 'Create'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {posts.map(post => (
                    <Card key={post.id} className="overflow-hidden">
                        <div className="flex items-center p-4 gap-4">
                            <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center overflow-hidden">
                                {post.coverImage ? (
                                    <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <FileText className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                                        {post.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.viewCount}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {posts.length === 0 && !loading && <div className="text-center py-10 text-muted-foreground">No posts found.</div>}
            </div>
        </div>
    );
};

export default BlogManager;
