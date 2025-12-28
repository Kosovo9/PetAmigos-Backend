import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dna, ShieldCheck, Zap, AlertTriangle, FileText, Upload } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const DNAMatching = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Mock analysis since we don't have a real file upload here for this demo
    const simulateAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setResult({
                score: 92,
                recommendation: "highly_recommended",
                findings: [
                    "Molecular verified breed purity (98.5%)",
                    "Low risk of hereditary hip dysplasia",
                    "Optimal genetic diversity for future offspring"
                ],
                diseases: [
                    { name: "Progressive Retinal Atrophy", risk: 0.02, status: "Clear" },
                    { name: "Degenerative Myelopathy", risk: 0.05, status: "Carrier" }
                ]
            });
            setAnalyzing(false);
            toast.success("DNA Analysis Complete!");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary">
                        <Dna className="w-8 h-8 animate-pulse" />
                        <h1 className="text-3xl font-bold tracking-tight">DNA Matching Engine™</h1>
                    </div>
                    <p className="text-slate-500 text-lg">
                        Analyze genetic compatibility at a molecular level with our AI-powered genomic analyzer.
                    </p>
                </div>

                {/* Upload / Start Section */}
                {!result && (
                    <Card className="border-2 border-dashed border-slate-200">
                        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold">Upload Genomic Test Results</p>
                                <p className="text-sm text-slate-400">Supports Embark, Wisdom Panel, and Orivet (CSV/JSON)</p>
                            </div>
                            <Button
                                onClick={simulateAnalysis}
                                disabled={analyzing}
                                className="px-8"
                            >
                                {analyzing ? "Analyzing SNPs..." : "Start Molecular Analysis"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {analyzing && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Sequencing SNP Markers...</span>
                                <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <Card className="md:col-span-1 shadow-lg bg-white border-primary/20">
                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-sm text-slate-400 uppercase tracking-widest">Compatibility Score</ CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-8">
                                    <div className="text-6xl font-black text-primary mb-2">{result.score}%</div>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                                        {result.recommendation.replace('_', ' ')}
                                    </Badge>
                                </CardContent>
                            </Card>

                            {/* Key Findings Card */}
                            <Card className="md:col-span-2 shadow-lg bg-white border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        Key Genetic Findings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {result.findings.map((finding: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                                            <span className="text-slate-600">{finding}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Health Risks Section */}
                        <Card className="shadow-lg border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                    Hereditary Health Risks
                                </CardTitle>
                                <CardDescription>Detailed analysis of 150+ genetic conditions based on SNP markers.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {result.diseases.map((disease: any, i: number) => (
                                    <div key={i} className="flex flex-col space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold">{disease.name}</span>
                                            <Badge variant={disease.status === 'Clear' ? 'outline' : 'destructive'}>
                                                {disease.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={disease.risk * 100} className="h-1.5 flex-1" />
                                            <span className="text-xs text-slate-400 w-12">{disease.risk * 100}% Risk</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button className="flex-1 gap-2">
                                <FileText className="w-4 h-4" />
                                Download Full Genetic Report
                            </Button>
                            <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/5">
                                Share with Veterinarian
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DNAMatching;
