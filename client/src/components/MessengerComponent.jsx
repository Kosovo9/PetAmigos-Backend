import React, { useState } from 'react';

import { Send, MapPin, DollarSign, Camera, CheckCircle, Bone, User } from 'lucide-react';

// Simulación de llamadas API y Contexto, reemplazar con la implementación real de tu proyecto

const api = { 

    sendMessage: (data) => new Promise(resolve => setTimeout(() => resolve(console.log("Mensaje enviado a DB y Socket")), 100))

}; 

const useSocket = () => ({ socket: null }); 

// MOCK DATA FOR USER AND CONVERSATION (Replace with real props)

const CURRENT_USER_ID = 'user-123';

const PARTNER_PROFILE = { 

  id: 'walker-456', 

  name: 'Sarah (Walker Certificada)', 

  isVerified: true, 

  moodScore: 4.8 

};

const INITIAL_MESSAGES = [

    { id: 1, sender: PARTNER_PROFILE.id, text: "Hola! Acabo de hacer check-in biométrico y estoy en camino.", type: 'text' },

    { id: 2, sender: CURRENT_USER_ID, text: "¿Puedes enviarme tu ubicación en vivo para el seguimiento?", type: 'text' },

];

export default function PetAmigosMessenger({ conversationId = 'convo-999' }) {

    const [messages, setMessages] = useState(INITIAL_MESSAGES);

    const [input, setInput] = useState('');

    const { socket } = useSocket(); // Using socket for real-time

    const handleSend = async () => {

        if (!input.trim()) return;

        const newMessage = {

            id: Date.now(),

            sender: CURRENT_USER_ID,

            text: input,

            type: 'text'

        };

        setMessages([...messages, newMessage]);

        setInput('');

        // 1. Call Backend (ChatController) to save to MongoDB

        await api.sendMessage({ conversationId, senderId: CURRENT_USER_ID, text: input });

        

        // 2. Real-Time Notification (Socket.io - Simulation)

        // if (socket) socket.emit('new_message', { conversationId, message: newMessage, receiverId: PARTNER_PROFILE.id });

    };

    const shareLiveLocation = () => {

        const locationMessage = {

            id: Date.now(),

            sender: CURRENT_USER_ID,

            text: "Compartiendo Ubicación en Vivo",

            type: 'location',

            coords: { lat: 40.7128, lng: -74.0060 } // Mock GPS

        };

        setMessages(prev => [...prev, locationMessage]);

        // if (socket) socket.emit('share_location', locationMessage);

    };

    const initiatePayment = () => {

        const feeMessage = {

            id: Date.now(),

            sender: CURRENT_USER_ID,

            text: "Pago del servicio de paseo iniciado ($25 USD - Nuestro Fee: 5%)",

            type: 'payment',

            amount: 25.00

        };

        setMessages(prev => [...prev, feeMessage]);

        // Call createCheckoutSession here for service payment

    };

    const renderMessageContent = (message) => {

        if (message.type === 'location') {

            return (

                <div className="flex items-center gap-2 text-white bg-blue-600 p-2 rounded-lg">

                    <MapPin size={18} /> <span>Ubicación en Vivo Compartida</span>

                </div>

            );

        }

        if (message.type === 'payment') {

            return (

                <div className="flex items-center gap-2 text-white bg-green-600 p-2 rounded-lg">

                    <DollarSign size={18} /> <span>Pago de ${message.amount.toFixed(2)} - Pendiente de Confirmar</span>

                </div>

            );

        }

        return message.text;

    };

    return (

        <div className="w-full h-screen bg-gray-50 flex flex-col max-w-lg mx-auto shadow-2xl rounded-lg overflow-hidden">

            {/* Advanced Engagement Header */}

            <div className="p-4 bg-white border-b shadow-md flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User size={20}/></div>

                    <div>

                        <div className="font-bold text-gray-900 flex items-center gap-1">

                            {PARTNER_PROFILE.name}

                            {PARTNER_PROFILE.isVerified && <CheckCircle size={16} className="text-blue-500 fill-white"/>}

                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1">

                            <Bone size={12} className="text-yellow-500" fill="currentColor"/> Mood Score: {PARTNER_PROFILE.moodScore}

                        </div>

                    </div>

                </div>

            </div>

            {/* Chat Body */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.map((msg) => (

                    <div key={msg.id} className={`flex ${msg.sender === CURRENT_USER_ID ? 'justify-end' : 'justify-start'}`}>

                        <div className={`max-w-[75%] p-3 rounded-xl text-sm shadow-md ${

                            msg.sender === CURRENT_USER_ID 

                                ? 'bg-indigo-500 text-white rounded-tr-none' 

                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'

                        }`}>

                            {renderMessageContent(msg)}

                        </div>

                    </div>

                ))}

            </div>

            {/* Input and High-Value Functions */}

            <div className="p-3 bg-white border-t flex items-center gap-2">

                

                {/* Advanced Functionality Buttons */}

                <button onClick={shareLiveLocation} className="p-2 text-blue-500 hover:bg-gray-100 rounded-full transition" title="Compartir Ubicación en Vivo">

                    <MapPin size={20}/>

                </button>

                <button onClick={initiatePayment} className="p-2 text-green-600 hover:bg-gray-100 rounded-full transition" title="Pagar Servicio/Fee">

                    <DollarSign size={20}/>

                </button>

                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition" title="Enviar Foto/Video">

                    <Camera size={20}/>

                </button>

                {/* Message Input */}

                <input 

                    value={input}

                    onChange={(e) => setInput(e.target.value)}

                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}

                    placeholder="Escribe un mensaje..."

                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"

                />

                

                {/* Send Button */}

                <button onClick={handleSend} className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition">

                    <Send size={20}/>

                </button>

            </div>

        </div>

    );

}

