import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollProgress } from '@/components/ScrollProgress';
import { InstallButton } from '@/components/pwa/InstallPrompt';


const navLinks = [
  { href: '/', label: 'Home', isTopFn: true },
  { href: '/#about', label: 'About', sectionId: 'about' },
  { href: '/#skills', label: 'Skills', sectionId: 'skills' },
  { href: '/#projects', label: 'Projects', sectionId: 'projects' },
  { href: '/#experience', label: 'Experience', sectionId: 'experience' },
  { href: '/blog', label: 'Blog', sectionId: null },
  { href: '/contact', label: 'Contact', sectionId: null },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy Logic
      const sections = navLinks.map(link => link.sectionId).filter(Boolean) as string[];

      // Default to home if at top
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      // Check each section
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId!);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If section top is near the top of viewport (with offset)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId!);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string | null) => {
    if (location.pathname === '/' && sectionId) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        // Offset for fixed header (approx 80px)
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsMobileMenuOpen(false);
        setActiveSection(sectionId);
      }
    } else if (location.pathname === '/' && sectionId === 'top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      setActiveSection('home');
    }
  };

  const isActive = (link: typeof navLinks[0]) => {
    if (link.isTopFn) return activeSection === 'home';
    if (link.sectionId === activeSection) return true;
    if (!link.sectionId && location.pathname === link.href) return true;
    return false;
  };

  return (
    <>
      <ScrollProgress />
      {/* Floating Glass Navbar */}
      <header
        className={`navbar-floating ${isScrolled ? 'navbar-scrolled' : ''}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={(e) => scrollToSection(e, 'top')}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
              <span className="font-bold text-primary text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Mukesh Silwal</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">Backend Engineer</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => scrollToSection(e, link.isTopFn ? 'top' : (link.sectionId || null))}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group ${isActive(link)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
                {/* Active Underline Animation */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isActive(link) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'
                    }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <InstallButton />
            <Link to="/contact">
              <button className="btn-primary text-sm py-2 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 group relative overflow-hidden">
                <span className="relative z-10 transition-colors group-hover:text-white">Let's Build</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="fixed top-20 left-4 right-4 z-40 glass-card rounded-2xl p-4 animate-fade-up md:hidden border-t border-white/10 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => scrollToSection(e, link.isTopFn ? 'top' : (link.sectionId || null))}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link)
                  ? 'bg-primary/10 text-primary border-l-4 border-primary pl-3'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <Link to="/contact" className="block" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="btn-primary w-full text-sm py-3 font-semibold shadow-lg shadow-primary/20">
                Hire Me
              </button>
            </Link>
          </div>
        </nav>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
