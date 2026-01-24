import { Code2, Cpu, Database, Zap } from 'lucide-react';

const highlights = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, well-documented code following best practices',
    color: 'text-blue-500',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Cpu,
    title: 'System Design',
    description: 'Architecting scalable solutions for complex business problems',
    color: 'text-purple-500',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Database,
    title: 'Data Driven',
    description: 'Optimizing database queries and data structures for performance',
    color: 'text-yellow-500',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Building high-throughput APIs with minimal latency',
    color: 'text-orange-500',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/10'
  },
];

import { publicApi } from '@/api/services';
import { ProfileDTO } from '@/types';
import { useEffect, useState } from 'react';

const About = () => {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);

  useEffect(() => {
    publicApi.getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <section id="about" className="section-padding relative">

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in">
              <Code2 className="w-3 h-3" />
              About Me
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Crafting <span className="gradient-text">Backend Excellence</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Text */}
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                {profile?.bio ? (
                  <div className="whitespace-pre-line">
                    {profile.bio}
                  </div>
                ) : (
                  <>
                    <p>
                      I am a results-driven <span className="text-foreground font-semibold">Java Software Engineer</span> specializing in
                      <span className="text-foreground font-semibold"> FinTech</span> and backend systems. With deep expertise in
                      building <span className="text-primary font-medium">scalable microservices</span>, I engineer high-throughput
                      transaction processing systems using <span className="text-orange-500 font-medium">Spring Boot</span> and modern cloud technologies.
                    </p>
                    <p>
                      My technical focus spans advanced <span className="text-green-500 font-medium">REST API</span> design, database optimization,
                      and distributed system architecture. I am committed to delivering enterprise-grade solutions that prioritize performance,
                      security, and maintainability.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 lg:mt-8">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
