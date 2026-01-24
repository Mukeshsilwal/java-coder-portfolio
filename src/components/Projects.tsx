import { ExternalLink, Github, Folder, ArrowUpRight, Trophy, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { ProjectDTO } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard, ProjectCardData } from '@/components/ProjectCard';

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
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await publicApi.getProjects();
        if (data && Array.isArray(data)) {
          const mapped: ProjectCardData[] = data.map(p => ({
            title: p.title,
            description: p.description,
            tech: p.techStack ? p.techStack.split(',').map(s => s.trim()) : [],
            github: p.githubRepoUrl,
            demo: p.liveDemoUrl,
            featured: p.isFeatured,
            type: p.projectType,
            thumbnail: p.projectImage // Ensure mapped if available in DTO/Entity
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  if (!loading && projects.length === 0) {
    return null;
  }
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
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[500px] rounded-2xl border border-border/50 bg-card/50 p-8 space-y-4">
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
              <ProjectCard
                key={project.title}
                project={project}
                featured={true}
                className={index === 0 ? 'md:col-span-2' : ''}
              />
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

