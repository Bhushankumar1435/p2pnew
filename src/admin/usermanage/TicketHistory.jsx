import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

import { GetAdminTicketHistoryApi, ManageAdminTicketApi } from "../../api/Adminapi";

const TicketHistory = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTickets();
    }, [page]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await GetAdminTicketHistoryApi(page, limit);
            if (res.success) {
                setTickets(res.data.tickets || []);
                const total = res.data.count || 1;
                setTotalPages(Math.ceil(total / limit));
            }
        } catch (err) {
            console.error("Ticket history error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const res = await ManageAdminTicketApi(ticketId, { status: newStatus });
            if (res.success) {
                fetchTickets(); // Refresh tickets after update
            } else {
                alert("Failed to update ticket");
            }
        } catch (err) {
            console.error("Error updating ticket:", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
                  <ToastContainer position="top-right" autoClose={3000} />

            <h2 className="text-2xl font-bold mb-4">Ticket History</h2>

            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <>
                    {/* ----------------------- Desktop Table ----------------------- */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-blue-50 text-center">
                                <tr>
                                    <th className="py-2 px-3 border">S.No</th>
                                    <th className="py-2 px-3 border">Ticket ID</th>
                                    <th className="py-2 px-3 border">User ID</th>
                                    <th className="py-2 px-3 border">Subject</th>
                                    <th className="py-2 px-3 border">Status</th>
                                    <th className="py-2 px-3 border">Created At</th>
                                    <th className="py-2 px-3 border">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tickets.length > 0 ? (
                                    tickets.map((t, index) => (
                                        <tr key={t._id} className="hover:bg-gray-50 text-center">
                                            <td className="py-2 px-3 border">
                                                {(page - 1) * limit + (index + 1)}
                                            </td>
                                            <td className="py-2 px-3 border">{t.ticketId}</td>
                                            <td className="py-2 px-3 border">{t.userId?.userId || "—"}</td>
                                            <td className="py-2 px-3 border">{t.subject}</td>
                                            <td className="py-2 px-3 border">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        t.status === "OPEN"
                                                            ? "bg-yellow-200 text-yellow-700"
                                                            : t.status === "CLOSED"
                                                                ? "bg-green-200 text-green-700"
                                                                : "bg-gray-300 text-gray-700"
                                                    }`}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 border">
                                                {new Date(t.createdAt).toLocaleString()}
                                            </td>
                                            <td className="py-2 px-3 border">
                                                <select
                                                    value={t.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(t._id, e.target.value)
                                                    }
                                                    className="border rounded px-2 py-1 text-sm"
                                                >
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                    <option value="CLOSED">CLOSED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center text-gray-500">
                                            No tickets found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ----------------------- Mobile Cards ----------------------- */}
                    <div className="md:hidden flex flex-col gap-4">
                        {tickets.map((t, index) => (
                            <div key={t._id} className="border rounded-xl p-4 bg-gray-50 shadow">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-bold">#{(page - 1) * limit + (index + 1)}</h3>

                                    <span className="px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">
                                        {t.status}
                                    </span>
                                </div>

                                <p><strong>Ticket ID:</strong> {t.ticketId}</p>
                                <p><strong>User:</strong> {t.userId?.userId || "—"}</p>
                                <p><strong>Subject:</strong> {t.subject}</p>

                                <p className="text-sm mt-2">
                                    <strong>Created:</strong>{" "}
                                    {new Date(t.createdAt).toLocaleString()}
                                </p>

                                {/* Mobile Status Change */}
                                <div className="mt-2">
                                    <select
                                        value={t.status}
                                        onChange={(e) =>
                                            handleStatusChange(t._id, e.target.value)
                                        }
                                        className="border rounded px-2 py-1 text-sm w-full"
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ----------------------- Pagination ----------------------- */}
                    <div className="flex justify-between items-center gap-4 mt-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md 
                             ${page === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-700 text-white hover:bg-gray-800"
                                }`}
                        >
                            <span className="md:hidden">←</span>
                            <span className="hidden md:inline">← Prev</span>
                        </button>

                        <span className="text-gray-700 font-medium ">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md 
                          ${page >= totalPages
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-700 text-white hover:bg-gray-800"
                                }`}
                        >
                            <span className="md:hidden">→</span>
                            <span className="hidden md:inline">Next →</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketHistory;
