import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  techStack?: string[]; // Added optional tech stack
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data } = await axiosInstance.get<ExperienceItem[]>('/experience');
        setExperiences(data);
      } catch (err) {
        console.error("Using static fallback for Experience", err);
        // Fallback to static if API fails
        setExperiences([
          {
            id: '1',
            isCurrent: true,
            position: 'Java Software Engineer',
            company: 'F1Soft International',
            startDate: '2024-10-01',
            endDate: '',
            description: 'Building the core banking backend for Nepal\'s largest fintech ecosystem. Designing scalable microservices, optimizing database performance, and ensuring 99.9% system availability for millions of daily transactions.',
            techStack: ['Java', 'Spring Boot', 'Microservices', 'Oracle DB', 'Redis']
          },
          {
            id: '2',
            isCurrent: false,
            position: 'Java Backend Developer',
            company: 'Citytech Group Pvt. Ltd',
            startDate: '2023-04-01',
            endDate: '2024-09-30',
            description: 'Spearheaded the development of Gatepay, a reactive payment gateway aggregator. Integrated 15+ external payment providers and built a real-time transaction monitoring dashboard using WebSockets.',
            techStack: ['Java', 'Spring WebFlux', 'Reactive Streams', 'PostgreSQL', 'Docker']
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  const education = [
    {
      degree: 'BSc CSIT',
      institution: 'Tribhuvan University',
      period: '2019 - 2023',
      description: 'Specialized in Software Engineering and Advanced Database Systems. Capstone project: Distributed Ledger Implementation.',
    },
  ];

  const certifications = [
    { name: 'Java Spring Boot Development', year: '2023' },
    { name: 'Reactive Programming with WebFlux', year: '2024' },
    { name: 'AWS Certified Cloud Practitioner', year: '2024' },
  ];

  if (loading) {
    return <div className="py-24 text-center">Loading experience...</div>;
  }

  return (
    <section id="experience" className="section-padding relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Work Experience Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-10 animate-fade-up">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Work Experience</h2>
                <p className="text-muted-foreground">My professional career in engineering.</p>
              </div>
            </div>

            <div className="relative pl-8 md:pl-10 space-y-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Vertical Line */}
              <div className="absolute left-3 top-2 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[35px] md:-left-[43px] w-4 h-4 rounded-full border-2 border-background ${index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-muted-foreground/30'}`} />

                  <div className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 hover:bg-card/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{exp.position}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 text-xs font-mono text-muted-foreground border border-border/50">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} — {exp.isCurrent ? <span className="text-green-500 font-bold">Present</span> : exp.endDate}
                      </span>
                    </div>

                    <div className="text-lg font-medium text-muted-foreground mb-4">{exp.company}</div>

                    <p className="text-muted-foreground/90 leading-relaxed mb-6">
                      {exp.description}
                    </p>

                    {/* Tech Stack Badges */}
                    {exp.techStack && (
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map(tech => (
                          <span key={tech} className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium border border-primary/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Edu & Certs */}
          <div className="space-y-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>

            {/* Education */}
            <div className="bg-card/20 rounded-2xl p-6 md:p-8 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-border/50">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                    <h4 className="font-bold">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{edu.institution}</p>
                    <p className="text-xs font-mono text-muted-foreground/50 mb-2">{edu.period}</p>
                    <p className="text-sm text-muted-foreground/80">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-card/20 rounded-2xl p-6 md:p-8 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-spring" />
                <h3 className="text-xl font-bold">Licenses & Certs</h3>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <span className="text-sm font-medium">{cert.name}</span>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
