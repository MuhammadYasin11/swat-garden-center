"use client";

import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const isLogin = pathname === "/admin/login" || pathname === "/admin";

  if (isLogin) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Sticky Top Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="font-bold text-slate-800 text-lg tracking-tight">Swat Admin</div>

          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <User size={20} />
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                router.push("/admin/login");
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
