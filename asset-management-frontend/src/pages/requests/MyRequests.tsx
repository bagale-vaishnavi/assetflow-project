import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/requests/my');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    if (!window.confirm("Cancel this request?")) return;

    try {
      await api.put(`/requests/${requestId}/cancel`);
      alert(" Request cancelled successfully!");
      fetchMyRequests();
    } catch (error) {
      alert(" Failed to cancel request");
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', newRequest);
      alert(" Request submitted successfully!");
      setShowCreateModal(false);
      setNewRequest({ title: '', description: '', category: 'Hardware', priority: 'Medium' });
      fetchMyRequests();
    } catch (error) {
      alert(" Failed to create request");
    }
  };

  const getStatusBadge = (statusName) => {
    const status = (statusName || '').toString().toLowerCase();
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700  ';
    return 'bg-yellow-100 text-yellow-700 ';
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading your requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Service Requests</h1>
          <p className="text-zinc-500">Track and manage your requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      <div className="bg-white  rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 ">
              <th className="px-8 py-5 text-left">Title</th>
              <th className="px-8 py-5 text-left">Description</th>
              <th className="px-8 py-5 text-left">Category</th>
              <th className="px-8 py-5 text-left">Priority</th>
              <th className="px-8 py-5 text-left">Status</th>
              <th className="px-8 py-5 text-left">Date</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y ">
            {requests.map((req: any) => {
              const status = (req.status?.statusName || req.status || 'Pending').toString().toLowerCase();
              const canCancel = status === 'pending';

              return (
                <tr key={req.requestId} className="hover:bg-zinc-50 ">
                  <td className="px-8 py-5 font-medium">{req.title}</td>
                  <td className="px-8 py-5 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {req.description || '—'}
                  </td>
                  <td className="px-8 py-5">{req.category}</td>
                  <td className="px-8 py-5 capitalize">{req.priority}</td>
                  <td className="px-8 py-5">
                    <span className={`px-5 py-1 text-xs font-medium rounded-2xl ${getStatusBadge(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {new Date(req.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {canCancel && (
                      <button
                        onClick={() => cancelRequest(req.requestId)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium px-5 py-2 rounded-2xl hover:bg-red-50 transition"
                      >
                        <XCircle size={18} />
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white  rounded-3xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Service Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Request Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-5 py-4 border  rounded-3xl focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Laptop not booting"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 border  rounded-3xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                    className="w-full px-5 py-4 border rounded-3xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Printer">Printer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                    className="w-full px-5 py-4 border  rounded-3xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 border  rounded-3xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-3xl font-semibold">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}