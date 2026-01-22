import { Briefcase, Calendar, MapPin } from 'lucide-react';

export interface ExperienceData {
    id: number;
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate: string | null;
    description: string;
    location?: string;
    technologies?: string[];
}

interface TimelineItemProps {
    experience: ExperienceData;
    isLast: boolean;
    index: number;
}

export const TimelineItem = ({ experience, isLast, index }: TimelineItemProps) => {
    const isPresent = !experience.endDate;
    const delay = index * 100; // Staggered animation delay

    return (
        <div className="relative pl-8 md:pl-0 animate-fade-up group" style={{ animationDelay: `${delay}ms` }}>
            {/* Desktop Layout (Alternating) */}
            <div className="hidden md:flex justify-between items-start w-full min-h-[180px]">
                {/* Left Side (45%) */}
                <div className="w-[45%] flex justify-end pr-8 pt-2">
                    {index % 2 === 0 ? (
                        <ExperienceContent experience={experience} align="right" />
                    ) : (
                        <div className="text-sm text-muted-foreground font-mono pt-4 transition-colors group-hover:text-primary/80">
                            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                        </div>
                    )}
                </div>

                {/* Center Line & Node */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all duration-500
            ${isPresent ? 'bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] scale-110' : 'bg-background border-muted-foreground group-hover:border-primary group-hover:scale-110'}`}
                    />
                    {!isLast && <div className="w-0.5 h-full bg-border/50 grow -mt-2 group-hover:bg-primary/20 transition-colors duration-500" />}
                </div>

                {/* Right Side (45%) */}
                <div className="w-[45%] flex justify-start pl-8 pt-2">
                    {index % 2 !== 0 ? (
                        <ExperienceContent experience={experience} align="left" />
                    ) : (
                        <div className="text-sm text-muted-foreground font-mono pt-4 transition-colors group-hover:text-primary/80">
                            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Layout (Standard Timeline) */}
            <div className="md:hidden pb-12 relative border-l-2 border-border/50 ml-2 pl-8">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
            ${isPresent ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`}
                />
                <div className="mb-2 text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                </div>
                <ExperienceContent experience={experience} align="left" />
            </div>
        </div>
    );
};

const ExperienceContent = ({ experience, align }: { experience: ExperienceData, align: 'left' | 'right' }) => (
    <div className={`relative p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 
                   hover:border-primary/30 hover:bg-card/60 transition-all duration-300 w-full max-w-lg shadow-sm
                   ${align === 'right' ? 'text-right' : 'text-left'}
                 `}>
        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {experience.companyName}
        </h3>
        <div className={`flex items-center gap-2 text-sm font-medium text-secondary-foreground mb-4 
                    ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <Briefcase className="w-4 h-4 text-primary" />
            {experience.jobTitle}
            {experience.location && (
                <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="w-3 h-3" />
                        {experience.location}
                    </span>
                </>
            )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {experience.description}
        </p>

        {experience.technologies && (
            <div className={`flex flex-wrap gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {experience.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="px-2 py-1 rounded text-[10px] bg-secondary/50 border border-border/50 text-muted-foreground">
                        {tech}
                    </span>
                ))}
                {experience.technologies.length > 4 && (
                    <span className="px-2 py-1 rounded text-[10px] text-muted-foreground">+{experience.technologies.length - 4}</span>
                )}
            </div>
        )}
    </div>
);

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};
