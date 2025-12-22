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
    const maxVisiblePages = 10;

    // Fetch Deposit Transactions
    const fetchDeposits = async () => {
        setLoading(true);
        try {
            const endpoint = `admin/depositTxn?page=${page}&limit=${limit}`;
            const res = await adminGet(endpoint, true);

            if (res.success) {
                setDeposits(res.data.data || []);
                const count = res.data.count || 0;
                const pages = Math.ceil(count / limit);
                setTotalPages(pages > 0 ? pages : 1); // ✅ always minimum 1

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

    const getVisiblePageNumbers = () => {
        const start = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
        const end = Math.min(start + maxVisiblePages - 1, totalPages);
        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };
    // Move to previous page
    const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));

    // Move to next page
    const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));
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
                <>
                    {/* Desktop Table */}
                    <div className="overflow-x-auto hidden md:block">
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
                                        <td className="p-2 border">{new Date(item.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4 mt-4">
                        {deposits.map((item, index) => (
                            <div key={item._id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <p className="font-semibold text-gray-800">
                                    #{(page - 1) * limit + index + 1} — {item.status}
                                </p>
                                <div className="mt-2 text-sm text-gray-700 space-y-1">
                                    <p><span className="font-medium">User ID:</span> {item.userId?.userId || "--"}</p>
                                    <p><span className="font-medium">Amount:</span> {item.amount}</p>
                                    <p><span className="font-medium">Token:</span> {item.token}</p>
                                    <p><span className="font-medium">Mode:</span> {item.mode}</p>
                                    <p><span className="font-medium">Remark:</span> {item.remark}</p>
                                    <p><span className="font-medium">Date:</span> {new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
                            {/* Prev */}
                            <button
                                disabled={page === 1}
                                onClick={handlePrevPage}
                                className={`px-4 py-2 rounded-lg shadow-md ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
                            >
                                ← Prev
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1 flex-wrap">
                                {getVisiblePageNumbers().map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-2 py-1 rounded-md text-sm font-medium cursor-pointer ${page === p ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {/* Next */}
                            <button
                                disabled={page === totalPages}
                                onClick={handleNextPage}
                                className={`px-4 py-2 rounded-lg shadow-md ${page === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
                            >
                                Next →
                            </button>
                        </div>

                    )}
                </>
            )}
        </div>
    );
};

export default DepositHistory;
