import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, BookOpen, Plus, Trash2, Edit2, X, Check, Type } from 'lucide-react';
import type { Milestone } from '@/types';

const emptyMilestone: Omit<Milestone, 'id'> = {
  title: '',
  description: '',
  order: 0,
};

export function JourneyEditor() {
  const { data, updateJourney, addMilestone, editMilestone, deleteMilestone } = useAdmin();
  const [title, setTitle] = useState(data.journey.title);
  const [subtitle, setSubtitle] = useState(data.journey.subtitle);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Milestone, 'id'>>(emptyMilestone);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(data.journey.title);
    setSubtitle(data.journey.subtitle);
  }, [data.journey.title, data.journey.subtitle]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleSubtitleChange = (value: string) => {
    setSubtitle(value);
    setHasChanges(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      ...emptyMilestone,
      order: data.journey.milestones.length + 1,
    });
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData(milestone);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingMilestone(null);
    setIsAdding(false);
    setFormData(emptyMilestone);
  };

  const handleSaveMilestone = () => {
    if (!formData.title.trim()) {
      toast.error('Milestone title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Milestone description is required');
      return;
    }

    if (isAdding) {
      addMilestone(formData);
      toast.success('Milestone added successfully');
    } else if (editingMilestone) {
      editMilestone(editingMilestone.id, formData);
      toast.success('Milestone updated successfully');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(id);
      toast.success('Milestone deleted successfully');
    }
  };

  const handleSaveSection = () => {
    updateJourney({
      ...data.journey,
      title,
      subtitle,
    });
    setHasChanges(false);
    toast.success('Journey section updated successfully');
  };

  if (isAdding || editingMilestone) {
    return (
      <div className="max-w-3xl">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {isAdding ? 'Add New Milestone' : 'Edit Milestone'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-[#666] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Milestone Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="e.g., Programming Fundamentals"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                placeholder="Describe what you learned or achieved..."
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                min={1}
                className="w-32 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex gap-4">
            <button
              onClick={handleSaveMilestone}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
            >
              <Check className="w-5 h-5" />
              <span>{isAdding ? 'Add Milestone' : 'Save Changes'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Learning Journey</h2>
            <p className="text-[#666] text-sm">Manage your learning milestones</p>
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

        {/* Add Milestone Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>

        {/* Milestones List */}
        <div className="space-y-3">
          {data.journey.milestones.length === 0 ? (
            <div className="text-center py-12 text-[#666]">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No milestones yet. Add your first milestone!</p>
            </div>
          ) : (
            data.journey.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#3B82F6]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{milestone.title}</h3>
                    <p className="text-[#666] text-sm line-clamp-1">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(milestone)}
                    className="p-2 text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Save button */}
        <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
          <button
            onClick={handleSaveSection}
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
