import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdmin } from '@/context/AdminContext';
import { 
  Code2, 
  Flame, 
  Database, 
  Globe, 
  Layers, 
  GitBranch, 
  Layout, 
  Cpu,
  Smartphone,
  Workflow
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Flutter: Smartphone,
  Dart: Code2,
  Firebase: Flame,
  'REST APIs': Globe,
  Provider: Layers,
  Bloc: Workflow,
  'Git & GitHub': GitBranch,
  'Clean Architecture': Cpu,
  'UI/UX Design': Layout,
  SQLite: Database,
};

const categoryColors: Record<string, string> = {
  language: 'border-[#3B82F6] text-[#3B82F6]',
  framework: 'border-[#10B981] text-[#10B981]',
  tool: 'border-[#F59E0B] text-[#F59E0B]',
  concept: 'border-[#EC4899] text-[#EC4899]',
};

export function Skills() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const skills = skillRefs.current.filter(Boolean);
    const orbit = orbitRef.current;

    if (!section || !container || skills.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(container, {
        scale: 0.5,
        opacity: 0,
        rotation: -15,
      });

      skills.forEach((skill) => {
        gsap.set(skill, {
          opacity: 0,
          scale: 0,
        });
      });

      // Scroll-triggered entrance
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      scrollTl.to(container, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });

      // Staggered skill appearance
      skills.forEach((skill, idx) => {
        scrollTl.to(
          skill,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          },
          0.1 + idx * 0.05
        );
      });

      // Continuous orbit rotation
      if (orbit) {
        gsap.to(orbit, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: 'none',
        });

        // Counter-rotate skills to keep them upright
        skills.forEach((skill) => {
          gsap.to(skill, {
            rotation: -360,
            duration: 60,
            repeat: -1,
            ease: 'none',
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, [data.skills.items.length]);

  // Calculate positions for skills in a circle
  const getSkillPosition = (index: number, total: number) => {
    const radius = 280;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen flex items-center justify-center bg-[#0F0F0F] py-20"
    >
      {/* Section label */}
      <div className="absolute top-8 left-8 text-[#666] text-sm uppercase tracking-widest">
        Skills
      </div>

      {/* Main container */}
      <div ref={containerRef} className="relative hidden lg:block">
        {/* Center content */}
        <div className="text-center z-10 relative">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            {data.skills.title}
          </h2>
          <p className="text-[#A0A0A0] text-lg">{data.skills.subtitle}</p>
        </div>

        {/* Orbiting skills - Desktop only */}
        <div
          ref={orbitRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block"
          style={{ width: '600px', height: '600px' }}
        >
          {data.skills.items.map((skill, index) => {
            const pos = getSkillPosition(index, data.skills.items.length);
            const Icon = iconMap[skill.name] || Code2;

            return (
              <div
                key={skill.id}
                ref={(el) => { skillRefs.current[index] = el; }}
                className="absolute skill-badge cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-[#0F0F0F] ${categoryColors[skill.category]}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#3B82F6] rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Mobile: Grid layout */}
      <div className="lg:hidden w-full flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="text-center z-10 relative mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {data.skills.title}
            </h2>
            <p className="text-[#A0A0A0] text-sm md:text-base">{data.skills.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {data.skills.items.map((skill) => {
              const Icon = iconMap[skill.name] || Code2;
              return (
                <div
                  key={skill.id}
                  className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 bg-[#0F0F0F] ${categoryColors[skill.category]}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-medium text-center leading-tight">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
