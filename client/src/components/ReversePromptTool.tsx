'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, Sparkles, Aperture } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';

export default function ReversePromptTool() {
    const { user } = useAuth();
    const { createCheckout, loading: payLoading, error: payError } = usePayment();
    const hasCredits = (user?.credits ?? 0) > 0;
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const analyzeImage = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/prompts/reverse', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setResult(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateImage = async () => {
        if (!result) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/prompts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: result.prompts.hollywood, // Always sell the Hollywood dream first
                    mode: 'HOLLYWOOD_GLAM',
                    aspectRatio: '3:2'
                })
            });

            const data = await res.json();
            if (data.success) {
                console.log('Image Generated:', data.imageUrl);
                alert(`✨ Manifestation Complete! Image URL: ${data.imageUrl}`);
            } else {
                alert('Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('Failed to connect to the Manifestation Engine.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Aperture className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-2xl font-bold text-white">Reverse Prompt Engineer</h2>
                    </div>
                    <p className="text-white/60">Upload any photo to extract its DNA and generate a 10000x Mega Prompt.</p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left: Upload Area */}
                    <div className="space-y-6">
                        <div className="relative group">
                            <div className={`
                aspect-square rounded-2xl border-2 border-dashed border-white/20 
                flex flex-col items-center justify-center transition-all duration-300
                ${preview ? 'border-cyan-500/50 bg-black/20' : 'hover:border-white/40 hover:bg-white/5'}
              `}>
                                {preview ? (
                                    <img src={preview} alt="Upload" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                        <p className="text-white/60 font-medium">Drop your photo here</p>
                                        <p className="text-white/30 text-sm mt-2">JPG, PNG up to 10MB</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <button
                            onClick={analyzeImage}
                            disabled={!image || loading}
                            className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2
                transition-all duration-300
                ${!image
                                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'}
              `}
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    >
                                        <Wand2 className="w-5 h-5" />
                                    </motion.div>
                                    Extracting DNA...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Analyze Magic DNA
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right: Results Area (THE MAGIC BOX) */}
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-h-[400px] flex flex-col relative overflow-hidden">

                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/30">
                                <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                                <p>Upload a photo to extract its Magic DNA</p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* 1. The "Simple" User View */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-white">✨ Magic DNA Extracted</h3>
                                    <p className="text-white/60">We've analyzed your image and built a 10000x enhancement engine.</p>
                                </div>

                                {/* 2. Visual Tags (What the user understands) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Subject</span>
                                        <p className="text-lg text-white font-medium mt-1 truncate">{result.analysis.breed || 'Unknown'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Vibe</span>
                                        <p className="text-lg text-white font-medium mt-1 truncate">{result.analysis.vibe || 'Cinematic'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Lighting</span>
                                        <p className="text-lg text-white font-medium mt-1 truncate">{result.analysis.timeOfDay || 'Golden Hour'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Location</span>
                                        <p className="text-lg text-white font-medium mt-1 truncate">{result.analysis.scenario || 'Studio'}</p>
                                    </div>
                                </div>

                                {/* 3. The "Secret Sauce" Indicator (Hidden Complexity) */}
                                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-full">
                                        <Sparkles className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Hyper-Realism Engine Ready</h4>
                                        <p className="text-xs text-white/50">Internal complexity: 500+ parameters optimized.</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold">100% READY</span>
                                    </div>
                                </div>

                                {/* 4. Action Buttons */}
                                <div className="pt-4 space-y-3">
                                    {hasCredits ? (
                                        <button
                                            onClick={generateImage}
                                            disabled={loading}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Generating...' : <><Wand2 className="w-5 h-5" /> Generate 10000x Version</>}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => createCheckout('generation')}
                                            disabled={payLoading}
                                            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            {payLoading ? 'Redirecting to Stripe...' : 'Pay $1 & Generate Image'}
                                        </button>
                                    )}

                                    {payError && <p className="text-red-400 text-center text-sm">{payError}</p>}

                                    <p className="text-center text-xs text-white/30">
                                        {hasCredits ? '* 1 Credit will be used' : '* Secure payment via Stripe'}
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
