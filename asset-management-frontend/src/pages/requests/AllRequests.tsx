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

  const handleApprove = async (requestId: number) => {
    if (!window.confirm('Approve this request?')) return;

    try {
      await api.put(
        `/requests/${requestId}/approve?decision=APPROVED`
      );

      alert('Request Approved!');
      fetchAllRequests();
    } catch (error: any) {
      console.log(error.response?.data);
      alert('Failed to approve');
    }
  };

  const handleReject = async (requestId: number) => {
    if (!window.confirm('Reject this request?')) return;

    try {
      await api.put(
        `/requests/${requestId}/approve?decision=REJECTED`
      );

      alert('Request Rejected!');
      fetchAllRequests();
    } catch (error: any) {
      console.log(error.response?.data);
      alert('Failed to reject');
    }
  };

  const handleDelete = async (requestId: number) => {
    if (!window.confirm('Delete this request permanently?')) return;

    try {
      await api.delete(`/requests/${requestId}`);
      alert('Request deleted!');
      fetchAllRequests();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const getStatusBadge = (statusName: string) => {
    if (statusName === 'Approved')
      return 'bg-green-100 text-green-700';

    if (statusName === 'Rejected')
      return 'bg-red-100 text-red-700';

    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xl">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        All Service Requests
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-zinc-50 border-b">
                <th className="px-6 py-5 text-left">Title</th>
                <th className="px-6 py-5 text-left w-96">Description</th>
                <th className="px-6 py-5 text-left">Category</th>
                <th className="px-6 py-5 text-left">Priority</th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-left">
                  Requested By
                </th>
                <th className="px-6 py-5 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {requests.map((req: any) => (
                <tr
                  key={req.requestId}
                  className="hover:bg-zinc-50 transition"
                >
                  <td className="px-6 py-5 font-medium">
                    {req.title}
                  </td>

                  <td className="px-6 py-5 text-zinc-600 break-words">
                    {req.description || '—'}
                  </td>

                  <td className="px-6 py-5">
                    {req.category}
                  </td>

                  <td className="px-6 py-5 capitalize font-medium">
                    {req.priority}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        req.status?.statusName
                      )}`}
                    >
                      {req.status?.statusName || 'Pending'}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-zinc-700 font-medium">
                    {req.requestedBy?.email ||
                      req.user?.email ||
                      '—'}
                  </td>

                  {/* FIXED ACTION BUTTONS */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() =>
                          handleApprove(req.requestId)
                        }
                        className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleReject(req.requestId)
                        }
                        className="p-2 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(req.requestId)
                        }
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-zinc-500"
                  >
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}