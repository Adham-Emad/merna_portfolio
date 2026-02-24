import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdmin } from '@/context/AdminContext';
import { Github, ExternalLink, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const slider = sliderRef.current;

    if (!section || !container || !slider) return;

    const ctx = gsap.context(() => {
      // Calculate total scroll distance
      const slides = slider.querySelectorAll('.project-slide');
      const totalWidth = slider.scrollWidth - window.innerWidth;

      // Horizontal scroll animation
      gsap.to(slider, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth * 1.5}`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
          },
        },
      });

      // Animate each slide on enter
      slides.forEach((slide) => {
        const content = slide.querySelector('.slide-content');
        gsap.from(content, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: gsap.getById('horizontal-scroll'),
            start: 'left 80%',
            end: 'left 20%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [data.projects.items.length]);

  return (
    <section ref={sectionRef} className="relative bg-[#0F0F0F]">
      {/* Section header */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none max-w-xs md:max-w-md">
        <div className="text-[#666] text-sm uppercase tracking-widest mb-2">Projects</div>
        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight break-words">{data.projects.title}</h2>
        <p className="text-[#A0A0A0] mt-3 text-xs md:text-sm">{data.projects.subtitle}</p>
      </div>

      {/* Horizontal slider container */}
      <div ref={containerRef} className="h-screen overflow-hidden">
        <div
          ref={sliderRef}
          className="flex h-full"
          style={{ width: `${data.projects.items.length * 100}vw` }}
        >
          {data.projects.items.map((project, index) => (
            <div
              key={project.id}
              className="project-slide w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-20"
            >
              <div className="slide-content w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
                {/* Project info */}
                <div className="order-2 md:order-1">
                  {/* Project number */}
                  <div className="text-8xl font-black text-[#1A1A1A] mb-4">
                    0{index + 1}
                  </div>

                  {/* Title */}
                  <h3 className="text-4xl md:text-6xl font-black text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xl text-[#3B82F6] font-medium mb-6">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-[#A0A0A0] text-lg mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Problem solved */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Problem Solved:</h4>
                    <p className="text-[#666]">{project.problemSolved}</p>
                  </div>

                  {/* Key features */}
                  <div className="mb-8">
                    <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {project.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#A0A0A0]">
                          <Check className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm border border-[#2A2A2A] rounded-full text-[#A0A0A0]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-[#1A1A1A] text-white text-sm rounded-lg border border-[#2A2A2A] hover:bg-[#2A2A2A] hover:border-[#3B82F6] transition-all duration-300 z-30 relative"
                    >
                      <Github className="w-4 h-4 flex-shrink-0" />
                      <span>View Code</span>
                    </a>
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white text-sm rounded-lg hover:bg-[#2563EB] transition-all duration-300 z-30 relative"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Project visual */}
                <div className="order-1 md:order-2">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#2A2A2A] overflow-hidden group">
                    {/* Project placeholder / image */}
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-black text-[#2A2A2A] mb-4">
                            {project.title.charAt(0)}
                          </div>
                          <div className="text-[#666]">Project Preview</div>
                        </div>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-60" />

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-[#3B82F6] opacity-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {data.projects.items.map((_, index) => (
          <div
            key={index}
            className="w-12 h-1 bg-[#2A2A2A] rounded-full overflow-hidden"
          >
            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '0%' }} />
          </div>
        ))}
      </div>
    </section>
  );
}
