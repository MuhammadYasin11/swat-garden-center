"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Plant {
    name: string;
    category: string;
    type: string;
    price: number;
    stock_quantity: number;
    expert_score: number;
    image_url?: string;
}

interface Tool {
    name: string;
    category: string;
    type: string;
    price: number;
    stock_quantity: number;
    expert_score: number;
    image_url?: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"plants" | "tools">("plants");
    const [plants, setPlants] = useState<Plant[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Form state corresponding to PlantSchema/ToolSchema
    const [formData, setFormData] = useState({
        name: "", name: "", category: "Foliage", type: "Indoor", type: "Hand Tool",
        light_requirement: "Medium", water_frequency: "Weekly",
        maintenance_level: "Medium", growth_rate: "Medium",
        temp_min: 60, temp_max: 85, price: 25, stock_quantity: 50, expert_score: 4.5,
        image_url: ""
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isCsvUploading, setIsCsvUploading] = useState(false);
    const [isLowStockVisible, setIsLowStockVisible] = useState(true);
    const [lastViewedCount, setLastViewedCount] = useState<number>(0);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [editingItemName, setEditingItemName] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const [plantsRes, toolsRes, ordersRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/plants`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/tools`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (plantsRes.ok) {
                const data = await plantsRes.json();
                setPlants(data.plants);
            }
            if (toolsRes.ok) {
                const data = await toolsRes.json();
                setTools(data.tools);
            }
            if (ordersRes.ok) {
                const data = await ordersRes.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const count = localStorage.getItem("last_viewed_order_count");
        if (count) setLastViewedCount(parseInt(count));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    const handleDeleteClick = (itemName: string) => setDeleteTarget(itemName);

    const handleEditClick = (item: any) => {
        const isPlant = !!item.name;
        const name = isPlant ? item.name : item.name;
        setActiveTab(isPlant ? "plants" : "tools");
        setEditingItemName(name);

        if (isPlant) {
            setFormData(prev => ({
                ...prev,
                name: item.name,
                name: "",
                category: item.category,
                type: item.type,
                type: prev.type,
                price: item.price,
                stock_quantity: item.stock_quantity,
                expert_score: item.expert_score,
                light_requirement: (item.light_requirement || prev.light_requirement),
                maintenance_level: (item.maintenance_level || prev.maintenance_level),
                water_frequency: (item.water_frequency || prev.water_frequency),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                name: "",
                name: item.name,
                category: item.category,
                type: prev.type,
                type: item.type,
                price: item.price,
                stock_quantity: item.stock_quantity,
                expert_score: item.expert_score,
            }));
        }
        setImageFile(null);
        setIsAddModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const itemName = deleteTarget;
        if (!itemName) return;

        try {
            const token = localStorage.getItem("admin_token");
            const url = activeTab === "plants"
                ? `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/plants/delete`
                : `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/tools/${encodeURIComponent(itemName)}`;

            const options: any = {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            };

            if (activeTab === "plants") {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify({ name: itemName });
            }

            const res = await fetch(url, options);

            if (res.ok) {
                fetchData();
                setToast({ message: `${activeTab === "plants" ? "Plant" : "Item"} deleted successfully.`, type: "success" });
            } else {
                setToast({ message: `Failed to delete ${activeTab === "plants" ? "plant" : "item"}.`, type: "error" });
            }
        } catch (error) {
            setToast({ message: "An error occurred.", type: "error" });
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("admin_token");

            const payload = new FormData();

            const isPlant = activeTab === "plants";
            const isEdit = !!editingItemName;

            if (isEdit) {
                if (isPlant) {
                    payload.append("original_name", editingItemName!);
                } else {
                    payload.append("original_tool_name", editingItemName!);
                }
            }

            if (isPlant) {
                Object.entries(formData).forEach(([key, value]) => {
                    if (key !== "image_url" && key !== "name" && key !== "type") payload.append(key, value.toString());
                });
            } else {
                // For tools, exclude plant specific fields
                const toolKeys = ["name", "category", "type", "price", "stock_quantity", "expert_score"];
                Object.entries(formData).forEach(([key, value]) => {
                    if (toolKeys.includes(key)) {
                        payload.append(key, String(value));
                    }
                });
            }

            if (imageFile) {
                payload.append("image", imageFile);
            }

            const url = isPlant
                ? isEdit
                    ? `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/plants/edit`
                    : `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/plants/add`
                : isEdit
                    ? `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/tools/edit`
                    : `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/tools`;

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setEditingItemName(null);
                fetchData();
                setFormData({ ...formData, name: "", name: "", price: 25, stock_quantity: 50, image_url: "" });
                setImageFile(null);
            } else {
                const errData = await res.json().catch(() => ({}));
                setToast({ message: errData.detail || `Failed to ${isEdit ? "update" : "save"} ${activeTab === "plants" ? "plant" : "item"}.`, type: "error" });
            }
        } catch (error) {
            setToast({ message: "Network error or invalid payload.", type: "error" });
        }
    };

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetTab: "plants" | "tools") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsCsvUploading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const payload = new FormData();
            payload.append("file", file);

            const url = targetTab === "plants"
                ? `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/plants/bulk-import`
                : `${process.env.NEXT_PUBLIC_API_URL || "https://swat-garden-center.onrender.com"}/admin/tools/bulk-import`;

            const res = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: payload,
            });

