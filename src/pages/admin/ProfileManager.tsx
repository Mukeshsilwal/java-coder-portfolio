
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Pencil, X, MapPin, Briefcase, Mail, Github, Linkedin, FileText, CheckCircle } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { adminApi } from '@/api/services';
import { resumeService } from '@/services/resumeService';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Profile {
    id: string;
    bio: string;
    resumeUrl: string;
    profileImage: string;
    headline: string;
    linkedinUrl: string;
    githubUrl: string;
    yearsOfExperience: number;
    email: string;
    location: string;
    phone: string;
}

const ProfileManager = () => {
    const [profile, setProfile] = useState<Partial<Profile>>({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data } = await axiosInstance.get<Profile>('/profile');
            setProfile(data);
        } catch (err) {
            console.error("Profile not found or error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/profile', profile);
            toast.success('Profile updated successfully');
            setIsEditing(false); // Switch back to view mode
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setProfile(prev => ({ ...prev, [e.target.id]: val }));
    };

    if (loading) return <div>Loading...</div>;

    if (!isEditing) {
        return (
            <Card className="max-w-3xl animate-fade-in border-dashed">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">Profile Snapshot</CardTitle>
                        <CardDescription>Current publicly visible information</CardDescription>
                    </div>
                    <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2">
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Section */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary shadow-sm mb-3">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-3xl font-bold text-muted-foreground">
                                        M
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground justify-center p-1 rounded-md hover:bg-secondary/50 transition-colors">
                                        <Github className="w-3 h-3" /> GitHub
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground justify-center p-1 rounded-md hover:bg-secondary/50 transition-colors">
                                        <Linkedin className="w-3 h-3" /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold">{profile.headline || 'No Headline Set'}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {profile.location || 'Location not set'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" />
                                        {profile.yearsOfExperience || 0} Years Exp
                                    </span>
                                    {profile.email && (
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {profile.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Bio
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {profile.bio || 'No bio provided...'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <Badge variant={profile.resumeUrl ? "default" : "secondary"} className="gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {profile.resumeUrl ? 'Resume Active' : 'No Resume Linked'}
                                </Badge>
                                {profile.resumeUrl && (
                                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                                        View Resume
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Edit Mode
    return (
        <Card className="max-w-2xl animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Edit Profile Information</CardTitle>
                    <CardDescription>Update your public details below</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                            id="headline"
                            value={profile.headline || ''}
                            onChange={handleChange}
                            placeholder="e.g. Senior Java Developer"
                        />
                        <p className="text-xs text-muted-foreground">Appears under your name in the Hero section.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                            <Input
                                id="yearsOfExperience"
                                type="number"
                                value={profile.yearsOfExperience || 0}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={profile.location || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">About Bio</Label>
                        <Textarea
                            id="bio"
                            className="min-h-[120px] font-sans"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            placeholder="Brief introduction..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Profile Image</Label>
                        <div className="p-4 bg-secondary/10 rounded-lg border border-border/50">
                            <ImageUploader
                                currentImageUrl={profile.profileImage}
                                onUpload={async (file) => {
                                    const { url } = await adminApi.uploadProfileImage(file);
                                    setProfile(prev => ({ ...prev, profileImage: url }));
                                }}
                                aspectRatio="square"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resumeUrl">Resume URL (PDF)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="resumeUrl"
                                value={profile.resumeUrl || ''}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    try {
                                        const metadata = await resumeService.getMetadata();
                                        if (metadata) {
                                            const url = `${window.location.origin}${resumeService.getDownloadUrl()}`;
                                            setProfile(prev => ({ ...prev, resumeUrl: url }));
                                            toast.success("Resume URL fetched from active upload");
                                        } else {
                                            toast.error("No active resume found. Upload one in Resume Manager.");
                                        }
                                    } catch (e) {
                                        toast.error("Failed to fetch resume");
                                    }
                                }}
                                title="Fetch from Active Resume"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub URL</Label>
                            <Input id="githubUrl" value={profile.githubUrl || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                            <Input id="linkedinUrl" value={profile.linkedinUrl || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={profile.email || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileManager;
