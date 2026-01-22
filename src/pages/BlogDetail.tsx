
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '@/api/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string;
    createdAt: string;
    viewCount: number;
}

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axiosInstance.get<BlogPost>(`/blogs/${slug}`);
                setPost(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <Skeleton className="w-full h-96 rounded-2xl mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );

    if (error || !post) return (
        <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you are looking for does not exist.</p>
            <Link to="/blog">
                <Button>Back to Blog</Button>
            </Link>
        </div>
    );

    return (
        <article className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/blog">
                    <Button variant="ghost" className="mb-8 hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Button>
                </Link>

                <div className="text-center mb-12 animate-fade-up">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {post.tags?.split(',').map(tag => (
                            <Badge key={tag} variant="secondary">
                                {tag.trim()}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Admin
                        </span>
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {post.viewCount} views
                        </span>
                    </div>
                </div>

                {post.coverImage && (
                    <div className="rounded-2xl overflow-hidden mb-12 shadow-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
