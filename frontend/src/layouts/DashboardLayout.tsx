import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/Button';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="space-y-2">
            <Link
              to="/dashboard/blog-posts"
              className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
            >
              Blog Posts
            </Link>
            <Link
              to="/dashboard/qanda"
              className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
            >
              Q&A
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;