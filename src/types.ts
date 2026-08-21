export type Language = 'it' | 'en';

export type AudienceType = 'all' | 'azienda' | 'recruiter' | 'dev';

export type ProjectCategory = 'all' | 'ai' | 'fullstack' | 'embedded';

export type ProjectStatus = 'production' | 'in_development' | 'demo_available' | 'bare_metal' | 'case_study';

export type TimelineCategory = 
  | 'lavoro' 
  | 'studio' 
  | 'ricerca' 
  | 'erasmus' 
  | 'volontariato' 
  | 'certificazione';

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: {
    it: string;
    en: string;
  };
  category: 'ai' | 'fullstack' | 'embedded';
  status: ProjectStatus;
  statusLabel: {
    it: string;
    en: string;
  };
  year: string;
  problem: {
    it: string;
    en: string;
  };
  howItWorks: {
    it: string;
    en: string;
  };
  aiRole?: {
    it: string;
    en: string;
  };
  whyItMatters: {
    it: string;
    en: string;
  };
  architectureNotes?: {
    it: string;
    en: string;
  };
  stack: string[];
  metrics?: {
    label: { it: string; en: string };
    value: string;
  }[];
  demoUrl?: string;
  repoUrl?: string;
  demoCredentials?: {
    it: string;
    en: string;
  };
  abstractDiagramType: 'packing' | 'agent_stream' | 'qr_pipeline' | 'tender_matching' | 'spi_icmp' | 'scoring_graph';
  image?: string;
}

export interface ServiceArea {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  proof: { it: string; en: string };
  linkedProjectId: string;
  keyPoints: { it: string[]; en: string[] };
  icon: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  title: { it: string; en: string };
  organization: string;
  location: string;
  category: TimelineCategory;
  description: { it: string; en: string };
  highlights?: { it: string[]; en: string[] };
  degreeTrack?: 'triennale' | 'magistrale';
  yearRange?: [number, number];
  startDate?: string;
  column?: 'left' | 'right';
}

export interface FaqItem {
  id: string;
  question: { it: string; en: string };
  answer: { it: string; en: string };
}
