import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, Settings, Lock, Globe, Eye, EyeOff } from 'lucide-react';

export function SettingsEditor() {
  const { data, updateData } = useAdmin();
  const [adminPassword, setAdminPassword] = useState(data.settings.adminPassword);
  const [siteTitle, setSiteTitle] = useState(data.settings.siteTitle);
  const [siteDescription, setSiteDescription] = useState(data.settings.siteDescription);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setAdminPassword(data.settings.adminPassword);
    setSiteTitle(data.settings.siteTitle);
    setSiteDescription(data.settings.siteDescription);
  }, [data.settings]);

  const handlePasswordChange = (value: string) => {
    setAdminPassword(value);
    setHasChanges(true);
  };

  const handleSiteTitleChange = (value: string) => {
    setSiteTitle(value);
    setHasChanges(true);
  };

  const handleSiteDescriptionChange = (value: string) => {
    setSiteDescription(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (adminPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    updateData({
      ...data,
      settings: {
        adminPassword,
        siteTitle,
        siteDescription,
      },
    });
    setHasChanges(false);
    toast.success('Settings updated successfully');
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            <p className="text-[#666] text-sm">Manage admin and site settings</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Admin Password */}
          <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-white font-medium">Admin Access</h3>
            </div>

            <div>
              <label className="block text-[#A0A0A0] text-sm mb-2">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[#666] text-sm mt-2">
                This password is required to access the admin panel.
              </p>
            </div>
          </div>

          {/* Site Settings */}
          <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-white font-medium">Site Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Site Title</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => handleSiteTitleChange(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <p className="text-[#666] text-sm mt-1">
                  Used for browser tab title and SEO.
                </p>
              </div>

              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Site Description</label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => handleSiteDescriptionChange(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                />
                <p className="text-[#666] text-sm mt-1">
                  Used for SEO meta description.
                </p>
              </div>
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

      {/* Info Card */}
      <div className="mt-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h3 className="text-sm font-medium text-[#666] mb-4 uppercase tracking-wider">
          Admin Panel Access
        </h3>
        <div className="space-y-3 text-sm">
          <p className="text-[#A0A0A0]">
            <span className="text-white">URL:</span> Add <code className="bg-[#0F0F0F] px-2 py-1 rounded">?admin</code> to any page URL
          </p>
          <p className="text-[#A0A0A0]">
            <span className="text-white">Example:</span>{' '}
            <code className="bg-[#0F0F0F] px-2 py-1 rounded">yoursite.com/?admin</code>
          </p>
          <p className="text-[#666] mt-4">
            The admin panel is hidden from normal visitors. Only you can access it with the password.
          </p>
        </div>
      </div>
    </div>
  );
}
