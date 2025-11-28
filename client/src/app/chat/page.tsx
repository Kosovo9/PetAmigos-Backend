'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, MapPin, DollarSign, Image } from 'lucide-react';
import { apiEndpoint } from '@/lib/config';

export default function ChatPage() {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch conversations
    useEffect(() => {
        // TODO: Fetch from /api/chat/conversations
        setConversations([
            { id: 1, name: 'Walker Juan', lastMessage: 'Llegué con Max!', avatar: '🐕' },
            { id: 2, name: 'Veterinaria Central', lastMessage: 'Cita confirmada', avatar: '🏥' }
        ]);
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(apiEndpoint('/chat/send'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeChat,
                    message: newMessage,
                    type: 'text'
                })
            });

            if (response.ok) {
                setNewMessage('');
                // Refresh messages
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto max-w-6xl h-screen flex">
                {/* Sidebar - Conversations List */}
                <div className="w-1/3 bg-white border-r">
                    <div className="p-4 border-b bg-purple-600 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageCircle /> Chats
                        </h2>
                    </div>
                    <div className="overflow-y-auto h-full">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveChat(conv.id)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat === conv.id ? 'bg-purple-50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{conv.avatar}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{conv.name}</h3>
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-white border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">🐕</div>
                                    <div>
                                        <h3 className="font-semibold">Walker Juan</h3>
                                        <p className="text-sm text-green-600">● En línea</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-lg shadow max-w-xs">
                                        <p>Hola! Ya voy en camino por Max 🐕</p>
                                        <span className="text-xs text-gray-500">10:30 AM</span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-purple-600 text-white p-3 rounded-lg shadow max-w-xs">
                                        <p>Perfecto! Gracias 😊</p>
                                        <span className="text-xs text-purple-200">10:31 AM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t">
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Image className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                                <p>Selecciona una conversación para comenzar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
