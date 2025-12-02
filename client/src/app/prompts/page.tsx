import ReversePromptTool from '@/components/ReversePromptTool';
import PromptLibraryGallery from '@/components/PromptLibraryGallery';

export default function PromptsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">

            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
                    Mega Prompt Engine
                </h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                    Unlock the power of 10000x hyper-realism. Reverse engineer any photo or browse our curated vault of masterpieces.
                </p>
            </div>

            {/* The Tool */}
            <div className="container mx-auto px-4 mb-24">
                <ReversePromptTool />
            </div>

            {/* Library Preview */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">The Vault <span className="text-purple-500">.</span></h2>
                    <p className="text-white/40 text-sm hidden md:block">300+ Curated Masterpieces</p>
                </div>

                <PromptLibraryGallery />
            </div>

        </div>
    );
}
