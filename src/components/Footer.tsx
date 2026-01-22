import { Code2, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col items-center md:items-start gap-2">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono font-bold text-lg">
                <span className="text-primary">&lt;</span>
                MS
                <span className="text-primary">/&gt;</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Building scalable backend systems with Java & Spring Boot.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="https://github.com/Mukeshsilwal" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/Mukeshsilwal" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:mukeshsilwal5@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} Mukesh Silwal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
