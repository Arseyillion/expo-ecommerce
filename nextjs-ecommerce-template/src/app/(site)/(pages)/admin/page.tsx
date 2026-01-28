import { Metadata } from "next";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Dashboard | NextCommerce",
  description: "Admin dashboard for managing your ecommerce store",
};

const AdminDashboard = () => {
  const adminSections = [
    {
      title: "Promo Banners",
      description: "Manage promotional banners for your homepage",
      href: "/admin/promo-banners",
      icon: "🎨",
      color: "bg-blue-500",
    },
    {
      title: "Products",
      description: "Manage product catalog and inventory",
      href: "/admin/products",
      icon: "📦",
      color: "bg-green-500",
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      href: "/admin/orders",
      icon: "🛒",
      color: "bg-purple-500",
    },
    {
      title: "Users",
      description: "Manage customer accounts and permissions",
      href: "/admin/users",
      icon: "👥",
      color: "bg-orange-500",
    },
    {
      title: "Analytics",
      description: "View sales reports and analytics",
      href: "/admin/analytics",
      icon: "📊",
      color: "bg-pink-500",
    },
    {
      title: "Settings",
      description: "Configure store settings and preferences",
      href: "/admin/settings",
      icon: "⚙️",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your ecommerce store from one central location
        </p>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${section.color} text-white mb-4`}>
                <span className="text-xl">{section.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600">
                {section.description}
              </p>
              
              {/* Arrow */}
              <div className="absolute top-6 right-6">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            
            {/* Bottom border accent */}
            <div className={`h-1 ${section.color}`}></div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <span className="text-green-600 text-xl">🛒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <span className="text-purple-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
              <span className="text-orange-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">$0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
