"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. Send credentials to FastAPI (OAuth2 expects form data, not JSON)
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch("http://https://swat-garden-center.onrender.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Invalid admin credentials");
            }

            const data = await response.json();

            // 2. Store the JWT securely
            // For a production app, use HTTP-only cookies. 
            // For this local prototype, localStorage is acceptable to get started.
            localStorage.setItem("admin_token", data.access_token);

            // 3. Redirect to the Admin Dashboard
            router.push("/admin/dashboard");

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Box - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-slate-900/20 z-10" />
                {/* Fallback to normal img or next/image as requested by standard aesthetics */}
                <img
                    src="https://images.unsplash.com/photo-1466692476877-3f2603f9dcbd?auto=format&fit=crop&w=1920&q=80"
                    alt="Lush green Monstera plants"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />

                <div className="absolute bottom-12 left-12 z-20 max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Cultivate a smarter garden space.
                    </h2>
                    <p className="text-lg text-slate-200">
                        Manage inventory, monitor health, and access advanced AI insights designed for premium plant care.
                    </p>
                </div>
            </div>

            {/* Right Box - Form Section */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <div className="mx-auto md:mx-0 w-[120px] h-[120px] mb-6 relative bg-white rounded-full shadow-sm border border-slate-100 p-2 flex items-center justify-center">
                            <img src="/logo.png" alt="Swat Garden Center Logo" className="w-full h-full object-contain mix-blend-multiply contrast-[2.0] brightness-[1.2]" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Admin Portal</h1>
                        <p className="text-base text-slate-500">
                            Enter your credentials to manage Swat Garden AI.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-xs">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-xs">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
                            suppressHydrationWarning
                        >
                            Sign In to Dashboard
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            Need help? Contact system administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
