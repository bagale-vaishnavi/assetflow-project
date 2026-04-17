import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm("Approve this request?")) return;
    try {
      await api.put(`/requests/${requestId}/approve`);
      alert("✅ Request Approved!");
      fetchAllRequests();
    } catch (error) {
      alert("❌ Failed to approve");
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await api.put(`/requests/${requestId}/reject`);
      alert("✅ Request Rejected!");
      fetchAllRequests();
    } catch (error) {
      alert("❌ Failed to reject");
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Delete this request permanently?")) return;
    try {
      await api.delete(`/requests/${requestId}`);
      alert("✅ Request deleted!");
      fetchAllRequests();
    } catch (error) {
      alert("❌ Failed to delete");
    }
  };

  const getStatusBadge = (statusName) => {
    if (statusName === 'Approved') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    if (statusName === 'Rejected') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">All Service Requests</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800 border-b">
              <th className="px-8 py-5 text-left">Title</th>
              <th className="px-8 py-5 text-left w-96">Description</th>
              <th className="px-8 py-5 text-left">Category</th>
              <th className="px-8 py-5 text-left">Priority</th>
              <th className="px-8 py-5 text-left">Status</th>
              <th className="px-8 py-5 text-left">Requested By (Email)</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {requests.map((req: any) => (
              <tr key={req.requestId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-8 py-5 font-medium">{req.title}</td>
                <td className="px-8 py-5 text-zinc-600 dark:text-zinc-400 break-words">
                  {req.description || '—'}
                </td>
                <td className="px-8 py-5">{req.category}</td>
                <td className="px-8 py-5 capitalize font-medium">{req.priority}</td>
                <td className="px-8 py-5">
                  <span className={`px-5 py-1 text-xs font-medium rounded-2xl ${getStatusBadge(req.status?.statusName)}`}>
                    {req.status?.statusName || 'Pending'}
                  </span>
                </td>
                <td className="px-8 py-5 font-medium text-zinc-700 dark:text-zinc-300">
                  {req.requestedBy?.email || req.user?.email || '—'}
                </td>
                <td className="px-8 py-5 text-center flex justify-center gap-4">
                  <button onClick={() => handleApprove(req.requestId)} className="text-green-600 hover:text-green-700 transition" title="Approve">
                    <CheckCircle size={20} />
                  </button>
                  <button onClick={() => handleReject(req.requestId)} className="text-red-600 hover:text-red-700 transition" title="Reject">
                    <XCircle size={20} />
                  </button>
                  <button onClick={() => handleDelete(req.requestId)} className="text-red-600 hover:text-red-700 transition" title="Delete">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}