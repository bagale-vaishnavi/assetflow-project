import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Bell, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xl">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <CheckCircle size={18} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-12 text-center">
          <Bell size={48} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">No notifications yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="divide-y dark:divide-zinc-700">
            {notifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`px-8 py-6 flex gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                  !notif.read ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                }`}
              >
                <div className="mt-1">
                  <Bell size={22} className={!notif.read ? "text-blue-600" : "text-zinc-400"} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{notif.title}</p>
                    <span className="text-xs text-zinc-400">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                    {notif.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}