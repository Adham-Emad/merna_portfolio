import { useState, useEffect, useCallback, useRef } from 'react';
import type { PortfolioData } from '@/types';
import { defaultPortfolioData } from '@/types';

// IndexedDB helper functions
const DB_NAME = 'PortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio';

const initIndexedDB = async (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        console.warn('[Portfolio] IndexedDB open error');
        resolve(null);
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    } catch (error) {
      console.warn('[Portfolio] IndexedDB not available:', error);
      resolve(null);
    }
  });
};

const saveToIndexedDB = async (db: IDBDatabase | null, data: string): Promise<boolean> => {
  if (!db) return false;
  
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, 'portfolio_data');
      
      request.onsuccess = () => {
        console.log('[Portfolio] Data saved to IndexedDB');
        resolve(true);
      };
      
      request.onerror = () => {
        console.warn('[Portfolio] IndexedDB save error');
        resolve(false);
      };
    } catch (error) {
      console.warn('[Portfolio] IndexedDB save failed:', error);
      resolve(false);
    }
  });
};

const loadFromIndexedDB = async (db: IDBDatabase | null): Promise<string | null> => {
  if (!db) return null;
  
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('portfolio_data');
      
      request.onsuccess = () => {
        if (request.result) {
          console.log('[Portfolio] Data loaded from IndexedDB');
          resolve(request.result);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.warn('[Portfolio] IndexedDB load error');
        resolve(null);
      };
    } catch (error) {
      console.warn('[Portfolio] IndexedDB load failed:', error);
      resolve(null);
    }
  });
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<number>(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef<boolean>(false);
  const lastPolledDataRef = useRef<string>('');
  const dbRef = useRef<IDBDatabase | null>(null);

  // Load data from API on mount and set up polling
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize IndexedDB
        dbRef.current = await initIndexedDB();

        // Try to load from server first
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
          
          const response = await fetch('/api/portfolio-data?t=' + Date.now(), {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
            headers: {
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache'
            }
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const jsonData = await response.json();
            setData({ ...defaultPortfolioData, ...jsonData });
            const dataString = JSON.stringify(jsonData);
            lastSavedDataRef.current = dataString;
            lastPolledDataRef.current = dataString;
            console.log('[Portfolio] Initial data loaded from server');
            
            // Backup to localStorage
            localStorage.setItem('portfolio_data_backup', dataString);
            
            // Backup to IndexedDB
            await saveToIndexedDB(dbRef.current, dataString);
          } else if (response.status === 404) {
            console.warn('[Portfolio] Data file not found on server, checking backups');
            throw new Error('Data file not found');
          }
        } catch (serverError: any) {
          // Server unavailable - try IndexedDB
          console.warn('[Portfolio] Server unavailable, attempting to load from IndexedDB:', serverError?.message);
          const idbData = await loadFromIndexedDB(dbRef.current);
          
          if (idbData) {
            try {
              const parsedData = JSON.parse(idbData);
              setData({ ...defaultPortfolioData, ...parsedData });
              lastSavedDataRef.current = idbData;
              lastPolledDataRef.current = idbData;
              console.log('[Portfolio] Data loaded from IndexedDB');
              return;
            } catch {
              console.warn('[Portfolio] IndexedDB data corrupted');
            }
          }
          
          // Try localStorage as fallback
          console.warn('[Portfolio] Attempting to load from localStorage');
          const backupData = localStorage.getItem('portfolio_data_backup');
          if (backupData) {
            try {
              const parsedData = JSON.parse(backupData);
              setData({ ...defaultPortfolioData, ...parsedData });
              lastSavedDataRef.current = backupData;
              lastPolledDataRef.current = backupData;
              console.log('[Portfolio] Data loaded from localStorage backup');
              
              // Try to sync back to IndexedDB
              await saveToIndexedDB(dbRef.current, backupData);
              return;
            } catch {
              console.warn('[Portfolio] localStorage data corrupted');
            }
          }
          
          // Use default data
          console.log('[Portfolio] No backup found, using default data');
          setData(defaultPortfolioData);
          lastSavedDataRef.current = JSON.stringify(defaultPortfolioData);
        }
      } catch (error) {
        console.error('[Portfolio] Error during data load:', error);
        setData(defaultPortfolioData);
      }
      setIsLoaded(true);
    };

    loadData();

    // Poll for changes every 2 seconds to detect updates from admin panel on other devices
    const pollInterval = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('/api/portfolio-data?t=' + Date.now(), {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const jsonData = await response.json();
          const newDataString = JSON.stringify(jsonData);
          
          // Only update if:
          // 1. Data changed on server
          // 2. We are NOT currently saving
          // 3. Local data has not been edited since last save
          if (newDataString !== lastPolledDataRef.current && !isSavingRef.current) {
            const currentLocalDataString = JSON.stringify(data);
            
            // If local data differs from last saved, don't overwrite (user is editing)
            if (currentLocalDataString !== lastSavedDataRef.current) {
              console.log('[Portfolio] Skipping poll update - local unsaved changes detected');
              return;
            }
            
            console.log('[Portfolio] Detected changes from server, updating local data');
            setData({ ...defaultPortfolioData, ...jsonData });
            lastSavedDataRef.current = newDataString;
            lastPolledDataRef.current = newDataString;
            
            // Update backups
            localStorage.setItem('portfolio_data_backup', newDataString);
            await saveToIndexedDB(dbRef.current, newDataString);
          }
        }
      } catch (error) {
        // Server is unavailable - continue with offline mode
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  // Save data to API whenever it changes (debounced with proper feedback)
  useEffect(() => {
    if (!isLoaded) return;

    // Don't save if it's the same as last saved data
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    console.log('[Portfolio] Change detected, preparing to save PERMANENTLY...');

    // Debounce save for 1 second
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const adminPassword = localStorage.getItem('admin_password_temp') || '';
        
        if (!adminPassword) {
          console.log('[Portfolio] No admin password - not saving (viewer mode)');
          return;
        }

        isSavingRef.current = true;
        console.log('[Portfolio] Attempting to save data to server...');

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch('/api/portfolio-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': adminPassword,
            },
            body: JSON.stringify(data),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            console.log('[Portfolio] ✓ Saved to server');
            lastSavedDataRef.current = currentDataString;
            lastPolledDataRef.current = currentDataString;
            setLastSaveTime(Date.now());
            
            // Also backup to localStorage
            localStorage.setItem('portfolio_data_backup', currentDataString);
            
            // Also backup to IndexedDB
            await saveToIndexedDB(dbRef.current, currentDataString);
            
            // Verify the saved data matches what we sent
            if (result.data) {
              const savedDataString = JSON.stringify(result.data);
              if (savedDataString === currentDataString) {
                console.log('[Portfolio] ✓ Save verified - data is consistent across all layers');
              }
            }
          } else {
            const errorText = await response.text();
            console.error('[Portfolio] ✗ Server save failed:', response.status, errorText);
            // Fallback to localStorage and IndexedDB
            localStorage.setItem('portfolio_data_backup', currentDataString);
            await saveToIndexedDB(dbRef.current, currentDataString);
            console.log('[Portfolio] Data backed up to localStorage and IndexedDB');
          }
        } catch (fetchError: any) {
          // Server is unavailable - save to localStorage and IndexedDB instead
          console.warn('[Portfolio] Server unavailable, saving to localStorage and IndexedDB:', fetchError?.message);
          localStorage.setItem('portfolio_data_backup', currentDataString);
          await saveToIndexedDB(dbRef.current, currentDataString);
          console.log('[Portfolio] ✓ Data saved to localStorage and IndexedDB (offline mode)');
          lastSavedDataRef.current = currentDataString;
          lastPolledDataRef.current = currentDataString;
          setLastSaveTime(Date.now());
        }
      } catch (error) {
        console.error('[Portfolio] ✗ Error saving portfolio data:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
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

  // Manual sync function to fetch latest data from server
  const syncData = useCallback(async () => {
    try {
      console.log('[Portfolio] Manual sync triggered');
      const response = await fetch('/api/portfolio-data?t=' + Date.now(), {
        method: 'GET',
        cache: 'no-store'
      });
      if (response.ok) {
        const jsonData = await response.json();
        const dataString = JSON.stringify(jsonData);
        setData({ ...defaultPortfolioData, ...jsonData });
        lastSavedDataRef.current = dataString;
        
        // Update backups
        localStorage.setItem('portfolio_data_backup', dataString);
        await saveToIndexedDB(dbRef.current, dataString);
        
        console.log('[Portfolio] Data synced from server disk');
        return true;
      }
    } catch (error) {
      console.error('[Portfolio] Error syncing data:', error);
    }
    return false;
  }, []);

  return {
    data,
    isLoaded,
    lastSaveTime,
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
    syncData,
  };
}
