
import { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const ProjectsPage = lazy(() => import("@/pages/Projects"));
const SkillsPage = lazy(() => import("@/pages/Skills"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Admin Pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ProjectsManager = lazy(() => import("@/pages/admin/ProjectsManager"));
const ProfileManager = lazy(() => import("@/pages/admin/ProfileManager"));
const SkillManager = lazy(() => import("@/pages/admin/SkillManager"));
const ExperienceManager = lazy(() => import("@/pages/admin/ExperienceManager"));
const ResumeManager = lazy(() => import("@/pages/admin/ResumeManager"));
const BlogManager = lazy(() => import("@/pages/admin/BlogManager"));
const Messages = lazy(() => import("@/pages/admin/Messages"));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<ProjectsManager />} />
                    <Route path="skills" element={<SkillManager />} />
                    <Route path="profile" element={<ProfileManager />} />
                    <Route path="experience" element={<ExperienceManager />} />
                    <Route path="resume" element={<ResumeManager />} />
                    <Route path="blogs" element={<BlogManager />} />
                    <Route path="messages" element={<Messages />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
