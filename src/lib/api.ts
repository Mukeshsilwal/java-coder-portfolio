
const API_BASE_URL = '/api';

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

interface AuthResponse {
    token: string;
}

const getHeaders = () => {
    return {
        'Content-Type': 'application/json'
        // Token is now handled by HttpOnly cookie
    };
};

export const api = {
    auth: {
        login: async (credentials: any) => {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (!res.ok) throw await res.json();
            const data: AuthResponse = await res.json();
            return data;
        },
        register: async (data: any) => {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw await res.json();
            return await res.json();
        }
    },
    projects: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/projects`, {
                headers: getHeaders(),
                credentials: 'include'
            });
            if (!res.ok) throw await res.json();
            return await res.json() as ProjectDTO[];
        },
        create: async (project: ProjectDTO) => {
            const res = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                credentials: 'include',
                headers: getHeaders(),
                body: JSON.stringify(project)
            });
            if (!res.ok) throw await res.json();
            return await res.json();
        }
    },
    profile: {
        get: async () => {
            const res = await fetch(`${API_BASE_URL}/profile`, {
                headers: getHeaders(),
                credentials: 'include'
            });
            if (!res.ok) throw await res.json();
            return await res.json() as ProfileDTO;
        }
    },
    skills: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/skills`, {
                headers: getHeaders(),
                credentials: 'include'
            });
            if (!res.ok) throw await res.json();
            return await res.json() as SkillDTO[];
        }
    }
};
