import { Code2, Cpu, Database, Zap, MapPin, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';

const highlights = [
    {
        icon: Code2,
        title: 'Clean Code',
        description: 'Writing maintainable, well-documented code following best practices and SOLID principles',
    },
    {
        icon: Cpu,
        title: 'System Design',
        description: 'Architecting scalable, high-performance solutions for complex business problems',
    },
    {
        icon: Database,
        title: 'Data Driven',
        description: 'Optimizing database queries and data structures for maximum performance',
    },
    {
        icon: Zap,
        title: 'Performance',
        description: 'Building high-throughput reactive APIs with minimal latency and maximum reliability',
    },
];

const experiences = [
    {
        company: 'F1Soft International',
        role: 'Java Backend Software Engineer',
        period: '2023 - Present',
        description: 'Building mobile banking backend systems serving millions of users. Working with Spring Boot, WebFlux, and reactive programming.',
    },
    {
        company: 'Citytech Group',
        role: 'Software Engineer',
        period: '2021 - 2023',
        description: 'Developed payment gateway systems and POS solutions using Java, Spring Framework, and PostgreSQL.',
    },
];

import { publicApi } from '@/api/services';
import { ProfileDTO } from '@/types';
import { useEffect, useState } from 'react';

const About = () => {
    const [profile, setProfile] = useState<ProfileDTO | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await publicApi.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);
    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-background via-secondary/10 to-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16 animate-fade-up">
                            <span className="font-mono text-primary text-sm tracking-wider uppercase">About Me</span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
                                Crafting <span className="gradient-text">Backend Excellence</span>
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Left Column - Bio */}
                            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                {/* Code Card */}
                                <div className="glass-card p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        <span className="font-mono text-sm text-muted-foreground ml-2">about.java</span>
                                    </div>
                                    <pre className="code-font text-sm text-muted-foreground overflow-x-auto">
                                        <code>
                                            {`public class Developer {
  private String name = "Mukesh Silwal";
  private int experience = 2; // years
  private String[] passions = {
    "Reactive Programming",
    "Fintech Solutions",
    "System Architecture"
  };
}`}
                                        </code>
                                    </pre>
                                </div>

                                {/* Bio Text */}
                                <div className="space-y-4">
                                    {profile?.bio ? (
                                        <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {profile.bio}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                I'm a passionate <span className="text-foreground font-semibold">Java Backend Software Engineer</span> with
                                                over 2 years of experience.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold gradient-text">{profile?.yearsOfExperience || '2+'}</span>
                                        <p className="text-sm text-muted-foreground">Years Exp.</p>
                                    </div>
                                    <div className="w-px h-12 bg-border" />
                                    <div className="text-center">
                                        <span className="text-3xl font-bold gradient-text">5+</span>
                                        <p className="text-sm text-muted-foreground">Projects</p>
                                    </div>
                                    <div className="w-px h-12 bg-border" />
                                    <div className="text-center">
                                        <span className="text-3xl font-bold gradient-text">2</span>
                                        <p className="text-sm text-muted-foreground">Companies</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="glass-card p-6 rounded-2xl space-y-3">
                                    {profile?.location && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                    {profile?.email && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Mail className="w-5 h-5 text-primary" />
                                            <a href={`mailto:${profile.email}`} className="hover:text-foreground transition-colors">
                                                {profile.email}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <span>Available on request</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Highlights */}
                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {highlights.map((item, index) => (
                                        <div
                                            key={item.title}
                                            className="glass-card-hover p-6 rounded-2xl"
                                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                                                <item.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="section-padding">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Professional <span className="gradient-text">Experience</span>
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                        </div>

                        <div className="space-y-6">
                            {experiences.map((exp, index) => (
                                <div
                                    key={exp.company}
                                    className="glass-card-hover p-6 rounded-2xl"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold">{exp.role}</h3>
                                                    <p className="text-primary font-medium">{exp.company}</p>
                                                </div>
                                                <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                                                    {exp.period}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
