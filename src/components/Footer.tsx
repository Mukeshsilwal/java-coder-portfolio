import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono font-bold">
                <span className="text-primary">&lt;</span>
                MS
                <span className="text-primary">/&gt;</span>
              </span>
            </a>

            {/* Built With */}
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & Tailwind
            </p>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} Mukesh Silwal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
