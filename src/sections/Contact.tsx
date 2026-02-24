import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdmin } from '@/context/AdminContext';
import { Mail, Github, Linkedin, Send, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;

    if (!section || !form) return;

    const ctx = gsap.context(() => {
      gsap.from(form, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0F0F0F] py-32 flex items-center"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6] rounded-full opacity-5 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            {data.contact.title}
          </h2>
          <p className="text-2xl md:text-3xl text-[#3B82F6] font-medium">
            {data.contact.subtitle}
          </p>
        </div>

        {/* Contact form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Name field */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            {/* Email field */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Message field */}
          <div className="mb-8">
            <label className="block text-[#A0A0A0] text-sm mb-2">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="form-input resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>

        {/* Social links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <a
            href={`mailto:${data.contact.email}`}
            className="flex items-center gap-3 px-6 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all group"
          >
            <Mail className="w-6 h-6 text-[#3B82F6]" />
            <span className="text-white">Email</span>
            <ArrowUpRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
          </a>

          <a
            href={data.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all group"
          >
            <Github className="w-6 h-6 text-[#3B82F6]" />
            <span className="text-white">GitHub</span>
            <ArrowUpRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
          </a>

          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all group"
          >
            <Linkedin className="w-6 h-6 text-[#3B82F6]" />
            <span className="text-white">LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
