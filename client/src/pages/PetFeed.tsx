import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import StoryViewer from "@/modules/stories/components/StoryViewer";

const PetSocialFeed = () => {
    const [newPost, setNewPost] = useState('');
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const utils = trpc.useUtils();

    // Mock stories for visual 10x experience
    const mockStories = [
        { id: 1, ownerName: "Buddy_Golden", mediaUrl: "https://placedog.net/401/712", timeAgo: "1h ago" },
        { id: 2, ownerName: "Mimi_Cat", mediaUrl: "https://placedog.net/402/714", timeAgo: "2h ago" },
        { id: 3, ownerName: "Rex_Vet", mediaUrl: "https://placedog.net/403/716", timeAgo: "4h ago" },
        { id: 4, ownerName: "Luna_Paws", mediaUrl: "https://placedog.net/404/718", timeAgo: "5h ago" },
        { id: 5, ownerName: "Charlie", mediaUrl: "https://placedog.net/405/720", timeAgo: "12h ago" },
    ];

    // tRPC Queries & Mutations
    const { data: posts, isLoading } = trpc.feed.getFeed.useQuery({ page: 1 });
    const createPost = trpc.feed.createPost.useMutation({
        onSuccess: () => {
            setNewPost('');
            utils.feed.getFeed.invalidate();
            toast.success("Post shared with the community!");
        }
    });

    const handlePost = () => {
        if (!newPost.trim()) return;
        createPost.mutate({ content: newPost });
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
            {/* Stories Section */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <div className="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Your Story</span>
                </div>
                {mockStories.map((story, i) => (
                    <div
                        key={story.id}
                        className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                        onClick={() => setSelectedStoryIndex(i)}
                    >
                        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-fuchsia-500 to-primary">
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                                <img src={`https://placedog.net/100/100?id=${story.id}`} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{story.ownerName}</span>
                    </div>
                ))}
            </div>

            <StoryViewer
                isOpen={selectedStoryIndex !== null}
                onClose={() => setSelectedStoryIndex(null)}
                stories={mockStories}
                initialIndex={selectedStoryIndex || 0}
            />

            {/* Create Post Section */}
            <Card className="shadow-sm border-2">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <textarea
                                className="w-full min-h-[100px] p-3 rounded-xl border-none focus:ring-2 focus:ring-primary/20 resize-none bg-slate-50 text-slate-700"
                                placeholder="What's your pet up to today?"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            <div className="flex justify-between items-center border-t pt-4">
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Add Photo
                                </Button>
                                <Button
                                    onClick={handlePost}
                                    disabled={!newPost.trim() || createPost.isPending}
                                    className="rounded-full px-6"
                                >
                                    {createPost.isPending ? "Posting..." : "Share Update"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feed Section */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-400 animate-pulse">Loading global feed...</div>
                ) : posts?.map((post: any) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Avatar className="w-10 h-10 border">
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-sm font-bold">Pet Owner #{post.authorId}</CardTitle>
                                <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">{post.content}</p>
                            {post.mediaUrls && (
                                <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video">
                                    <img src={post.mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t bg-slate-50/50 flex justify-between py-2">
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-rose-500 transition-colors">
                                    <Heart className="w-4 h-4 mr-2" />
                                    {post.likesCount || 0}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {post.commentsCount || 0}
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-500">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PetSocialFeed;