            if (res.ok) {
                const data = await res.json();
                setToast({ message: data.message || "Bulk upload successful!", type: "success" });
                fetchData();
            } else {
                const data = await res.json();
                setToast({ message: data.detail || "Upload failed.", type: "error" });
            }
        } catch (error) {
            setToast({ message: "An error occurred during Excel upload.", type: "error" });
        } finally {
            setIsCsvUploading(false);
            e.target.value = '';
        }
    };

    const lowStockPlants = plants.filter(p => p.stock_quantity < 10);
    const lowStockTools = tools.filter(t => t.stock_quantity < 10);
    const lowStockItems = [
        ...lowStockPlants.map(p => ({ ...p, isPlant: true, displayName: p.name })),
        ...lowStockTools.map(t => ({ ...t, isPlant: false, displayName: t.name }))
    ];

    const currentData = activeTab === "plants" ? plants : tools;
    const filteredData = currentData.filter(item => {
        const name = (item as any).name || (item as any).name;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-slate-500 mt-1">Manage your plant and gardening item inventory.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/admin/change-password")}
                                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                                title="Change admin password"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Change password
                            </button>
                            <button
                                onClick={() => router.push("/admin/physical-sales")}
                                className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                            >
                                Physical Sales
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem("last_viewed_order_count", orders.length.toString());
                                    setLastViewedCount(orders.length);
                                    router.push("/admin/orders");
                                }}
                                className="relative w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                            >
                                View Customer Orders
                                {orders.length > lastViewedCount && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4" title="New orders available">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="hidden md:block px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Total Revenue</h3>
                            <p className="text-4xl font-bold text-amber-600 mt-2">Rs. {isLoading ? "--" : orders.reduce((sum, o) => o.status === "Delivered" ? sum + (Number(o.total_amount) || 0) : sum, 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Total Orders</h3>
                            <p className="text-4xl font-bold text-indigo-600 mt-2">{isLoading ? "--" : orders.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Total Plants</h3>
                            <p className="text-4xl font-bold text-emerald-600 mt-2">{isLoading ? "--" : plants.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Total Gardening Items</h3>
                            <p className="text-4xl font-bold text-blue-600 mt-2">{isLoading ? "--" : tools.length}</p>
                        </div>
                    </div>

                    {/* Charts */}
                    {!isLoading && orders.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-slate-700 mb-4">Orders by Status</h3>
                                <div className="space-y-3">
                                    {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => {
                                        const count = orders.filter((o: any) => o.status === status).length;
                                        const max = Math.max(...["Pending", "Shipped", "Delivered", "Cancelled"].map(s => orders.filter((o: any) => o.status === s).length), 1);
                                        const pct = (count / max) * 100;
                                        const colors: Record<string, string> = { Pending: "bg-amber-500", Shipped: "bg-blue-500", Delivered: "bg-emerald-500", Cancelled: "bg-red-500" };
                                        return (
                                            <div key={status} className="flex items-center gap-3">
                                                <span className="w-24 text-sm font-medium text-slate-600">{status}</span>
                                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${colors[status] || "bg-slate-400"} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="w-8 text-sm font-bold text-slate-700">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-slate-700 mb-4">Revenue (Last 7 Days)</h3>
                                <div className="flex items-end gap-2 h-32">
                                    {(() => {
                                        const days = [...Array(7)].map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - (6 - i));
                                            return d.toISOString().split("T")[0];
                                        });
                                        const dayRevenue = days.map(date => ({
                                            date,
                                            revenue: orders
                                                .filter((o: any) => (o.date || "").startsWith(date) && o.status === "Delivered")
                                                .reduce((s: number, o: any) => s + (Number(o.total_amount) || 0), 0)
                                        }));
                                        const maxRev = Math.max(...dayRevenue.map(d => d.revenue), 1);
                                        return dayRevenue.map((d, i) => (
                                            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="w-full bg-slate-100 rounded-t overflow-hidden" style={{ height: 100 }}>
                                                    <div
                                                        className="w-full bg-emerald-500 rounded-t transition-all"
                                                        style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: d.revenue ? 4 : 0 }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-500">{new Date(d.date).toLocaleDateString("en", { weekday: "short" })}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dedicated Add Buttons Box */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                onClick={() => { setActiveTab("plants"); setIsAddModalOpen(true); }}
                                className="flex flex-col items-center justify-center p-4 w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all group h-full cursor-pointer shadow-sm hover:shadow"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700 text-center">Add Plant</span>
                            </button>
                            <button
                                onClick={() => { setActiveTab("tools"); setIsAddModalOpen(true); }}
                                className="flex flex-col items-center justify-center p-4 w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group h-full cursor-pointer shadow-sm hover:shadow"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-700 text-center">Add Gardening Item</span>
                            </button>
                            <label className="flex flex-col items-center justify-center p-4 w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all group cursor-pointer h-full relative shadow-sm hover:shadow">
                                <input type="file" accept=".xlsx, .xls" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleExcelUpload(e, "plants")} disabled={isCsvUploading} />
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{isCsvUploading ? '⏳' : '📊'}</span>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700 text-center">{isCsvUploading ? 'Uploading...' : 'Add Plant Excel'}</span>
                            </label>
                            <label className="flex flex-col items-center justify-center p-4 w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all group cursor-pointer h-full relative shadow-sm hover:shadow">
                                <input type="file" accept=".xlsx, .xls" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleExcelUpload(e, "tools")} disabled={isCsvUploading} />
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{isCsvUploading ? '⏳' : '📄'}</span>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-700 text-center">{isCsvUploading ? 'Uploading...' : 'Add Item Excel'}</span>
                            </label>
                        </div>
                    </div>

                    {/* Dedicated Low Stock Section */}
                    {lowStockItems.length > 0 && (
                        <div className="bg-amber-50/50 rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                            <div
                                onClick={() => setIsLowStockVisible(!isLowStockVisible)}
                                className="p-5 flex items-center justify-between border-b border-amber-200 bg-amber-100/30 cursor-pointer hover:bg-amber-200/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <h2 className="text-lg font-bold text-amber-900">Low Stock Alerts</h2>
                                    <span className="px-2.5 py-1 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">{lowStockItems.length} Items</span>
                                </div>
                                <div className="text-amber-800 bg-amber-200/50 p-1.5 rounded-lg">
                                    {isLowStockVisible ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
                                </div>
                            </div>
                            {isLowStockVisible && (
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white/50">
                                    {lowStockItems.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm flex items-center justify-between hover:border-amber-400 transition-colors">
                                            <div className="overflow-hidden">
                                                <p className="font-semibold text-slate-800 truncate" title={item.displayName}>{item.displayName}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.isPlant ? 'Plant' : 'Tool'} • {item.category}</p>
                                            </div>
                                            <div className="ml-3 flex-shrink-0 bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-sm text-center min-w-[3rem]">
                                                {item.stock_quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Inventory Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex flex-col items-start gap-4">
                            <div className="flex w-full justify-between items-center bg-slate-100 p-1.5 rounded-lg mb-2">
                                <button
                                    onClick={() => setActiveTab("plants")}
                                    className={`w-1/2 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "plants" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Plants
                                </button>
                                <button
                                    onClick={() => setActiveTab("tools")}
                                    className={`w-1/2 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "tools" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Gardening Items
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    Live {activeTab === "plants" ? "Plants" : "Gardening Items"} Inventory
                                </h2>
                                <div className="relative w-full sm:w-72">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab === "plants" ? "plants" : "items"} by name or category...`}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">{activeTab === "plants" ? "Plant Name" : "Item Name"}</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4 text-center">Stock</th>
                                        <th className="px-6 py-4 text-center">AI Score</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {isLoading ? (
                                        <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading inventory...</td></tr>
                                    ) : filteredData.map((item: any, idx: number) => {
                                        const name = item.name || item.name;
                                        const type = item.type || item.type;

                                        return (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 sm:px-6 py-4 font-medium text-slate-900 break-words">{name}</td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{type}</td>
                                                <td className="px-6 py-4 text-slate-900 font-medium">Rs. {item.price}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${item.stock_quantity < 10 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                                                        {item.stock_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-blue-600 font-medium">{(Number(item.expert_score) || 0).toFixed(1)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title={`Edit ${activeTab === "plants" ? "Plant" : "Item"}`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                                                                <path d="M11.379 5.793L4 13.172V16h2.828l7.379-7.379-2.828-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(name)}
                                                            className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title={`Delete ${activeTab === "plants" ? "Plant" : "Item"}`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {!isLoading && filteredData.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-8 text-slate-400">No {activeTab === "plants" ? "plants" : "items"} found matching your search.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Plant Modal Overlay */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {editingItemName ? "Edit" : "Add New"} {activeTab === "plants" ? "Plant" : "Gardening Item"}
                                </h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">{activeTab === "plants" ? "Plant Name" : "Item Name"}</label>
                                        <input type="text" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={activeTab === "plants" ? formData.name : formData.name}
                                            onChange={e => activeTab === "plants" ? setFormData({ ...formData, name: e.target.value }) : setFormData({ ...formData, name: e.target.value })}
                                            placeholder={activeTab === "plants" ? "e.g. Monstera Deliciosa" : "e.g. Premium Trowel"} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Category</label>
                                        <input type="text" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">{activeTab === "plants" ? "Type (Indoor/Outdoor)" : "Type (Hand Tool/Power Tool)"}</label>
                                        <input type="text" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={activeTab === "plants" ? formData.type : formData.type}
                                            onChange={e => activeTab === "plants" ? setFormData({ ...formData, type: e.target.value }) : setFormData({ ...formData, type: e.target.value })} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Price (Rs.)</label>
                                        <input type="number" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.price || ""} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
                                        <input type="number" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.stock_quantity || ""} onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })} />
                                    </div>

                                    {/* Defaulting all the other backend required fields as hidden constants or smaller fields for simplicity */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Expert Score (0-5)</label>
                                        <input type="number" step="0.1" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.expert_score || ""} onChange={e => setFormData({ ...formData, expert_score: parseFloat(e.target.value) })} />
                                    </div>

                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Upload {activeTab === "plants" ? "Plant" : "Item"} Image (Optional)</label>
                                        <input type="file" accept="image/*" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                            onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                        <p className="text-xs text-slate-500 mt-1">Leave blank to let AI auto-generate an image from Unsplash.</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm">
                                        {editingItemName ? "Update" : "Save"} {activeTab === "plants" ? "Plant" : "Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete item"
                message={`Are you sure you want to permanently delete ${deleteTarget || ""}?`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AdminProtectedRoute>
    );
}
