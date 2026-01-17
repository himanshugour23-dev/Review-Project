import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-black-100  pt-20">
      
   
      <aside className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link href="/admin" className="block hover:text-gray-300">
            Dashboard
          </Link>

          <Link href="/admin/reports" className="block hover:text-gray-300">
            Reports
          </Link>
        </nav>
      </aside>


      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
