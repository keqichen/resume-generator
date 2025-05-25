// lib/types.ts

export interface WorkExperience {
  company: string;
  title: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SideProject {
  projectName: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationExperience {
  school: string;
  degree: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  name: string;
  location: string;
  phone: string;
  email: string;
  github?: string;
  website?: string;
  linkedin?: string;
  skillsList?: string[];      
  workExperienceList?: WorkExperience[];
  educationExperienceList?: EducationExperience[];
  sideProjectList?: SideProject[]
}

export interface ResumeRecord {
  id: string;
  title: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  data: ResumeData;
}
