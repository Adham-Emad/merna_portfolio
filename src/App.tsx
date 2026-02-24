import { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Projects } from '@/sections/Projects';
import { Journey } from '@/sections/Journey';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Loading screen component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="text-center">
        <div className="text-6xl font-black text-white mb-8">
          {Math.min(Math.round(progress), 100)}%
        </div>
        <div className="w-64 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3B82F6] transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Main portfolio content
function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="relative">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Contact />
      <Footer />
    </main>
  );
}

// Navigation dots
function NavigationDots() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'journey', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'journey', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`group flex items-center gap-3 transition-all ${
            activeSection === section.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'
          }`}
        >
          <span
            className={`text-xs uppercase tracking-wider transition-all ${
              activeSection === section.id ? 'text-white' : 'text-[#666]'
            }`}
          >
            {section.label}
          </span>
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              activeSection === section.id
                ? 'bg-[#3B82F6] scale-125'
                : 'bg-[#666] group-hover:bg-[#3B82F6]'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}

// Wrapper for admin access to use context
function AdminAccessWrapper({ onClose }: { onClose: () => void }) {
  const { logout } = useAdmin();
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = () => {
    setShowLogin(false);
  };

  const handleClose = () => {
    logout();
    onClose();
  };

  if (showLogin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleClose} />;
}

// Main App component
function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check for admin mode on mount
    const checkAdminMode = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.has('admin')) {
        setShowAdmin(true);
        // Clean up URL
        url.searchParams.delete('admin');
        window.history.replaceState({}, '', url.toString());
      }
    };

    checkAdminMode();

    // Also listen for keyboard shortcut (Ctrl+Shift+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (showAdmin) {
    return (
      <AdminProvider>
        <AdminAccessWrapper onClose={() => setShowAdmin(false)} />
        <Toaster position="top-right" theme="dark" />
      </AdminProvider>
    );
  }

  return (
    <AdminProvider>
      <div className="relative">
        <NavigationDots />
        <PortfolioContent />
        <Toaster position="top-right" theme="dark" />

        {/* Hidden admin access hint */}
        <div className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowAdmin(true)}
            className="text-[#333] text-xs hover:text-[#666] transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </AdminProvider>
  );
}

export default App;
