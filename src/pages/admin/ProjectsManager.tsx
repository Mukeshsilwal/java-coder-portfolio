
import { useEffect, useState } from 'react';
import { publicApi, adminApi } from '@/api/services';
import { ProjectDTO } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Edit2, Star, StarOff } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ProjectsManager = () => {
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<ProjectDTO>>({
        title: '',
        description: '',
        techStack: '',
        githubRepoUrl: '',
        liveDemoUrl: '',
        projectImage: '',
        projectType: 'PERSONAL',
        isFeatured: false
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            // Admin usually wants to see ALL projects, not just featured
            const data = await publicApi.getProjects();
            setProjects(data);
        } catch (err) {
            toast.error('Failed to load projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminApi.updateProject(editingId, formData);
                toast.success('Project updated successfully');
            } else {
                await adminApi.createProject(formData);
                toast.success('Project created successfully');
            }
            setIsDialogOpen(false);
            resetForm();
            loadProjects();
        } catch (err) {
            toast.error('Operation failed');
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await adminApi.deleteProject(id);
            toast.success('Project deleted');
            loadProjects();
        } catch (err) {
            toast.error('Failed to delete project');
        }
    };

    const openEdit = (project: ProjectDTO) => {
        setFormData(project);
        setEditingId(project.id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            techStack: '',
            githubRepoUrl: '',
            liveDemoUrl: '',
            projectImage: '',
            projectType: 'PERSONAL',
            isFeatured: false
        });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>+ Add Project</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                            <div className="text-sm text-muted-foreground">
                                {editingId ? 'Update project details.' : 'Fill in the details for your new project.'}
                            </div>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Input id="type" value={formData.projectType} onChange={e => setFormData({ ...formData, projectType: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea id="desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tech">Tech Stack (comma separated)</Label>
                                    <Input id="tech" value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} placeholder="Java, Spring, React" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="github">GitHub URL</Label>
                                        <Input id="github" value={formData.githubRepoUrl} onChange={e => setFormData({ ...formData, githubRepoUrl: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="demo">Live Demo URL</Label>
                                        <Input id="demo" value={formData.liveDemoUrl} onChange={e => setFormData({ ...formData, liveDemoUrl: e.target.value })} />
                                    </div>
                                </div>

                                {editingId ? (
                                    <div className="space-y-2">
                                        <Label>Project Image</Label>
                                        <ImageUploader
                                            currentImageUrl={formData.projectImage}
                                            onUpload={async (file) => {
                                                const { url } = await adminApi.uploadProjectImage(editingId, file);
                                                setFormData(prev => ({ ...prev, projectImage: url }));
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg bg-muted/50 text-center">
                                        Save the project first to upload an image.
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="featured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked === true })} />
                                    <Label htmlFor="featured">Feature this project on home page</Label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{editingId ? 'Save Changes' : 'Create Project'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {projects.map(project => (
                    <Card key={project.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-4 p-4 items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{project.title}</h3>
                                    {project.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{project.projectType}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.techStack?.split(',').map(t => (
                                        <span key={t} className="text-xs bg-muted px-1 rounded">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {projects.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">No projects found. Add one to get started.</div>
                )}
            </div>
        </div>
    );
};

export default ProjectsManager;
