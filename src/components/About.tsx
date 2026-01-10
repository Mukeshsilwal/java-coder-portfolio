import { Code2, Cpu, Database, Zap } from 'lucide-react';

const highlights = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, well-documented code following best practices',
  },
  {
    icon: Cpu,
    title: 'System Design',
    description: 'Architecting scalable solutions for complex business problems',
  },
  {
    icon: Database,
    title: 'Data Driven',
    description: 'Optimizing database queries and data structures for performance',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Building high-throughput APIs with minimal latency',
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-primary text-sm tracking-wider uppercase">About Me</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              Crafting <span className="gradient-text">Backend Excellence</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-mono text-sm text-muted-foreground ml-2">about.java</span>
                </div>
                <pre className="font-mono text-sm text-muted-foreground overflow-x-auto">
                  <code>
{`public class Developer {
  private String name = "Mukesh Silwal";
  private int experience = 2; // years
  private String[] passions = {
    "Reactive Programming",
    "Fintech Solutions",
    "System Architecture"
  };
}`}
                  </code>
                </pre>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a passionate <span className="text-foreground font-semibold">Java Backend Software Engineer</span> with 
                2+ years of experience building robust fintech solutions. I specialize in creating 
                scalable APIs using <span className="text-spring font-semibold">Spring Boot</span>, 
                <span className="text-spring font-semibold"> WebFlux</span>, and reactive programming.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Currently at F1Soft, Nepal's leading fintech company, I work on mobile banking backends 
                that serve millions of users. Previously, I built payment gateway systems and POS solutions 
                at Citytech Group.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <span className="text-3xl font-bold gradient-text">2+</span>
                  <p className="text-sm text-muted-foreground">Years Exp.</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-bold gradient-text">5+</span>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-bold gradient-text">2</span>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
              </div>
            </div>

            {/* Right Column - Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="glass-card p-6 rounded-xl group hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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
