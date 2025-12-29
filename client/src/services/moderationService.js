
// client/src/services/moderationService.js
const API_BASE = process.env.REACT_APP_API_BASE || 'https://petmatch-backend.onrender.com/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const moderationService = {
    // Obtener cola de moderación pendiente
    getQueue: async () => {
        const res = await fetch(`${API_BASE}/moderation/queue`, {
            headers: getAuthHeader()
        });
        return res.json();
    },

    // Aprobar contenido
    approve: async (id, type) => {
        const res = await fetch(`${API_BASE}/moderation/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ id, type })
        });
        return res.json();
    },

    // Rechazar (eliminar) contenido
    reject: async (id, type, reason) => {
        const res = await fetch(`${API_BASE}/moderation/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ id, type, reason })
        });
        return res.json();
    }
};
