import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdmin } from '@/context/AdminContext';

gsap.registerPlugin(ScrollTrigger);

const bgColorMap = {
  white: 'bg-white text-[#0F0F0F]',
  dark: 'bg-[#1A1A1A] text-white',
  blue: 'bg-[#3B82F6] text-white',
};

export function About() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !cardsContainer || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state for cards
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: window.innerHeight + 100,
          opacity: 0,
          zIndex: index + 1,
        });
      });

      // Create scroll-triggered animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${window.innerHeight * 2}`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: (progress) => {
              if (progress < 0.2) return 0;
              if (progress < 0.5) return 0.33;
              if (progress < 0.8) return 0.66;
              return 1;
            },
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
          },
        },
      });

      // Animate each card stacking
      cards.forEach((card, index) => {
        scrollTl.to(
          card,
          {
            y: index * 30, // Stack with slight offset
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          index * 0.25
        );
      });

      // Final exit animation
      scrollTl.to(
        cardsContainer,
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.2,
        },
        0.85
      );
    }, section);

    return () => ctx.revert();
  }, [data.about.cards.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-[#0F0F0F]"
    >
      {/* Section label */}
      <div className="absolute top-8 left-8 text-[#666] text-sm uppercase tracking-widest">
        About Me
      </div>

      {/* Cards container */}
      <div
        ref={cardsContainerRef}
        className="relative w-full max-w-2xl mx-auto px-4"
        style={{ height: '400px' }}
      >
        {data.about.cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={`absolute inset-x-4 top-0 p-8 md:p-12 rounded-lg shadow-2xl ${bgColorMap[card.bgColor]}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{card.title}</h3>
            <p className="text-lg leading-relaxed opacity-90">{card.content}</p>

            {/* Card number indicator */}
            <div className="absolute bottom-4 right-4 text-6xl font-black opacity-10">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-b from-[#3B82F6] to-transparent" />
    </section>
  );
}
