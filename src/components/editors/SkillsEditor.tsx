import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, Code2, Plus, Trash2, Type } from 'lucide-react';
import type { Skill } from '@/types';

const categories = [
  { value: 'language', label: 'Language', color: '#3B82F6' },
  { value: 'framework', label: 'Framework', color: '#10B981' },
  { value: 'tool', label: 'Tool', color: '#F59E0B' },
  { value: 'concept', label: 'Concept', color: '#EC4899' },
];

export function SkillsEditor() {
  const { data, updateSkills, addSkill, deleteSkill } = useAdmin();
  const [title, setTitle] = useState(data.skills.title);
  const [subtitle, setSubtitle] = useState(data.skills.subtitle);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('language');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(data.skills.title);
    setSubtitle(data.skills.subtitle);
  }, [data.skills.title, data.skills.subtitle]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleSubtitleChange = (value: string) => {
    setSubtitle(value);
    setHasChanges(true);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    addSkill({ name: newSkillName.trim(), category: newSkillCategory });
    setNewSkillName('');
    toast.success('Skill added successfully');
  };

  const handleDeleteSkill = (id: string) => {
    deleteSkill(id);
    toast.success('Skill deleted successfully');
  };

  const handleSave = () => {
    updateSkills({
      ...data.skills,
      title,
      subtitle,
    });
    setHasChanges(false);
    toast.success('Skills section updated successfully');
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Skills</h2>
            <p className="text-[#666] text-sm">Manage your technical skills</p>
          </div>
        </div>

        {/* Section Title & Subtitle */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Section Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A0A0A0] text-sm mb-2">Section Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
        </div>

        {/* Add New Skill */}
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-4">Add New Skill</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Skill name (e.g., React, TypeScript)"
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as Skill['category'])}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[#A0A0A0] mb-3">
            Current Skills ({data.skills.items.length})
          </h3>
          {data.skills.items.map((skill) => {
            const category = categories.find((c) => c.value === skill.category);
            return (
              <div
                key={skill.id}
                className="flex items-center justify-between bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category?.color || '#666' }}
                  />
                  <span className="text-white">{skill.name}</span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${category?.color}20`,
                      color: category?.color,
                    }}
                  >
                    {category?.label}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
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
    </div>
  );
}
