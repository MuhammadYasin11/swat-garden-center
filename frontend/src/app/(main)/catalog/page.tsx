import PlantCatalog from "@/components/PlantCatalog";
import { Leaf } from "lucide-react";

export default function CatalogPage() {
    return (
        <div className="pt-24 pb-16 bg-surface-50 min-h-screen relative overflow-hidden">
            {/* Decorative background blobs to fill empty space */}
            <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none flex justify-between z-0">
                <div className="w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4" />
                <div className="w-96 h-96 bg-amber-100/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm border border-emerald-200">
                    <Leaf size={32} strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-surface-900 tracking-tight mb-4">
                    Explore Our <span className="text-emerald-600">Curated Catalog</span>
                </h1>
                <p className="text-lg md:text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed">
                    Browse our complete selection of premium plants. Use the filters below to find exactly what you're looking for to complete your perfect space.
                </p>
            </div>

            <div className="relative z-10">
                <PlantCatalog />
            </div>
        </div>
    );
}
