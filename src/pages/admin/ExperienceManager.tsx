
import { useEffect, useState } from 'react';
import { adminApi, publicApi } from '@/api/services';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Trash2, Edit2, Briefcase } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Define generic type locally if not in types.ts yet
interface Experience {
    id: string;
    company: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    jobType?: string;
    workMode?: string;
    logoUrl?: string;
    order?: number;
}

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Experience>>({
        company: '',
        role: '',
        description: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        jobType: 'FULL_TIME',
        workMode: 'ON_SITE',
        logoUrl: ''
    });

    useEffect(() => {
        loadExperience();
    }, []);

    const loadExperience = async () => {
        try {
            const { data } = await axiosInstance.get<any>('/experience');
            setExperiences(data.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load experience');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosInstance.put(`/experience/${editingId}`, formData);
                toast.success('Experience Updated', {
                    description: `Successfully updated role at ${formData.company}.`
                });
            } else {
                await axiosInstance.post('/experience', formData);
                toast.success('Experience Added', {
                    description: `New role at ${formData.company} has been added to your profile.`
                });
            }
            setIsDialogOpen(false);
            resetForm();
            loadExperience();
        } catch (err) {
            toast.error('Operation Failed', {
                description: 'There was an error saving your experience data. Please try again.'
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await axiosInstance.delete(`/experience/${id}`);
            toast.success('Experience Deleted', {
                description: 'The experience entry has been removed.'
            });
            loadExperience();
        } catch (err) {
            toast.error('Delete Failed', {
                description: 'Could not delete the experience entry. Please try again.'
            });
        }
    };

    const openEdit = (exp: Experience) => {
        setFormData({
            ...exp,
            jobType: exp.jobType || 'FULL_TIME',
            workMode: exp.workMode || 'ON_SITE'
        });
        setEditingId(exp.id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            company: '',
            role: '',
            description: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            jobType: 'FULL_TIME',
            workMode: 'ON_SITE',
            logoUrl: ''
        });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Experience</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>+ Add Experience</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                            <div className="text-sm text-muted-foreground">
                                {editingId ? 'Edit the details of your experience.' : 'Add a new work experience.'}
                            </div>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input id="company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                                </div>
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jobType">Job Type</Label>
                                    <select
                                        id="jobType"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.jobType}
                                        onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                                    >
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="FREELANCE">Freelance</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="workMode">Work Mode</Label>
                                    <select
                                        id="workMode"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.workMode}
                                        onChange={e => setFormData({ ...formData, workMode: e.target.value })}
                                    >
                                        <option value="ON_SITE">On-site</option>
                                        <option value="REMOTE">Remote</option>
                                        <option value="HYBRID">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input id="start" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input id="end" type="date" value={formData.endDate || ''} onChange={e => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.isCurrent} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="current" checked={formData.isCurrent} onCheckedChange={(c) => setFormData({ ...formData, isCurrent: c === true, endDate: c === true ? '' : formData.endDate })} />
                                <Label htmlFor="current">I currently work here</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{editingId ? 'Save' : 'Add'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {experiences.map(exp => (
                    <Card key={exp.id}>
                        <div className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-lg">{exp.role}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(exp)}><Edit2 className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate} •
                                    <span className="text-xs uppercase bg-muted px-1 py-0.5 rounded ml-1">{exp.jobType?.replace('_', ' ')}</span>
                                    {exp.workMode && (
                                        <span className="text-xs uppercase bg-muted px-1 py-0.5 rounded ml-1">{exp.workMode.replace('_', ' ')}</span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{exp.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div >
    );
};

export default ExperienceManager;
