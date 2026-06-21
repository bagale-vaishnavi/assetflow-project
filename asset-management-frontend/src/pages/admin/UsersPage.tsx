import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xl">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-3xl max-w-md mx-auto">
          <p className="font-medium">{error}</p>

          <button
            onClick={fetchUsers}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Manage Users
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b">
              <th className="px-8 py-5 text-left font-medium">Name</th>
              <th className="px-8 py-5 text-left font-medium">Email</th>
              <th className="px-8 py-5 text-left font-medium">Role</th>
              <th className="px-8 py-5 text-left font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((u: any) => (
                <tr
                  key={u.userId}
                  className="hover:bg-zinc-50"
                >
                  <td className="px-8 py-5">{u.name}</td>

                  <td className="px-8 py-5">{u.email}</td>

                  <td className="px-8 py-5 capitalize font-medium">
                    {u.role?.roleName || u.role?.name || '—'}
                  </td>

                  <td className="px-8 py-5">
                    <button
                     onClick={() => deleteUser(u.userId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-zinc-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}