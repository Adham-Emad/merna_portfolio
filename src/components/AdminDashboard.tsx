import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  Code2,
  FolderGit2,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';
import { HeroEditor } from './editors/HeroEditor';
import { AboutEditor } from './editors/AboutEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { JourneyEditor } from './editors/JourneyEditor';
import { ContactEditor } from './editors/ContactEditor';
import { SettingsEditor } from './editors/SettingsEditor';

type TabType = 'hero' | 'about' | 'skills' | 'projects' | 'journey' | 'contact' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'hero', label: 'Hero', icon: LayoutDashboard },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'journey', label: 'Journey', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const { exportData, importData, resetToDefault, logout } = useAdmin();
  const [isExporting, setIsExporting] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
    toast.success('Logged out successfully');
  };

  const handleExport = () => {
    setIsExporting(true);
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
    toast.success('Portfolio data exported successfully');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const success = importData(jsonString);
        if (success) {
          toast.success('Portfolio data imported successfully');
        } else {
          toast.error('Invalid data format');
        }
      } catch (error) {
        toast.error('Error importing data');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleReset = () => {
    resetToDefault();
    toast.success('Portfolio reset to default');
  };

  const renderEditor = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroEditor />;
      case 'about':
        return <AboutEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'journey':
        return <JourneyEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'settings':
        return <SettingsEditor />;
      default:
        return <HeroEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] fixed h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Admin Panel</div>
              <div className="text-[#666] text-xs">Portfolio Manager</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <Check className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-[#2A2A2A] space-y-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>

          <label className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transition-colors text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#2A2A2A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#A0A0A0] hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {tabs.find((t) => t.id === activeTab)?.label} Editor
              </h1>
              <p className="text-[#666] text-sm">
                Manage your {activeTab} section content
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#3B82F6] transition-colors text-sm"
            >
              <span>View Site</span>
              <Save className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Editor content */}
        <div className="p-8">{renderEditor()}</div>
      </main>
    </div>
  );
}
