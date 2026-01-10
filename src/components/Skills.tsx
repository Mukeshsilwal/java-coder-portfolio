import { 
  Code, 
  Server, 
  Database as DatabaseIcon, 
  Wrench,
  Coffee,
  Leaf,
  Layers,
  Globe,
  GitBranch,
  Container,
  Terminal,
  TestTube
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Languages',
    color: 'java',
    icon: Code,
    skills: [
      { name: 'Java (Core, OOP, Collections)', level: 95 },
      { name: 'Multithreading & Concurrency', level: 85 },
      { name: 'SQL', level: 90 },
      { name: 'JavaScript', level: 75 },
    ],
  },
  {
    title: 'Frameworks & Tools',
    color: 'spring',
    icon: Server,
    skills: [
      { name: 'Spring Boot', level: 92 },
      { name: 'Spring MVC / Spring Security', level: 88 },
      { name: 'Hibernate / JPA', level: 85 },
      { name: 'REST APIs', level: 95 },
    ],
  },
  {
    title: 'Databases',
    color: 'database',
    icon: DatabaseIcon,
    skills: [
      { name: 'MySQL', level: 90 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'MongoDB', level: 75 },
      { name: 'Redis', level: 70 },
    ],
  },
  {
    title: 'Dev Tools',
    color: 'tools',
    icon: Wrench,
    skills: [
      { name: 'Git & GitHub', level: 95 },
      { name: 'Docker', level: 80 },
      { name: 'Maven / Gradle', level: 90 },
      { name: 'IntelliJ IDEA', level: 95 },
    ],
  },
];

const techIcons = [
  { icon: Coffee, label: 'Java', color: 'java' },
  { icon: Leaf, label: 'Spring', color: 'spring' },
  { icon: Layers, label: 'Hibernate', color: 'database' },
  { icon: Globe, label: 'REST API', color: 'primary' },
  { icon: GitBranch, label: 'Git', color: 'tools' },
  { icon: Container, label: 'Docker', color: 'database' },
  { icon: Terminal, label: 'CLI', color: 'muted-foreground' },
  { icon: TestTube, label: 'JUnit', color: 'spring' },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-primary text-sm tracking-wider uppercase">Skills</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              Technical <span className="gradient-text">Expertise</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          {/* Tech Icons */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            {techIcons.map((tech) => (
              <div
                key={tech.label}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-xl glass-card flex items-center justify-center group-hover:border-${tech.color}/50 transition-all duration-300`}>
                  <tech.icon className={`w-7 h-7 text-${tech.color}`} />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {tech.label}
                </span>
              </div>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category) => (
              <div
                key={category.title}
                className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-${category.color}/10 border border-${category.color}/30 flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 text-${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-xl">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{skill.name}</span>
                        <span className="font-mono text-xs text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-${category.color} to-primary rounded-full transition-all duration-1000`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
