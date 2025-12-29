
// client/src/pages/ModerationPanel.jsx
import { useState, useEffect } from 'react';
import { moderationService } from '../services/moderationService';
import SeoHead from '../components/SeoHead';

const ModerationPanel = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const loadQueue = async () => {
        try {
            const data = await moderationService.getQueue();
            setQueue(data);
        } catch (err) {
            setError("Error loading moderation queue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const handleAction = async (id, type, action) => {
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            if (action === 'approve') {
                await moderationService.approve(id, type);
            } else {
                await moderationService.reject(id, type, 'Violates community guidelines');
            }
            // Remove from local list
            setQueue(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert("Error executing action");
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando cola de moderación...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <SeoHead title="Panel de Moderación | PetAmigos" />
            <h1 className="text-2xl font-bold mb-6">🛡️ Cola de Moderación</h1>

            {queue.length === 0 ? (
                <div className="bg-green-50 p-8 rounded text-center text-green-700">
                    ✅ Todo limpio. No hay contenido pendiente de revisión.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queue.map(item => (
                        <div key={item._id} className="bg-white border rounded-lg shadow p-4 flex flex-col">
                            <div className="mb-4">
                                <span className="bg-gray-100 text-xs px-2 py-1 rounded uppercase font-bold">{item.type}</span>
                                <span className="text-xs text-gray-500 ml-2">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Preview del contenido */}
                            <div className="flex-1 mb-4 bg-gray-50 rounded p-2 overflow-hidden">
                                {item.image && (
                                    <img src={item.image} alt="Preview" className="w-full h-48 object-cover rounded mb-2" />
                                )}
                                <p className="text-sm">{item.text || item.bio || item.description || "Sin texto"}</p>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => handleAction(item._id, item.type || 'post', 'reject')}
                                    disabled={actionLoading[item._id]}
                                    className="flex-1 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition"
                                >
                                    {actionLoading[item._id] ? '...' : '❌ Rechazar'}
                                </button>
                                <button
                                    onClick={() => handleAction(item._id, item.type || 'post', 'approve')}
                                    disabled={actionLoading[item._id]}
                                    className="flex-1 bg-green-100 text-green-700 py-2 rounded hover:bg-green-200 transition"
                                >
                                    {actionLoading[item._id] ? '...' : '✅ Aprobar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModerationPanel;
