import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Heart,
  MapPin,
  Plane,
  MessageCircle,
  Camera,
  Leaf,
  Users,
  DollarSign,
  Stethoscope,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              🐾 PetMatch.fun
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-white/90">
              La Super App para tu Mascota
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
              Chat en tiempo real • Fotos con IA • Alertas de mascotas perdidas • Paseos verificados • ¡Y mucho más!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/christmas"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                🎄 Fotos Navideñas con IA
              </Link>
              <Link
                href="/chat"
                className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-all border-2 border-white/30 transform hover:scale-105"
              >
                💬 Abrir Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🌟 10 Features Increíbles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Chat Messenger */}
            <Link href="/chat" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-400">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <MessageCircle className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Chat Messenger</h3>
                <p className="text-gray-600 text-sm">
                  Chat en tiempo real tipo Facebook. Envía mensajes, fotos, ubicación y pagos.
                </p>
                <div className="mt-4 text-purple-600 font-semibold text-sm">
                  Abrir Chat →
                </div>
              </div>
            </Link>

            {/* Feature 2: Mascotas Perdidas */}
            <Link href="/lost-pets" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-red-400">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Alerta Mascotas Perdidas</h3>
                <p className="text-gray-600 text-sm">
                  Geolocalización en tiempo real. Alerta a usuarios cercanos en 5km.
                </p>
                <div className="mt-4 text-red-600 font-semibold text-sm">
                  Crear Alerta →
                </div>
              </div>
            </Link>

            {/* Feature 3: Paseos Verificados */}
            <Link href="/walks" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-400">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <MapPin className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Paseos Verificados</h3>
                <p className="text-gray-600 text-sm">
                  Walkers con verificación biométrica. Tracking GPS en vivo.
                </p>
                <div className="mt-4 text-green-600 font-semibold text-sm">
                  Reservar Paseo →
                </div>
              </div>
            </Link>

            {/* Feature 4: Nutrición AI */}
            <Link href="/nutrition" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-400">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Stethoscope className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Nutrición AI</h3>
                <p className="text-gray-600 text-sm">
                  Plan personalizado con IA. Recetas semanales gratis.
                </p>
                <div className="mt-4 text-orange-600 font-semibold text-sm">
                  Ver Plan →
                </div>
              </div>
            </Link>

            {/* Feature 5: AI Photo Studio */}
            <Link href="/christmas" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-400">
                <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Camera className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Photo Studio</h3>
                <p className="text-gray-600 text-sm">
                  Fotos profesionales con IA. Navidad, cumpleaños y más.
                </p>
                <div className="mt-4 text-pink-600 font-semibold text-sm">
                  Generar Fotos →
                </div>
              </div>
            </Link>

            {/* Feature 6: PetMatch Fly */}
            <Link href="/fly" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-400">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plane className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">PetMatch Fly</h3>
                <p className="text-gray-600 text-sm">
                  Políticas de 50+ aerolíneas. Precios y requisitos actualizados.
                </p>
                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Ver Aerolíneas →
                </div>
              </div>
            </Link>

            {/* Feature 7: ESG Carbon */}
            <Link href="/esg" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-emerald-400">
                <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Leaf className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Huella de Carbono</h3>
                <p className="text-gray-600 text-sm">
                  Calcula el impacto ambiental. Compensa con árboles.
                </p>
                <div className="mt-4 text-emerald-600 font-semibold text-sm">
                  Calcular →
                </div>
              </div>
            </Link>

            {/* Feature 8: Influencers */}
            <Link href="/influencers" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-400">
                <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Microinfluencers</h3>
                <p className="text-gray-600 text-sm">
                  Gana 20% de comisión. Dashboard de ventas en tiempo real.
                </p>
                <div className="mt-4 text-indigo-600 font-semibold text-sm">
                  Ver Dashboard →
                </div>
              </div>
            </Link>

            {/* Feature 9: Love Stories */}
            <Link href="/love-stories" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-rose-400">
                <div className="w-14 h-14 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                  <Heart className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Love Stories</h3>
                <p className="text-gray-600 text-sm">
                  Historias de adopción verificadas. Comparte tu experiencia.
                </p>
                <div className="mt-4 text-rose-600 font-semibold text-sm">
                  Ver Historias →
                </div>
              </div>
            </Link>

            {/* Feature 10: Veterinarias */}
            <Link href="/vets" className="group">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-400">
                <div className="w-14 h-14 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                  <DollarSign className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Veterinarias</h3>
                <p className="text-gray-600 text-sm">
                  Directorio verificado. Booking con telemedicina integrada.
                </p>
                <div className="mt-4 text-cyan-600 font-semibold text-sm">
                  Buscar Veterinaria →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a miles de dueños de mascotas que confían en PetMatch
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg transform hover:scale-105 shadow-lg"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
