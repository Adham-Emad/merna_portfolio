// Portfolio Data Types

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  problemSolved: string;
  keyFeatures: string[];
  technologies: string[];
  image: string;
  githubLink: string;
  liveLink?: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept';
  icon?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface AboutCard {
  id: string;
  title: string;
  content: string;
  bgColor: 'white' | 'dark' | 'blue';
}

export interface HeroData {
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
}

export interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: {
    cards: AboutCard[];
  };
  skills: {
    title: string;
    subtitle: string;
    items: Skill[];
  };
  projects: {
    title: string;
    subtitle: string;
    items: Project[];
  };
  journey: {
    title: string;
    subtitle: string;
    milestones: Milestone[];
  };
  contact: ContactData;
  settings: {
    siteTitle: string;
    siteDescription: string;
  };
}

// Admin context types
export interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  updateHero: (hero: HeroData) => void;
  updateAbout: (about: { cards: AboutCard[] }) => void;
  updateSkills: (skills: { title: string; subtitle: string; items: Skill[] }) => void;
  updateProjects: (projects: { title: string; subtitle: string; items: Project[] }) => void;
  updateJourney: (journey: { title: string; subtitle: string; milestones: Milestone[] }) => void;
  updateContact: (contact: ContactData) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  editProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  deleteSkill: (id: string) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  editMilestone: (id: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => void;
}

// Default data
export const defaultPortfolioData: PortfolioData = {
  hero: {
    firstName: "MERNA",
    lastName: "BAHGAT",
    title: "Flutter Developer",
    subtitle: "Building Real Applications",
  },
  about: {
    cards: [
      {
        id: "1",
        title: "Hello, I'm Merna Bahgat",
        content: "I build mobile applications that solve real problems. With a strong foundation in Flutter and Dart, I create clean, scalable, and maintainable code that delivers exceptional user experiences.",
        bgColor: "white",
      },
      {
        id: "2",
        title: "Clean Code & Architecture",
        content: "I believe in SOLID principles, Clean Architecture, and writing code that lasts. Every line I write is designed with maintainability, testability, and scalability in mind.",
        bgColor: "dark",
      },
      {
        id: "3",
        title: "Job-Ready Developer",
        content: "I'm not just learning; I'm building a career. Through hands-on projects and real-world problem solving, I'm ready to contribute from day one and grow with your team.",
        bgColor: "blue",
      },
    ],
  },
  skills: {
    title: "TECHNICAL ARSENAL",
    subtitle: "Technologies & tools I work with",
    items: [
      { id: "1", name: "Flutter", category: "framework" },
      { id: "2", name: "Dart", category: "language" },
      { id: "3", name: "Firebase", category: "tool" },
      { id: "4", name: "REST APIs", category: "concept" },
      { id: "5", name: "Provider", category: "concept" },
      { id: "6", name: "Bloc", category: "concept" },
      { id: "7", name: "Git & GitHub", category: "tool" },
      { id: "8", name: "Clean Architecture", category: "concept" },
      { id: "9", name: "UI/UX Design", category: "concept" },
      { id: "10", name: "SQLite", category: "tool" },
    ],
  },
  projects: {
    title: "FEATURED PROJECTS",
    subtitle: "Real applications I've built",
    items: [
      {
        id: "1",
        title: "TASK MASTER",
        subtitle: "To-Do Application",
        description: "A feature-rich task management application built with Flutter. Organize your daily tasks with categories, priorities, and due dates.",
        problemSolved: "Helps users stay organized and productive by providing an intuitive interface for task management with local persistence.",
        keyFeatures: [
          "Create, edit, and delete tasks",
          "Set priorities and due dates",
          "Categorize tasks",
          "Local data persistence with SQLite",
          "Clean and intuitive UI",
        ],
        technologies: ["Flutter", "Dart", "SQLite", "Provider"],
        image: "",
        githubLink: "https://github.com/yourusername/task-master",
        order: 1,
      },
      {
        id: "2",
        title: "NEWS WAVE",
        subtitle: "News Aggregator App",
        description: "A real-time news application that fetches and displays news from various sources using the NewsAPI.",
        problemSolved: "Provides users with a centralized platform to stay updated with the latest news from multiple sources in a clean, readable format.",
        keyFeatures: [
          "Real-time news fetching",
          "Category-based browsing",
          "Search functionality",
          "Save favorite articles",
          "Responsive design",
        ],
        technologies: ["Flutter", "Dart", "REST API", "HTTP"],
        image: "",
        githubLink: "https://github.com/yourusername/news-wave",
        order: 2,
      },
      {
        id: "3",
        title: "CINE PHILE",
        subtitle: "Movie Discovery App",
        description: "A movie browsing application that allows users to discover popular movies, view details, and search for their favorites using TMDB API.",
        problemSolved: "Simplifies movie discovery by providing detailed information, ratings, and recommendations in an elegant interface.",
        keyFeatures: [
          "Browse popular and trending movies",
          "Detailed movie information",
          "Search movies by title",
          "View ratings and reviews",
          "Beautiful movie posters grid",
        ],
        technologies: ["Flutter", "Dart", "TMDB API", "Clean Architecture"],
        image: "",
        githubLink: "https://github.com/yourusername/cine-phile",
        order: 3,
      },
    ],
  },
  journey: {
    title: "MY PATH",
    subtitle: "How I evolved as a developer",
    milestones: [
      {
        id: "1",
        title: "Programming Fundamentals",
        description: "Built a strong foundation in programming concepts, data structures, and algorithms. Mastered the core principles that power every application.",
        order: 1,
      },
      {
        id: "2",
        title: "Object-Oriented Programming",
        description: "Deep understanding of OOP principles - encapsulation, inheritance, polymorphism, and abstraction. Applied these concepts to build modular, reusable code.",
        order: 2,
      },
      {
        id: "3",
        title: "State Management",
        description: "Learned to manage complex application state using Provider and Bloc patterns. Understanding of reactive programming and data flow architecture.",
        order: 3,
      },
      {
        id: "4",
        title: "API Integration",
        description: "Mastered REST API consumption, handling HTTP requests, parsing JSON data, and implementing error handling for robust network operations.",
        order: 4,
      },
      {
        id: "5",
        title: "Clean Architecture",
        description: "Adopted Clean Architecture and SOLID principles to build scalable, testable, and maintainable applications with clear separation of concerns.",
        order: 5,
      },
    ],
  },
  contact: {
    title: "LET'S BUILD SOMETHING",
    subtitle: "Together",
    email: "merna.bahgat@email.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
  settings: {
    siteTitle: "Merna Bahgat - Flutter Developer",
    siteDescription: "Portfolio of Merna Bahgat, a Flutter Developer building real applications",
  },
};
