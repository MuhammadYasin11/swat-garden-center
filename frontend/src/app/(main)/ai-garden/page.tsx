import RecommendationForm from "@/components/RecommendationForm";
import { Sparkles, Sprout, Bot, ShieldCheck, Database, Award } from "lucide-react";

export default function AIGardenPage() {
    return (
        <div className="pt-20 pb-16 bg-surface-50 min-h-screen">

            {/* --- Hero Image / Intro Section --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm mb-6 shadow-sm border border-emerald-200">
                    <Sparkles size={16} />
                    Swat Garden Center Exclusive Engine
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-surface-900 tracking-tight mb-6">
                    Meet Your Personal <br /> <span className="text-emerald-600">AI Horticulturist</span>
                </h1>
                <p className="text-xl text-surface-600 max-w-3xl mx-auto leading-relaxed">
                    A revolutionary way to find the perfect plants. We've combined cutting-edge machine learning with decades of real-world agricultural expertise.
                </p>
            </div>

            {/* --- How It Works Section --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <h2 className="text-3xl font-bold text-center text-surface-900 mb-12">How Our AI Recommender Works</h2>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-0.5 bg-emerald-100 -z-10" />

                    {/* Step 1 */}
                    <div className="text-center relative bg-white p-8 rounded-3xl shadow-sm border border-surface-100">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                            <Database size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-3">1. Input Your Environment</h3>
                        <p className="text-surface-600 leading-relaxed">
                            Tell us about your space. Whether it's a sunny outdoor patio or a dimly lit office desk, the AI needs to know the exact lighting, watering schedule, and climate.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center relative bg-white p-8 rounded-3xl shadow-sm border border-surface-100">
                        <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                            <Bot size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-3">2. AI Analysis</h3>
                        <p className="text-surface-600 leading-relaxed">
                            Our proprietary algorithm scans through hundreds of plant profiles, calculating compatibility scores based on botanical science and your survival probability.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center relative bg-white p-8 rounded-3xl shadow-sm border border-surface-100">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                            <Sprout size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-3">3. Perfect Matches</h3>
                        <p className="text-surface-600 leading-relaxed">
                            Receive a tailor-made list of plant recommendations ranked by their likelihood to thrive in your exact environment, complete with sustainability scores.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- The Recommendation Form Component (Wraps in a nice container) --- */}
            <div id="ai-engine" className="scroll-mt-24 mb-24 relative">
                {/* Decorative blobs behind the engine */}
                <div className="absolute inset-0 max-w-7xl mx-auto hidden lg:block pointer-events-none">
                    <div className="absolute top-1/4 -left-12 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-[1400px] mx-auto">
                    <RecommendationForm />
                </div>
            </div>

            {/* --- Why Trust Our AI Section --- */}
            <div className="bg-emerald-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 text-emerald-300 font-medium text-sm mb-6 border border-emerald-700">
                                <ShieldCheck size={16} />
                                Expert Verified Data
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Not just code. It's powered by 15 years of <span className="text-emerald-400">Agricultural Science</span>.
                            </h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed mb-6">
                                Unlike generic plant recommendation apps that scrape basic internet data, the Swat Garden Center AI Engine is built on a proprietary dataset meticulously curated by our founder, Dr. Muhammad Zamin.
                            </p>
                            <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">
                                Every requirement, tolerance level, and sustainability score has been verified against his Ph.D. research and real-world landscaping experience in extreme climates. The AI doesn't just guess; it calculates the exact botanical parameters required for plant survival.
                            </p>

                            <div className="flex items-center gap-4 bg-emerald-800/40 p-4 rounded-2xl border border-emerald-700">
                                <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-emerald-300 shrink-0">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Ph.D. Horticultural Agriculture</div>
                                    <div className="text-sm text-emerald-300">Data model certified by Dr. Zamin</div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract visual/stats for the right side */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-800/30 p-8 rounded-3xl border border-emerald-700 text-center">
                                <div className="text-5xl font-extrabold text-emerald-400 mb-2">200+</div>
                                <div className="text-emerald-100 font-medium">Unique Plant Genomes</div>
                            </div>
                            <div className="bg-emerald-800/30 p-8 rounded-3xl border border-emerald-700 text-center translate-y-8">
                                <div className="text-5xl font-extrabold text-emerald-400 mb-2">10k+</div>
                                <div className="text-emerald-100 font-medium">Calculations per Search</div>
                            </div>
                            <div className="bg-emerald-800/30 p-8 rounded-3xl border border-emerald-700 text-center">
                                <div className="text-5xl font-extrabold text-emerald-400 mb-2">✓</div>
                                <div className="text-emerald-100 font-medium">Climate Calibrated</div>
                            </div>
                            <div className="bg-emerald-800/30 p-8 rounded-3xl border border-emerald-700 text-center translate-y-8">
                                <div className="text-5xl font-extrabold text-emerald-400 mb-2">98%</div>
                                <div className="text-emerald-100 font-medium">Survival Rate Match</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
