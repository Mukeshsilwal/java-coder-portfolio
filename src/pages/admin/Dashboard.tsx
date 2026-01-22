
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, MessageSquare, Eye, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        messages: 0,
        views: 1250 // Mocked for now
    });
    const [recentProjects, setRecentProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const projects = await publicApi.getProjects();
                setStats(s => ({ ...s, projects: projects.length }));
                setRecentProjects(projects.slice(0, 5));
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
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projects}</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.messages}</div>
                        <p className="text-xs text-muted-foreground">Check your inbox</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views}</div>
                        <p className="text-xs text-muted-foreground">+10% from last month</p>
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
                        <div className="text-sm text-muted-foreground">
                            Message inbox coming soon.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
