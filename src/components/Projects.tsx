import { ExternalLink, Github, Folder, ArrowUpRight, Trophy, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { ProjectDTO } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Extended Interface for UI Logic (merges API data with static UI enhancements)
interface ProjectUI extends Partial<ProjectDTO> {
  title: string;
  description: string;
  tech: string[];
  features?: string[];
  impact?: string; // New field for recruiter stats
  github: string;
  demo: string | null;
  featured: boolean;
  type?: string;
}

const staticProjects: ProjectUI[] = [
  {
    title: 'Ticket Katum',
    description: 'A comprehensive high-availability booking platform for bus tickets, hotel rooms, and large-scale event reservations. Designed for concurrency.',
    tech: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Redis'],
    features: ['Concurrent Booking Engine', 'Real-time Seat Selection', 'Payment Gateway Aggregation'],
    impact: 'Handled 10k+ concurrent requests during festival season',
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
    type: 'Commercial'
  },
  {
    title: 'Kisan Ko Sathii',
    description: 'AI-powered agricultural marketplace connecting farmers directly with buyers. Features image-based quality analysis using ML models.',
    tech: ['Java', 'Spring Boot', 'Python', 'TensorFlow', 'React'],
    features: ['AI Quality Grading', 'Real-time Price Analytics', 'Direct Chat System'],
    impact: 'Reduced produce wastage by 15% through faster matchmaking',
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
    type: 'Innovation'
  },
  {
    title: 'Gatepay',
    description: 'Enterprise-grade payment gateway aggregator built with Reactive programming patterns for non-blocking throughput.',
    tech: ['Java', 'Spring WebFlux', 'Docker', 'Kubernetes'],
    features: ['Non-blocking I/O', 'Distributed Tracing', 'Merchant Dashboard'],
    impact: 'Processed $50k+ daily transactions with 99.99% uptime',
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
    type: 'Fintech'
  },
];

const getTechStyle = (tech: string) => {
  const lower = tech.toLowerCase();
  if (lower.includes('java')) return 'text-[#ff4500] bg-[#ff4500]/10 border-[#ff4500]/20';
  if (lower.includes('spring')) return 'text-[#6db33f] bg-[#6db33f]/10 border-[#6db33f]/20';
  if (lower.includes('react') || lower.includes('frontend')) return 'text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/20';
  if (lower.includes('sql') || lower.includes('data')) return 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/20';
  if (lower.includes('docker') || lower.includes('cloud')) return 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20';
  return 'text-muted-foreground bg-secondary border-border';
};

const Projects = () => {
  const [projects, setProjects] = useState<ProjectUI[]>(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await publicApi.getProjects();
        if (data && data.length > 0) {
          // Merge API data with static "Impact" data if titles match, otherwise use API data cleanly
          const mapped: ProjectUI[] = data.map(p => {
            // Find matching static project to get the "Impact" text which isn't in DB yet
            const staticMatch = staticProjects.find(sp => sp.title.toLowerCase() === p.title.toLowerCase());

            return {
              title: p.title,
              description: p.description,
              tech: p.techStack ? p.techStack.split(',').map(s => s.trim()) : [],
              features: staticMatch?.features || [],
              impact: staticMatch?.impact,
              github: p.githubRepoUrl,
              demo: p.liveDemoUrl,
              featured: p.isFeatured,
              type: p.projectType
            };
          });
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch projects, using static fallback", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="section-padding relative w-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in">
            <Folder className="w-3 h-3" />
            Selected Work
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-fade-up">
            Building <span className="gradient-text">High-Scale</span> Systems
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            A collection of robust backend architectures, distributed systems, and full-stack applications solving real business problems.
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl border border-border/50 bg-card/50 p-8 space-y-4">
                <Skeleton className="h-8 w-1/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <div className="pt-8 space-y-2">
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-full rounded" />
                </div>
              </div>
            ))
          ) : (
            featuredProjects.map((project, index) => (
              <div
                key={project.title}
                className={`group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5
                  ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="p-6 md:p-8 lg:p-10 relative z-10 flex flex-col h-full">
                  {/* Top Row: Type & Links */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-secondary/50 text-foreground border border-border/50`}>
                        {project.type || 'Project'}
                      </span>
                      {project.impact && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <Zap className="w-3 h-3" />
                          {project.impact}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {project.github && (
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-colors" asChild>
                          <a href={project.github} target="_blank" aria-label="GitHub Repo">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {project.demo && (
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-colors" asChild>
                          <a href={project.demo} target="_blank" aria-label="Live Demo">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-auto">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                      {project.description}
                    </p>

                    {/* Features List (if available) */}
                    {project.features && project.features.length > 0 && (
                      <ul className="space-y-2 mb-8">
                        {project.features.map(feat => (
                          <li key={feat} className="flex items-center gap-2 text-sm text-foreground/80">
                            <Star className="w-3 h-3 text-primary shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Tech Stack Footer */}
                  <div className="pt-6 border-t border-border/40 flex flex-wrap gap-2 mt-4">
                    {project.tech.map(t => (
                      <span key={t} className={`px-3 py-1.5 rounded-md text-xs font-medium border ${getTechStyle(t)}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Impact Mobile Badge (shown here only if hidden above on mobile) */}
                  {project.impact && (
                    <div className="mt-4 sm:hidden flex items-center gap-2 text-xs text-green-400 font-medium">
                      <Zap className="w-3 h-3" />
                      {project.impact}
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

        {/* Other Projects - Smaller List */}
        {otherProjects.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Folder className="w-5 h-5 text-muted-foreground" />
              Other Experiments
            </h3>
            <div className="space-y-4">
              {otherProjects.map(project => (
                <div key={project.title} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-border/40 bg-card/20 hover:bg-card/40 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      {project.github && <a href={project.github} className="text-muted-foreground hover:text-primary"><Github className="w-3 h-3" /></a>}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl">{project.description}</p>
                    <div className="flex gap-2 mt-1">
                      {project.tech.slice(0, 3).map(t => <span key={t} className="text-[10px] text-muted-foreground font-mono">{t}</span>)}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">{project.type || 'Personal'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All */}
        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-full px-8 py-6 text-base hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all font-medium" asChild>
            <a href="https://github.com/Mukeshsilwal?tab=repositories" target="_blank">
              View Full Project Archive <ArrowUpRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;

