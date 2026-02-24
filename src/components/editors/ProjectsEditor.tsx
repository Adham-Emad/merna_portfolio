import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { FolderGit2, Plus, Trash2, Edit2, X, Check, Image } from 'lucide-react';
import type { Project } from '@/types';

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  problemSolved: '',
  keyFeatures: [''],
  technologies: [''],
  image: '',
  githubLink: '',
  liveLink: '',
  order: 0,
};

export function ProjectsEditor() {
  const { data, addProject, editProject, deleteProject } = useAdmin();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(emptyProject);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      ...emptyProject,
      order: data.projects.items.length + 1,
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAdding(false);
    setFormData(emptyProject);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Project description is required');
      return;
    }

    if (isAdding) {
      addProject(formData);
      toast.success('Project added successfully');
    } else if (editingProject) {
      editProject(editingProject.id, formData);
      toast.success('Project updated successfully');
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      toast.success('Project deleted successfully');
    }
  };

  const handleArrayChange = (
    field: 'keyFeatures' | 'technologies',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayItem = (field: 'keyFeatures' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayItem = (field: 'keyFeatures' | 'technologies', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        image: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isAdding || editingProject) {
    return (
      <div className="max-w-4xl">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {isAdding ? 'Add New Project' : 'Edit Project'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-[#666] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title & Subtitle */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="e.g., Task Master"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="e.g., To-Do Application"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                placeholder="Describe your project..."
              />
            </div>

            {/* Problem Solved */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Problem Solved</label>
              <textarea
                value={formData.problemSolved}
                onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                rows={2}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                placeholder="What problem does this project solve?"
              />
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Key Features</label>
              <div className="space-y-2">
                {formData.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('keyFeatures', idx, e.target.value)}
                      className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder={`Feature ${idx + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('keyFeatures', idx)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem('keyFeatures')}
                  className="flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Technologies Used</label>
              <div className="space-y-2">
                {formData.technologies.map((tech, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange('technologies', idx, e.target.value)}
                      className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder={`Technology ${idx + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveArrayItem('technologies', idx)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem('technologies')}
                  className="flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Technology</span>
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">GitHub Link</label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Live Demo Link (optional)</label>
                <input
                  type="url"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Project Image</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#0F0F0F] border border-[#2A2A2A]">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#3B82F6] transition-colors cursor-pointer">
                  <Image className="w-5 h-5" />
                  <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <button
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
            >
              <Check className="w-5 h-5" />
              <span>{isAdding ? 'Add Project' : 'Save Changes'}</span>
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
    <div className="max-w-4xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <p className="text-[#666] text-sm">Manage your portfolio projects</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {data.projects.items.length === 0 ? (
            <div className="text-center py-12 text-[#666]">
              <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet. Add your first project!</p>
            </div>
          ) : (
            data.projects.items.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#3B82F6]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-xl font-bold text-[#3B82F6]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      project.title.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{project.title}</h3>
                    <p className="text-[#666] text-sm">{project.subtitle}</p>
                    <div className="flex gap-2 mt-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-xs text-[#3B82F6]">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-[#666]">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
