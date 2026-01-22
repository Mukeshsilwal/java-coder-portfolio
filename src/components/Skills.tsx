import {
  Code,
  Server,
  Database as DatabaseIcon,
  Wrench,
  Coffee,
  Leaf,
  Layers,
  Globe,
  GitBranch,
  Container,
  Terminal as TerminalIcon,
  TestTube,
  Cloud,
  LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { SkillDTO } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryConfig {
  icon: LucideIcon;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

// Map for Category -> Config
const categoryConfig: Record<string, CategoryConfig> = {
  'Backend': {
    icon: Server,
    colorClass: 'text-orange-500',
    borderClass: 'border-orange-500/20',
    bgClass: 'bg-orange-500/10'
  },
  'Frontend': {
    icon: Code,
    colorClass: 'text-blue-400',
    borderClass: 'border-blue-400/20',
    bgClass: 'bg-blue-400/10'
  },
  'Database': {
    icon: DatabaseIcon,
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-400/20',
    bgClass: 'bg-yellow-400/10'
  },
  'DevOps': {
    icon: Cloud,
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-400/20',
    bgClass: 'bg-purple-400/10'
  },
  'Tools': {
    icon: TerminalIcon,
    colorClass: 'text-gray-400',
    borderClass: 'border-gray-400/20',
    bgClass: 'bg-gray-400/10'
  }
};

const techIcons = [
  { icon: Coffee, label: 'Java', class: 'text-orange-500' },
  { icon: Leaf, label: 'Spring', class: 'text-green-500' },
  { icon: Layers, label: 'JPA', class: 'text-yellow-500' },
  { icon: Container, label: 'Docker', class: 'text-blue-500' },
  { icon: Cloud, label: 'AWS', class: 'text-yellow-600' },
  { icon: GitBranch, label: 'Git', class: 'text-red-500' },
];

interface SkillUI {
  name: string;
  level?: number;
}

interface CategoryUI extends CategoryConfig {
  title: string;
  skills: SkillUI[];
}

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<CategoryUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await publicApi.getSkills();
        if (data && data.length > 0) {
          // Group by Category
          const groups: Record<string, SkillDTO[]> = {};
          data.forEach(skill => {
            const cat = skill.category || 'Tools';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(skill);
          });

          // Transform to UI format with predefined sort order
          const sortOrder = ['Backend', 'Database', 'Frontend', 'DevOps', 'Tools'];

          const categories = Object.keys(groups)
            .sort((a, b) => {
              const idxA = sortOrder.indexOf(a);
              const idxB = sortOrder.indexOf(b);
              return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
            })
            .map(cat => {
              const config = categoryConfig[cat] || categoryConfig['Tools'];
              return {
                title: cat,
                ...config,
                skills: groups[cat].map(s => ({
                  name: s.skillName,
                  level: 80 // Default mostly visual now
                }))
              };
            });

          setSkillCategories(categories);
        } else {
          // Fallback Static Data
          setSkillCategories([
            { title: 'Backend', ...categoryConfig['Backend'], skills: [{ name: 'Java', level: 90 }, { name: 'Spring Boot', level: 85 }, { name: 'WebFlux', level: 80 }, { name: 'Hibernate', level: 75 }] },
            { title: 'Database', ...categoryConfig['Database'], skills: [{ name: 'PostgreSQL', level: 85 }, { name: 'Redis', level: 70 }, { name: 'Oracle', level: 60 }, { name: 'MongoDB', level: 65 }] },
            { title: 'Frontend', ...categoryConfig['Frontend'], skills: [{ name: 'React', level: 70 }, { name: 'TypeScript', level: 65 }, { name: 'Tailwind', level: 80 }] },
            { title: 'DevOps', ...categoryConfig['DevOps'], skills: [{ name: 'Docker', level: 75 }, { name: 'Kubernetes', level: 50 }, { name: 'Jenkins', level: 60 }, { name: 'AWS', level: 55 }] }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="section-padding relative w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in">
            <TerminalIcon className="w-3 h-3" />
            Tech Stack
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-up">
            My Technical <span className="gradient-text">Arbitrage</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            A comprehensive toolset for building robust, scalable, and reactive systems.
            From database optimization to frontend interactivity.
          </p>
        </div>

        {/* Floating Icons Strip (Decorative) */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20 opacity-80 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {techIcons.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className={`p-4 rounded-2xl bg-card border border-border/50 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ${t.class.replace('text-', 'shadow-')}/20`}>
                <t.icon className={`w-8 h-8 ${t.class}`} />
              </div>
              <span className="text-xs font-mono text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))
          ) : (
            skillCategories.map((category, idx) => (
              <div
                key={category.title}
                className={`group relative p-1 rounded-2xl bg-gradient-to-br from-border/50 to-transparent hover:from-primary/20 hover:to-accent/20 transition-all duration-500
                    ${idx === 0 || idx === 1 ? 'md:col-span-1' : ''}
                `}
              >
                <div className="h-full bg-card/40 backdrop-blur-sm p-6 md:p-8 rounded-[14px] border border-border/50 group-hover:border-transparent transition-all">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-xl ${category.bgClass} ${category.borderClass} border flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 ${category.colorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{category.skills.length} skills</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-sm font-medium hover:bg-secondary hover:border-primary/30 transition-colors cursor-default"
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
