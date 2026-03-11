"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, incrementItem, decrementItem, totalItems, totalPrice } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-16 pb-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-surface-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-surface-900">Cart</h2>
                <p className="text-xs text-surface-500">{totalItems} item{totalItems === 1 ? "" : "s"}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingBag className="w-12 h-12 text-surface-300 mb-4" />
                <p className="text-surface-500 font-medium mb-2">Your cart is empty</p>
                <Link
                  href="/catalog"
                  onClick={onClose}
                  className="text-emerald-600 font-semibold hover:underline text-sm"
                >
                  Browse catalog
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.plant_name}
                    className="flex gap-3 p-3 rounded-2xl bg-surface-50 border border-surface-100"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-200 shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.plant_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-400">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-surface-900 truncate">
                          {item.plant_name}
                        </p>
                        <p className="text-xs text-surface-500">
                          Rs. {item.price} × {item.cart_quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-surface-900 mt-1">
                        Rs. {item.price * item.cart_quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-1">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 px-2 py-1 bg-white">
                        <button
                          onClick={() => decrementItem(item.plant_name)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold text-surface-800">
                          {item.cart_quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.plant_name)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.plant_name)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-surface-200 bg-white rounded-b-3xl">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-surface-600">Subtotal</span>
              <span className="font-semibold text-surface-900">Rs. {totalPrice}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className={`block w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-colors ${
                cartItems.length === 0
                  ? "bg-surface-200 text-surface-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
