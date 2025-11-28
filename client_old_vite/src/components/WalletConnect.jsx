import React, { useState } from 'react';

import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';



export default function WalletConnect({ onWalletConnected }) {

    const [walletAddress, setWalletAddress] = useState('');

    const [isConnected, setIsConnected] = useState(false);

    const [error, setError] = useState(null);



    const connectMetaMask = async () => {

        try {

            if (typeof window.ethereum !== 'undefined') {

                // Solicitar acceso a la cuenta

                const accounts = await window.ethereum.request({

                    method: 'eth_requestAccounts'

                });



                if (accounts.length > 0) {

                    const address = accounts[0];

                    setWalletAddress(address);

                    setIsConnected(true);

                    setError(null);

                    if (onWalletConnected) {

                        onWalletConnected(address);

                    }

                }

            } else {

                setError("MetaMask no está instalado. Por favor, instálalo desde metamask.io");

            }

        } catch (error) {

            console.error("Error conectando wallet:", error);

            setError("Error al conectar la billetera. Por favor, intenta de nuevo.");

        }

    };



    const connectWalletConnect = async () => {

        // Implementación básica de WalletConnect

        // En producción, usar la librería oficial de WalletConnect

        setError("WalletConnect próximamente disponible.");

    };



    return (

        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">

            <div className="flex items-center gap-3 mb-4">

                <Wallet className="text-purple-500" size={24} />

                <h3 className="text-lg font-black text-gray-900">Conectar Billetera</h3>

            </div>



            {isConnected ? (

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">

                    <div className="flex items-center gap-2 mb-2">

                        <CheckCircle className="text-green-500" size={20} />

                        <span className="font-bold text-green-700">Billetera Conectada</span>

                    </div>

                    <p className="text-sm text-gray-600 font-mono break-all">

                        {walletAddress}

                    </p>

                </div>

            ) : (

                <div className="space-y-3">

                    <button

                        onClick={connectMetaMask}

                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition flex items-center justify-center gap-2"

                    >

                        <Wallet size={20} />

                        Conectar MetaMask

                    </button>



                    <button

                        onClick={connectWalletConnect}

                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition flex items-center justify-center gap-2"

                    >

                        <Wallet size={20} />

                        Conectar WalletConnect

                    </button>



                    {error && (

                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">

                            <AlertCircle className="text-red-500 mt-0.5" size={18} />

                            <p className="text-sm text-red-700">{error}</p>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}


