'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Zap, FolderOpen, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyzedImage {
    filename: string;
    success: boolean;
    analysis?: {
        species: string;
        breed: string;
        category: string;
        hyperRealisticPrompt: string;
        [key: string]: any;
    };
    error?: string;
}

export default function BatchPhotoUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // Validate file types
        const validFiles = selectedFiles.filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length !== selectedFiles.length) {
            alert('Some files were skipped. Only image files are allowed.');
        }

        setFiles(prevFiles => [...prevFiles, ...validFiles].slice(0, 50)); // Max 50 files
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
        setFiles(prevFiles => [...prevFiles, ...validFiles].slice(0, 50));
    }, []);

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const analyzeImages = async () => {
        if (files.length === 0) {
            alert('Please upload images first');
            return;
        }

        setAnalyzing(true);
        setProgress(0);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('/api/photos/batch-analyze', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.results);
                setProgress(100);
            } else {
                alert(`Error: ${data.error}`);
            }

        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to analyze images. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const clearAll = () => {
        setFiles([]);
        setResults(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-bold text-white mb-4"
                    >
                        🚀 Batch Photo Analyzer
                    </motion.h1>
                    <p className="text-gray-300 text-lg">
                        Upload multiple photos, get hyper-realistic prompts, auto-categorized
                    </p>
                    <div className="flex gap-4 justify-center mt-4 text-sm text-gray-400">
                        <span>✨ 100x Hyper-Realistic Prompts</span>
                        <span>📂 Auto-Categorization</span>
                        <span>⚡ AI-Powered Analysis</span>
                    </div>
                </div>

                {/* Upload Zone */}
                {!results && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl border-2 border-dashed border-white/30 p-12 mb-8"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            <Upload className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Drag & Drop Images Here
                            </h2>
                            <p className="text-gray-300 mb-6">
                                or click to browse (max 50 images, 10MB each)
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold cursor-pointer hover:scale-105 transition-transform"
                            >
                                <ImageIcon className="w-5 h-5" />
                                Select Images
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* Selected Files Preview */}
                {files.length > 0 && !results && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">
                                Selected Images ({files.length}/50)
                            </h3>
                            <button
                                onClick={clearAll}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="relative group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <p className="text-xs text-gray-300 mt-1 truncate">{file.name}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={analyzeImages}
                                disabled={analyzing}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-6 h-6" />
                                        Analyze All Images
                                    </>
                                )}
                            </button>
                        </div>

                        {analyzing && (
                            <div className="mt-4">
                                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Results */}
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={<Sparkles />}
                                label="Total Analyzed"
                                value={results.summary.totalImages}
                                color="from-blue-500 to-cyan-500"
                            />
                            <StatCard
                                icon={<Check />}
                                label="Successful"
                                value={results.summary.successful}
                                color="from-green-500 to-emerald-500"
                            />
                            <StatCard
                                icon={<X />}
                                label="Failed"
                                value={results.summary.failed}
                                color="from-red-500 to-pink-500"
                            />
                            <StatCard
                                icon={<Zap />}
                                label="Processing Time"
                                value={results.summary.processingTime}
                                color="from-yellow-500 to-orange-500"
                            />
                        </div>

                        {/* Categories */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <FolderOpen className="w-6 h-6" />
                                Categorized Results
                            </h3>

                            {Object.entries(results.byCategory).map(([category, images]: [string, any]) => {
                                if (images.length === 0) return null;

                                return (
                                    <CategorySection
                                        key={category}
                                        category={category}
                                        images={images}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={clearAll}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Start Over
                            </button>
                            <button
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <Zap className="w-6 h-6" />
                                Generate All ({results.stats.successful} images)
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Sub-components
function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-3`}>
                {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-300 text-sm mt-1">{label}</div>
        </div>
    );
}

function CategorySection({ category, images }: { category: string; images: any[] }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="mb-6">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full text-left mb-3"
            >
                <h4 className="text-xl font-bold text-white capitalize">
                    {category} ({images.length})
                </h4>
                <span className="text-gray-300">{expanded ? '▼' : '▶'}</span>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3"
                    >
                        {images.map((image, index) => (
                            <ImageResultCard key={index} image={image} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ImageResultCard({ image }: { image: AnalyzedImage }) {
    const [showPrompt, setShowPrompt] = useState(false);

    if (!image.success) {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-300">❌ {image.filename}: {image.error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-white font-semibold">{image.filename}</p>
                    <div className="flex gap-2 mt-1">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {image.analysis?.species}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                            {image.analysis?.breed}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="text-sm text-purple-400 hover:text-purple-300"
                >
                    {showPrompt ? 'Hide' : 'Show'} Prompt
                </button>
            </div>

            {showPrompt && (
                <div className="mt-3 p-3 bg-black/30 rounded-lg">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {image.analysis?.hyperRealisticPrompt}
                    </p>
                </div>
            )}
        </div>
    );
}
