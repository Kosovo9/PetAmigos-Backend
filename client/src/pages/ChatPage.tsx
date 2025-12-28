import React, { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';

/**
 * ChatPage - Real-time messaging UI
 * Clean, modern interface with focus on pet owner socializing.
 */
export default function ChatPage() {
    const [message, setMessage] = useState("");

    const contacts = [
        { id: 1, name: "Sarah & Cooper", lastMsg: "See you at the park!", time: "2m", active: true, image: "https://i.pravatar.cc/150?u=sarah" },
        { id: 2, name: "Mike & Luna", lastMsg: "Is he vaccinated?", time: "1h", active: false, image: "https://i.pravatar.cc/150?u=mike" },
        { id: 3, name: "Dog Daycare", lastMsg: "Your reservation is confirmed.", time: "3h", active: false, image: "https://i.pravatar.cc/150?u=care" },
    ];

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-neutral-800 flex flex-col">
                <div className="p-4 border-b border-neutral-800">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input className="bg-neutral-900 border-neutral-800 pl-10" placeholder="Search chats..." />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {contacts.map(contact => (
                        <div key={contact.id} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-neutral-900 transition-colors ${contact.id === 1 ? 'bg-neutral-900 shadow-inner' : ''}`}>
                            <div className="relative">
                                <Avatar className="w-12 h-12 border border-neutral-800">
                                    <AvatarImage src={contact.image} />
                                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                </Avatar>
                                {contact.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-950" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold truncate">{contact.name}</h3>
                                    <span className="text-xs text-neutral-500">{contact.time}</span>
                                </div>
                                <p className="text-sm text-neutral-400 truncate">{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <header className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="https://i.pravatar.cc/150?u=sarah" />
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold">Sarah & Cooper</h3>
                            <p className="text-xs text-green-500">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                    </div>
                </header>

                <ScrollArea className="flex-1 p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                        <span className="bg-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-400">TODAY</span>
                    </div>

                    <div className="flex justify-start">
                        <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none max-w-[70%]">
                            <p className="text-sm">Hi! My Golden Retriever Max matched with Cooper earlier today. Are you free for a playdate this weekend?</p>
                            <span className="text-[10px] text-neutral-500 float-right mt-1">10:42 AM</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-orange-600 p-3 rounded-2xl rounded-tr-none max-w-[70%] shadow-lg shadow-orange-600/20">
                            <p className="text-sm">Hey! Cooper would love that! We usually go to Central Dog Park on Saturdays. Does 10am work?</p>
                            <span className="text-[10px] text-white/50 float-right mt-1">10:45 AM</span>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none max-w-[70%]">
                            <p className="text-sm">Perfect! See you at the park! 🐶🎾</p>
                            <span className="text-[10px] text-neutral-500 float-right mt-1">10:46 AM</span>
                        </div>
                    </div>
                </ScrollArea>

                <footer className="p-4 bg-neutral-900/50">
                    <div className="flex items-center gap-2 bg-neutral-900 rounded-full p-2 border border-neutral-800">
                        <Button variant="ghost" size="icon" className="shrink-0 text-neutral-500"><Paperclip className="w-5 h-5" /></Button>
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-transparent border-none focus-visible:ring-0 placeholder:text-neutral-600"
                            placeholder="Type a message..."
                        />
                        <Button variant="ghost" size="icon" className="shrink-0 text-neutral-500"><Smile className="w-5 h-5" /></Button>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600 rounded-full w-10 h-10 p-0 shadow-lg shadow-orange-500/20"
                            disabled={!message.trim()}
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
