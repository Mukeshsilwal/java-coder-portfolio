export const API_BASE_URL = '/api';

const getAuthToken = () => localStorage.getItem('token');

export interface ResumeMetadata {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    isActive: boolean;
}

export const resumeService = {
    uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/admin/cv/upload`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(errorData.message || 'Upload failed');
        }
        return await res.json();
    },

    getMetadata: async (): Promise<ResumeMetadata | null> => {
        const res = await fetch(`${API_BASE_URL}/admin/cv`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(errorData.message || 'Failed to fetch metadata');
        }
        return await res.json();
    },

    deleteResume: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/cv`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete resume');
    },


    getDownloadUrl: () => `${API_BASE_URL}/public/cv/download`
};
