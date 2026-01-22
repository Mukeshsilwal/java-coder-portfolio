import { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SkillItemProps {
    name: string;
    level: number;
    delay?: number;
}

export const SkillProgressBar = ({ name, level, delay = 0 }: SkillItemProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Animate the progress bar
                    setTimeout(() => {
                        setCurrentLevel(level);
                    }, delay);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [level, delay]);

    return (
        <div ref={ref} className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {isVisible ? currentLevel : 0}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden relative">
                {/* Background glow effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        width: `${currentLevel}%`,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />

                {/* Actual progress */}
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent relative overflow-hidden"
                    style={{
                        width: `${currentLevel}%`,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            </div>
        </div>
    );
};

interface SkillCategoryCardProps {
    title: string;
    icon: LucideIcon;
    skills: { name: string; level: number }[];
    colorClass: string;
    borderClass: string;
    bgClass: string;
    delay?: number;
}

export const SkillCategoryCard = ({
    title,
    icon: Icon,
    skills,
    colorClass,
    borderClass,
    bgClass,
    delay = 0
}: SkillCategoryCardProps) => {
    return (
        <div
            className="group relative p-1 rounded-2xl bg-gradient-to-br from-border/50 to-transparent 
                 hover:from-primary/20 hover:to-accent/20 transition-all duration-500 animate-fade-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="h-full bg-card/40 backdrop-blur-sm p-6 md:p-8 rounded-[14px] 
                      border border-border/50 group-hover:border-primary/30 transition-all">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-xl ${bgClass} ${borderClass} border-2 
                          flex items-center justify-center group-hover:scale-110 
                          transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${colorClass}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                            {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                        </p>
                    </div>
                </div>

                {/* Skills with Progress Bars */}
                <div className="space-y-5">
                    {skills.map((skill, index) => (
                        <SkillProgressBar
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                            delay={delay + (index * 100)}
                        />
                    ))}
                </div>

                {/* Average Proficiency Badge */}
                <div className="mt-6 pt-6 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Avg. Proficiency</span>
                        <span className={`font-bold ${colorClass}`}>
                            {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
