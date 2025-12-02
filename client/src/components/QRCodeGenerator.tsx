'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
    affiliateCode: string;
    affiliateUrl: string;
}

export default function QRCodeGenerator({ affiliateCode, affiliateUrl }: QRCodeGeneratorProps) {
    const [copied, setCopied] = useState(false);
    const [size, setSize] = useState(256);

    const handleDownload = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `petmatch-qr-${affiliateCode}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(affiliateUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'PetMatch - AI Pet Photos',
                    text: `Get amazing AI-generated photos of your pet! Use my code: ${affiliateCode}`,
                    url: affiliateUrl,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Your QR Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Share this QR code to earn 20% commission
                </p>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <QRCodeSVG
                        id="qr-code-svg"
                        value={affiliateUrl}
                        size={size}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: '/logo.png',
                            height: 40,
                            width: 40,
                            excavate: true,
                        }}
                    />
                </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QR Code Size
                </label>
                <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                >
                    <option value={128}>Small (128x128)</option>
                    <option value={256}>Medium (256x256)</option>
                    <option value={512}>Large (512x512)</option>
                    <option value={1024}>Extra Large (1024x1024)</option>
                </select>
            </div>

            {/* URL Display */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Affiliate Link
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={affiliateUrl}
                        readOnly
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    Download QR
                </button>
                <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <Share2 size={20} />
                    Share Link
                </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Print QR codes on business cards</li>
                    <li>• Share on Instagram Stories</li>
                    <li>• Add to email signatures</li>
                    <li>• Post in pet communities</li>
                </ul>
            </div>
        </div>
    );
}
