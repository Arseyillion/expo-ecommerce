import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin | NextCommerce",
  description: "Admin panel for NextCommerce",
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Promo Banners", href: "/admin/promo-banners", icon: "🎨" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "Orders", href: "/admin/orders", icon: "🛒" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Analytics", href: "/admin/analytics", icon: "📊" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">NextCommerce</span>
                <span className="ml-2 text-sm text-gray-500">Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Store
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
