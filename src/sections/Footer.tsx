import { useAdmin } from '@/context/AdminContext';
import { Code } from 'lucide-react';

export function Footer() {
  const { data } = useAdmin();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F0F0F] border-t border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">
                {data.hero.firstName} {data.hero.lastName}
              </div>
              <div className="text-[#666] text-sm">{data.hero.title}</div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-[#666] text-sm">
            <span>© {currentYear} {data.hero.firstName} {data.hero.lastName}</span>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6">
            <a
              href="#about"
              className="text-[#666] hover:text-white transition-colors text-sm"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-[#666] hover:text-white transition-colors text-sm"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="text-[#666] hover:text-white transition-colors text-sm"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-[#666] hover:text-white transition-colors text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />
    </footer>
  );
}
