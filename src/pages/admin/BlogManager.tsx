
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
    DialogDescription,
} from "@/components/ui/dialog";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string | string[]; // Allow both for internal handling
    published: boolean;
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
        published: false
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const { data } = await axiosInstance.get<any>('/blogs/admin');
            let items: any[] = [];

            // Robust data extraction
            if (data && Array.isArray(data)) {
                items = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                items = data.data;
            } else if (data && data.content && Array.isArray(data.content)) {
                items = data.content;
            } else if (data && data.data && data.data.content && Array.isArray(data.data.content)) {
                items = data.data.content;
            }

            if (!Array.isArray(items)) {
                console.warn('Blog loadPosts: Items is not an array', items);
                items = [];
            }

            // Normalize tags to string for form compatibility
            const formattedPosts = items.map(item => ({
                ...item,
                tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
                published: item.isPublished !== undefined ? item.isPublished : item.published
            }));

            setPosts(formattedPosts);
        } catch (err) {
            console.error('Failed to load posts:', err);
            toast.error('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert tags string to array for backend
            const tagsString = typeof formData.tags === 'string' ? formData.tags : '';
            const payload = {
                ...formData,
                tags: tagsString.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (editingId) {
                await axiosInstance.put(`/blogs/${editingId}`, payload);
                toast.success('Post updated');
            } else {
                await axiosInstance.post('/blogs', payload);
                toast.success('Post created');
            }
            setIsDialogOpen(false);
            resetForm();
            loadPosts();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Operation failed');
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
            published: false
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
                            <DialogDescription>
                                {editingId ? 'Make changes to your blog post here.' : 'Create a new blog post.'}
                            </DialogDescription>
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
                                <Checkbox id="pub" checked={formData.published} onCheckedChange={(c) => setFormData({ ...formData, published: c === true })} />
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
                                    <Badge variant={post.published ? "default" : "secondary"}>
                                        {post.published ? "Published" : "Draft"}
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
