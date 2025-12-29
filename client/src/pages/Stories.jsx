
// client/src/pages/Stories.jsx
import { useState, useEffect } from 'react';
import SeoHead from '../components/SeoHead';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Mock fetch for now, replace with actual service call
        const fetchStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/stories', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStories(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const newStory = await res.json();
            setStories([newStory, ...stories]);
        } catch (err) {
            alert('Error uploading story');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <SeoHead title="Historias | PetAmigos" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Historias (24h)</h1>
                <label className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full cursor-pointer hover:opacity-90 transition font-bold text-sm">
                    + Nueva Historia
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="space-y-6">
                    {stories.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No hay historias recientes.</p>
                    ) : (
                        stories.map(story => (
                            <div key={story._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                <div className="p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        {/* Avatar fallback */}
                                        {story.userId?.avatar ? <img src={story.userId.avatar} alt="User" /> : <div className="w-full h-full bg-indigo-100"></div>}
                                    </div>
                                    <span className="font-semibold text-sm">{story.userId?.name || 'Usuario'}</span>
                                </div>
                                <img src={story.imageUrl} alt="Story" className="w-full h-96 object-cover bg-black" />
                                <div className="p-3 text-xs text-gray-500 text-right">
                                    Expira: {new Date(new Date(story.createdAt).getTime() + 86400000).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Stories;
