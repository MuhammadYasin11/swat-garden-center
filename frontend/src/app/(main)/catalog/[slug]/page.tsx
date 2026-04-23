"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star, Leaf, Droplets, Sun, Wrench } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Plant } from "@/components/PlantCard";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [plant, setPlant] = useState<(Plant & { light_requirement?: string; maintenance_level?: string; water_frequency?: string }) | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchPlants() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/plants`);
        if (!res.ok) return;
        const data = await res.json();
        const found = data.plants.find((p: any) => slugify(p.name) === slug);
        setPlant(found || null);
        if (found?.image_url) {
          setImageUrl(found.image_url);
        } else if (found) {
          const terms = encodeURIComponent(`${found.name} plant ${found.type}`.toLowerCase().replace(/ /g, ","));
          setImageUrl(`https://source.unsplash.com/600x600/?${terms}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, [slug]);

  const handleAddToCart = () => {
    if (!plant) return;
    addToCart(plant, imageUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse w-full max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-surface-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-surface-200 rounded" />
              <div className="h-6 w-1/2 bg-surface-100 rounded" />
              <div className="h-6 w-full bg-surface-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4">
        <p className="text-center text-surface-600 mb-6">Plant not found.</p>
        <Link href="/catalog" className="text-emerald-600 font-medium hover:underline">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-emerald-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-surface-200 shadow-lg">
            <img
              src={imageUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80";
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase">
                {plant.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-200 text-surface-700 text-xs font-medium capitalize">
                {plant.type}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">{plant.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <Star size={18} className="fill-amber-500 text-amber-500" />
                {plant.expert_score}/5
              </span>
              <span className={`text-sm font-medium ${plant.stock_quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {plant.stock_quantity > 0 ? `${plant.stock_quantity} in stock` : "Out of stock"}
              </span>
            </div>
            <p className="text-4xl font-bold text-emerald-600 mb-8">Rs. {plant.price}</p>

            {(plant as any).light_requirement && (
              <div className="flex items-center gap-3 mb-3 text-surface-600">
                <Sun size={18} className="text-amber-500" />
                <span>Light: <span className="font-medium capitalize">{(plant as any).light_requirement}</span></span>
              </div>
            )}
            {(plant as any).water_frequency && (
              <div className="flex items-center gap-3 mb-3 text-surface-600">
                <Droplets size={18} className="text-blue-500" />
                <span>Water: <span className="font-medium">{(plant as any).water_frequency}</span></span>
              </div>
            )}
            {(plant as any).maintenance_level && (
              <div className="flex items-center gap-3 mb-6 text-surface-600">
                <Wrench size={18} className="text-slate-500" />
                <span>Maintenance: <span className="font-medium capitalize">{(plant as any).maintenance_level}</span></span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={plant.stock_quantity === 0}
                className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <Link
                href={`/checkout?plant=${encodeURIComponent(plant.name)}&price=${plant.price}&image=${encodeURIComponent(imageUrl)}`}
                className="flex-1 px-6 py-4 rounded-xl border-2 border-emerald-600 text-emerald-600 font-semibold flex items-center justify-center hover:bg-emerald-50 transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
