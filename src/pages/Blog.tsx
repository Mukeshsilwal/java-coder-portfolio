
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // We'll show snippet
    coverImage?: string;
    tags?: string;
    createdAt: string;
    viewCount: number;
}

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosInstance.get('/blogs');
                setPosts(data.content || data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto mb-16 text-center">
                <span className="font-mono text-primary text-sm tracking-wider uppercase">Thoughts & Insights</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                    Technical <span className="gradient-text">Blog</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Sharing knowledge about Java, Spring Boot, Microservices, and System Design.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <Card key={post.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
                        <div className="aspect-video bg-secondary overflow-hidden relative">
                            {post.coverImage ? (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                    <span className="text-4xl">☕</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-background/80 backdrop-blur text-foreground hover:bg-background">
                                    {post.tags?.split(',')[0] || 'Tech'}
                                </Badge>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    Admin
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
                            </p>
                            <Button variant="link" className="p-0 h-auto group-hover:translate-x-1 transition-transform">
                                Read Article <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {posts.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No articles published yet.</p>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
