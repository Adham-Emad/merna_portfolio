import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, Type } from 'lucide-react';

export function HeroEditor() {
  const { data, updateHero } = useAdmin();
  const [formData, setFormData] = useState(data.hero);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(data.hero);
  }, [data.hero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateHero(formData);
    setHasChanges(false);
    toast.success('Hero section updated successfully');
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <Type className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Hero Content</h2>
            <p className="text-[#666] text-sm">Edit your main landing section</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Professional Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
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
        <div className="text-center py-12">
          <div className="text-6xl font-black text-white mb-2">{formData.firstName}</div>
          <div className="text-6xl font-black gradient-text mb-6">{formData.lastName}</div>
          <div className="text-xl text-[#A0A0A0] tracking-widest uppercase">{formData.title}</div>
          <div className="text-lg text-[#3B82F6] mt-2">{formData.subtitle}</div>
        </div>
      </div>
    </div>
  );
}
