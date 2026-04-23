"use client";

import { useState, useEffect } from "react";
import PlantCard, { Plant } from "./PlantCard";
import { Loader2, AlertCircle, Search, Filter } from "lucide-react";
import CatalogSkeleton from "./CatalogSkeleton";

interface PlantCatalogProps {
    limit?: number;
}

interface ExtendedPlant extends Plant {
    light_requirement?: string;
    maintenance_level?: string;
}

export default function PlantCatalog({ limit }: PlantCatalogProps = {}) {
    const [plants, setPlants] = useState<ExtendedPlant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"plants" | "tools">("plants");
    const [filters, setFilters] = useState({
        maxPrice: "" as string | number,
        light: "",
        type: "",
        maintenance: "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const [gardeningTools, setGardeningTools] = useState<Plant[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const search = params.get("search");
            if (search) setSearchQuery(search);
        }
    }, []);

    useEffect(() => {
        async function fetchCatalogData() {
            try {
                const [plantsRes, toolsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/plants`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/tools`)
                ]);

                if (!plantsRes.ok || !toolsRes.ok) {
                    throw new Error("Failed to fetch catalog data");
                }

                const [plantsData, toolsData] = await Promise.all([
                    plantsRes.json(),
                    toolsRes.json()
                ]);

                setPlants(plantsData.plants);

                const formattedTools = toolsData.tools.map((t: any) => ({
                    ...t,
                    name: t.name
                }));
                setGardeningTools(formattedTools);

            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchCatalogData();
    }, []);

    if (loading) {
        return <CatalogSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500 bg-red-50 rounded-3xl m-8 py-12">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="font-medium text-lg mb-2">Failed to load plants!</p>
                <p className="text-sm text-red-400">Please make sure the FastAPI server is running on localhost:8000</p>
            </div>
        );
    }

    const baseData = activeTab === "plants" ? plants : gardeningTools;

    let displayedItems = baseData.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.type || "").toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === "plants" && item && "light_requirement" in item) {
            const p = item as ExtendedPlant;
            if (filters.maxPrice && Number(p.price) > Number(filters.maxPrice)) return false;
            if (filters.light && (p.light_requirement || "").toLowerCase() !== filters.light.toLowerCase()) return false;
            if (filters.type && (p.type || "").toLowerCase() !== filters.type.toLowerCase()) return false;
            if (filters.maintenance && (p.maintenance_level || "").toLowerCase() !== filters.maintenance.toLowerCase()) return false;
        }

        return true;
    });

    if (limit) displayedItems = displayedItems.slice(0, limit);

    const uniqueTypes = [...new Set(plants.map((p: ExtendedPlant) => (p.type || "").toLowerCase()).filter(Boolean))].sort();
    const uniqueLight = [...new Set(plants.map((p: ExtendedPlant) => (p.light_requirement || "").toLowerCase()).filter(Boolean))].sort();
    const uniqueMaintenance = [...new Set(plants.map((p: ExtendedPlant) => (p.maintenance_level || "").toLowerCase()).filter(Boolean))].sort();

    return (
        <section className="py-20 lg:py-28 bg-surface-50 border-t border-surface-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div>
                        <h2 className="text-4xl font-extrabold text-surface-900 mb-4 tracking-tight">
                            {activeTab === "plants" ? "Our Plant Collection" : "Gardening Items"}
                        </h2>
                        <p className="text-lg text-surface-600 max-w-2xl leading-relaxed">
                            {activeTab === "plants"
                                ? "Browse through our handpicked selection of premium plants. From lush indoor beauties to resilient succulents, find the perfect addition to your space."
                                : "Discover high-quality tools and essentials designed to keep your garden and indoor plants thriving year-round."
                            }
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        {activeTab === "plants" && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-surface-200 text-surface-600 hover:border-surface-300"}`}
                            >
                                <Filter size={18} />
                                Filters
                            </button>
                        )}
                        <div className="relative flex-1 md:min-w-[280px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-surface-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={activeTab === "plants" ? "Search plants by name..." : "Search items by name..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl leading-5 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {activeTab === "plants" && showFilters && (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-surface-200 shadow-sm flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-xs font-medium text-surface-500 mb-1">Max Price (Rs.)</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                                className="w-28 rounded-lg border border-surface-200 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-500 mb-1">Light</label>
                            <select
                                value={filters.light}
                                onChange={(e) => setFilters(f => ({ ...f, light: e.target.value }))}
                                className="rounded-lg border border-surface-200 px-3 py-2 text-sm min-w-[120px]"
                            >
                                <option value="">All</option>
                                {uniqueLight.map(t => (
                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-500 mb-1">Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                                className="rounded-lg border border-surface-200 px-3 py-2 text-sm min-w-[120px]"
                            >
                                <option value="">All</option>
                                {uniqueTypes.map(t => (
                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-500 mb-1">Maintenance</label>
                            <select
                                value={filters.maintenance}
                                onChange={(e) => setFilters(f => ({ ...f, maintenance: e.target.value }))}
                                className="rounded-lg border border-surface-200 px-3 py-2 text-sm min-w-[120px]"
                            >
                                <option value="">All</option>
                                {uniqueMaintenance.map(t => (
                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ maxPrice: "", light: "", type: "", maintenance: "" })}
                            className="text-sm font-medium text-surface-500 hover:text-emerald-600"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Tabs / Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-surface-200/50 p-1.5 rounded-full">
                        <button
                            onClick={() => { setActiveTab("plants"); setSearchQuery(""); setFilters({ maxPrice: "", light: "", type: "", maintenance: "" }); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "plants"
                                ? "bg-white text-emerald-600 shadow-sm border border-emerald-100/50"
                                : "text-surface-500 hover:text-surface-700"
                                }`}
                        >
                            Plants
                        </button>
                        <button
                            onClick={() => { setActiveTab("tools"); setSearchQuery(""); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "tools"
                                ? "bg-white text-emerald-600 shadow-sm border border-emerald-100/50"
                                : "text-surface-500 hover:text-surface-700"
                                }`}
                        >
                            Gardening Items
                        </button>
                    </div>
                </div>

                {displayedItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-surface-100 shadow-sm">
                        <p className="text-surface-500 text-lg">No items found matching <span className="font-semibold text-surface-800">"{searchQuery}"</span>.</p>
                        <button onClick={() => setSearchQuery("")} className="mt-4 text-primary-600 font-medium hover:text-primary-700">Clear search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedItems.map((item, idx) => (
                            <PlantCard key={`${item.name}-${idx}`} plant={item} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
