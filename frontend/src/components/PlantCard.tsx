"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Info, Image as ImageIcon, Check, CreditCard } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export interface Plant {
    name: string;
    category: string;
    type: string;
    price: number;
    stock_quantity: number;
    expert_score: number;
    image_url?: string;
}

export default function PlantCard({ plant, index }: { plant: Plant; index: number }) {
    // Use Unsplash source API for guaranteed high-quality, relevant images.
    // We combine the plant name and type to get the best possible contextual match from Unsplash.
    const [imageUrl, setImageUrl] = useState("");
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(plant, imageUrl);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    useEffect(() => {
        if (plant.image_url) {
            setImageUrl(plant.image_url);
        } else {
            // Unsplash Source API generates a random image based on search terms.
            // It provides a much more premium feel than Wikipedia thumbnails.
            const searchTerms = encodeURIComponent(`${plant.name} plant ${plant.type} indoor`.toLowerCase().replace(/ /g, ','));
            setImageUrl(`https://source.unsplash.com/500x500/?${searchTerms}`);
        }
    }, [plant.name, plant.type, plant.image_url]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="card-premium group relative overflow-hidden flex flex-col h-full"
        >
            <div className="relative aspect-square overflow-hidden bg-surface-100 flex items-center justify-center">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={plant.name}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            // High-quality premium fallback image just in case Unsplash acts up
                            e.currentTarget.src = "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&q=80";
                        }}
                    />
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm text-sm font-medium">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-surface-800">{plant.expert_score}</span>
                </div>
                <div className="absolute top-3 left-3 bg-primary-100/90 text-primary-800 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm">
                    {plant.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/catalog/${plant.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="font-bold text-lg text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1" title={plant.name}>
                        {plant.name}
                    </Link>
                    <span className="font-semibold text-lg text-primary-700 dark:text-primary-400 whitespace-nowrap ml-2">Rs. {plant.price}</span>
                </div>

                <p className="text-sm text-surface-500 dark:text-surface-400 capitalize mb-4">
                    type: {plant.type}
                </p>

                <div className="mt-auto pt-4 border-t border-surface-100 dark:border-surface-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${plant.stock_quantity > 0 ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                            {plant.stock_quantity > 0 ? `${plant.stock_quantity} in stock` : "Out of stock"}
                        </span>
                        <Link href={`/catalog/${plant.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="text-surface-400 flex items-center justify-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="View details">
                            <Info size={18} />
                        </Link>
                    </div>

                    {plant.stock_quantity === 0 ? (
                        <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            <ShoppingBag size={18} />
                            Out of Stock
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-2 rounded-xl border-2 font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${added
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                                    : "bg-white border-primary-200 text-primary-600 hover:border-primary-600 hover:bg-primary-50"
                                    }`}
                            >
                                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                                <span className="text-sm">{added ? "Added" : "Cart"}</span>
                            </button>
                            <Link
                                href={`/checkout?plant=${encodeURIComponent(plant.name)}&price=${plant.price}&image=${encodeURIComponent(imageUrl)}`}
                                className="w-full py-2 rounded-xl bg-primary-600 text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-700 hover:shadow-md transition-all hover:-translate-y-0.5"
                            >
                                <CreditCard size={16} />
                                <span className="text-sm">Buy Now</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
