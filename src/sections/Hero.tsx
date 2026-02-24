import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export function Hero() {
  const { data } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hidden
      gsap.set([firstNameRef.current, lastNameRef.current], {
        opacity: 0,
        y: 100,
        rotateX: -90,
      });
      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 30,
      });
      gsap.set(scrollHintRef.current, {
        opacity: 0,
        y: 20,
      });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(firstNameRef.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power4.out',
      })
        .to(
          lastNameRef.current,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power4.out',
          },
          '-=0.7'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          scrollHintRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        );

      // Continuous scroll hint animation
      const bounceIcon = scrollHintRef.current?.querySelector('.bounce-icon');
      if (bounceIcon) {
        gsap.to(bounceIcon, {
          y: 10,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0F0F]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Main heading */}
        <div className="overflow-hidden mb-2">
          <div
            ref={firstNameRef}
            className="hero-title text-[15vw] md:text-[12vw] font-black tracking-tighter leading-none text-white"
            style={{ perspective: '1000px' }}
          >
            {data.hero.firstName}
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <div
            ref={lastNameRef}
            className="hero-title text-[15vw] md:text-[12vw] font-black tracking-tighter leading-none gradient-text"
            style={{ perspective: '1000px' }}
          >
            {data.hero.lastName}
          </div>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-16">
          <p className="text-xl md:text-2xl text-[#A0A0A0] font-light tracking-widest uppercase">
            {data.hero.title}
          </p>
          <p className="text-lg md:text-xl text-[#3B82F6] mt-2 font-medium">
            {data.hero.subtitle}
          </p>
        </div>

        {/* Scroll hint */}
        <div ref={scrollHintRef} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-[#666]">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="bounce-icon w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
      <div className="absolute top-40 right-32 w-3 h-3 bg-[#3B82F6] rounded-full animate-pulse opacity-50" />
      <div className="absolute bottom-40 left-32 w-2 h-2 bg-white rounded-full animate-pulse opacity-30" />
    </section>
  );
}
