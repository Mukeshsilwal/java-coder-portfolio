import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/services';
import { Education } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
    Trash2,
    Edit2,
    GraduationCap,
    GripVertical,
    Plus,
    Save,
    X,
    Upload,
    ExternalLink
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { motion, Reorder } from 'framer-motion';

const EducationManager = () => {
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<Education>>({
        institution: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
        status: 'Completed',
        grade: '',
        description: '',
        certificateUrl: '',
        visible: true,
        orderIndex: 0
    });

    useEffect(() => {
        loadEducation();
    }, []);

    const loadEducation = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllEducation();
            // Sort by orderIndex just in case
            const sortedData = [...data].sort((a, b) => a.orderIndex - b.orderIndex);
            setEducationList(sortedData);
        } catch (err) {
            toast.error('Failed to load education records');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder: Education[]) => {
        setEducationList(newOrder);
        try {
            const ids = newOrder.map(item => item.id);
            await adminApi.reorderEducation(ids);
        } catch (err) {
            toast.error('Failed to save new order');
            loadEducation(); // Revert on failure
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminApi.updateEducation(editingId, formData);
                toast.success('Education record updated');
            } else {
                await adminApi.createEducation(formData);
                toast.success('Education record added');
            }
            setIsDialogOpen(false);
            resetForm();
            loadEducation();
        } catch (err) {
            toast.error('Failed to save education record');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            await adminApi.deleteEducation(id);
            toast.success('Record deleted');
            loadEducation();
        } catch (err) {
            toast.error('Failed to delete record');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const response = await adminApi.uploadImage(file, 'certificates');
            setFormData(prev => ({ ...prev, certificateUrl: response.data.url }));
            toast.success('Certificate uploaded successfully');
        } catch (err) {
            toast.error('Failed to upload certificate');
        } finally {
            setIsUploading(false);
        }
    };

    const openEdit = (edu: Education) => {
        setFormData({
            ...edu,
            startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
            endDate: edu.endDate ? edu.endDate.split('T')[0] : ''
        });
        setEditingId(edu.id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            institution: '',
            degree: '',
            location: '',
            startDate: '',
            endDate: '',
            status: 'Completed',
            grade: '',
            description: '',
            certificateUrl: '',
            visible: true,
            orderIndex: educationList.length
        });
        setEditingId(null);
    };

    const toggleVisibility = async (edu: Education) => {
        try {
            await adminApi.updateEducation(edu.id, { ...edu, visible: !edu.visible });
            loadEducation();
            toast.success(`Record is now ${!edu.visible ? 'visible' : 'hidden'}`);
        } catch (err) {
            toast.error('Failed to update visibility');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Education Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your academic history and certifications.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Education
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : educationList.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">No education records</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                You haven't added any education history yet. Start by adding your first degree or certification.
                            </p>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)} variant="outline">Add First Record</Button>
                    </div>
                </Card>
            ) : (
                <Reorder.Group axis="y" values={educationList} onReorder={handleReorder} className="space-y-4">
                    {educationList.map((edu) => (
                        <Reorder.Item
                            key={edu.id}
                            value={edu}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            <Card className={`p-4 hover:shadow-md transition-shadow cursor-default border-l-4 ${edu.visible ? 'border-l-primary' : 'border-l-muted'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    {edu.degree}
                                                    {!edu.visible && <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full uppercase tracking-wider font-semibold">Hidden</span>}
                                                </h3>
                                                <p className="text-primary font-medium">{edu.institution}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : edu.status}
                                                    {edu.location && ` • ${edu.location}`}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleVisibility(edu)}
                                                    title={edu.visible ? "Hide from public" : "Show in public"}
                                                >
                                                    <Switch checked={edu.visible} className="scale-75" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(edu)}>
                                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            {editingId ? 'Edit Education Record' : 'Add New Education'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree / Program</Label>
                                <Input
                                    id="degree"
                                    placeholder="e.g. Master of Computer Science"
                                    value={formData.degree}
                                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution Name</Label>
                                <Input
                                    id="institution"
                                    placeholder="e.g. Stanford University"
                                    value={formData.institution}
                                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. California, USA"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Dropped">Dropped</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate text-muted-foreground mr-1 flex items-center justify-between">
                                    <span>End Date (Optional)</span>
                                    {formData.status === 'Ongoing' && <span className="text-[10px] text-primary">Leave empty if Ongoing</span>}
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate || ''}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade / Percentage / GPA</Label>
                            <Input
                                id="grade"
                                placeholder="e.g. 3.9/4.0 or 85%"
                                value={formData.grade}
                                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe your focus, major subjects, or achievements..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Certificate Link (Direct URL or Upload)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    value={formData.certificateUrl}
                                    onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="cert-upload"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="image/*,application/pdf"
                                        disabled={isUploading}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="gap-2"
                                        disabled={isUploading}
                                        onClick={() => document.getElementById('cert-upload')?.click()}
                                    >
                                        {isUploading ? <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /> : <Upload className="w-4 h-4" />}
                                        Upload
                                    </Button>
                                </div>
                            </div>
                            {formData.certificateUrl && (
                                <p className="text-xs text-primary flex items-center gap-1 mt-1">
                                    <ExternalLink className="w-3 h-3" />
                                    <a href={formData.certificateUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-sm">
                                        Preview Certificate
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Switch
                                    checked={formData.visible}
                                    onCheckedChange={checked => setFormData({ ...formData, visible: checked })}
                                />
                                <span>Display on public portfolio</span>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="w-4 h-4" /> {editingId ? 'Update Record' : 'Add Record'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EducationManager;
