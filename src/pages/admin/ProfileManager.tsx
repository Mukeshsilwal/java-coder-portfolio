
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { adminApi } from '@/api/services';

import { resumeService } from '@/services/resumeService';
import { RefreshCw } from 'lucide-react';

interface Profile {
    id: string; // Add ID for backend if needed, mostly singular resource
    bio: string;
    resumeUrl: string;
    profileImage: string;
    headline: string; // Add headline
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

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data } = await axiosInstance.get<Profile>('/profile');
            setProfile(data);
        } catch (err) {
            console.error("Profile not found or error", err);
            // Initialize defaults if needed
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/profile', profile);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setProfile(prev => ({ ...prev, [e.target.id]: val }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">About Bio</Label>
                        <Textarea
                            id="bio"
                            className="min-h-[100px]"
                            value={profile.bio || ''}
                            onChange={handleChange}
                        />
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
                        <Label>Profile Image</Label>
                        <ImageUploader
                            currentImageUrl={profile.profileImage}
                            onUpload={async (file) => {
                                const { url } = await adminApi.uploadProfileImage(file);
                                setProfile(prev => ({ ...prev, profileImage: url }));
                            }}
                            aspectRatio="square"
                        />
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
                                            // Construct full URL or relative path depending on backend
                                            // Using the public download endpoint
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
                        <p className="text-xs text-muted-foreground">
                            Click the refresh icon to fetch the URL of the resume uploaded in Resume Manager.
                        </p>
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

                    <Button type="submit" className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileManager;
