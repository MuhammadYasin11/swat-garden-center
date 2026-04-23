"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Order {
    order_id: string;
    date: string;
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
    address: string;
    total_amount: number;
    items: string;
    status: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/orders/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ order_id: orderId, status: newStatus })
            });

            if (response.ok) {
                fetchOrders();
                setToast({ message: "Order status updated.", type: "success" });
            } else {
                setToast({ message: "Failed to update order status.", type: "error" });
            }
        } catch (error) {
            setToast({ message: "Error updating status.", type: "error" });
        }
    };

    const handleDeleteOrderClick = (orderId: string) => setDeleteOrderId(orderId);

    const handleDeleteOrderConfirm = async () => {
        const orderId = deleteOrderId;
        if (!orderId) return;

        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/admin/orders/${orderId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                fetchOrders();
                setToast({ message: "Order deleted successfully.", type: "success" });
            } else {
                setToast({ message: "Failed to delete order.", type: "error" });
            }
        } catch (error) {
            setToast({ message: "Error deleting order.", type: "error" });
        } finally {
            setDeleteOrderId(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Clock className="w-5 h-5 text-amber-500" />;
            case "Shipped": return <Truck className="w-5 h-5 text-blue-500" />;
            case "Delivered": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case "Cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-slate-500" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-full shadow-sm border border-slate-100 bg-white flex-shrink-0">
                                <img src="/logo.png" alt="Swat Garden Center Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Order Management</h1>
                                <p className="text-sm sm:text-base text-slate-500 mt-1">View and process customer orders.</p>
                            </div>
                        </div>
                        <div className="flex items-center w-full sm:w-auto mt-2 sm:mt-0">
                            <Link
                                href="/admin/dashboard"
                                className="w-full sm:w-auto justify-center px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-sm text-slate-600 min-w-[1000px]">
                                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-4 whitespace-nowrap">Order ID / Date</th>
                                        <th className="px-4 py-4 whitespace-nowrap">Customer</th>
                                        <th className="px-4 py-4 whitespace-nowrap">WhatsApp</th>
                                        <th className="px-4 py-4 whitespace-nowrap">Address</th>
                                        <th className="px-4 py-4 whitespace-nowrap">Items</th>
                                        <th className="px-4 py-4 whitespace-nowrap">Total</th>
                                        <th className="px-4 py-4 whitespace-nowrap">Status</th>
                                        <th className="px-4 py-4 text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {isLoading ? (
                                        <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading orders...</td></tr>
                                    ) : orders.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="font-semibold text-slate-900 leading-tight block">{order.order_id}</div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {new Date(order.date).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-semibold text-slate-900">{order.first_name} {order.last_name}</div>
                                                <div className="text-sm text-slate-500">{order.email}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {order.whatsapp ? (
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                        <a
                                                            href={`https://wa.me/${String(order.whatsapp).replace(/\D/g, "")}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex max-w-max items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-semibold transition-colors"
                                                            title="Open WhatsApp chat"
                                                        >
                                                            <MessageCircle size={16} />
                                                            Chat
                                                        </a>
                                                        <span className="text-slate-600 text-sm whitespace-nowrap">{order.whatsapp}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 min-w-[200px]">
                                                <div className="text-xs text-slate-500 leading-snug whitespace-normal" title={order.address}>{order.address}</div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-700 font-medium whitespace-normal max-w-[250px]">
                                                {order.items}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap">
                                                Rs. {order.total_amount}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.order_id, "Shipped")}
                                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                                                            >
                                                                Mark Shipped
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.order_id, "Cancelled")}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status === "Shipped" && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.order_id, "Delivered")}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                    {order.status === "Delivered" && (
                                                        <span className="text-xs font-medium text-slate-400 px-3 py-1.5">Completed</span>
                                                    )}
                                                    {order.status === "Cancelled" && (
                                                        <span className="text-xs font-medium text-red-500 px-3 py-1.5">Cancelled</span>
                                                    )}

                                                    {/* Permanent Delete Button for all orders */}
                                                    <button
                                                        onClick={() => handleDeleteOrderClick(order.order_id)}
                                                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!isLoading && orders.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-16 text-slate-400">
                                                <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                                <p className="text-lg font-medium text-slate-500">No orders yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteOrderId}
                title="Delete order"
                message="Are you sure you want to permanently delete this order? This cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteOrderConfirm}
                onCancel={() => setDeleteOrderId(null)}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AdminProtectedRoute>
    );
}
