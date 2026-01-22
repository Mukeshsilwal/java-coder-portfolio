
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { ProjectDTO } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [techFilter, setTechFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await publicApi.getProjects();
                setProjects(data);
                setFilteredProjects(data);
            } catch (err) {
                console.error("Failed to load projects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        let res = projects;

        if (search) {
            res = res.filter(p =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.techStack?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (techFilter !== 'all') {
            res = res.filter(p => p.techStack?.toLowerCase().includes(techFilter.toLowerCase()));
        }

        if (typeFilter !== 'all') {
            res = res.filter(p => p.projectType === typeFilter);
        }

        setFilteredProjects(res);
    }, [search, techFilter, typeFilter, projects]);

    // Extract unique techs for filter
    const allTechs = Array.from(new Set(projects.flatMap(p => p.techStack ? p.techStack.split(',').map(s => s.trim()) : []))).sort();

    return (
        <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore my technical projects, featuring microservices, full-stack applications, and open-source contributions.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={techFilter} onValueChange={setTechFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tech</SelectItem>
                        {allTechs.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="CLIENT">Client</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No projects match your filters.</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                            <Card className="h-full flex flex-col overflow-hidden hover:border-primary/50 transition-colors group">
                                <div className="aspect-video bg-secondary relative overflow-hidden">
                                    {project.projectImage ? (
                                        <img src={project.projectImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={project.isFeatured ? "default" : "secondary"}>
                                            {project.projectType}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {project.techStack?.split(',').slice(0, 4).map(t => (
                                            <Badge key={t} variant="outline" className="text-xs font-normal">
                                                {t.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2 pt-0">
                                    {project.githubRepoUrl && (
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="w-4 h-4 mr-2" /> Code
                                            </a>
                                        </Button>
                                    )}
                                    {project.liveDemoUrl && (
                                        <Button size="sm" className="flex-1" asChild>
                                            <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" /> Demo
                                            </a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
