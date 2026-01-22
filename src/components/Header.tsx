import { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Floating Glass Navbar */}
      <header
        className={`navbar-floating ${isScrolled ? 'navbar-scrolled' : ''}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="font-bold text-primary text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Mukesh Silwal</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Portfolio</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group ${isActive(link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
                {/* Active Underline Animation */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isActive(link.href) ? 'w-8' : 'w-0 group-hover:w-8'
                    }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:block">
            <Link to="/contact">
              <button className="btn-primary text-sm py-2 px-6">
                Let's Connect
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
        <nav className="fixed top-20 left-4 right-4 z-40 glass-card rounded-2xl p-4 animate-fade-up md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.href)
                  ? 'bg-primary/10 text-foreground border-l-2 border-primary'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <Link to="/contact" className="block" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="btn-primary w-full text-sm py-2">
                Let's Connect
              </button>
            </Link>
          </div>
        </nav>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
