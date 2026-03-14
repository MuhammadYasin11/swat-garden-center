"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const INTRO_STORAGE_KEY = "swat_garden_intro_shown";
const INTRO_HOLD_MS = 5000; // 5 seconds total animation

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
    
    // Check if the splash screen has already been shown this session
    const alreadyShown = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (alreadyShown) {
      setIntroComplete(true);
      return;
    }

    // Set timer for the 5-second fade out
    const t = setTimeout(() => {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      setIntroComplete(true);
    }, INTRO_HOLD_MS);

    return () => clearTimeout(t);
  }, [mounted]);

  // Lock the body scrolling while the intro plays
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

  // Generate 40 random particles forming a circle (The Particle Build)
  const logoParticles = Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const distance = 150 + Math.random() * 100; // Start far away
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y, delay: Math.random() * 0.5 };
  });

  // Background Ambient Particles (Bokeh/Dust)
  const ambientParticles = Array.from({ length: 25 }).map((_, i) => ({
    width: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <>
      {mounted && (
        <AnimatePresence mode="wait">
          {showIntro && (
            <motion.div
              key="intro-overlay"
              // The Final Fade (5s+): fade to 0 opacity
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              // 1. The Void (0-1s): Start deep, solid matte forest green
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950 overflow-hidden"
            >
              {/* 3. The Vignette Effect: Darken corners to focus the glowing center */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,20,10,0.85)_100%)] z-0" />

              {/* 2. Ambient Background Particles (Drifting Dust/Bokeh) */}
              {ambientParticles.map((p, i) => (
                <motion.div
                  key={`ambient-${i}`}
                  className="absolute rounded-full bg-emerald-200/20 blur-[1px] pointer-events-none z-0"
                  style={{
                    width: p.width,
                    height: p.width,
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    x: [0, Math.random() * 50 - 25, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: p.delay,
                  }}
                />
              ))}

              <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-lg mt-0">
                
                {/* 
                  STAGE 1: The Particle Build & Reveal
                  Particles fly inward and form the logo boundaries, then fade out as the real logo fades in.
                */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-3 flex items-center justify-center">
                  
                  {/* 5. Subtle Lens Flare behind the logo mark */}
                  <motion.div
                    className="absolute h-[2px] w-[250px] md:w-[350px] bg-teal-400/80 blur-[2px] rounded-full"
                    style={{ boxShadow: "0 0 20px 5px rgba(45,212,191,0.6)" }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: [0, 1, 1], scaleX: [0, 1, 1] }}
                    transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }} // Appears right as the glow peaks
                  />

                  {/* Formatting Particles */}
                  {logoParticles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-emerald-300 rounded-full"
                      style={{ boxShadow: "0 0 8px 2px rgba(110, 231, 183, 0.8)" }} // Digital particle glow
                      initial={{ 
                        opacity: 0, 
                        x: p.x, 
                        y: p.y,
                        scale: 0
                      }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], // Fade in, hold, fade out
                        x: [p.x, 0, 0, 0],     // Fly to center
                        y: [p.y, 0, 0, 0],
                        scale: [0, 1, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        times: [0, 0.4, 0.8, 1], // 40% fly in, hold until 80%, fade out by 100%
                        delay: 0.5 + p.delay,    // Start after 0.5s Void
                        ease: "easeOut" 
                      }}
                    />
                  ))}

                  {/* 4. Sequential Reveal (Part 1): Solid logo pulses in */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center filter"
                    initial={{ opacity: 0, filter: "none", scale: 0.9 }}
                    animate={{ 
                      opacity: [0, 0, 1, 1], 
                      scale: [0.9, 0.9, 1.05, 1], // The "pulse" pop
                      // Subtle pulsating neon glow
                      filter: [
                        "drop-shadow(0 0 0px rgba(52,211,153,0))", 
                        "drop-shadow(0 0 0px rgba(52,211,153,0))", 
                        "drop-shadow(0 0 20px rgba(52,211,153,0.9))", 
                        "drop-shadow(0 0 10px rgba(52,211,153,0.6))"
                      ]
                    }}
                    transition={{ 
                      duration: 4.5,
                      times: [0, 0.55, 0.65, 1], // 0.55 of 4.5s = ~2.5s (Reveal point)
                      ease: "easeOut"
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="Swat Garden Center Silhouette"
                      width={160}
                      height={160}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-95 brightness-[2.5]" // Makes the black logo look crystal/holographic
                      priority
                    />
                  </motion.div>
                </div>

                {/* 
                  1. Vertical Compression: Tight gaps, Title and Tagline positioned closely against Logo.
                  4. Sequential Reveal (Parts 2 & 3): Timed tightly after Logo.
                */}
                <div className="overflow-hidden flex flex-col items-center justify-center gap-1.5">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }} // Slide up from bottom
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }} // Target 0.5s after Logo (2.5s -> 3.0s)
                    className="text-3xl md:text-5xl font-bold text-white whitespace-nowrap leading-tight"
                  >
                    Swat{" "}
                    <span className="text-emerald-400 font-extrabold">
                      Garden Center
                    </span>
                  </motion.h1>

                  {/* Tagline expansion with elegant tracking-in effect */}
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "0em" }}
                    animate={{ opacity: 1, letterSpacing: "0.25em" }}
                    transition={{ duration: 1.2, delay: 3.5, ease: "easeOut" }} // Target 0.5s after Title (3.0s -> 3.5s)
                    className="text-[10px] md:text-xs uppercase text-emerald-200/80 font-semibold pl-[0.25em]" // Pad left to offset center-alignment shifting when tracking increases
                  >
                    Landscape · Irrigation · Gardening
                  </motion.p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main App Content - Hidden while intro plays */}
      <motion.div
        initial={false}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`min-h-screen flex flex-col ${!introComplete ? "bg-emerald-950" : ""}`}
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
