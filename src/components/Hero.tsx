import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Floating Code Elements */}
      <div className="absolute top-1/3 left-[10%] font-mono text-primary/30 text-sm animate-float hidden lg:block">
        public class Developer &#123;
      </div>
      <div className="absolute top-1/2 right-[10%] font-mono text-accent/30 text-sm animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
        @SpringBootApplication
      </div>
      <div className="absolute bottom-1/3 left-[15%] font-mono text-primary/30 text-sm animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
        &#125; // end class
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for opportunities</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Hi, I'm{' '}
            <span className="gradient-text">John Doe</span>
          </h1>

          {/* Title */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="font-mono text-lg sm:text-xl md:text-2xl text-foreground">Java Developer</span>
            <span className="text-primary">•</span>
            <span className="font-mono text-lg sm:text-xl md:text-2xl text-muted-foreground">Backend Engineer</span>
            <span className="text-primary hidden sm:inline">•</span>
            <span className="font-mono text-lg sm:text-xl md:text-2xl text-muted-foreground hidden sm:inline">Problem Solver</span>
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up text-balance" style={{ animationDelay: '0.3s' }}>
            Building robust, scalable backend systems with{' '}
            <span className="text-java font-semibold">Java</span> and{' '}
            <span className="text-spring font-semibold">Spring Boot</span>.
            Passionate about clean code, RESTful APIs, and microservices architecture.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 font-semibold px-8"
              asChild
            >
              <a href="#projects">
                View Projects
                <ArrowDown className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border hover:bg-secondary transition-all duration-300 font-semibold px-8"
              asChild
            >
              <a href="/resume.pdf" download>
                <Download className="mr-2 w-4 h-4" />
                Download Resume
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:john@example.com"
              className="w-12 h-12 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
