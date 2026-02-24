import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, Mail, Type, Link } from 'lucide-react';

export function ContactEditor() {
  const { data, updateContact } = useAdmin();
  const [formData, setFormData] = useState(data.contact);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(data.contact);
  }, [data.contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateContact(formData);
    setHasChanges(false);
    toast.success('Contact section updated successfully');
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="text-[#666] text-sm">Manage your contact information</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Section Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">GitHub Profile URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">LinkedIn Profile URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h3 className="text-sm font-medium text-[#666] mb-4 uppercase tracking-wider">
          Preview
        </h3>
        <div className="text-center py-8">
          <div className="text-3xl font-black text-white mb-2">{formData.title}</div>
          <div className="text-xl text-[#3B82F6] font-medium mb-6">{formData.subtitle}</div>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-[#A0A0A0]">{formData.email}</span>
            <span className="text-[#666]">•</span>
            <span className="text-[#A0A0A0]">GitHub</span>
            <span className="text-[#666]">•</span>
            <span className="text-[#A0A0A0]">LinkedIn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
