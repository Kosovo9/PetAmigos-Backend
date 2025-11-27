import React, { useState } from 'react';

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

                const userMessage = chatMsg;

                setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);

                setChatMsg('');

                const { data } = await api.chatWithPet({ petName: 'Barnaby', userMessage });

                setChatHistory(prev => [...prev, { sender: 'pet', text: data.reply }]);

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

