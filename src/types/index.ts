export interface ProjectDTO {
    id: string;
    title: string;
    description: string;
    techStack: string; // Comma separated
    githubRepoUrl: string;
    liveDemoUrl: string;
    projectImage: string;
    projectType: 'PERSONAL' | 'CLIENT' | 'OPEN_SOURCE';
    startDate: string;
    endDate: string;
    isFeatured: boolean;
}

export interface SkillDTO {
    id: string;
    skillName: string;
    category: string; // Backend, Frontend, Database, DevOps, Tools
    proficiencyLevel: string; // Beginner, Intermediate, Advanced, Expert
    experienceYears: number;
    iconUrl: string;
    displayOrder: number;
}

export interface ProfileDTO {
    id: string;
    headline: string;
    bio: string;
    yearsOfExperience: number;
    resumeUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioWebsite: string;
    location: string;
    phone: string;
    email: string;
    profileImage: string;
    availabilityStatus: string;
}

export interface AuthResponse {
    token: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    technologies: string[];
    logoUrl?: string;
    jobType?: string;
    workMode?: string;
    order?: number;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string | null;
    status: string;
    grade: string;
    description: string;
    certificateUrl?: string;
    orderIndex: number;
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
}
