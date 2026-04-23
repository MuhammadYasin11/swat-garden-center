"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Sparkles, CheckCircle2, ChevronRight, Star, Leaf } from "lucide-react";
import Link from "next/link";
import RecommenderSkeleton from "./RecommenderSkeleton";

export default function RecommendationForm() {
    const [formData, setFormData] = useState({
        category: "indoor",
        type: "foliage",
        light_requirement: "medium",
        maintenance_level: "low",
        growth_rate: "fast",
        water_frequency: "medium",
        temp_min: 60,
        temp_max: 85,
        price: 50
    });

    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to get recommendations");
            }

            const data = await response.json();
            setRecommendations(data.recommended_plants);
        } catch (err) {
            setError("Failed to connect to the AI Garden engine. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("temp") || name === "price" ? Number(value) : value
        }));
    };

    return (
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[600px] h-[600px] rounded-full bg-primary-50/60 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 text-surface-700 font-medium text-sm mb-6">
                            <Bot size={16} className="text-primary-500" />
                            AI Assistant
                        </div>
                        <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight leading-tight mb-6">
                            Not sure what to buy? <br />
                            <span className="text-primary-600">Let our AI help you.</span>
                        </h2>
                        <p className="text-lg text-surface-600 mb-8">
                            Tell us a little bit about your environment and preferences, and our advanced AI engine will match you with the perfect plant companions.
                        </p>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-surface-700">
                                <CheckCircle2 className="text-primary-500" size={20} />
                                <span>Matches based on your exact lighting conditions</span>
                            </li>
                            <li className="flex items-center gap-3 text-surface-700">
                                <CheckCircle2 className="text-primary-500" size={20} />
                                <span>Filters by your desired maintenance level</span>
                            </li>
                            <li className="flex items-center gap-3 text-surface-700">
                                <CheckCircle2 className="text-primary-500" size={20} />
                                <span>Ensures plants fit your budget</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-surface-200/50 border border-surface-100 p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-surface-900">
                            Your Preferences <Sparkles className="text-amber-400" size={20} />
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                                    <select suppressHydrationWarning name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 py-2.5 px-3 outline-none border text-surface-900 transition-colors hover:bg-surface-100">
                                        <option value="indoor">Indoor</option>
                                        <option value="outdoor">Outdoor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1">Light</label>
                                    <select suppressHydrationWarning name="light_requirement" value={formData.light_requirement} onChange={handleChange} className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 py-2.5 px-3 outline-none border text-surface-900 transition-colors hover:bg-surface-100">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1">Maintenance</label>
                                    <select suppressHydrationWarning name="maintenance_level" value={formData.maintenance_level} onChange={handleChange} className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 py-2.5 px-3 outline-none border text-surface-900 transition-colors hover:bg-surface-100">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1">Water Freq</label>
                                    <select suppressHydrationWarning name="water_frequency" value={formData.water_frequency} onChange={handleChange} className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 py-2.5 px-3 outline-none border text-surface-900 transition-colors hover:bg-surface-100">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Max Price: Rs. {formData.price}</label>
                                <input
                                    suppressHydrationWarning
                                    type="range"
                                    name="price"
                                    min="500"
                                    max="20000"
                                    step="100"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                />
                            </div>

                            <button
                                suppressHydrationWarning
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-4 rounded-xl bg-surface-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Generating Matches...</span>
                                ) : (
                                    <>
                                        Find My Matches
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    {error}
                                </motion.div>
                            )}

                            {loading && (
                                <div className="mt-8">
                                    <RecommenderSkeleton />
                                </div>
                            )}

                            {!loading && recommendations.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                                    <h4 className="font-semibold text-surface-900 mb-3 border-b border-surface-100 pb-2">Top Recommendations for You:</h4>
                                    <ul className="space-y-2">
                                        {recommendations.map((rec, i) => (
                                            <li key={i}>
                                                <Link href={`/catalog?search=${encodeURIComponent(rec.name)}`} className="flex items-center gap-3 bg-primary-50/50 p-3 rounded-xl border border-primary-100/50 hover:bg-primary-50 hover:border-primary-200 transition-colors group cursor-pointer">
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-grow flex flex-col justify-center">
                                                        <span className="font-semibold text-surface-900 capitalize leading-tight">
                                                            {rec.name}
                                                        </span>
                                                        <div className="flex items-center gap-4 mt-1.5 text-xs">
                                                            <span className="text-surface-600 font-medium">Rs. {rec.price}</span>
                                                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                                                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                                                {rec.expert_score}/5
                                                            </span>
                                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                                <Leaf size={12} className="fill-emerald-500 text-emerald-500" />
                                                                {rec.sustainability_score}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-primary-400 group-hover:text-primary-600 transition-colors shrink-0" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
