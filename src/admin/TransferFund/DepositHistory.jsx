import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminGet } from "../../api/Adminapi";

const DepositHistory = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Deposit Transactions
    const fetchDeposits = async () => {
        setLoading(true);
        try {
            const endpoint = `admin/depositTxn?page=${page}&limit=${limit}`;
            const res = await adminGet(endpoint, true);

            if (res.success) {
                setDeposits(res.data.data || []);
                const count = res.data.count || 0;
                setTotalPages(Math.ceil(count / limit));
            } else {
                toast.error(res.message || "Failed to fetch deposit history");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error. Try again!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, [page]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <h1 className="text-2xl font-semibold mb-4">Deposit History</h1>

            {/* Loading */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : deposits.length === 0 ? (
                <p className="text-center">No deposit transactions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">S.No</th>
                                <th className="p-2 border">User ID</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Token</th>
                                <th className="p-2 border">Mode</th>
                                <th className="p-2 border">Remark</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {deposits.map((item, index) => (
                                <tr key={item._id} className="text-center">
                                    <td className="border p-2">{(page - 1) * limit + index + 1}</td>
                                    <td className="p-2 border">{item.userId?.userId || "--"}</td>
                                    <td className="p-2 border">{item.amount}</td>
                                    <td className="p-2 border">{item.token}</td>
                                    <td className="p-2 border">{item.mode}</td>
                                    <td className="p-2 border">{item.remark}</td>
                                    <td className="p-2 border">{item.status}</td>
                                    <td className="p-2 border">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center gap-4 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={`px-4 py-2 rounded-lg shadow-md ${page === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-800"
                        }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className={`px-4 py-2 rounded-lg shadow-md ${page >= totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 text-white hover:bg-gray-800"
                        }`}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default DepositHistory;
