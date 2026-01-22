import { ArrowDown, Github, Linkedin, Mail, Code2, Terminal, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resumeService } from '@/services/resumeService';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-padding">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT SIDE - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 status-badge animate-fade-up">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Available for Work</span>
            </div>

            {/* Name Heading */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Hi, I'm{' '}
                <span className="gradient-text">Mukesh Silwal</span>
              </h1>

              {/* Role Tagline */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-lg sm:text-xl">
                <span className="font-semibold text-foreground">Java Backend Engineer</span>
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">Reactive Systems</span>
                <span className="text-primary hidden sm:inline">•</span>
                <span className="text-muted-foreground hidden sm:inline">Fintech</span>
              </div>
            </div>

            {/* Value Proposition */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-up text-balance" style={{ animationDelay: '0.2s' }}>
              Building <span className="text-foreground font-semibold">robust, scalable backend systems</span> with
              Java, Spring Boot & Reactive Programming. Currently powering mobile banking at Nepal's #1 fintech.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <a href="#projects" className="w-full sm:w-auto">
                <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  View Projects
                </button>
              </a>
              <a href={resumeService.getDownloadUrl()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="https://github.com/Mukeshsilwal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/Mukeshsilwal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:mukeshsilwal5@gmail.com"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - Visual Panel */}
          <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {/* Floating Code Card */}
            <div className="glass-card p-6 rounded-2xl space-y-4 animate-float">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Developer.java</span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Code Content */}
              <div className="code-font text-sm space-y-2 text-muted-foreground">
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">1</span>
                  <span><span className="text-accent">@SpringBootApplication</span></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">2</span>
                  <span><span className="text-primary">public class</span> <span className="text-foreground font-semibold">Developer</span> {'{'}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">3</span>
                  <span className="pl-4">
                    <span className="text-primary">private</span> String name = <span className="text-green-400">"Mukesh"</span>;
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">4</span>
                  <span className="pl-4">
                    <span className="text-primary">private</span> String[] skills = {'{'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">5</span>
                  <span className="pl-8">
                    <span className="text-green-400">"Java"</span>, <span className="text-green-400">"Spring Boot"</span>,
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">6</span>
                  <span className="pl-8">
                    <span className="text-green-400">"WebFlux"</span>, <span className="text-green-400">"PostgreSQL"</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">7</span>
                  <span className="pl-4">{'};'}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground/50 select-none">8</span>
                  <span>{'}'}</span>
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                {['Java', 'Spring Boot', 'WebFlux', 'PostgreSQL', 'Docker'].map((tech) => (
                  <span key={tech} className="skill-chip text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-2xl blur-2xl animate-pulse-slow" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-2xl blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
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
