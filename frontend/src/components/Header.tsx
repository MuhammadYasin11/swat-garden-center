"use client";

import { Leaf, ShoppingBag, Menu, User } from "lucide-react";
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
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        <Link href="/admin/login" className="p-2.5 rounded-full hover:bg-slate-100/80 hover:text-emerald-600 transition-colors hidden sm:flex items-center justify-center">
                            <User size={20} strokeWidth={2} />
                        </Link>
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2.5 rounded-full hover:bg-slate-100/80 hover:text-emerald-600 transition-colors hidden sm:flex items-center justify-center"
                        >
                            <ShoppingBag size={20} strokeWidth={2} />
                            {totalItems > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button suppressHydrationWarning className="md:hidden p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ml-2">
                            <Menu size={24} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </header>
    );
}
