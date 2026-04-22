"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Plant } from "@/components/PlantCard";

interface CartItem extends Plant {
    cart_quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (plant: Plant, imageUrl: string) => void;
    removeFromCart: (plantName: string) => void;
    clearCart: () => void;
    incrementItem: (plantName: string) => void;
    decrementItem: (plantName: string) => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem("swat_garden_cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("swat_garden_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isMounted]);

    const addToCart = (plant: Plant, imageUrl: string) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.name === plant.name);
            if (existing) {
                return prev.map((item) =>
                    item.name === plant.name
                        ? { ...item, cart_quantity: item.cart_quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...plant, image_url: imageUrl, cart_quantity: 1 }];
        });
    };

    const incrementItem = (plantName: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.name === plantName
                    ? { ...item, cart_quantity: item.cart_quantity + 1 }
                    : item
            )
        );
    };

    const decrementItem = (plantName: string) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.name === plantName
                        ? { ...item, cart_quantity: item.cart_quantity - 1 }
                        : item
                )
                .filter((item) => item.cart_quantity > 0)
        );
    };

    const removeFromCart = (plantName: string) => {
        setCartItems((prev) => prev.filter((item) => item.name !== plantName));
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.cart_quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.cart_quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                incrementItem,
                decrementItem,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
