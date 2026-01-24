import {
  Code,
  Server,
  Database as DatabaseIcon,
  Cloud,
  Terminal as TerminalIcon,
  LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { SkillDTO } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SkillCategoryCard } from '@/components/SkillProgressBar';

interface CategoryConfig {
  icon: LucideIcon;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

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

interface SkillUI {
  name: string;
  level: number;
  iconUrl?: string;
}

interface CategoryUI extends CategoryConfig {
  title: string;
  skills: SkillUI[];
}

const FALLBACK_SKILLS: CategoryUI[] = [
  {
    title: 'Backend',
    ...categoryConfig['Backend'],
    skills: [
      { name: 'Java', level: 95 },
      { name: 'Spring Boot', level: 90 },
      { name: 'WebFlux', level: 85 },
      { name: 'Hibernate', level: 80 }
    ]
  },
  {
    title: 'Database',
    ...categoryConfig['Database'],
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'Redis', level: 75 },
      { name: 'Oracle', level: 70 },
      { name: 'MongoDB', level: 65 }
    ]
  },
  {
    title: 'Frontend',
    ...categoryConfig['Frontend'],
    skills: [
      { name: 'React', level: 75 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind CSS', level: 85 }
    ]
  },
  {
    title: 'DevOps',
    ...categoryConfig['DevOps'],
    skills: [
      { name: 'Docker', level: 80 },
      { name: 'Kubernetes', level: 60 },
      { name: 'Jenkins', level: 65 },
      { name: 'AWS', level: 70 }
    ]
  }
];

const Skills = () => {
  // Initialize with FALLBACK_SKILLS to ensure content is visible immediately or on error
  const [skillCategories, setSkillCategories] = useState<CategoryUI[]>(FALLBACK_SKILLS);
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
                  // Ensure level is a number
                  level: typeof s.proficiencyLevel === 'number' ? s.proficiencyLevel : 80,
                  iconUrl: s.iconUrl
                }))
              };
            });

          setSkillCategories(categories);
        }
        // If data is empty, we keep the FALLBACK_SKILLS initialized in state
      } catch (err) {
        console.error("Failed to fetch skills, using static fallback", err);
        // Keep FALLBACK_SKILLS
        setSkillCategories(FALLBACK_SKILLS);
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

        {/* Categories Grid with Progress Bars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))
          ) : (
            skillCategories.map((category, idx) => (
              <SkillCategoryCard
                key={category.title}
                title={category.title}
                icon={category.icon}
                skills={category.skills}
                colorClass={category.colorClass}
                borderClass={category.borderClass}
                bgClass={category.bgClass}
                delay={idx * 100}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
