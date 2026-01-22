
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/services';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User, Mail, ShieldAlert } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        adminKey: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Note: In a real app, registration might not auto-login, or might require email verification.
            // For this portfolio: Register -> Get Token -> Login
            await authApi.register(formData);

            // After register, we can immediately login or ask user to login. 
            // The current backend register returns a token, so we can auto-login.
            // Let's retry login with the credentials to be sure, or just use the returned token if the API returns it.
            // Looking at AuthenticationService.java, register returns AuthenticationResponse which has the token.

            // Let's modify authApi.register in services.ts to return the data properly so we can use it.
            // Assuming authApi.register returns { token: string } based on AuthenticationResponse.

            const response = await authApi.login({ email: formData.email, password: formData.password }); // explicit login to be safe/consistent
            login(response.token);

            toast.success('Registration successful! Welcome.');
            navigate('/admin');
        } catch (err: any) {
            console.error(err);
            toast.error('Registration failed. Email might be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter your details to register</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-9"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="adminKey">Admin Key (Optional)</Label>
                                <span className="text-xs text-muted-foreground">(For Site Owner)</span>
                            </div>
                            <div className="relative">
                                <ShieldAlert className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="adminKey"
                                    name="adminKey"
                                    type="password"
                                    placeholder="Admin Secret Key"
                                    className="pl-9 font-mono"
                                    value={formData.adminKey}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Already have an account?
                    <Link to="/login" className="ml-1 text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
