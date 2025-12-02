'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Copy, Star, Heart, Sparkles } from 'lucide-react';

interface Prompt {
    _id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    promptData: {
        hollywood: string;
        raw: string;
        technical: string;
    };
}

export default function PromptLibraryGallery() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPrompts();
    }, []);

    const fetchPrompts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/prompts/library');
            const data = await res.json();
            if (data.success) {
                setPrompts(data.data);
            }
        } catch (error) {
            console.error('Error fetching vault:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrompts = prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'all' || p.category === filter;
        return matchesSearch && matchesFilter;
    });

    const categories = ['all', 'seasonal', 'nature', 'studio', 'lifestyle', 'fantasy'];

    return (
        <div className="space-y-8">

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${filter === cat
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'bg-black/20 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat === 'seasonal' ? '🎄 Christmas' : cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search the Vault..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredPrompts.map((prompt) => (
                            <motion.div
                                key={prompt._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-colors"
                            >
                                {/* Image Placeholder (Gradient for now) */}
                                <div className="aspect-[3/2] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                    <div className={`absolute inset-0 bg-gradient-to-tr opacity-30 ${prompt.category === 'seasonal' ? 'from-red-900 to-green-900' :
                                            prompt.category === 'nature' ? 'from-emerald-900 to-blue-900' :
                                                'from-purple-900 to-blue-900'
                                        }`} />

                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
                                            {prompt.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                            {prompt.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button className="text-white/40 hover:text-white transition-colors">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-white/60 line-clamp-2 mb-4 h-10">
                                        {prompt.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {prompt.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(prompt.promptData.hollywood)}
                                            className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Sparkles className="w-3 h-3 text-purple-400" />
                                            Copy Hollywood
                                        </button>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(prompt.promptData.raw)}
                                            className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Copy className="w-3 h-3 text-amber-400" />
                                            Copy Raw
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
