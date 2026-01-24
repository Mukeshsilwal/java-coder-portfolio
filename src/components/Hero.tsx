import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Code2, Download } from 'lucide-react';
import { publicApi } from '@/api/services';
import { ProfileDTO } from '@/types';
import { resumeService } from '@/services/resumeService';
import { StatusBadge } from '@/components/StatusBadge';
import { MetricsDisplay } from '@/components/MetricsDisplay';

const Hero = () => {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await publicApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-padding">
      {/* Subtle Background Elements - Mobile Safe */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-[min(500px,80vw)] h-[min(500px,80vw)] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[min(500px,80vw)] h-[min(500px,80vw)] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Content - Centered */}
          <div className="space-y-8 text-center flex flex-col items-center">

            {/* Profile Image */}
            {profile?.profileImage && (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 animate-fade-in">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent blur-lg opacity-50 animate-pulse-slow"></div>
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="relative w-full h-full rounded-full object-cover border-4 border-background shadow-2xl"
                />
              </div>
            )}

            {/* Enhanced Status Badge */}
            <StatusBadge
              available={!profile?.availabilityStatus || profile.availabilityStatus === 'AVAILABLE'}
              experience={profile?.yearsOfExperience ? `${profile.yearsOfExperience}+ Years Experience` : "2+ Years Experience"}
            />

            {/* Name Heading */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Hi, I'm{' '}
                <span className="gradient-text">Mukesh Silwal</span>
              </h1>

              {/* Role Tagline */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl">
                {profile?.headline ? (
                  <span className="font-semibold text-foreground">{profile.headline}</span>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">Java Backend Engineer</span>
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Reactive Systems</span>
                  </>
                )}
              </div>
            </div>

            {/* Value Proposition */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-fade-up text-balance" style={{ animationDelay: '0.2s' }}>
              {profile?.bio || (
                <>
                  Building <span className="text-foreground font-semibold">robust, scalable backend systems</span> with
                  Java, Spring Boot & Reactive Programming. Currently powering mobile banking at Nepal's #1 fintech.
                </>
              )}
            </p>

            {/* Key Metrics */}
            <MetricsDisplay className="animate-fade-up" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Code2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                View Projects
              </button>

              <a
                href={profile?.resumeUrl || resumeService.getDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 group">
                  <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  Download CV
                </button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
        <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-xs font-medium">Scroll Down</span>
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
