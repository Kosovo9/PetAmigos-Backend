import React from 'react';
import { ShoppingBag, Tag, ExternalLink, Filter, ChevronRight, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

/**
 * Marketplace Page - Pet products with affiliate tracking
 * High-conversion design with category filters and premium visuals.
 */
export default function Marketplace() {
    const products = [
        {
            id: 1,
            name: "Organic Raw Dog Food",
            brand: "PetOrganic",
            price: 45.99,
            category: "Food",
            source: "Temu",
            commission: "20%",
            image: "https://images.unsplash.com/photo-1589924691106-ca18815348b8?q=80&w=800&auto=format&fit=crop",
            link: "#"
        },
        {
            id: 2,
            name: "Sleek GPS Tracking Collar",
            brand: "GeoPet",
            price: 129.00,
            category: "Accessories",
            source: "Amazon",
            commission: "10%",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
            link: "#"
        },
        {
            id: 3,
            name: "Automatic Interactive Laser",
            brand: "CatPlay",
            price: 24.50,
            category: "Toys",
            source: "Mercado Libre",
            commission: "15%",
            image: "https://images.unsplash.com/photo-1548546738-8502ce9a3544?q=80&w=800&auto=format&fit=crop",
            link: "#"
        },
        {
            id: 4,
            name: "Premium Memory Foam Bed",
            brand: "RestEasy",
            price: 89.95,
            category: "Accessories",
            source: "Internal",
            commission: "100%",
            image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dfc?q=80&w=800&auto=format&fit=crop",
            link: "#"
        }
    ];

    const categories = ["All", "Food", "Toys", "Accessories", "Health", "Services"];

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Pet <span className="text-orange-500">Marketplace</span></h1>
                        <p className="text-neutral-400">Premium products curated for your Pet-ID 2.0 profile.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Input className="bg-neutral-900 border-neutral-800 md:w-64" placeholder="Search products..." />
                        <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </header>

                {/* Categories Scroller */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            variant={cat === "All" ? "default" : "outline"}
                            className={`px-4 py-2 cursor-pointer text-sm transition-all ${cat === "All" ? "bg-orange-500 hover:bg-orange-600" : "border-neutral-800 hover:bg-neutral-900"}`}
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="bg-neutral-900 border-neutral-800 overflow-hidden group hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-black/60 backdrop-blur-md text-orange-500 border-none">
                                        {product.source}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs text-neutral-500 font-mono tracking-widest uppercase">{product.brand}</span>
                                    <Badge variant="secondary" className="bg-neutral-800 text-green-400 text-[10px] font-bold">
                                        {product.commission} COM
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight group-hover:text-orange-400 transition-colors uppercase">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                                    <div className="flex items-center text-neutral-500 text-xs">
                                        <Truck className="w-3 h-3 mr-1" />
                                        Free Shipping
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl group">
                                    Buy Now
                                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Featured Banner */}
                <section className="mt-16 bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 opacity-10 scale-150 rotate-12">
                        <ShoppingBag className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">PREMIUM MEMBERSHIP</h2>
                        <p className="text-orange-50 text-lg mb-8 max-w-lg">Get 20% extra discount on all internal products and early access to matching suggestions.</p>
                        <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 h-14 rounded-2xl shadow-xl">
                            Upgrade Now <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </div>
                    <div className="relative z-10 w-full max-w-sm">
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <span className="font-semibold">Special Offer</span>
                                <Badge className="bg-white text-orange-600">Save $50</Badge>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4" /> Exclusive breeder tools</li>
                                <li className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4" /> Unlimited chat storage</li>
                                <li className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4" /> Verified health badge</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
