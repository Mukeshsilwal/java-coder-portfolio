
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
    content: string;
    coverImage?: string;
    tags?: string | string[];
    createdAt: string;
    viewCount: number;
}

const LatestBlogs = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch normally - backend sort defaults to latest
                const { data } = await axiosInstance.get<any>('/blogs?size=3&sort=createdAt,desc');
                let items: any[] = [];

                if (data && Array.isArray(data)) {
                    items = data;
                } else if (data && data.data && Array.isArray(data.data)) {
                    items = data.data;
                } else if (data && data.content && Array.isArray(data.content)) {
                    items = data.content; // Spring Page content
                } else if (data && data.data && data.data.content && Array.isArray(data.data.content)) {
                    items = data.data.content;
                }

                // If fallback to empty
                if (!Array.isArray(items)) items = [];

                // Take only first 3 just in case API returns more
                setPosts(items.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch latest blogs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (posts.length === 0 && !loading) return null;

    return (
        <section id="blog" className="py-24 bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fade-up">
                    <span className="font-mono text-primary text-sm tracking-wider uppercase">Recent Writings</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                        Latest from the <span className="gradient-text">Blog</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Insights and tutorials on Java, Spring Boot, and modern web development.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <Card
                            key={post.id}
                            className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-up"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
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
                                        {(Array.isArray(post.tags) ? post.tags : (post.tags || '').split(','))[0] || 'Tech'}
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
                                <Link to={`/blog/${post.slug}`}>
                                    <Button variant="link" className="p-0 h-auto group-hover:translate-x-1 transition-transform">
                                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <Link to="/blog">
                        <Button variant="outline" className="px-8">
                            View All Articles
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestBlogs;
