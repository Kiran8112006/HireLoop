// Resume Builder Types

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id?: string;
  institution?: string;
  degree?: string;
  field?: string;
  location?: string;
  graduation_date?: string;
  gpa?: string;
  result?: string;
  honors?: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  credential_id?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface StructuredResume {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  awards: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'traditional' | 'executive';
  preview?: string;
  thumbnail?: string;
  description: string;
  suitable_for: string[];
}
