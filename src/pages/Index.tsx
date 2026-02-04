import Hero from '@/components/Hero';
import About from '@/components/About';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import LatestBlogs from '@/components/LatestBlogs';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <>
      <Hero />
      <MetricsDisplay />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <LatestBlogs />
      <Contact />
    </>
  );
};

export default Index;
