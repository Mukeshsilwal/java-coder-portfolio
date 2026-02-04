import { axiosInstance } from './axios';
import { ProjectDTO, SkillDTO, ProfileDTO, Education, Experience } from '@/types';

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
        const { data } = await axiosInstance.get('/profile');
        return data.data; // Extract from ApiResponse
    },
    getProjects: async (params?: { featured?: boolean, tech?: string, type?: string, page?: number, size?: number }) => {
        const { data } = await axiosInstance.get('/projects', { params });
        return data.data; // Extract from ApiResponse
    },
    getSkills: async () => {
        const { data } = await axiosInstance.get('/skills');
        return data.data; // Extract from ApiResponse
    },
    getProjectById: async (id: string) => {
        const { data } = await axiosInstance.get(`/projects/${id}`);
        return data.data; // Extract from ApiResponse
    },
    getExperiences: async () => {
        const { data } = await axiosInstance.get('/experience');
        return data.data; // Extract from ApiResponse
    },
    sendMessage: async (message: MessageDTO) => {
        const { data } = await axiosInstance.post('/contact', message);
        return data.data; // Extract from ApiResponse
    },
    getCVDownloadUrl: async () => {
        const { data } = await axiosInstance.get('/public/media/cv/download-url');
        // Handle ApiResponse format: { status, message, data }
        return data.data; // Returns { url, publicId }
    },
    downloadCV: () => {
        return `${axiosInstance.defaults.baseURL}/public/cv/download?download=true`;
    },
    getEducation: async () => {
        const { data } = await axiosInstance.get('/public/education');
        return data.data;
    }
};

// Admin APIs (Protected)
export const adminApi = {
    // Profile
    updateProfile: async (profile: Partial<ProfileDTO>) => {
        const { data } = await axiosInstance.post('/profile', profile);
        return data.data; // Extract from ApiResponse
    },

    // Projects
    createProject: async (project: Partial<ProjectDTO>) => {
        const { data } = await axiosInstance.post('/projects', project);
        return data.data; // Extract from ApiResponse
    },
    updateProject: async (id: string, project: Partial<ProjectDTO>) => {
        const { data } = await axiosInstance.put(`/projects/${id}`, project);
        return data.data; // Extract from ApiResponse
    },
    deleteProject: async (id: string) => {
        await axiosInstance.delete(`/projects/${id}`);
    },

    // Skills
    createSkill: async (skill: Partial<SkillDTO>) => {
        const { data } = await axiosInstance.post('/skills', skill);
        return data.data; // Extract from ApiResponse
    },
    deleteSkill: async (id: string) => {
        await axiosInstance.delete(`/skills/${id}`);
    },
    updateSkill: async (id: string, skill: Partial<SkillDTO>) => { // Assuming update exists
        const { data } = await axiosInstance.put(`/skills/${id}`, skill);
        return data.data; // Extract from ApiResponse
    },

    // Images
    uploadProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post('/admin/profile/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    uploadProjectImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post(`/admin/projects/${id}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    uploadBlogThumbnail: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post(`/admin/blogs/${id}/thumbnail`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    uploadSkillIcon: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post(`/admin/skills/${id}/icon`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    // Media Management
    uploadImage: async (file: File, folder: string = 'general') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const { data } = await axiosInstance.post('/admin/media/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    uploadCV: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post('/admin/media/upload/cv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    getActiveCV: async () => {
        const { data } = await axiosInstance.get('/admin/media/cv/active');
        return data;
    },
    deleteMedia: async (id: number) => {
        await axiosInstance.delete(`/admin/media/${id}`);
    },
    deleteMediaByPublicId: async (publicId: string) => {
        await axiosInstance.delete('/admin/media/by-public-id', {
            params: { publicId }
        });
    },
    listMedia: async (type?: 'IMAGE' | 'CV') => {
        const { data } = await axiosInstance.get('/admin/media/list', {
            params: type ? { type } : {}
        });
        return data;
    },

    // Education
    getAllEducation: async () => {
        const { data } = await axiosInstance.get('/admin/education');
        return data.data;
    },
    createEducation: async (education: Partial<Education>) => {
        const { data } = await axiosInstance.post('/admin/education', education);
        return data.data;
    },
    updateEducation: async (id: string, education: Partial<Education>) => {
        const { data } = await axiosInstance.put(`/admin/education/${id}`, education);
        return data.data;
    },
    deleteEducation: async (id: string) => {
        await axiosInstance.delete(`/admin/education/${id}`);
    },
    reorderEducation: async (ids: string[]) => {
        await axiosInstance.patch('/admin/education/reorder', ids);
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
    },
    logout: async () => {
        await axiosInstance.post('/auth/logout');
    }
};
