import { Code2, Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to="/" onClick={handleScrollTop} className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono font-bold text-xl tracking-tight">
                <span className="text-primary">&lt;</span>
                Mukesh
                <span className="text-primary">/&gt;</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Building robust, scalable, and high-performance backend systems with Java & Spring Boot.
              Turning complex problems into elegant code.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    onClick={(e) => {
                      if (link.href.startsWith('/#')) {
                        // handle anchor links
                        // Note: Global Header handles actual scroll, but this ensures navigation 
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/Mukeshsilwal" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/10 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/Mukeshsilwal" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/10 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:mukeshsilwal5@gmail.com"
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/10 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Mukesh Silwal. All rights reserved.
          </p>

          <button
            onClick={handleScrollTop}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
