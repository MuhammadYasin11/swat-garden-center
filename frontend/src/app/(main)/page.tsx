import Hero from "@/components/Hero";
import PlantCatalog from "@/components/PlantCatalog";
import RecommendationForm from "@/components/RecommendationForm";
import { Sparkles, Leaf } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>

      {/* 1. Hero Section (Welcome) */}
      <Hero />

      {/* 2. Landscaping Services */}
      <section className="py-24 bg-surface-50 relative overflow-hidden border-b border-surface-100">
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide">
                <Sparkles size={16} />
                <span>Professional Services</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 tracking-tight">
                Transform Your Outdoors with <span className="text-emerald-600">Expert Landscaping</span>
              </h2>

              <p className="text-lg text-surface-600 leading-relaxed">
                We're more than just a garden center. Our team of experienced horticulturists and landscape designers can turn any outdoor space into a lush, thriving ecosystem. From residential gardens to large commercial installations, we bring the same data-driven, sustainable approach to our landscaping services.
              </p>

              <ul className="space-y-4">
                {[
                  "Custom Garden Design & Installation",
                  "Smart Irrigation Systems",
                  "Sustainable Hardscaping",
                  "Seasonal Maintenance Plans",
                  "Installing grass in your homes"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-surface-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Contact Our Designers
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Beautiful lush garden landscaping with manicured plants and a scenic path"
                  className="w-full h-full object-cover shrink-0"
                />
              </div>
              {/* Decorative background block */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-emerald-50 rounded-[2rem] -z-10 transform rotate-3" />

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 animate-float border border-surface-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-900">Fast Execution</h4>
                    <p className="text-sm text-surface-500">From design to reality</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. AI Recommender Section */}
      <section className="py-24 bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 tracking-tight mb-4">
            Discover Your <span className="text-emerald-600">Perfect Match</span>
          </h2>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Answer a few quick questions about your space, and our AI will calculate the precise
            botanical parameters to recommend plants guaranteed to thrive.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <RecommendationForm />
        </div>
      </section>

      {/* 4. Why Buy From Us */}
      <section className="py-24 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900 tracking-tight text-center mb-12">
            Why Buy From <span className="text-emerald-600">Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-surface-50 border border-surface-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-bold text-surface-900 mb-2">Premium Quality</h3>
              <p className="text-surface-600 text-sm">Hand-picked plants and expert-verified products for lasting beauty.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-surface-50 border border-surface-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-surface-900 mb-2">Fast Delivery</h3>
              <p className="text-surface-600 text-sm">Secure packaging and prompt delivery to your doorstep.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-surface-50 border border-surface-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="font-bold text-surface-900 mb-2">Expert Support</h3>
              <p className="text-surface-600 text-sm">AI recommendations and horticulturist guidance when you need it.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-surface-50 border border-surface-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <h3 className="font-bold text-surface-900 mb-2">Sustainable Approach</h3>
              <p className="text-surface-600 text-sm">Eco-friendly practices and economical solutions for your garden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Catalog Section */}
      <section className="py-24 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex justify-center items-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-6 border border-primary-100 shadow-sm">
            <Leaf size={24} />
          </div>
          <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight mb-4">
            Curated Collection
          </h2>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto mb-8">
            Browse our premium selection of indoor and outdoor plants, hand-picked for their resilience and beauty. We have hundreds of rare and popular varieties waiting for you!
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Full Catalog &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
