'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, Search, PlusCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { config } from '../../lib/config';

export default function LostPetsPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Dog',
        description: '',
        address: '',
        contactPhone: '',
        lastSeenDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const res = await fetch(`${config.apiUrl}/lost-pets`);
            const data = await res.json();
            if (data.success) {
                setPets(data.data);
            }
        } catch (error) {
            console.error('Error fetching pets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Mock coordinates for now (would use Google Maps API in prod)
            const payload = {
                ...formData,
                latitude: 0,
                longitude: 0,
                images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80'] // Placeholder image
            };

            const res = await fetch(`${config.apiUrl}/lost-pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowForm(false);
                fetchPets();
                alert('Report submitted successfully!');
            }
        } catch (error) {
            alert('Error submitting report');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-red-500 flex items-center gap-3">
                            <AlertTriangle size={40} />
                            Lost Pets Radar
                        </h1>
                        <p className="text-gray-400 mt-2">Help reunite pets with their families. Global coverage.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                        <PlusCircle size={20} />
                        Report Lost Pet
                    </button>
                </div>

                {/* Report Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-red-500/30 rounded-3xl p-8 mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6">Report a Missing Pet</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text" placeholder="Pet Name" required
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <select
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text" placeholder="Last Seen Location (Address/City)" required
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white md:col-span-2"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <input
                                type="date" required
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                value={formData.lastSeenDate} onChange={e => setFormData({ ...formData, lastSeenDate: e.target.value })}
                            />
                            <input
                                type="tel" placeholder="Contact Phone" required
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                            />
                            <textarea
                                placeholder="Description (Color, distinct marks, collar...)" required
                                className="bg-black/50 border border-white/10 rounded-xl p-3 text-white md:col-span-2 h-32"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                                    Broadcast Alert
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Pets Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Scanning frequencies...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet: any) => (
                            <div key={pet._id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all group">
                                <div className="h-48 bg-gray-800 relative overflow-hidden">
                                    <img
                                        src={pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80'}
                                        alt={pet.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                        LOST
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{pet.name}</h3>
                                            <p className="text-gray-400 text-sm">{pet.breed} • {pet.type}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(pet.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-300 mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-red-500" />
                                            {pet.lastSeenLocation?.address}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-blue-500" />
                                            Lost: {new Date(pet.lastSeenDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button className="w-full border border-white/20 hover:bg-white hover:text-black text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        <Phone size={18} />
                                        Contact Owner
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
