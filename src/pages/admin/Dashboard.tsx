
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, MessageSquare, Eye, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import { axiosInstance } from '@/api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        blogs: 0,
        views: 0,
        downloads: 0,
        unreadMessages: 0
    });
    const [recentProjects, setRecentProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosInstance.get('/admin/dashboard/stats');
                // Handle ApiResponse format: { status, message, data }
                if (data.status === 'SUCCESS' && data.data) {
                    setStats(data.data);
                }

                const projects = await publicApi.getProjects();
                setRecentProjects(Array.isArray(projects) ? projects.slice(0, 5) : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projects}</div>
                        <p className="text-xs text-muted-foreground">Portfolio Items</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.blogs}</div>
                        <p className="text-xs text-muted-foreground">Published Articles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views}</div>
                        <p className="text-xs text-muted-foreground">Profile Impressions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.downloads}</div>
                        <p className="text-xs text-muted-foreground">Resume Access</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProjects.map(p => (
                                <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className='truncate max-w-[200px]'>
                                        <p className="font-medium truncate">{p.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{p.techStack}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to="/admin/projects">Edit</Link>
                                    </Button>
                                </div>
                            ))}
                            {recentProjects.length === 0 && <div className="text-sm text-muted-foreground">No projects yet.</div>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            <div className="relative">
                                <MessageSquare className="w-12 h-12 text-muted-foreground/50" />
                                {stats.unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {stats.unreadMessages}
                                    </span>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                                <p className="text-sm text-muted-foreground">Unread Messages</p>
                            </div>
                            <Button variant="outline" size="sm" asChild className="w-full">
                                <Link to="/admin/messages">View Inbox</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
