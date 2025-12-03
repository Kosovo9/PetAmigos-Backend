import { getTranslations } from 'next-intl/server';
import LaunchLanding from '@/components/LaunchLanding';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen">
      {/* Temporalmente deshabilitado para limpiar UI */}
      {/* <LaunchLanding /> */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">🐾 PetMatch.fun</h1>
          <p className="text-2xl text-white/80">La Super App Galáctica para tu Mascota</p>
        </div>
      </div>
    </div>
  );
}
