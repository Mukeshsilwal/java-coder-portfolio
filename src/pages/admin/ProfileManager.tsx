
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Profile {
    id: string; // Add ID for backend if needed, mostly singular resource
    about: string;
    resumeUrl: string;
    imageUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    experienceYears: number;
    projectsCompleted: number;
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
            await axiosInstance.put('/profile', profile);
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
                        <Label htmlFor="about">About Bio</Label>
                        <Textarea
                            id="about"
                            className="min-h-[100px]"
                            value={profile.about || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="experienceYears">Years of Experience</Label>
                            <Input
                                id="experienceYears"
                                type="number"
                                value={profile.experienceYears || 0}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="projectsCompleted">Projects Completed</Label>
                            <Input
                                id="projectsCompleted"
                                type="number"
                                value={profile.projectsCompleted || 0}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Profile Image URL</Label>
                        <Input
                            id="imageUrl"
                            value={profile.imageUrl || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resumeUrl">Resume URL (PDF)</Label>
                        <Input
                            id="resumeUrl"
                            value={profile.resumeUrl || ''}
                            onChange={handleChange}
                        />
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
                            <Label htmlFor="twitterUrl">Twitter URL</Label>
                            <Input id="twitterUrl" value={profile.twitterUrl || ''} onChange={handleChange} />
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
