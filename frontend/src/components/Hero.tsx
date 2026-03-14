"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative pt-20 pb-20 lg:pt-24 lg:pb-28 overflow-hidden flex flex-col items-center text-center bg-gradient-to-br from-emerald-50 via-surface-50 to-white z-10">
            {/* The background color matches the catalog section, with dim green glows on both sides that fade out smoothly at all edges */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div
                    className="absolute top-[10%] -left-[5%] w-[600px] h-[600px] bg-emerald-200 opacity-[0.4] blur-[100px] rounded-full"
                    style={{
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                    }}
                ></div>
                <div
                    className="absolute top-[10%] -right-[5%] w-[600px] h-[600px] bg-emerald-200 opacity-[0.4] blur-[100px] rounded-full"
                    style={{
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                    }}
                ></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center w-full"
                >
                    <h1 className="text-3xl sm:text-[40px] lg:text-[46px] font-[900] tracking-tight mb-5 w-full text-center sm:whitespace-nowrap leading-tight">
                        <span className="text-[#0d1b2a] block sm:inline">Welcome to </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a859] to-emerald-400 drop-shadow-sm pb-1 block sm:inline">Swat Garden Center</span>
                    </h1>

                    <p className="text-[17px] md:text-[20px] text-[#4b5563] leading-[1.6] font-normal mx-auto">
                        Where you can find landscape, irrigation and gardening solutions under
                        <br className="hidden md:block" />
                        one roof with sustainable approach and more economical.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
