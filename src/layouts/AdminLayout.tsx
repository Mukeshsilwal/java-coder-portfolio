import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Folder,
    Code2,
    FileText,
    MessageSquare,
    LogOut,
    User,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: Folder, label: 'Projects', path: '/admin/projects' },
    { icon: Code2, label: 'Skills', path: '/admin/skills' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: FileText, label: 'Resume', path: '/admin/resume' },
    { icon: FileText, label: 'Blogs', path: '/admin/blogs' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
];

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="font-bold text-primary">M</span>
                        </div>
                        <h2 className="text-xl font-bold font-mono">Dev<span className="text-primary">Admin</span></h2>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-secondary",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
