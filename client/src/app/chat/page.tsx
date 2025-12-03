'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, MapPin, DollarSign, Image, MoreVertical, Phone, Video, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat);
            // Poll for new messages every 3 seconds (Simple real-time for now)
            const interval = setInterval(() => fetchMessages(activeChat), 3000);
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            // Mock response if no token or backend not ready
            if (!token) {
                // Keep mock data for demo if not logged in
                setConversations([
                    { _id: '1', name: 'Walker Juan', lastMessage: 'Llegué con Max!', time: '10:30 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', online: true },
                    { _id: '2', name: 'Dra. Sarah Vet', lastMessage: 'Cita confirmada', time: 'Ayer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', online: false }
                ]);
                setLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Use mock if no token

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.conversation) {
                setMessages(data.conversation.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeChat) return;

        const tempId = Date.now();
        const msg = {
            _id: tempId,
            text: newMessage,
            senderId: 'me', // Optimistic
            deliveredAt: new Date().toISOString()
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversationId: activeChat,
                    text: msg.text
                })
            });
            fetchMessages(activeChat); // Refresh to get real ID and status
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden relative pt-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-7xl h-[calc(100vh-100px)] flex relative z-10 p-4 gap-4">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`w-full md:w-1/3 lg:w-1/4 bg-[#111] border border-white/10 rounded-3xl flex flex-col overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}
                >
                    <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
                        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                            PetMatch Chat
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input type="text" placeholder="Search..." className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-all" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {conversations.map((conv: any) => (
                            <motion.div
                                key={conv._id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setActiveChat(conv._id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${activeChat === conv._id ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="relative">
                                    <img src={conv.avatar || 'https://via.placeholder.com/50'} alt={conv.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                                    {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold truncate ${activeChat === conv._id ? 'text-white' : 'text-gray-300'}`}>{conv.name}</h3>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Chat Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 bg-[#111] border border-white/10 rounded-3xl flex flex-col overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}
                >
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden p-2 hover:bg-white/10 rounded-full text-gray-400">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <h3 className="font-bold text-white">Chat</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
                                {messages.map((msg: any) => (
                                    <motion.div
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${msg.senderId === 'me' ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-tr-none' : 'bg-[#222] border border-white/10 text-gray-200 rounded-tl-none'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-2xl p-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none px-2"
                                    />
                                    <button onClick={sendMessage} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-pink-600/20">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <MessageCircle size={48} className="text-pink-500/50 mb-4" />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
