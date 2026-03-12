"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { PlusCircle, Search, Calendar, DollarSign, Download, ArrowLeft, Trash2, Edit } from "lucide-react";
import Link from "next/link";

interface PhysicalSale {
    id: string;
    date: string;
    total_sale: number;
    expense: number;
    net_sale: number;
    description: string;
}

export default function PhysicalSalesPage() {
    const [sales, setSales] = useState<PhysicalSale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<string | null>(null);
    const [deleteSaleId, setDeleteSaleId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        total_sale: "",
        expense: "0",
        description: ""
    });

    const netSaleCalculation = (parseFloat(formData.total_sale || "0") - parseFloat(formData.expense || "0")).toFixed(2);

    const fetchSales = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch("https://swat-garden-center.onrender.com/admin/physical-sales", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSales(data.sales);
            }
        } catch (error) {
            console.error("Failed to fetch physical sales:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleAddSale = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("admin_token");
            const url = editRecordId
                ? `https://swat-garden-center.onrender.com/admin/physical-sales/${editRecordId}`
                : "https://swat-garden-center.onrender.com/admin/physical-sales";

            const method = editRecordId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: formData.date,
                    total_sale: parseFloat(formData.total_sale),
                    expense: parseFloat(formData.expense || "0"),
                    description: formData.description
                })
            });

            if (response.ok) {
                closeModal();
                fetchSales();
                setToast({ message: editRecordId ? "Sale updated." : "Sale added.", type: "success" });
            } else {
                setToast({ message: `Failed to ${editRecordId ? "update" : "add"} sale record.`, type: "error" });
            }
        } catch (error) {
            setToast({ message: "An error occurred.", type: "error" });
        }
    };

    const handleDeleteSaleClick = (id: string) => setDeleteSaleId(id);

    const handleDeleteSaleConfirm = async () => {
        const id = deleteSaleId;
        if (!id) return;
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`https://swat-garden-center.onrender.com/admin/physical-sales/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                fetchSales();
                setToast({ message: "Sale record deleted.", type: "success" });
            } else {
                setToast({ message: "Failed to delete record.", type: "error" });
            }
        } catch (error) {
            setToast({ message: "Error deleting sale.", type: "error" });
        } finally {
            setDeleteSaleId(null);
        }
    };

    const handleEditClick = (sale: PhysicalSale) => {
        setEditRecordId(sale.id);
        setFormData({
            date: sale.date,
            total_sale: sale.total_sale.toString(),
            expense: sale.expense.toString(),
            description: sale.description || ""
        });
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditRecordId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            total_sale: "",
            expense: "0",
            description: ""
        });
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch("https://swat-garden-center.onrender.com/admin/physical-sales/export", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `physical_sales_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Failed to export.");
            }
        } catch (error) {
            console.error("Error exporting data", error);
        }
    };

    const totalPhysicalRevenue = sales.reduce((acc, sale) => acc + (parseFloat(sale.total_sale as any) || 0), 0);
    const totalPhysicalExpense = sales.reduce((acc, sale) => acc + (parseFloat(sale.expense as any) || 0), 0);
    const totalPhysicalNet = sales.reduce((acc, sale) => acc + (parseFloat(sale.net_sale as any) || 0), 0);

    // Group sales by month (year-month key), newest first. Each month becomes its own section.
    const monthNames: Record<string, string> = {
        "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
        "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
    };
    const getMonthKey = (dateStr: string) => {
        const d = dateStr.split("T")[0] || dateStr;
        const [y, m] = d.split("-");
        return { key: `${y}-${m}`, year: y || "", month: m || "" };
    };
    const salesByMonth = sales.reduce<Record<string, PhysicalSale[]>>((acc, sale) => {
        const { key } = getMonthKey(sale.date);
        if (!acc[key]) acc[key] = [];
        acc[key].push(sale);
        return acc;
    }, {});
    const monthKeysOrdered = Object.keys(salesByMonth).sort((a, b) => b.localeCompare(a));

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-5">
                            <div className="relative w-16 h-16 overflow-hidden rounded-full shadow-sm border border-slate-100 bg-white">
                                <img src="/logo.png" alt="Swat Garden Center Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Physical Sales Tracker</h1>
                                <p className="text-slate-500 mt-1">Log and monitor your daily in-store nursery sales.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">All-Time Total Sales</h3>
                            <p className="text-4xl font-bold text-amber-600 mt-2">Rs. {totalPhysicalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">All-Time Expenses</h3>
                            <p className="text-4xl font-bold text-red-600 mt-2">Rs. {totalPhysicalExpense.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">All-Time Net Sales</h3>
                            <p className="text-4xl font-bold text-emerald-600 mt-2">Rs. {totalPhysicalNet.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <PlusCircle size={18} />
                            Log New Physical Sale
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export to Excel/CSV
                        </button>
                    </div>

                    {/* Sales by month: separate section per month */}
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">
                            Loading records...
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center text-slate-400">
                            <DollarSign className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p className="text-lg font-medium text-slate-500">No physical sales logged yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {monthKeysOrdered.map((monthKey) => {
                                const [year, month] = monthKey.split("-");
                                const monthLabel = `${monthNames[month] || month} ${year}`;
                                const monthSales = salesByMonth[monthKey];
                                const monthRevenue = monthSales.reduce((a, s) => a + (parseFloat(s.total_sale as any) || 0), 0);
                                const monthExpense = monthSales.reduce((a, s) => a + (parseFloat(s.expense as any) || 0), 0);
                                const monthNet = monthSales.reduce((a, s) => a + (parseFloat(s.net_sale as any) || 0), 0);
                                return (
                                    <div key={monthKey} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-emerald-600" />
                                                {monthLabel}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-amber-700 font-medium">Sales: Rs. {monthRevenue.toFixed(2)}</span>
                                                <span className="text-red-600 font-medium">Expense: Rs. {monthExpense.toFixed(2)}</span>
                                                <span className="text-emerald-700 font-bold">Net: Rs. {monthNet.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                                                <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-3">Date</th>
                                                        <th className="px-6 py-3">Total Sale (Rs.)</th>
                                                        <th className="px-6 py-3">Expense (Rs.)</th>
                                                        <th className="px-6 py-3">Net Sale (Rs.)</th>
                                                        <th className="px-6 py-3">Description</th>
                                                        <th className="px-6 py-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {monthSales.map((sale, idx) => (
                                                        <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-6 py-4 font-semibold text-slate-900">{sale.date}</td>
                                                            <td className="px-6 py-4 font-medium text-amber-700">{sale.total_sale}</td>
                                                            <td className="px-6 py-4 font-medium text-red-600">{sale.expense}</td>
                                                            <td className="px-6 py-4 font-bold text-emerald-700">{sale.net_sale}</td>
                                                            <td className="px-6 py-4 truncate max-w-[300px]" title={sale.description}>{sale.description || <span className="text-slate-300 italic">No description</span>}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleEditClick(sale)}
                                                                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        title="Edit Sale"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteSaleClick(sale.id)}
                                                                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Delete Sale"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">{editRecordId ? 'Edit Physical Sale' : 'Log Daily Physical Sale'}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddSale} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Date</label>
                                <input type="date" required className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Total Sale (Rs.)</label>
                                <input type="number" required min="0" step="0.01" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.total_sale} onChange={e => setFormData({ ...formData, total_sale: e.target.value })} placeholder="e.g. 5000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Today's Expense (Rs.) <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input type="number" min="0" step="0.01" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.expense} onChange={e => setFormData({ ...formData, expense: e.target.value })} placeholder="e.g. 500" />
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                                <span className="font-semibold text-emerald-800">Calculated Net Sale:</span>
                                <span className="font-bold text-xl text-emerald-600">Rs. {netSaleCalculation}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description / Expense Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <textarea rows={2} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Bought new fertilizer supplies..." />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                                    {editRecordId ? 'Update Record' : 'Save Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteSaleId}
                title="Delete sale record"
                message="Are you sure you want to permanently delete this sale record?"
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteSaleConfirm}
                onCancel={() => setDeleteSaleId(null)}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AdminProtectedRoute>
    );
}
