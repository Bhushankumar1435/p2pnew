import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlockUnblockUserApi, GetAdminUsersApi, HoldUnholdUserApi } from "../../api/Adminapi";

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

  const openPopup = (event, userId) => {
    const rect = event.target.getBoundingClientRect();
    const popupWidth = 250;
    const gap = 10;

    // Mobile screen
    if (window.innerWidth < 768) {
      setPopupPosition({
        x: window.innerWidth / 2 - popupWidth / 2,
        y: rect.bottom + window.scrollY + 10,
      });
    }
    // Desktop screen
    else {
      setPopupPosition({
        x: rect.right - popupWidth - gap,
        y: rect.top + window.scrollY,
      });
    }

    setSelectedUser(userId);
    setModalOpen(true);
  };


  // Navigate to user details page
  const goToDetailsPage = (type) => {
    navigate(`/admin/users/details?type=${type}&id=${selectedUser}`);
    setModalOpen(false);
  };


  // Block/Unblock user
  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      const action = !isBlocked;
      const res = await BlockUnblockUserApi(userId, action);

      if (res?.success) {
        alert(`User ${action ? "blocked" : "unblocked"} successfully!`);
        fetchUsers();
      } else {
        alert(res?.message || `Failed to ${action ? "block" : "unblock"} user`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isBlocked ? "unblock" : "block"} user. Try again.`);
    }
  };
  const toggleHoldUser = async (userId, isHold) => {
    try {
      const action = !isHold; // if hold = true → unhold, else → hold
      const res = await HoldUnholdUserApi(userId, action);

      if (res?.success) {
        alert(`User account ${action ? "hold" : "unhold"} successfully!`);
        fetchUsers();
      } else {
        alert(res?.message || "Operation failed.");
      }
    } catch (err) {
      alert("Error updating hold status.");
      console.error(err);
    }
  };



  return (
    <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      {loading ? (
        <p className="text-2xl font-semibold">Loading List…</p>
      ) : (
        <div className="w-full">

          {/* DESKTOP TABLE */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-center">
                <tr>
                  <th className="py-2 px-3 border">S.No</th>
                  <th className="py-2 px-3 border">User ID</th>
                  <th className="py-2 px-3 border">Sponser ID</th>
                  <th className="py-2 px-3 border">Rank</th>
                  <th className="py-2 px-3 border">Name</th>
                  <th className="py-2 px-3 border">Email</th>
                  <th className="py-2 px-3 border">Phone</th>
                  <th className="py-2 px-3 border">Country</th>
                  <th className="py-2 px-3 border">Status</th>
                  <th className="py-2 px-3 border">More Details</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, index) => (
                  <tr key={u._id} className="text-center hover:bg-gray-50">
                    <td className="border py-2">{(page - 1) * limit + index + 1}</td>
                    <td className="border py-2">{u.userId}</td>
                    <td className="border py-2">{u.sponsorId?.userId}</td>
                    <td className="border py-2">{u.rank || "No Rank"}</td>
                    <td className="border py-2">{u.name}</td>
                    <td className="border py-2">{u.email}</td>
                    <td className="border py-2">{u.phoneNumber}</td>
                    <td className="border py-2">{u.country}</td>

                    {/* Status */}
                    <>
                      <td className="border py-2">
                        <div className="flex justify-center gap-2">
                          {u.isBlocked ? (
                            <button
                              onClick={() => toggleBlockUser(u._id, true)}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleBlockUser(u._id, false)}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                            >
                              Block
                            </button>
                          )}

                          {u.hold ? (
                            <button
                              onClick={() => toggleHoldUser(u._id, true)}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                            >
                              Unhold
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleHoldUser(u._id, false)}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                            >
                              Hold
                            </button>
                          )}
                        </div>
                      </td>

                    </>


                    <td className="border py-2">
                      <button
                        onClick={(e) => openPopup(e, u._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4 mt-4">
            {users.map((u, index) => (
              <div
                key={u._id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <p className="font-semibold text-gray-800">
                  #{(page - 1) * limit + index + 1} — {u.name}
                </p>

                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p><span className="font-medium">User ID:</span> {u.userId}</p>
                  <p><span className="font-medium">Sponsor ID:</span> {u.sponsorId?.userId}</p>
                  <p><span className="font-medium">Rank:</span> {u.rank || "No Rank"}</p>
                  <p><span className="font-medium">Email:</span> {u.email}</p>
                  <p><span className="font-medium">Phone:</span> {u.phoneNumber}</p>
                  <p><span className="font-medium">Country:</span> {u.country}</p>

                  <p className="flex items-center gap-1">
                    <span className="font-medium">Status:</span>
                    <>
                      {u.isBlocked ? (
                        <button
                          onClick={() => toggleBlockUser(u._id, true)}
                          className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleBlockUser(u._id, false)}
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                        >
                          Block
                        </button>
                      )}
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Status:</span>
                        {u.isHold ? (
                          <button
                            onClick={() => toggleHoldUser(u._id, true)}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Unhold
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleHoldUser(u._id, false)}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                          >
                            Hold
                          </button>
                        )}

                      </p>

                    </>
                  </p>

                  <button
                    onClick={(e) => openPopup(e, u._id)}
                    className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}


      {/* Popup */}
      {modalOpen && (
        <div
          className="fixed z-50 w-56"
          style={
            window.innerWidth >= 768
              ? {
                top: popupPosition.y,
                left: popupPosition.x,
              }
              : {
                left: "50%",
                bottom: "20%",
                transform: "translateX(-50%)",
              }
          }
        >
          <div className="bg-white rounded-xl p-3 shadow-xl border relative">
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
          className={`px-4 py-2 rounded-lg shadow-md ${page === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
        >
          <span className="md:hidden">←</span>
          <span className="hidden md:inline">← Prev</span>
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded-lg shadow-md ${page >= totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
        >
          <span className="md:hidden">→</span>
          <span className="hidden md:inline">Next →</span>
        </button>
      </div>
    </div>
  );
};

export default UserList;
