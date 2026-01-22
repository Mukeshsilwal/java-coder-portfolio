import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data } = await axiosInstance.get<ExperienceItem[]>('/experience');
        setExperiences(data);
      } catch (err) {
        console.error("Using static fallback", err);
        // Fallback to static if API fails (optional, good for demo)
        setExperiences([
          {
            id: '1',
            isCurrent: true,
            position: 'Java Software Engineer',
            company: 'F1Soft International',
            startDate: '2024-10-01',
            endDate: '',
            description: 'Working on mobile banking backend systems at Nepal\'s leading fintech company. Building scalable APIs and microservices serving millions of users.',
          },
          {
            id: '2',
            isCurrent: false,
            position: 'Java Backend Developer',
            company: 'Citytech Group Pvt. Ltd',
            startDate: '2023-04-01',
            endDate: '2024-09-30',
            description: 'Developed Gatepay, a multi-payment gateway system using Java reactive programming. Built FinPOS backend for POS device integration and transaction management.',
          },
        ]);
      }
    };
    fetchExperience();
  }, []);

  const education = [
    {
      degree: 'BSc CSIT',
      institution: 'Tribhuvan University',
      period: '2019 - 2023',
      description: 'Focused on software engineering, database systems, and web technologies.',
    },
  ];

  const certifications = [
    { name: 'Java Spring Boot Development', year: '2023' },
    { name: 'Reactive Programming with WebFlux', year: '2024' },
  ];

  return (
    <section id="experience" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-primary text-sm tracking-wider uppercase">Experience</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              Career <span className="gradient-text">Journey</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Work Experience */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Work Experience</h3>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute left-[9px] w-3 h-3 rounded-full bg-primary glow-primary" />

                      <div className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                            <Calendar className="w-4 h-4" />
                            {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        <p className="text-muted-foreground text-sm mb-4 whitespace-pre-line">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-8">
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Education</h3>
                </div>

                {education.map((edu, index) => (
                  <div key={index} className="glass-card p-6 rounded-xl">
                    <h4 className="font-bold mb-1">{edu.degree}</h4>
                    <p className="text-primary font-medium text-sm mb-2">{edu.institution}</p>
                    <p className="text-muted-foreground text-sm font-mono mb-3">{edu.period}</p>
                    <p className="text-muted-foreground text-sm">{edu.description}</p>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-spring/10 border border-spring/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-spring" />
                  </div>
                  <h3 className="text-xl font-bold">Certifications</h3>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="glass-card p-4 rounded-lg flex items-center justify-between hover:border-primary/30 transition-all duration-300"
                    >
                      <div>
                        <p className="font-medium text-sm">{cert.name}</p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
