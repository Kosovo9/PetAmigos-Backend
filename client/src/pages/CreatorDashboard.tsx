import React from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Play, Eye, Heart, Share2 } from 'lucide-react';

const CreatorDashboard = () => {
    // In a real app, this would use a real query. For demo, we mock or use the newly created router
    // const { data: analytics } = trpc.creator.getAnalytics.useQuery();

    const mockData = {
        totalViews: "1.2M",
        totalLikes: "450K",
        earnings: "$1,240.50",
        topVideo: {
            title: "Cute Golden Retriever Puppy First Walk",
            views: "850K",
            likes: "120K"
        },
        recentPerformance: [
            { date: 'Mon', views: 12000, earnings: 15 },
            { date: 'Tue', views: 15000, earnings: 20 },
            { date: 'Wed', views: 18000, earnings: 25 },
            { date: 'Thu', views: 22000, earnings: 30 },
            { date: 'Fri', views: 25000, earnings: 35 },
            { date: 'Sat', views: 30000, earnings: 45 },
            { date: 'Sun', views: 35000, earnings: 55 },
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Creator Hub</h1>
                        <p className="text-slate-500">Manage your pet content and track your global earnings.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">Withdraw Funds</Button>
                        <Button className="bg-primary hover:bg-primary/90">Post New Reel</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Views</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900">{mockData.totalViews}</h3>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-emerald-600 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+12.5% vs last week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Engaged Fans</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900">{mockData.totalLikes}</h3>
                                </div>
                                <div className="p-2 bg-rose-50 rounded-lg">
                                    <Heart className="w-5 h-5 text-rose-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-emerald-600 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+8.2% vs last week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-primary text-primary-foreground">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium opacity-80">Creator Earnings</p>
                                    <h3 className="text-2xl font-bold mt-1">{mockData.earnings}</h3>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-white/90 text-sm">
                                <Badge className="bg-white/20 text-white border-none">Tier: Platinum</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="pt-6 text-center">
                            <div className="h-24 flex items-center justify-center">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-500">Next Payout</p>
                                    <h3 className="text-xl font-bold text-slate-900">Jan 15, 2025</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Content */}
                    <Card className="lg:col-span-2 border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle>Top Performing Reels</CardTitle>
                            <CardDescription>Visual metrics of your most viral pet videos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-32 aspect-video bg-slate-100 rounded-lg overflow-hidden relative">
                                            <img src={`https://placedog.net/400/225?id=${i}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-bold text-slate-900 truncate">Funny Dog Jump #{i}</h4>
                                            <div className="flex gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 250K</span>
                                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 45K</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> 1.2K</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-600">+$45.20</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Earnings</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chart Visualization Placeholder */}
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle>Daily Traction</CardTitle>
                            <CardDescription>Views over the last 7 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-end gap-2 justify-between">
                                {mockData.recentPerformance.map((day) => (
                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-100 rounded-t-md hover:bg-primary transition-colors cursor-pointer"
                                            style={{ height: `${(day.views / 40000) * 100}%` }}
                                        />
                                        <span className="text-[10px] font-bold text-slate-400">{day.date}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
