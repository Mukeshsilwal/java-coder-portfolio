
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Trash2, Plus, Code2 } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { adminApi } from '@/api/services';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Skill {
    id: string;
    skillName: string;
    category: string;
    proficiencyLevel: number; // matched DTO
    iconUrl?: string;
    experienceYears?: number;
}

const SkillManager = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<Skill>>({
        skillName: '',
        category: 'BACKEND',
        proficiencyLevel: 50,
        iconUrl: ''
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const { data } = await axiosInstance.get<Skill[]>('/skills');
            setSkills(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/skills', formData);
            toast.success('Skill added');
            setIsDialogOpen(false);
            resetForm();
            loadSkills();
        } catch (err) {
            toast.error('Failed to add skill');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(`/skills/${id}`);
            toast.success('Skill deleted');
            loadSkills();
        } catch (err) {
            toast.error('Failed to delete skill');
        }
    };

    const resetForm = () => {
        setFormData({
            skillName: '',
            category: 'BACKEND',
            proficiencyLevel: 50,
            iconUrl: ''
        });
        setIsDialogOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Skills</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Skill</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Skill Name</Label>
                                <Input value={formData.skillName} onChange={e => setFormData({ ...formData, skillName: e.target.value })} required placeholder="Java, React, etc." />
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, category: val })} defaultValue={formData.category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BACKEND">Backend</SelectItem>
                                        <SelectItem value="FRONTEND">Frontend</SelectItem>
                                        <SelectItem value="DEVOPS">DevOps</SelectItem>
                                        <SelectItem value="DATABASE">Database</SelectItem>
                                        <SelectItem value="TOOLS">Tools</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Proficiency ({formData.proficiencyLevel}%)</Label>
                                </div>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={5}
                                    value={[formData.proficiencyLevel || 50]}
                                    onValueChange={(val) => setFormData({ ...formData, proficiencyLevel: val[0] })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Icon</Label>
                                {/* Only show uploader if we have an ID (edit mode) or just let them create first */}
                                <p className="text-xs text-muted-foreground">Save the skill first to upload an icon.</p>
                            </div>

                            <Button type="submit" className="w-full">Save Skill</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                    <Card key={skill.id} className="relative overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{skill.skillName}</h3>
                                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(skill.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="px-4 pb-2">
                            <ImageUploader
                                currentImageUrl={skill.iconUrl}
                                label="Icon"
                                aspectRatio="square"
                                className="mb-2"
                                onUpload={async (file) => {
                                    const { url } = await adminApi.uploadSkillIcon(skill.id, file);
                                    // Refresh list or update local state
                                    setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, iconUrl: url } : s));
                                }}
                            />
                        </div>
                        <div className="h-1 bg-secondary mx-4 mb-4 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${skill.proficiencyLevel || 50}%` }} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SkillManager;
