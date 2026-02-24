import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AdminContextType } from '@/types';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const portfolioData = usePortfolioData();

  const login = useCallback((password: string): boolean => {
    if (password === portfolioData.data.settings.adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [portfolioData.data.settings.adminPassword]);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const value: AdminContextType = {
    isAdmin,
    login,
    logout,
    data: portfolioData.data,
    updateData: portfolioData.updateData,
    updateHero: portfolioData.updateHero,
    updateAbout: portfolioData.updateAbout,
    updateSkills: portfolioData.updateSkills,
    updateProjects: portfolioData.updateProjects,
    updateJourney: portfolioData.updateJourney,
    updateContact: portfolioData.updateContact,
    addProject: portfolioData.addProject,
    editProject: portfolioData.editProject,
    deleteProject: portfolioData.deleteProject,
    addSkill: portfolioData.addSkill,
    deleteSkill: portfolioData.deleteSkill,
    addMilestone: portfolioData.addMilestone,
    editMilestone: portfolioData.editMilestone,
    deleteMilestone: portfolioData.deleteMilestone,
    exportData: portfolioData.exportData,
    importData: portfolioData.importData,
    resetToDefault: portfolioData.resetToDefault,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
