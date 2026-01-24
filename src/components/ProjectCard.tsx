import { ExternalLink, Github, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProjectCardData {
    title: string;
    description: string;
    problem?: string;
    solutions?: string[];
    metrics?: string;
    tech: string[];
    github: string;
    demo: string | null;
    featured?: boolean;
    type?: string;
    thumbnail?: string;
}

interface ProjectCardProps {
    project: ProjectCardData;
    featured?: boolean;
    className?: string;
}

const getTechStyle = (tech: string) => {
    const lower = tech.toLowerCase();
    if (lower.includes('java')) return 'text-[#ff4500] bg-[#ff4500]/10 border-[#ff4500]/20';
    if (lower.includes('spring')) return 'text-[#6db33f] bg-[#6db33f]/10 border-[#6db33f]/20';
    if (lower.includes('react') || lower.includes('frontend')) return 'text-info bg-info/10 border-info/20';
    if (lower.includes('sql') || lower.includes('data') || lower.includes('postgres')) return 'text-warning bg-warning/10 border-warning/20';
    if (lower.includes('docker') || lower.includes('cloud') || lower.includes('kubernetes')) return 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20';
    return 'text-muted-foreground bg-secondary border-border';
};

export const ProjectCard = ({ project, featured = false, className = '' }: ProjectCardProps) => {
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden
                  border border-border/50 bg-card/30 backdrop-blur-xl
                  hover:border-primary/50 transition-all duration-500
                  hover:shadow-2xl hover:shadow-primary/5
                  ${featured ? 'md:col-span-2' : ''}
                  ${className}`}
        >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Thumbnail Section (if provided) */}
            {project.thumbnail && (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          flex items-end p-6 gap-3">
                        {project.demo && (
                            <Button
                                size="sm"
                                className="bg-white/10 backdrop-blur border border-white/20 text-white
                           hover:bg-white/20 transition-colors"
                                asChild
                            >
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Live Demo
                                </a>
                            </Button>
                        )}
                        {project.github && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/10 backdrop-blur border border-white/20 text-white
                           hover:bg-white/20 transition-colors"
                                asChild
                            >
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-4 h-4 mr-2" />
                                    Source
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-6 md:p-8 lg:p-10 relative z-10 flex flex-col h-full">
                {/* Top Row: Type & Links */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider
                           bg-secondary/50 text-foreground border border-border/50">
                            {project.type || 'Project'}
                        </span>
                        {featured && (
                            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                             bg-warning/10 text-warning border border-warning/20">
                                ⭐ Featured
                            </span>
                        )}
                    </div>

                    {!project.thumbnail && (
                        <div className="flex gap-2">
                            {project.github && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-colors"
                                    asChild
                                >
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repo">
                                        <Github className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                            {project.demo && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-colors"
                                    asChild
                                >
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                    {project.description}
                </p>

                {/* Case Study Section */}
                {(project.problem || project.solutions) && (
                    <div className="space-y-4 mb-6">
                        {/* Problem Statement */}
                        {project.problem && (
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-error rounded-full" />
                                    Challenge
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-border/50">
                                    {project.problem}
                                </p>
                            </div>
                        )}

                        {/* Solution Highlights */}
                        {project.solutions && project.solutions.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-success rounded-full" />
                                    Solution
                                </h4>
                                <ul className="space-y-2 pl-3 border-l-2 border-border/50">
                                    {project.solutions.map((solution, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                            {solution}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Impact Metrics */}
                {project.metrics && (
                    <div className="mb-6 p-4 rounded-xl bg-success/5 border border-success/20 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <h4 className="text-sm font-semibold text-success uppercase tracking-wide">
                                Impact
                            </h4>
                        </div>
                        <p className="text-sm text-foreground font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4 text-warning" />
                            {project.metrics}
                        </p>
                    </div>
                )}

                {/* Tech Stack Footer */}
                <div className="pt-6 border-t border-border/40 flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((tech) => (
                        <span
                            key={tech}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                         hover:scale-105 cursor-default ${getTechStyle(tech)}`}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
