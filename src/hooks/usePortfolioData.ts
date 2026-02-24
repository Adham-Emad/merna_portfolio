import { useState, useEffect, useCallback } from 'react';
import type { PortfolioData } from '@/types';
import { defaultPortfolioData } from '@/types';

const STORAGE_KEY = 'portfolio_data_v1';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Merge with default to ensure all fields exist
          setData({ ...defaultPortfolioData, ...parsed });
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving portfolio data:', error);
      }
    }
  }, [data, isLoaded]);

  const updateData = useCallback((newData: PortfolioData) => {
    setData(newData);
  }, []);

  const updateHero = useCallback((hero: PortfolioData['hero']) => {
    setData(prev => ({ ...prev, hero }));
  }, []);

  const updateAbout = useCallback((about: PortfolioData['about']) => {
    setData(prev => ({ ...prev, about }));
  }, []);

  const updateSkills = useCallback((skills: PortfolioData['skills']) => {
    setData(prev => ({ ...prev, skills }));
  }, []);

  const updateProjects = useCallback((projects: PortfolioData['projects']) => {
    setData(prev => ({ ...prev, projects }));
  }, []);

  const updateJourney = useCallback((journey: PortfolioData['journey']) => {
    setData(prev => ({ ...prev, journey }));
  }, []);

  const updateContact = useCallback((contact: PortfolioData['contact']) => {
    setData(prev => ({ ...prev, contact }));
  }, []);

  const addProject = useCallback((project: Omit<PortfolioData['projects']['items'][0], 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: [...prev.projects.items, newProject],
      },
    }));
  }, []);

  const editProject = useCallback((id: string, project: Partial<PortfolioData['projects']['items'][0]>) => {
    setData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.map(p =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.filter(p => p.id !== id),
      },
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<PortfolioData['skills']['items'][0], 'id'>) => {
    const newSkill = {
      ...skill,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        items: [...prev.skills.items, newSkill],
      },
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        items: prev.skills.items.filter(s => s.id !== id),
      },
    }));
  }, []);

  const addMilestone = useCallback((milestone: Omit<PortfolioData['journey']['milestones'][0], 'id'>) => {
    const newMilestone = {
      ...milestone,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      journey: {
        ...prev.journey,
        milestones: [...prev.journey.milestones, newMilestone],
      },
    }));
  }, []);

  const editMilestone = useCallback((id: string, milestone: Partial<PortfolioData['journey']['milestones'][0]>) => {
    setData(prev => ({
      ...prev,
      journey: {
        ...prev.journey,
        milestones: prev.journey.milestones.map(m =>
          m.id === id ? { ...m, ...milestone } : m
        ),
      },
    }));
  }, []);

  const deleteMilestone = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      journey: {
        ...prev.journey,
        milestones: prev.journey.milestones.filter(m => m.id !== id),
      },
    }));
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      // Validate that it has the required structure
      if (parsed.hero && parsed.about && parsed.skills && parsed.projects) {
        setData({ ...defaultPortfolioData, ...parsed });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  const resetToDefault = useCallback(() => {
    if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
      setData(defaultPortfolioData);
    }
  }, []);

  return {
    data,
    isLoaded,
    updateData,
    updateHero,
    updateAbout,
    updateSkills,
    updateProjects,
    updateJourney,
    updateContact,
    addProject,
    editProject,
    deleteProject,
    addSkill,
    deleteSkill,
    addMilestone,
    editMilestone,
    deleteMilestone,
    exportData,
    importData,
    resetToDefault,
  };
}
