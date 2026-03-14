"use client";

import { Leaf, ShoppingBag, Menu, X, User } from "lucide-react";
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
                            <p className="flex items-center gap-2"><span className="text-emerald-600 text-base">📍</span> Main Swat Road, Mingora</p>
                            <p className="flex items-center gap-2"><span className="text-emerald-600 text-base">📞</span> +92 300 1234567</p>
                            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
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
