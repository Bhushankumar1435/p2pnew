import React, { useEffect, useState } from "react";
import { GetAdminUsersApi, GetUserBankDetailsApi } from "../../api/Adminapi";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await GetAdminUsersApi(page, limit);

            if (res.success) {
                setUsers(res.data.users || []);
                const total = res.data.count || 1;
                setTotalPages(Math.ceil(total / limit));
            }
        } catch (err) {
            console.error("User list error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBankDetails = async (userId) => {
        try {
            const res = await GetUserBankDetailsApi(userId);
            if (res.success) {
                setBankDetails(res.data || {});
                setModalOpen(true);
            } else {
                alert("Bank details not found");
            }
        } catch (err) {
            console.error("Bank Details Error:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">User List</h2>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-center">
                                <tr>
                                    <th className="py-2 px-3 border">S. No.</th>
                                    <th className="py-2 px-3 border">User ID</th>
                                    <th className="py-2 px-3 border">Name</th>
                                    <th className="py-2 px-3 border">Email</th>
                                    <th className="py-2 px-3 border">Phone</th>
                                    <th className="py-2 px-3 border">Country</th>
                                    <th className="py-2 px-3 border">Status</th>
                                    <th className="py-2 px-3 border">Created At</th>
                                    <th className="py-2 px-3 border">More</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length > 0 ? (
                                    users.map((u, index) => (
                                        <tr key={u._id} className="hover:bg-gray-50 text-center">
                                            <td className="py-2 px-3 border">
                                                {(page - 1) * limit + (index + 1)}
                                            </td>
                                            <td className="py-2 px-3 border">{u.userId}</td>
                                            <td className="py-2 px-3 border">{u.name}</td>
                                            <td className="py-2 px-3 border">{u.email}</td>
                                            <td className="py-2 px-3 border">{u.phoneNumber}</td>
                                            <td className="py-2 px-3 border">{u.country}</td>

                                            <td className="py-2 px-3 border">
                                                {u.isBlocked ? (
                                                    <span className="text-red-600 font-semibold">Blocked</span>
                                                ) : (
                                                    <span className="text-green-600 font-semibold">Active</span>
                                                )}
                                            </td>

                                            <td className="py-2 px-3 border">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="py-2 px-3 border">
                                                <button
                                                    onClick={() => fetchBankDetails(u._id)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="p-4 text-gray-500">
                                            No Users Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {users.map((u, index) => (
                            <div key={u._id} className="border p-4 rounded-xl shadow bg-gray-50">
                                <div className="flex justify-between mb-3">
                                    <h3 className="font-bold">#{(page - 1) * limit + (index + 1)}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${u.isBlocked
                                                ? "bg-red-200 text-red-700"
                                                : "bg-green-200 text-green-700"
                                            }`}
                                    >
                                        {u.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </div>

                                <p className="text-sm"><strong>User ID:</strong> {u.userId}</p>
                                <p className="text-sm"><strong>Name:</strong> {u.name}</p>
                                <p className="text-sm"><strong>Email:</strong> {u.email}</p>
                                <p className="text-sm"><strong>Phone:</strong> {u.phoneNumber}</p>
                                <p className="text-sm"><strong>Country:</strong> {u.country}</p>
                                <p className="text-sm mt-1">
                                    <strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}
                                </p>

                                <button
                                    onClick={() => fetchBankDetails(u._id)}
                                    className="w-full bg-blue-600 text-white px-3 py-2 mt-3 rounded hover:bg-blue-700"
                                >
                                    View Bank Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
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

            {/* Bank Details Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Bank Details</h3>

                        {bankDetails ? (
                            <ul className="space-y-2 text-sm">
                                <li><strong>Account Holder:</strong> {bankDetails.name}</li>
                                <li><strong>Bank:</strong> {bankDetails.bankName}</li>
                                <li><strong>Account No:</strong> {bankDetails.accountNumber}</li>
                                <li><strong>IFSC:</strong> {bankDetails.ifsc}</li>
                            </ul>
                        ) : (
                            <p>No Bank Details Found</p>
                        )}

                        <button
                            className="mt-5 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
