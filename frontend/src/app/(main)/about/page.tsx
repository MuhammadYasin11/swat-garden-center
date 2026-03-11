import { Leaf, Award, Users, Heart, Phone, Video, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="pb-24">
            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Cultivating Beautiful Spaces
                    </h1>
                    <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                        At Swat Garden Center, we believe that bringing nature indoors shouldn't be a guessing game.
                        We combine horticultural expertise with advanced AI to ensure every plant finds its perfect home.
                    </p>
                </div>
            </section>

            {/* Our Story & Founder Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left Column: Our Story */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-px bg-emerald-600 w-12"></div>
                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">About Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 mb-8 tracking-tight">
                            Our Story
                        </h2>
                        <div className="space-y-6 text-surface-600 leading-relaxed text-lg">
                            <p>
                                Founded by a team of passionate horticulturist and technical enthusiasts, Swat Garden Center was born from a simple observation: too many beautiful plants die because they are placed in the wrong environment and poor maintenance practices.
                            </p>
                            <p>
                                We realized that by leveraging data and artificial intelligence, we could bridge the knowledge gap between expert horticulturists and everyday plant lovers.
                            </p>
                            <p>
                                Today, our AI-powered recommendation engine has helped thousands of customers build thriving indoor plantation that perfectly match their lighting, schedule, and lifestyle. We also offer design and development supervision of landscape/agriculture projects, play grounds, parks, towns and streets plantation with international experienced professionals.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: CEO Profile */}
                    <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 z-0"></div>

                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-surface-200/50 border border-surface-100 relative z-10">
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-8">
                                <div className="shrink-0">
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-emerald-50 shadow-md">
                                        <Image
                                            src="/ceo.png"
                                            alt="Dr. Muhammad Zamin - Founder & CEO"
                                            fill
                                            className="object-cover object-top"
                                            sizes="160px"
                                        />
                                    </div>
                                </div>
                                <div className="text-center sm:text-left mt-2 sm:mt-4">
                                    <h3 className="text-2xl font-bold text-surface-900">Dr. Muhammad Zamin</h3>
                                    <p className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mt-1">Founder & CEO</p>
                                    <p className="text-surface-500 text-sm mt-2 italic border-l-2 border-emerald-200 pl-3">
                                        Ph.D. in Horticulture <br />
                                        15+ Years UAE Landscape Engineer
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-surface-600 leading-relaxed text-[15px]">
                                <p>
                                    As the visionary driving Swat Garden Center, Dr. Muhammad Zamin brings forth a remarkable blend of profound botanical mastery and an innovative Garden Designs.
                                </p>
                                <p>
                                    His extensive experience has instilled a deep understanding of plant resilience, specific environmental needs, and sustainable care practices. This rich background enables us to perfectly bridge traditional agricultural science with state-of-the-art, AI-powered plants and garden elements recommendations, ensuring every customer finds the ideal green companion.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Connect With Us Section */}
            <section className="py-20 bg-surface-50 border-t border-surface-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-surface-900 mb-4">Let's Stay Connected</h2>
                        <p className="text-lg text-surface-600">
                            Join our growing community of plant lovers. Reach out to us for expert advice, updates, and more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <Link
                            href="https://wa.me/923463330981"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-sm border border-surface-100 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                <Image src="/whatsapp.svg" alt="WhatsApp Logo" width={32} height={32} className="text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-emerald-700 transition-colors">WhatsApp</h3>
                            <span className="text-surface-500 font-medium group-hover:text-emerald-600 transition-colors">
                                +92 346 3330981
                            </span>
                        </Link>

                        <Link
                            href="https://www.tiktok.com/@swatgardencentre?_r=1&_t=ZS-94JAGA034QH"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-sm border border-surface-100 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                <Image src="/tiktok.svg" alt="TikTok Logo" width={32} height={32} className="text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-emerald-700 transition-colors">TikTok</h3>
                            <span className="text-surface-500 font-medium group-hover:text-emerald-600 transition-colors text-center">
                                @swatgardencentre
                            </span>
                        </Link>

                        <Link
                            href="https://www.facebook.com/share/1Df1eLaHJj/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-sm border border-surface-100 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                <Facebook className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-emerald-700 transition-colors">Facebook</h3>
                            <span className="text-surface-500 font-medium group-hover:text-emerald-600 transition-colors text-center">
                                Swat Garden Center
                            </span>
                        </Link>
                    </div>

                    {/* Contact Details */}
                    <div className="max-w-4xl mx-auto mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-surface-200 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6 shadow-sm border border-emerald-100">
                            <Phone size={28} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight mb-8">Contact Us</h2>

                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Location</h4>
                                    <p className="text-surface-800 font-semibold text-lg leading-snug">
                                        SWAT GARDEN CENTER <br />
                                        <span className="text-surface-500 font-normal text-base mt-1 block">
                                            (NURSERY AND LANDSCAPING)
                                        </span>
                                    </p>
                                    <p className="text-surface-600 mt-2 leading-relaxed">
                                        Located at Qambar Bypass Road,<br />
                                        Near General Bus Station,<br />
                                        Mingora, Swat
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 md:border-l border-surface-200 md:pl-8">
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Direct Contact</h4>
                                    <p className="text-surface-800 font-medium text-lg">+92-348-1905741</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Digital</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <span className="text-surface-400 font-medium w-16">Website:</span>
                                            <a href="https://swatgardencenter.com" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                                swatgardencenter.com
                                            </a>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-surface-400 font-medium w-16">Email:</span>
                                            <div className="flex flex-col gap-1">
                                                <a href="mailto:info@swatgardencenter.com" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                                    info@swatgardencenter.com
                                                </a>
                                                <a href="mailto:swatgardencentre@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                                    swatgardencentre@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-surface-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-surface-900 mb-16">Why Choose Us</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Leaf className="text-emerald-600" size={32} />, title: "Premium Quality", desc: "Every plant is hand-inspected for pests and diseases before leaving our greenhouse." },
                            { icon: <Award className="text-emerald-600" size={32} />, title: "Expert Curated", desc: "Our catalog features only the most resilient and beautiful species available." },
                            { icon: <Users className="text-emerald-600" size={32} />, title: "AI-Powered", desc: "Our intelligent engine ensures you only buy plants that will thrive in your home." },
                            { icon: <Heart className="text-emerald-600" size={32} />, title: "Lifetime Support", desc: "We provide ongoing care instructions and support for every plant we sell." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100 text-center hover:shadow-lg transition-shadow">
                                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-surface-900 mb-3">{feature.title}</h3>
                                <p className="text-surface-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

