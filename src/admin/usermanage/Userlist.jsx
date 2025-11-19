import React, { useEffect, useState } from "react";
import { GetAdminUsersApi } from "../../api/Adminapi";
import { useNavigate } from "react-router-dom";
import { postData } from "../../api/protectedApi"; 

const UserList = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const TABS = [
        "BANK",
        "INCOME",
        "WALLET",
        "DEPOSIT",
        "WITHDRAW",
        "DEAL",
        "ORDER",
        "TEAM",
    ];

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await GetAdminUsersApi(page, limit);
            if (res.success) {
                setUsers(res.data.users || []);
                setTotalPages(Math.ceil(res.data.count / limit));
            }
        } catch (err) {
            console.error("User fetch error:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    // Open popup exactly beside clicked "View"
    const openPopup = (event, userId) => {
        const rect = event.target.getBoundingClientRect();
        const popupWidth = 220;
        const gap = 10;

        setPopupPosition({
            x: rect.left - popupWidth - gap,
            y: rect.top + window.scrollY
        });

        setSelectedUser(userId);
        setModalOpen(true);
    };

    // Navigate to user details page
    const goToDetailsPage = (type) => {
        navigate(`/admin/userDetails?type=${type}&id=${selectedUser}`);
        setModalOpen(false);
    };

    // Block/Unblock user
    const toggleBlockUser = async (userId, isBlocked) => {
        try {
            const action = isBlocked ? "unblock" : "block";
            const res = await postData(`/admin/unblockUser`, { userId }); 
            if (res.data.success) {
                alert(`User ${action}ed successfully!`);
                fetchUsers(); 
            } else {
                alert(res.data.message || `Failed to ${action} user`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">User List</h2>

            {loading ? (
                <p>Loading…</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100 text-center">
                            <tr>
                                <th className="py-2 px-3 border">S.No</th>
                                <th className="py-2 px-3 border">User ID</th>
                                <th className="py-2 px-3 border">Name</th>
                                <th className="py-2 px-3 border">Email</th>
                                <th className="py-2 px-3 border">Phone</th>
                                <th className="py-2 px-3 border border-b-0">Status</th>
                                <th className="py-2 px-3 border">More Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u, index) => (
                                <tr key={u._id} className="text-center hover:bg-gray-50">
                                    <td className="border py-2">{(page - 1) * limit + index + 1}</td>
                                    <td className="border py-2">{u.userId}</td>
                                    <td className="border py-2">{u.name}</td>
                                    <td className="border py-2">{u.email}</td>
                                    <td className="border py-2">{u.phoneNumber}</td>

                                    <td className="border-t py-2 flex justify-center items-center gap-2">
                                        {u.isBlocked ? (
                                            <>
                                                <span className="text-red-600 font-bold">Blocked</span>
                                                <button
                                                    onClick={() => toggleBlockUser(u._id, true)}
                                                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Unblock
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-green-600 font-bold">Active</span>
                                                <button
                                                    onClick={() => toggleBlockUser(u._id, false)}
                                                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Block
                                                </button>
                                            </>
                                        )}
                                    </td>

                                    <td className="border py-2">
                                        <button
                                            onClick={(e) => openPopup(e, u._id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ---------- POPUP EXACTLY BESIDE THE BUTTON ---------- */}
            {modalOpen && (
                <div
                    className="fixed z-50"
                    style={{
                        top: popupPosition.y,
                        left: popupPosition.x,
                    }}
                >
                    <div className="bg-white w-56 rounded-xl p-3 shadow-xl border relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-1 right-2 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h3 className="text-sm font-bold mb-2">Select Details</h3>

                        <div className="flex flex-col gap-2">
                            {TABS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => goToDetailsPage(t)}
                                    className="bg-gray-200 hover:bg-gray-300 text-xs py-1 rounded"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center gap-4 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-4 py-2 rounded-lg shadow-md ${
                        page === 1
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
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`px-4 py-2 rounded-lg shadow-md ${
                        page >= totalPages
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

export default UserList;
