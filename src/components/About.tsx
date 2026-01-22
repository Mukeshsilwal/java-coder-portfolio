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

const About = () => {
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
              <div className="glass-card p-6 rounded-2xl border border-border/50 bg-background/50">
                <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground ml-auto">about.java</span>
                </div>
                <pre className="font-mono text-sm text-muted-foreground overflow-x-auto leading-relaxed">
                  <code>
                    {`<span className="text-purple-400">public class</span> <span className="text-yellow-400">Developer</span> {
  <span className="text-purple-400">private</span> String name = <span className="text-green-400">"Mukesh Silwal"</span>;
  <span className="text-purple-400">private</span> String focus = <span className="text-green-400">"Backend Engineering"</span>;
  
  <span className="text-purple-400">private</span> String[] passions = {
    <span className="text-green-400">"Reactive Programming"</span>,
    <span className="text-green-400">"Fintech Solutions"</span>,
    <span className="text-green-400">"Distributed Systems"</span>
  };
}`}
                  </code>
                </pre>
              </div>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I'm a passionate <span className="text-foreground font-semibold">Java Backend Software Engineer</span> with
                  over 2 years of experience building robust fintech solutions.
                </p>
                <p>
                  Currently at <span className="text-foreground font-semibold">F1Soft International</span>, Nepal's leading fintech company, I architect mobile banking backends
                  that serve millions of users. My expertise lies in <span className="text-orange-500 font-medium">Spring Boot</span>, <span className="text-green-500 font-medium">WebFlux</span>, and designing scalable microservices.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">2+</span>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">Years Exp</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">5+</span>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">Live Projects</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">2</span>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">Companies</p>
                </div>
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
