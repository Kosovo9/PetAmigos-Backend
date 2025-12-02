'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black/90 text-white/40 py-8 border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm">
                    © {new Date().getFullYear()} PetMatch.Fun. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm">
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/refunds" className="hover:text-white transition-colors">Refund Policy</Link>
                </div>
            </div>
        </footer>
    );
}
