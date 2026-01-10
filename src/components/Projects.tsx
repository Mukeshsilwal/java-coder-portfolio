import { ExternalLink, Github, Folder, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'Ticket Katum',
    description: 'A comprehensive booking platform for bus tickets, hotel rooms, and event reservations. Built with a microservices architecture for high availability.',
    tech: ['Java', 'Spring Boot', 'React', 'Tailwind CSS', 'PostgreSQL'],
    features: ['Bus Ticket Booking', 'Room Reservations', 'Event Management', 'Payment Integration'],
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
  },
  {
    title: 'Kisan Ko Sathii',
    description: 'An innovative platform connecting farmers directly with buyers, featuring AI-powered vegetable analysis for quality assessment and price recommendations.',
    tech: ['Java', 'Spring Boot', 'AI/ML', 'React', 'PostgreSQL'],
    features: ['Farmer-Buyer Marketplace', 'AI Vegetable Analysis', 'Price Analytics', 'Direct Connect'],
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
  },
  {
    title: 'Gatepay - Multi-Payment Gateway',
    description: 'Enterprise payment gateway system supporting multiple payment methods and transaction management for merchants. Built using Java reactive programming.',
    tech: ['Java', 'Spring WebFlux', 'Reactive Streams', 'Redis', 'PostgreSQL'],
    features: ['Multi-Payment Methods', 'Merchant Management', 'Real-time Transactions', 'Analytics Dashboard'],
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: true,
  },
  {
    title: 'FinPOS - Point of Sale System',
    description: 'Backend system for POS devices enabling seamless payment processing and transaction management at retail points.',
    tech: ['Java', 'Spring Boot', 'REST APIs', 'MySQL'],
    features: ['POS Integration', 'Transaction Processing', 'Inventory Sync', 'Reporting'],
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: false,
  },
  {
    title: 'Mobile Banking Backend',
    description: 'Core banking backend powering mobile banking operations at Nepal\'s leading fintech company, serving millions of users.',
    tech: ['Java', 'Spring Boot', 'Microservices', 'Oracle DB'],
    features: ['Account Management', 'Fund Transfers', 'Bill Payments', 'Transaction History'],
    github: 'https://github.com/Mukeshsilwal',
    demo: null,
    featured: false,
  },
];

const Projects = () => {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-primary text-sm tracking-wider uppercase">Projects</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              Featured <span className="gradient-text">Work</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          {/* Featured Projects */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.title}
                className={`glass-card rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-300 ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                      <Folder className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="View on GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="View live demo"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap items-center gap-3">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Projects */}
          <h3 className="text-xl font-semibold mb-6 text-center">Other Noteworthy Projects</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProjects.map((project) => (
              <div
                key={project.title}
                className="glass-card p-6 rounded-xl group hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <Folder className="w-10 h-10 text-primary" />
                  <div className="flex items-center gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <a href="https://github.com/Mukeshsilwal" target="_blank" rel="noopener noreferrer">
                View All on GitHub
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
