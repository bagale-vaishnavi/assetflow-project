import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import {
  Users,
  Package,
  FileText,
  Bell,
  Plus,
  CheckCircle,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase() || 'EMPLOYEE';

  const [stats, setStats] = useState({
    users: 0,
    assets: 0,
    requests: 0,
    notifications: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      if (role === 'ADMIN') {
        const [usersRes, assetsRes, requestsRes, notifRes] =
          await Promise.all([
            api.get('/admin/users'),
            api.get('/assets'),
            api.get('/requests'),
            api.get('/notifications')
          ]);

        setStats({
          users: usersRes.data.length,
          assets: assetsRes.data.length,
          requests: requestsRes.data.length,
          notifications: notifRes.data.length
        });
      }

      if (role === 'MANAGER') {
        const [assetsRes, requestsRes, notifRes] =
          await Promise.all([
            api.get('/assets'),
            api.get('/requests'),
            api.get('/notifications')
          ]);

        setStats({
          users: 0,
          assets: assetsRes.data.length,
          requests: requestsRes.data.length,
          notifications: notifRes.data.length
        });
      }

      if (role === 'EMPLOYEE') {
        const [requestsRes, notifRes] =
          await Promise.all([
            api.get('/requests/my'),
            api.get('/notifications')
          ]);

        setStats({
          users: 0,
          assets: 0,
          requests: requestsRes.data.length,
          notifications: notifRes.data.length
        });
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleContent = () => {
    if (role === 'ADMIN') {
      return {
        title: 'Welcome, Admin',
        subtitle: 'You have full control over the system',
        actions: [
          { label: 'Manage Users', icon: Users, path: '/admin/users' },
          { label: 'Add New Asset', icon: Plus, path: '/assets' },
          { label: 'Assign Assets', icon: Package, path: '/admin/assign-asset' },
          { label: 'View Requests', icon: FileText, path: '/requests/all' }
        ]
      };
    }

    if (role === 'MANAGER') {
      return {
        title: 'Welcome, Manager',
        subtitle: 'Manage approvals and requests',
        actions: [
          { label: 'All Requests', icon: FileText, path: '/requests/all' },
          { label: 'Notifications', icon: Bell, path: '/notifications' }
        ]
      };
    }

    return {
      title: 'Welcome Back',
      subtitle: 'Track your service requests',
      actions: [
        { label: 'Raise Request', icon: Plus, path: '/requests/my' },
        { label: 'My Requests', icon: FileText, path: '/requests/my' },
        { label: 'Notifications', icon: Bell, path: '/notifications' }
      ]
    };
  };

  const content = getRoleContent();

  if (loading) {
    return (
      <div className="p-12 text-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">{content.title}</h1>
        <p className="text-blue-100 mt-2 text-lg">{content.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {role === 'ADMIN' && (
          <>
            <Card title="Users" value={stats.users} icon={<Users />} />
            <Card title="Assets" value={stats.assets} icon={<Package />} />
            <Card title="Requests" value={stats.requests} icon={<FileText />} />
            <Card title="Notifications" value={stats.notifications} icon={<Bell />} />
          </>
        )}

        {role === 'MANAGER' && (
          <>
            <Card title="Assets" value={stats.assets} icon={<Package />} />
            <Card title="Requests" value={stats.requests} icon={<FileText />} />
            <Card title="Notifications" value={stats.notifications} icon={<Bell />} />
          </>
        )}

        {role === 'EMPLOYEE' && (
          <>
            <Card title="My Requests" value={stats.requests} icon={<FileText />} />
            <Card title="Notifications" value={stats.notifications} icon={<Bell />} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={24} className="text-blue-600" />
              </div>

              <h3 className="font-semibold text-lg">{action.label}</h3>
              <p className="text-sm text-zinc-500 mt-1">Click to open</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Progress */}
        <div className="bg-white rounded-3xl border p-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-6 flex gap-2 items-center">
            <TrendingUp size={20} className="text-blue-600" />
            Performance
          </h2>

          <div className="space-y-5">
            <Progress label="Completed Tasks" value={82} />
            <Progress label="Pending Requests" value={45} />
            <Progress label="System Usage" value={72} />
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-3xl border p-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-6 flex gap-2 items-center">
            <Activity size={20} className="text-green-600" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            <ActivityItem text="New request submitted" />
            <ActivityItem text="Asset assigned successfully" />
            <ActivityItem text="Notification received" />
            <ActivityItem text="System synced today" />
          </div>
        </div>
      </div>

      {/* Role Access */}
      <div className="bg-white rounded-3xl border p-8 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          What you can do as {role}
        </h2>

        <ul className="space-y-3 text-zinc-600">
          <li className="flex gap-3">
            <CheckCircle size={18} className="text-green-500 mt-0.5" />
            Access personalized dashboard
          </li>

          <li className="flex gap-3">
            <CheckCircle size={18} className="text-green-500 mt-0.5" />
            Manage requests & notifications
          </li>

          <li className="flex gap-3">
            <CheckCircle size={18} className="text-green-500 mt-0.5" />
            Fast workflow actions
          </li>
        </ul>
      </div>
    </div>
  );
}

/* Components */

function Card({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
}

function Progress({ label, value }: any) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="w-full h-3 bg-zinc-100 rounded-full">
        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

function ActivityItem({ text }: any) {
  return (
    <div className="flex gap-3 items-center">
      <Clock size={16} className="text-zinc-400" />
      <p className="text-sm">{text}</p>
    </div>
  );
}