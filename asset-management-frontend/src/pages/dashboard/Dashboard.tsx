import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, Users, Bell, Plus, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // You can add real stats later if needed
    setStats({});
  }, []);

  const role = user?.role?.toUpperCase() || 'EMPLOYEE';

  const getRoleContent = () => {
    if (role === 'ADMIN') {
      return {
        title: "Welcome, Admin",
        subtitle: "You have full control over the system",
        actions: [
          { label: "Manage Users", icon: Users, path: "/admin/users" },
          { label: "Add New Asset", icon: Plus, path: "/assets" },
          { label: "Assign Assets", icon: Package, path: "/admin/assign-asset" },
          { label: "View All Requests", icon: FileText, path: "/requests/all" },
        ]
      };
    }
    if (role === 'MANAGER') {
      return {
        title: "Welcome, Manager",
        subtitle: "You manage approval workflows",
        actions: [
          { label: "Review All Requests", icon: FileText, path: "/requests/all" },
          { label: "View Notifications", icon: Bell, path: "/notifications" },
        ]
      };
    }
    // Employee
    return {
      title: "Welcome back",
      subtitle: "Submit and track your service requests",
      actions: [
        { label: "Raise New Request", icon: Plus, path: "/requests/my" },
        { label: "My Requests", icon: FileText, path: "/requests/my" },
        { label: "Notifications", icon: Bell, path: "/notifications" },
      ]
    };
  };

  const content = getRoleContent();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-2">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
                  <Icon size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{action.label}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to go</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-specific quick info */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800">
        <h2 className="font-semibold text-lg mb-4">What you can do as {role}</h2>
        <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
          {role === 'ADMIN' && (
            <>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Manage all users</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Add, edit and delete assets</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Assign assets to employees</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> View all requests and assignments</li>
            </>
          )}
          {role === 'MANAGER' && (
            <>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Approve or reject service requests</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> View all pending requests</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Send notifications to employees</li>
            </>
          )}
          {role === 'EMPLOYEE' && (
            <>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Raise new service requests</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Track status of your requests</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="mt-0.5 text-green-500" /> Receive notifications</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}