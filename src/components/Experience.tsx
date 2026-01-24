import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { Skeleton } from '@/components/ui/skeleton';
import { TimelineItem, ExperienceData } from '@/components/TimelineItem';

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await publicApi.getExperiences();
        if (data && Array.isArray(data)) {
          // Map API DTO to UI model
          const mapped: ExperienceData[] = data.map((exp: any) => ({
            id: exp.id,
            companyName: exp.company,
            jobTitle: exp.role, // Backend: role
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent,
            description: exp.description,
            jobType: exp.jobType,
            location: 'Remote', // Default or could be added to DB later
            technologies: exp.technologies || [] // Backend now returns this list
          }));

          // Sort by date descending
          const sorted = mapped.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          setExperiences(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch experience", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  // Use empty state if no experiences found (after loading)
  if (!loading && experiences.length === 0) {
    // Optional: Render nothing or a simplified empty state. 
    // For now we render nothing to avoid clutter if no data exists.
    return null;
  }

  return (
    <section id="experience" className="section-padding relative w-full overflow-hidden bg-secondary/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in">
            <Briefcase className="w-3 h-3" />
            Career Journey
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-up">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            A timeline of my contributions to high-impact engineering projects.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto relative">
          {loading ? (
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 items-center">
                  <Skeleton className="w-full md:w-1/2 h-40 rounded-2xl" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="w-full md:w-1/2 h-40 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {experiences.map((exp, index) => (
                <TimelineItem
                  key={exp.id}
                  experience={exp}
                  index={index}
                  isLast={index === experiences.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
