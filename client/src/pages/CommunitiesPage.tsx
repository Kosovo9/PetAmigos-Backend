import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, MessageSquare, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

const CommunitiesPage = () => {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState('');

    // Mock communities for now
    const mockCommunities = [
        { id: 1, name: "Golden Retriever Lovers", slug: "golden-retrievers", members: 1240, description: "Worldwide community for Golden owners and fans." },
        { id: 2, name: "Vet Tech Support", slug: "vet-support", members: 850, description: "Professional advice and support for pet health." },
        { id: 3, name: "Dog Training Secrets", slug: "dog-training", members: 3200, description: "Tips and tricks for the best behaved pups." },
        { id: 4, name: "Rescue & Adopt", slug: "rescue", members: 5400, description: "Finding forever homes for amazing pets." },
    ];

    const createCommunity = trpc.communities.create.useMutation({
        onSuccess: () => {
            toast.success("Community born! Welcome to the pack.");
            setIsCreating(false);
        }
    });

    const handleCreate = () => {
        if (!newCommunityName) return;
        createCommunity.mutate({
            name: newCommunityName,
            slug: newCommunityName.toLowerCase().replace(/ /g, '-')
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Users className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-widest text-xs">PetMatch Communities</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">The Global Pack</h1>
                        <p className="text-slate-500 max-w-lg">Join groups of like-minded owners, share knowledge, and build your digital territory.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search groups..."
                                className="pl-10 w-64 bg-white border-none shadow-sm focus:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90 gap-2">
                            <Plus className="w-4 h-4" /> New Group
                        </Button>
                    </div>
                </div>

                {/* Create Modal Entry */}
                {isCreating && (
                    <Card className="border-2 border-primary/20 bg-primary/5 shadow-none animate-in fade-in slide-in-from-top-4">
                        <CardContent className="pt-6 flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Community Name</label>
                                <Input
                                    placeholder="e.g. Bulldog Guardians Global"
                                    className="bg-white"
                                    value={newCommunityName}
                                    onChange={(e) => setNewCommunityName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Initialize pack</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Featured Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCommunities.map((c) => (
                        <Card key={c.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                            <CardHeader className="relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 flex gap-1">
                                        <Globe className="w-3 h-3" /> Public
                                    </Badge>
                                </div>
                                <Avatar className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border-none">
                                    <AvatarFallback className="font-bold text-xl">{c.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="mt-4 space-y-1">
                                    <CardTitle className="group-hover:text-primary transition-colors">{c.name}</CardTitle>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Users className="w-3 h-3" />
                                        <span>{c.members.toLocaleString()} members</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{c.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t bg-slate-50/50 pt-4 pb-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                            <AvatarFallback className="text-[8px]">U</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold border-2 border-white">+1k</div>
                                </div>
                                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">Join Pack</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Explore by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {["Breed Groups", "Health & Wellness", "Training & Advice", "Lost & Found", "Meetups", "Exotic Pets"].map(cat => (
                            <Button key={cat} variant="outline" className="rounded-full border-none shadow-sm bg-white hover:bg-primary hover:text-white transition-all">
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunitiesPage;
