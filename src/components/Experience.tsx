import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

const experiences = [
  {
    type: 'work',
    title: 'Java Backend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Developing and maintaining microservices architecture using Spring Boot. Leading API design and implementation for enterprise clients.',
    highlights: ['Microservices', 'API Development', 'Team Lead'],
  },
  {
    type: 'work',
    title: 'Junior Java Developer',
    company: 'StartupXYZ',
    period: '2021 - 2022',
    description: 'Built RESTful APIs and contributed to backend development of an e-commerce platform. Collaborated with frontend team for seamless integration.',
    highlights: ['REST APIs', 'E-commerce', 'Agile'],
  },
  {
    type: 'work',
    title: 'Software Development Intern',
    company: 'Innovation Labs',
    period: '2020 - 2021',
    description: 'Learned enterprise Java development practices. Contributed to internal tools and gained hands-on experience with Spring Framework.',
    highlights: ['Spring Framework', 'Internal Tools', 'Learning'],
  },
];

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'State University',
    period: '2017 - 2021',
    description: 'Graduated with honors. Specialized in software engineering and database systems.',
  },
];

const certifications = [
  { name: 'Oracle Certified Professional: Java SE 11', year: '2023' },
  { name: 'Spring Professional Certification', year: '2022' },
  { name: 'AWS Certified Cloud Practitioner', year: '2022' },
];

const Experience = () => {
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
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute left-[9px] w-3 h-3 rounded-full bg-primary glow-primary" />
                      
                      <div className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-lg">{exp.title}</h4>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                            <Calendar className="w-4 h-4" />
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        <p className="text-muted-foreground text-sm mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
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
