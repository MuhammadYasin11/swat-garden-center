"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const INTRO_STORAGE_KEY = "swat_garden_intro_shown";
const INTRO_HOLD_MS = 2600;

interface StartAnimationProps {
  children: React.ReactNode;
}

export default function StartAnimation({ children }: StartAnimationProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const alreadyShown = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (alreadyShown) {
      setIntroComplete(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      setIntroComplete(true);
    }, INTRO_HOLD_MS);
    return () => clearTimeout(t);
  }, [mounted]);

  useEffect(() => {
    if (introComplete) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    } else {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [introComplete]);

  const showIntro = mounted && !introComplete;

  return (
    <>
      {mounted && (
        <AnimatePresence mode="wait">
          {showIntro && (
            <motion.div
              key="intro-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c1912] overflow-hidden"
            >
              {/* Premium gradient mesh background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_80%,rgba(5,150,105,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_70%,rgba(20,184,166,0.06),transparent_50%)]" />
              </div>

              {/* Floating orb - slow drift */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-[320px] h-[320px] rounded-full bg-emerald-500/10 blur-[100px]"
                animate={{
                  x: [0, 24, 0],
                  y: [0, -16, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/4 w-[280px] h-[280px] rounded-full bg-teal-500/10 blur-[80px]"
                animate={{
                  x: [0, -20, 0],
                  y: [0, 12, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-lg">
                {/* Logo with ring */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mb-8"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border border-emerald-500/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1.35, opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl shadow-black/20 ring-1 ring-white/5">
                    <Image
                      src="/logo.png"
                      alt="Swat Garden Center"
                      width={96}
                      height={96}
                      className="w-14 h-14 md:w-16 md:h-16 object-contain opacity-95"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Title with staggered reveal */}
                <div className="overflow-hidden mb-2">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white"
                  >
                    Swat{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 font-extrabold">
                      Garden Center
                    </span>
                  </motion.h1>
                </div>

                {/* Underline accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent origin-center mb-6"
                />

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                  className="text-xs md:text-sm uppercase tracking-[0.3em] text-emerald-400/90 font-medium mb-10"
                >
                  Landscape · Irrigation · Gardening
                </motion.p>

                {/* Progress bar */}
                <motion.div
                  className="h-0.5 w-40 rounded-full bg-white/10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: (INTRO_HOLD_MS - 800) / 1000,
                      delay: 0.8,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`min-h-screen flex flex-col ${!introComplete ? "bg-[#0c1912]" : ""}`}
        style={{
          visibility: introComplete ? "visible" : "hidden",
          pointerEvents: introComplete ? "auto" : "none",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
