"use client";

import { Leaf, ShoppingBag, Menu, X, User, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Catalog", href: "/catalog" },
        { name: "AI Garden", href: "/ai-garden" },
        { name: "About Us", href: "/about" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-200 py-3"
                : "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/50 py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center p-0.5 shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Swat Garden Center Logo"
                                fill
                                className="object-contain mix-blend-multiply contrast-[2.0] brightness-[1.2] opacity-90 p-1"
                            />
                        </div>
                        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 hidden sm:block whitespace-nowrap">
                            Swat<span className="text-emerald-600 font-light ml-1">Garden</span><span className="text-emerald-800 font-semibold ml-1">Center</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <ul className="flex space-x-1 bg-slate-100/50 backdrop-blur-sm px-1.5 py-1 rounded-full border border-slate-200/50">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${isActive
                                                ? "text-emerald-800 bg-white shadow-sm"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Actions Section */}
                    <div className="flex items-center gap-1.5 sm:gap-3 text-slate-600">
                        <Link href="/admin/login" className="p-2.5 rounded-full hover:bg-slate-100/80 hover:text-emerald-600 transition-colors flex items-center justify-center">
                            <User size={20} strokeWidth={2} />
                        </Link>
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2.5 rounded-full hover:bg-slate-100/80 hover:text-emerald-600 transition-colors flex items-center justify-center"
                        >
                            <ShoppingBag size={20} strokeWidth={2} />
                            {totalItems > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            suppressHydrationWarning 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ml-1 sm:ml-2 relative z-50 flex items-center justify-center"
                        >
                            <Menu size={24} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Backdrop & Drawer */}
            <div 
                className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                {/* Backdrop effect */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* 80% Width Side Drawer - FIXED HEIGHT (m-0, h-[100dvh]) */}
                <div 
                    className={`absolute top-0 right-0 h-[100dvh] w-[85%] sm:w-80 bg-white shadow-2xl flex flex-col justify-between overflow-hidden transform transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* SECTION 1: Drawer Header (Logo + Close X) */}
                    <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
                            <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 rounded-full flex items-center justify-center p-0.5 shrink-0 border border-emerald-100">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain mix-blend-multiply opacity-90 p-1" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900">
                                Swat<span className="text-emerald-600 font-light ml-1">Garden</span>
                            </span>
                        </Link>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X size={28} strokeWidth={2} />
                        </button>
                    </div>

                    {/* SECTION 2: Drawer Navigation Links */}
                    <nav className="flex-1 flex flex-col justify-center py-4">
                        <ul className="flex flex-col space-y-1 sm:space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-6 sm:px-8 py-2.5 sm:py-3 text-xl sm:text-2xl font-medium transition-all duration-200 border-l-4 ${
                                                isActive 
                                                    ? "text-emerald-700 border-emerald-500 bg-emerald-50/50" 
                                                    : "text-slate-700 border-transparent hover:text-emerald-600 hover:bg-slate-50 hover:border-slate-200"
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* SECTION 3: Drawer Footer / Branding */}
                    <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 shrink-0 mt-auto">
                        <div className="flex flex-col gap-2 text-slate-500 text-xs sm:text-[13px]">
                            <p className="flex items-center gap-2"><span className="text-emerald-600 text-base">📍</span> Qambar Bypass Road, Mingora</p>
                            <p className="flex items-center gap-2"><span className="text-emerald-600 text-base">📞</span> 923463330981</p>
                            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
                                <a href="https://wa.me/923463330981" target="_blank" rel="noopener noreferrer" className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} className="opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" />
                                </a>
                                <a href="https://www.tiktok.com/@swatgardencentre?_r=1&_t=ZS-94JAGA034QH" target="_blank" rel="noopener noreferrer" className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Image src="/tiktok.svg" alt="TikTok" width={16} height={16} className="opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" />
                                </a>
                                <a href="https://www.facebook.com/share/1Df1eLaHJj/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </header>
    );
}
