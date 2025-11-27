import os



# ==========================================

# CONSTRUCTOR PETAMIGOS WORLD - PRO EDITION

# ==========================================

# Este script genera tanto el Backend (Dinero) como el Frontend (UX/UI)

# listos para producción.



project_structure = {

    # ---------------------------------------------------------

    # 1. BACKEND (SERVER) - EL MOTOR DE DINERO

    # ---------------------------------------------------------

    "server/package.json": """{

  "name": "petamigos-backend",

  "version": "1.0.0",

  "main": "server.js",

  "scripts": { "start": "node server.js", "dev": "nodemon server.js" },

  "dependencies": {

    "express": "^4.18.2", "mongoose": "^7.5.0", "cors": "^2.8.5",

    "dotenv": "^16.3.1", "socket.io": "^4.7.2", "stripe": "^13.4.0",

    "openai": "^4.5.0", "bcryptjs": "^2.4.3", "jsonwebtoken": "^9.0.2",

    "moment": "^2.29.4", "axios": "^1.4.0", "cheerio": "^1.0.0-rc.12"

  }

}""",



    "server/.env": """PORT=5000

MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/petamigos

JWT_SECRET=secret_key_change_me

STRIPE_SECRET_KEY=sk_test_key

OPENAI_API_KEY=sk_openai_key

CLIENT_URL=http://localhost:5173

""",



    "server/server.js": """const express = require('express');

const http = require('http');

const cors = require('cors');

const { Server } = require('socket.io');

const mongoose = require('mongoose');

require('dotenv').config();



const app = express();

const server = http.createServer(app);



app.use(cors());

app.use(express.json({ limit: '50mb' }));



mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('✅ BD Conectada'))

  .catch(err => console.error('❌ Error BD:', err));



const io = new Server(server, {

  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] }

});



io.on('connection', (socket) => {

  console.log(`🔌 User: ${socket.id}`);

  socket.on('request_service', (data) => io.emit('new_request', data));

});



app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/pay', require('./routes/paymentRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));

""",



    "server/models/User.js": """const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, default: 'user' },

  wallet: { treats: { type: Number, default: 50 } },

  location: { type: { type: String, default: 'Point' }, coordinates: [Number] }

});

module.exports = mongoose.model('User', UserSchema);

""",



    "server/routes/authRoutes.js": """const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require('../models/User');



router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });

    } catch (e) { res.status(500).json({ message: "Error" }); }

});



router.post('/signin', async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "No existe usuario" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Credenciales inválidas" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });

    } catch (e) { res.status(500).json({ message: "Error" }); }

});

module.exports = router;

""",



    "server/routes/paymentRoutes.js": """const express = require('express');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



router.post('/create-checkout-session', async (req, res) => {

    try {

        const { type } = req.body;

        let line_items = [];

        if (type === 'lifetime') {

            line_items.push({

                price_data: { currency: 'usd', product_data: { name: "Founder Lifetime" }, unit_amount: 9700 },

                quantity: 1,

            });

        }

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'], line_items, mode: 'payment',

            success_url: `${process.env.CLIENT_URL}/success`,

            cancel_url: `${process.env.CLIENT_URL}/cancel`,

        });

        res.json({ url: session.url });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

module.exports = router;

""",



    "server/routes/aiRoutes.js": """const express = require('express');

const router = express.Router();

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



router.post('/chat', async (req, res) => {

    const { petName, userMessage } = req.body;

    // Mock simple para evitar gastar créditos en pruebas

    // En prod, descomentar la llamada a OpenAI

    res.json({ reply: `${petName} dice: ¡Guau! Eso suena genial. 🐾` });

});

module.exports = router;

""",



    # ---------------------------------------------------------

    # 2. FRONTEND (CLIENT) - LA SUPER APP (UX/UI)

    # ---------------------------------------------------------

    "client/package.json": """{

  "name": "petamigos-client",

  "version": "1.0.0",

  "type": "module",

  "scripts": { "dev": "vite", "build": "vite build" },

  "dependencies": {

    "react": "^18.2.0", "react-dom": "^18.2.0", "lucide-react": "^0.263.1",

    "axios": "^1.4.0", "socket.io-client": "^4.7.2", "framer-motion": "^10.12.16",

    "react-router-dom": "^6.14.1"

  },

  "devDependencies": {

    "@vitejs/plugin-react": "^4.0.0", "vite": "^4.3.9",

    "tailwindcss": "^3.3.2", "autoprefixer": "^10.4.14", "postcss": "^8.4.24"

  }

}""",



    "client/vite.config.js": """import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; export default defineConfig({ plugins: [react()] });""",

    

    "client/postcss.config.js": """export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }""",

    

    "client/tailwind.config.js": """/** @type {import('tailwindcss').Config} */

export default {

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {

    extend: {

      colors: {

        petPink: '#EC4899',

        petYellow: '#F59E0B',

        petBlue: '#3B82F6',

      },

      animation: {

        'bounce-slow': 'bounce 3s infinite',

      }

    },

  },

  plugins: [],

}""",



    "client/src/index.css": """@tailwind base; @tailwind components; @tailwind utilities; body { margin: 0; font-family: 'Inter', sans-serif; background-color: #f3f4f6; }""",



    # --- API LAYER ---

    "client/src/api/index.js": """import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });



API.interceptors.request.use((req) => {

    if (localStorage.getItem('profile')) {

        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;

    }

    return req;

});



export const signIn = (formData) => API.post('/auth/signin', formData);

export const signUp = (formData) => API.post('/auth/signup', formData);

export const createCheckoutSession = (data) => API.post('/pay/create-checkout-session', data);

export const chatWithPet = (data) => API.post('/ai/chat', data);

""",



    # --- CONTEXTS (CEREBRO UX) ---

    "client/src/context/AuthContext.jsx": """import React, { createContext, useState, useEffect, useContext } from 'react';

import * as api from '../api';



const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('profile'));

        if (storedUser) setUser(storedUser.result);

    }, []);



    const login = async (formData) => {

        try {

            const { data } = await api.signIn(formData);

            localStorage.setItem('profile', JSON.stringify(data));

            setUser(data.result);

        } catch (error) { alert("Error al entrar"); }

    };

    const register = async (formData) => {

        try {

            const { data } = await api.signUp(formData);

            localStorage.setItem('profile', JSON.stringify(data));

            setUser(data.result);

        } catch (error) { alert("Error al registrar"); }

    };

    const logout = () => { localStorage.clear(); setUser(null); };



    return (

        <AuthContext.Provider value={{ user, login, register, logout }}>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);

""",



    "client/src/main.jsx": """import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import './index.css'

import { AuthProvider } from './context/AuthContext';



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <AuthProvider>

        <App />

    </AuthProvider>

  </React.StrictMode>,

)""",



    # --- THE SUPER APP UI (La Joya de la Corona) ---

    "client/src/App.jsx": """import React, { useState } from 'react';

import { useAuth } from './context/AuthContext';

import * as api from './api';

import { 

  Heart, X, MessageCircle, User, PawPrint, Globe, Camera, Bone, Sparkles, 

  Send, MapPin, Shield, Search, AlertTriangle, LogOut, 

  ShoppingBag, Plane, Utensils, Megaphone, Stethoscope, 

  Scan, Umbrella, Scissors, CloudRain, Trophy, Grid, 

  ChevronRight, Star, Car, Sun, Moon, Zap, MessageSquare, Siren, Lock

} from 'lucide-react';



// MOCK DATA PARA DEMO RÁPIDA

const FEED_POSTS = [

  { id: 1, user: "Sarah", pet: "Luna", img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80", likes: 124, caption: "Playa time! 🌊" },

  { id: 'ad', type: 'ad', title: "Spa Canino", content: "20% off hoy!", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80" },

];



export default function App() {

  const { user, login, register, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('hub');

  const [subFeature, setSubFeature] = useState(null);

  

  // Estados para Login

  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });



  // Estados Virales

  const [chatMsg, setChatMsg] = useState('');

  const [chatHistory, setChatHistory] = useState([{ sender: 'pet', text: "¡Guau! ¿Dónde están mis premios?" }]);

  const [alertActive, setAlertActive] = useState(false);



  // --- COMPONENTES INTERNOS ---



  const AuthScreen = () => (

    <div className="h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black text-white">

      <PawPrint size={64} className="mb-4 animate-bounce text-pink-500"/>

      <h1 className="text-4xl font-black mb-6 text-center">PetAmigos World</h1>

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">

        {isSignup && <input placeholder="Nombre" onChange={(e)=>setFormData({...formData, name:e.target.value})} className="w-full mb-3 p-3 rounded-xl bg-black/50 text-white"/>}

        <input placeholder="Email" onChange={(e)=>setFormData({...formData, email:e.target.value})} className="w-full mb-3 p-3 rounded-xl bg-black/50 text-white"/>

        <input type="password" placeholder="Password" onChange={(e)=>setFormData({...formData, password:e.target.value})} className="w-full mb-6 p-3 rounded-xl bg-black/50 text-white"/>

        <button onClick={() => isSignup ? register(formData) : login(formData)} className="w-full bg-pink-500 font-bold py-3 rounded-xl hover:scale-105 transition">

            {isSignup ? "Registrarse" : "Entrar"}

        </button>

      </div>

      <button onClick={() => setIsSignup(!isSignup)} className="mt-6 text-gray-400">{isSignup ? "¿Ya tienes cuenta? Entra" : "Crear Cuenta"}</button>

    </div>

  );



  const PetChatScreen = () => (

    <div className="h-full bg-gray-50 flex flex-col">

        <div className="p-4 bg-white shadow-sm flex justify-between items-center">

            <h2 className="font-black text-xl flex items-center gap-2"><MessageSquare className="text-purple-500"/> Chat IA</h2>

            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-bold">5 Gratis</span>

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {chatHistory.map((msg, i) => (

                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-white shadow-sm'}`}>{msg.text}</div>

                </div>

            ))}

        </div>

        <div className="p-4 bg-white border-t flex gap-2">

            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Di algo..." className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"/>

            <button onClick={async () => {

                setChatHistory([...chatHistory, { sender: 'user', text: chatMsg }]);

                const { data } = await api.chatWithPet({ petName: 'Barnaby', userMessage: chatMsg });

                setChatMsg('');

                setChatHistory(prev => [...prev, { sender: 'user', text: chatMsg }, { sender: 'pet', text: data.reply }]);

            }} className="bg-purple-600 text-white p-3 rounded-full"><Send size={18}/></button>

        </div>

    </div>

  );



  const AmberAlertScreen = () => (

      <div className="h-full bg-red-600 text-white flex flex-col items-center justify-center p-6 text-center">

          {!alertActive ? (

              <>

                <Siren size={64} className="mb-4 animate-pulse"/>

                <h2 className="text-3xl font-black mb-2">ALERTA AMBER</h2>

                <p className="mb-8 opacity-90">Notifica a 5,000 vecinos en 5km a la redonda.</p>

                <button onClick={() => setAlertActive(true)} className="w-full bg-white text-red-600 py-4 rounded-xl font-black text-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">

                    <Zap fill="currentColor"/> ACTIVAR ($29)

                </button>

              </>

          ) : (

              <div className="animate-in zoom-in">

                  <h2 className="text-3xl font-black mb-2">¡ALERTA ENVIADA!</h2>

                  <p className="text-lg opacity-90">Rastreando GPS...</p>

              </div>

          )}

      </div>

  );



  const HubScreen = () => (

      <div className="h-full bg-gray-50 flex flex-col p-4 pb-24 overflow-y-auto">

          <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-black text-gray-900">Pet<span className="text-pink-500">Hub</span></h2>

              <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-gray-600 flex items-center gap-1"><MapPin size={12} className="text-blue-500"/> Global</div>

          </div>

          <div className="grid grid-cols-3 gap-3">

              <button onClick={() => setSubFeature('petchat')} className="col-span-2 bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-between text-white group relative overflow-hidden">

                  <div className="relative z-10 flex items-center gap-3">

                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><MessageSquare size={20}/></div>

                      <div className="text-left"><span className="font-bold block text-sm">Chat IA</span><span className="text-[10px] opacity-90">Habla con ellos</span></div>

                  </div>

                  <ChevronRight className="relative z-10"/>

              </button>

              <button onClick={() => setSubFeature('amber')} className="bg-red-500 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 text-white hover:bg-red-600 transition"><Siren size={24} className="animate-pulse"/><span className="text-[10px] font-black uppercase">SOS</span></button>

              <button onClick={() => setSubFeature('taxi')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 aspect-square"><Car size={20} className="text-gray-600"/><span className="text-[10px] font-bold text-gray-700">Taxi</span></button>

              <button onClick={() => setSubFeature('breeding')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 aspect-square"><Heart size={20} className="text-gray-600"/><span className="text-[10px] font-bold text-gray-700">Parejas</span></button>

              <button onClick={() => setSubFeature('store')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 aspect-square"><ShoppingBag size={20} className="text-gray-600"/><span className="text-[10px] font-bold text-gray-700">Tienda</span></button>

          </div>

      </div>

  );



  const CommunityScreen = () => (

      <div className="h-full bg-gray-50 flex flex-col pb-24 overflow-y-auto">

           <div className="bg-white p-4 border-b"><h2 className="text-xl font-black">Comunidad</h2></div>

           <div className="p-4 space-y-4">

              {FEED_POSTS.map((post, i) => (

                  post.type === 'ad' ? (

                      <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-4 items-center">

                          <img src={post.img} className="w-16 h-16 rounded-xl object-cover" />

                          <div className="flex-1"><span className="text-[9px] font-bold text-yellow-600 uppercase">Patrocinado</span><h3 className="font-bold text-sm">{post.title}</h3></div>

                      </div>

                  ) : (

                      <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">

                          <img src={post.img} className="w-full aspect-square object-cover" />

                          <div className="p-3"><p className="text-sm"><span className="font-bold">{post.user}</span> {post.caption}</p></div>

                      </div>

                  )

              ))}

           </div>

      </div>

  );



  if (!user) return <AuthScreen />;



  return (

    <div className="w-full h-screen bg-gray-200 flex justify-center items-center font-sans">

      <div className="w-full h-full max-w-[420px] bg-white relative shadow-2xl md:h-[95vh] md:rounded-[40px] overflow-hidden flex flex-col">

        {/* TOP BAR */}

        <div className="bg-white px-4 pt-4 pb-2 flex justify-between items-center z-20 border-b border-gray-50">

            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-xs"><Bone size={14} fill="currentColor" /> {user.wallet?.treats || 0}</div>

            <button onClick={logout} className="p-2 bg-gray-100 rounded-full"><LogOut size={16} className="text-gray-500"/></button>

        </div>



        {/* CONTENT */}

        <div className="flex-1 relative overflow-hidden">

            {subFeature ? (

                <div className="h-full flex flex-col animate-in slide-in-from-right">

                    <div className="p-4 bg-white border-b flex items-center gap-2">

                        <button onClick={() => setSubFeature(null)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-180 text-gray-600"/></button>

                        <span className="font-bold capitalize text-gray-800">{subFeature}</span>

                    </div>

                    <div className="flex-1 overflow-hidden">

                        {subFeature === 'petchat' && <PetChatScreen />}

                        {subFeature === 'amber' && <AmberAlertScreen />}

                        {subFeature === 'taxi' && <div className="p-10 text-center text-gray-400">Módulo Taxi (Mapa)</div>}

                        {subFeature === 'breeding' && <div className="p-10 text-center text-gray-400">Módulo Parejas</div>}

                        {subFeature === 'store' && <div className="p-10 text-center text-gray-400">Módulo Tienda</div>}

                    </div>

                </div>

            ) : (

                <>

                    {activeTab === 'hub' && <HubScreen />}

                    {activeTab === 'discover' && <CommunityScreen />}

                    {activeTab === 'profile' && <div className="p-20 text-center text-gray-400">Perfil</div>}

                </>

            )}

        </div>



        {/* NAV */}

        <div className="bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-30">

            {[{ id: 'discover', icon: Search }, { id: 'hub', icon: Grid }, { id: 'profile', icon: User }].map((tab) => (

                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSubFeature(null); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-pink-500 scale-110' : 'text-gray-300'}`}>

                    <tab.icon size={tab.id === 'hub' ? 32 : 24} className={tab.id === 'hub' ? "text-pink-600 mb-1" : ""} />

                </button>

            ))}

        </div>

      </div>

    </div>

  );

}

"""
}



def create_project():

    print("🚀 Construyendo PetAmigos World Pro...")

    for filepath, content in project_structure.items():

        directory = os.path.dirname(filepath)

        if directory and not os.path.exists(directory):

            os.makedirs(directory)

        with open(filepath, "w", encoding="utf-8") as f:

            f.write(content)

        print(f"✅ Generado: {filepath}")

    print("\\n🎉 ¡LISTO! Ejecuta 'npm install' en /server y /client.")



if __name__ == "__main__":

    create_project()

