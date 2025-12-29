import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Video, ShieldCheck, Zap, X, Film, Scissors, Music } from 'lucide-react';
import { toast } from 'sonner';

const VideoUploadPortal = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(0); // 0: Select, 1: Edit, 2: Transcoding, 3: Success
    const [progress, setProgress] = useState(0);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setStep(1);
        } else {
            toast.error("Please select a valid video file.");
        }
    };

    const startUpload = () => {
        setUploading(true);
        setStep(2);

        // Simulating the 300% optimized HLS transcoding process
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 2;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setStep(3);
                setUploading(false);
                toast.success("Reel published successfully!");
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-xl shadow-xl border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-black italic tracking-tigh text-primary">REELS STUDIO</CardTitle>
                    <CardDescription>Upload and optimize your pet videos for the viral feed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 0 && (
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => fileInput.current?.click()}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold">Drop your pet video here</p>
                                <p className="text-sm text-slate-400">MP4, MOV or WebM (Max 100MB)</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInput}
                                className="hidden"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {step === 1 && file && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95">
                            <div className="aspect-[9/16] bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
                                <Film className="w-12 h-12 text-white/20" />
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="absolute inset-0 w-full h-full object-contain"
                                    controls
                                />
                                <button
                                    onClick={() => setStep(0)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Caption</Label>
                                    <Input placeholder="Describe the scene..." className="bg-slate-50 border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Music</Label>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-none bg-slate-50">
                                        <Music className="w-4 h-4" /> Select Track
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 gap-2">
                                    <Scissors className="w-4 h-4" /> Trim Clip
                                </Button>
                                <Button onClick={startUpload} className="flex-1 bg-primary hover:bg-primary/90">
                                    Publish Reel
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="py-12 space-y-8 animate-in fade-in">
                            <div className="text-center space-y-2">
                                <div className="inline-flex p-3 bg-amber-50 rounded-xl mb-4">
                                    <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold">Optimizing for Global Stream</h3>
                                <p className="text-sm text-slate-500">Generating HLS variants (1080p, 720p, 480p) via Pet-Transcode Engine™</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>TRANSCODING PROGRESS</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs text-slate-600">Encrypted and optimized for zero-latency delivery.</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-12 text-center space-y-6 animate-in scale-in-95">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-10 h-10 text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Viral Ready!</h3>
                                <p className="text-slate-500">Your pet reel has been distributed to 15 nodes globally.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button className="w-full" onClick={() => window.location.href = '/reels'}>
                                    Go to Reels Feed
                                </Button>
                                <Button variant="ghost" onClick={() => setStep(0)}>
                                    Upload Another
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VideoUploadPortal;
