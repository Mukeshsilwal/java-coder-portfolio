import { axiosInstance } from './axios';
import { ProjectDTO, SkillDTO, ProfileDTO } from '@/types';

export interface MessageDTO {
    senderName: string;
    senderEmail: string;
    message: string;
    subject: string;
}

export interface LoginDTO {
    username?: string;
    password?: string;
    email?: string;
}

// Public APIs
export const publicApi = {
    getProfile: async () => {
        const { data } = await axiosInstance.get<ProfileDTO>('/profile');
        return data;
    },
    getProjects: async (params?: { featured?: boolean, tech?: string, type?: string, page?: number, size?: number }) => {
        const { data } = await axiosInstance.get<ProjectDTO[]>('/projects', { params });
        return data;
    },
    getSkills: async () => {
        const { data } = await axiosInstance.get<SkillDTO[]>('/skills');
        return data;
    },
    getProjectById: async (id: string) => {
        const { data } = await axiosInstance.get<ProjectDTO>(`/projects/${id}`);
        return data;
    },
    sendMessage: async (message: MessageDTO) => {
        const { data } = await axiosInstance.post('/contact', message);
        return data;
    }
};

// Admin APIs (Protected)
export const adminApi = {
    // Profile
    updateProfile: async (profile: Partial<ProfileDTO>) => {
        const { data } = await axiosInstance.put<ProfileDTO>('/profile', profile);
        return data;
    },

    // Projects
    createProject: async (project: Partial<ProjectDTO>) => {
        const { data } = await axiosInstance.post<ProjectDTO>('/projects', project);
        return data;
    },
    updateProject: async (id: string, project: Partial<ProjectDTO>) => {
        const { data } = await axiosInstance.put<ProjectDTO>(`/projects/${id}`, project);
        return data;
    },
    deleteProject: async (id: string) => {
        await axiosInstance.delete(`/projects/${id}`);
    },

    // Skills
    createSkill: async (skill: Partial<SkillDTO>) => {
        const { data } = await axiosInstance.post<SkillDTO>('/skills', skill);
        return data;
    },
    deleteSkill: async (id: string) => {
        await axiosInstance.delete(`/skills/${id}`);
    },
    updateSkill: async (id: string, skill: Partial<SkillDTO>) => { // Assuming update exists
        const { data } = await axiosInstance.put<SkillDTO>(`/skills/${id}`, skill);
        return data;
    }
};

export const authApi = {
    login: async (credentials: LoginDTO) => {
        const { data } = await axiosInstance.post<{ token: string }>('/auth/login', credentials);
        return data;
    },
    // Admin registration might not be public, but keeping it if needed
    register: async (credentials: LoginDTO) => {
        const { data } = await axiosInstance.post('/auth/register', credentials);
        return data;
    }
};
