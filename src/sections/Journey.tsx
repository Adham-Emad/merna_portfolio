import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdmin } from '@/context/AdminContext';
import { BookOpen, Code, Layers, Globe, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  'Programming Fundamentals': BookOpen,
  'Object-Oriented Programming': Code,
  'State Management': Layers,
  'API Integration': Globe,
  'Clean Architecture': Cpu,
};

export function Journey() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const milestones = milestoneRefs.current.filter(Boolean);

    if (!section || !line || milestones.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate line drawing
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      // Animate each milestone
      milestones.forEach((milestone) => {
        if (!milestone) return;
        
        const content = milestone.querySelector('.milestone-content');
        const node = milestone.querySelector('.milestone-node');

        // Set initial state
        gsap.set(content, {
          x: -50,
          opacity: 0,
        });
        gsap.set(node, {
          scale: 0,
        });

        // Animate on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: milestone,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        });

        tl.to(content, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }).to(
          node,
          {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          },
          0
        );
      });
    }, section);

    return () => ctx.revert();
  }, [data.journey.milestones.length]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative min-h-screen bg-[#0F0F0F] py-32"
    >
      {/* Section header */}
      <div className="text-center mb-20 px-4">
        <div className="text-[#666] text-sm uppercase tracking-widest mb-4">
          Learning Journey
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
          {data.journey.title}
        </h2>
        <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
          {data.journey.subtitle}
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Center line */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6] via-[#3B82F6] to-transparent -translate-x-1/2 hidden md:block"
        />

        {/* Mobile line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6] via-[#3B82F6] to-transparent md:hidden" />

        {/* Milestones */}
        <div className="space-y-16 md:space-y-24">
          {data.journey.milestones.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            const Icon = iconMap[milestone.title] || BookOpen;

            return (
              <div
                key={milestone.id}
                ref={(el) => { milestoneRefs.current[index] = el; }}
                className={`relative flex items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content card */}
                <div
                  className={`milestone-content flex-1 ${
                    isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'
                  } pl-12 md:pl-0`}
                >
                  <div
                    className={`inline-flex items-center gap-3 mb-3 ${
                      isLeft ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <span className="text-[#3B82F6] text-sm font-medium">
                      Step 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {milestone.title}
                  </h3>

                  <p className="text-[#A0A0A0] leading-relaxed max-w-md">
                    {milestone.description}
                  </p>
                </div>

                {/* Center node */}
                <div className="milestone-node absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-[#3B82F6] border-4 border-[#0F0F0F]" />
                </div>

                {/* Empty space for other side */}
                <div className="flex-1 hidden md:block" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
    </section>
  );
}
