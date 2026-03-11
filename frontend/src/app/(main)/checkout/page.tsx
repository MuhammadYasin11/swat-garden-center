"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Lock, ArrowLeft, CreditCard, Leaf, Banknote, Truck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const { cartItems, totalPrice, clearCart } = useCart();

    const urlPlant = searchParams.get("plant");
    const urlPrice = searchParams.get("price");
    const urlImage = searchParams.get("image");
    const isQuickBuy = !!urlPlant && !!urlPrice;

    let displayName = "Beautiful Plant";
    let displayImage = "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&q=80";
    let subtotal = 0;
    let itemsDescription = "Beautiful Plant";

    if (isQuickBuy) {
        const priceNum = parseInt(urlPrice || "0", 10) || 0;
        displayName = urlPlant || displayName;
        displayImage = urlImage || displayImage;
        subtotal = priceNum;
        itemsDescription = displayName;
    } else if (cartItems.length > 0) {
        subtotal = totalPrice;
        if (cartItems.length === 1) {
            displayName = cartItems[0].plant_name;
            displayImage = cartItems[0].image_url || displayImage;
        } else {
            displayName = `${cartItems.length} items in cart`;
            displayImage = cartItems[0].image_url || displayImage;
        }
        itemsDescription = cartItems
            .map((item) => `${item.plant_name} x${item.cart_quantity}`)
            .join(", ");
    }

    const [isClient, setIsClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [address, setAddress] = useState("");

    const shipping = 150;
    const total = subtotal + shipping;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                whatsapp: whatsapp,
                address: address,
                total_amount: total,
                items: itemsDescription
            };

            const response = await fetch("http://127.0.0.1:8000/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setIsSuccess(true);
                if (!isQuickBuy) {
                    clearCart();
                }
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isClient) return null;

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 md:p-14 rounded-3xl shadow-2xl shadow-primary-900/10 border border-surface-100 max-w-xl w-full text-center"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Order Confirmed!</h2>
                    <p className="text-lg text-surface-600 mb-8">
                        Thank you for your purchase. Your <span className="font-semibold text-surface-900">{displayName}</span> is being prepared and will be shipped securely to your beautiful space.
                    </p>
                    <Link href={"/catalog"} className="inline-block w-full py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg">
                        Continue Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }



    return (
        <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors font-medium mb-10">
                <ArrowLeft size={18} /> Back to Catalog
            </Link>

            <div className="grid lg:grid-cols-12 gap-12 items-start">

                {/* Left Column: Form Elements */}
                <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-100">
                        <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm">1</span>
                            Shipping Details
                        </h2>

                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5">First Name</label>
                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 focus:bg-white text-surface-900 placeholder-surface-400 py-3 px-4 outline-none border transition-colors hover:bg-white" placeholder="Jane" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5">Last Name</label>
                                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 focus:bg-white text-surface-900 placeholder-surface-400 py-3 px-4 outline-none border transition-colors hover:bg-white" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 focus:bg-white text-surface-900 placeholder-surface-400 py-3 px-4 outline-none border transition-colors hover:bg-white" placeholder="jane@example.com" />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">WhatsApp Number</label>
                            <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 focus:bg-white text-surface-900 placeholder-surface-400 py-3 px-4 outline-none border transition-colors hover:bg-white" placeholder="+92 300 1234567" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Delivery Address</label>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full rounded-xl border-surface-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-surface-50 focus:bg-white text-surface-900 placeholder-surface-400 py-3 px-4 outline-none border transition-colors hover:bg-white" placeholder="123 Garden Avenue" />
                        </div>

                        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mt-6">
                            <h4 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-600" />
                                Delivery Arrangement
                            </h4>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Please note: To arrange specific delivery times or special handling for your plants/tools, please contact the nursery directly after placing your order:
                            </p>
                            <div className="mt-2 text-amber-900 font-medium text-sm flex gap-4">
                                <a href="tel:03481905741" className="hover:underline flex items-center gap-1">📞 0348-1905741</a>
                                <a href="tel:03463330981" className="hover:underline flex items-center gap-1">📞 0346-3330981</a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[100px] -z-10"></div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h2>

                        <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-200 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <input type="radio" defaultChecked className="w-5 h-5 accent-primary-600" />
                                    <span className="font-semibold text-surface-900">Cash on Delivery (COD)</span>
                                </div>
                                <div className="flex gap-2 text-primary-600">
                                    <Banknote size={24} />
                                </div>
                            </div>

                            <p className="text-sm text-surface-600 pl-8 leading-relaxed">
                                Pay with cash upon delivery of your order. Please make sure you have the exact amount available when the delivery agent arrives.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl bg-surface-950 text-white font-bold tracking-wide hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Processing Order...</span>
                            ) : (
                                <>
                                    <Truck size={18} className="text-white/70" />
                                    Place Order - Rs. {total}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-surface-900 rounded-3xl p-8 shadow-2xl text-white sticky top-28">
                        <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

                        <div className="flex gap-4 pb-8 border-b border-surface-800">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 shrink-0">
                                <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className="font-semibold text-lg line-clamp-2">{displayName}</h3>
                                <p className="text-surface-400 text-sm mt-1">Premium Quality Plant</p>
                                <span className="font-bold text-primary-400 mt-2">Rs. {subtotal}</span>
                            </div>
                        </div>

                        <div className="py-8 space-y-4 border-b border-surface-800">
                            <div className="flex justify-between text-surface-300">
                                <span>Subtotal</span>
                                <span className="text-white">Rs. {subtotal}</span>
                            </div>
                            <div className="flex justify-between text-surface-300">
                                <span>Expert Packaging & Shipping</span>
                                <span className="text-white">Rs. {shipping}</span>
                            </div>
                            <div className="flex justify-between text-surface-300">
                                <span>Taxes</span>
                                <span className="text-white text-sm">Calculated at next step</span>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="flex justify-between items-end mb-8">
                                <div className="font-semibold text-surface-300">Total</div>
                                <div className="text-3xl font-extrabold text-white">Rs. {total}</div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 flex gap-3 text-sm text-surface-300">
                                <Leaf className="text-primary-400 shrink-0" size={20} />
                                <p>Every order includes our 30-day "Thrive Guarantee" and a detailed digital care handbook.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-surface-500">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="font-medium animate-pulse">Loading secure checkout...</p>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
