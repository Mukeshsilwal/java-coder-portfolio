import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '@/api/services';
import { Skeleton } from '@/components/ui/skeleton';
import { TimelineItem, ExperienceData } from '@/components/TimelineItem';

const FALLBACK_EXPERIENCE: ExperienceData[] = [
  {
    id: 1,
    companyName: 'TechCorp Solutions',
    jobTitle: 'Senior Backend Engineer',
    startDate: '2023-01-01',
    endDate: null,
    description: 'Leading a team of 5 developers in re-architecting legacy monoliths into microservices using Spring Boot and Docker. Improved system scalability by 200%.',
    location: 'Kathmandu, Nepal',
    technologies: ['Java', 'Spring Cloud', 'Kubernetes', 'Kafka']
  },
  {
    id: 2,
    companyName: 'FinServe Nepal',
    jobTitle: 'Java Developer',
    startDate: '2021-03-01',
    endDate: '2022-12-31',
    description: 'Developed secure payment gateway integrations and core banking modules. Optimized SQL queries significantly reducing transaction latency.',
    location: 'Lalitpur, Nepal',
    technologies: ['Java 11', 'Spring Boot', 'PostgreSQL', 'Redis']
  },
  {
    id: 3,
    companyName: 'SoftBenz Infosys',
    jobTitle: 'Junior Software Engineer',
    startDate: '2019-06-01',
    endDate: '2021-02-28',
    description: 'Collaborated on full-stack web applications using React and Spring Boot. Implemented RESTful APIs and ensured high code quality through unit testing.',
    location: 'Kathmandu, Nepal',
    technologies: ['Java', 'React', 'MySQL', 'Junit']
  }
];

const Experience = () => {
  // Initialize with FALLBACK to ensure robustness immediately
  const [experiences, setExperiences] = useState<ExperienceData[]>(FALLBACK_EXPERIENCE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await publicApi.getExperiences();
        if (data && data.length > 0) {
          // Map API DTO to UI model
          const mapped: ExperienceData[] = data.map((exp: any) => ({
            id: exp.id,
            companyName: exp.company, // Backend: company
            jobTitle: exp.position,   // Backend: position
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
            jobType: exp.jobType,     // Backend: jobType
            location: 'Remote', // We might not have location in DB yet, or add it
            technologies: [] // We don't have this column yet in Experience entity
          }));

          // Sort by date descending
          const sorted = mapped.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          setExperiences(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch experience, using fallback", err);
        setExperiences(FALLBACK_EXPERIENCE);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

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
