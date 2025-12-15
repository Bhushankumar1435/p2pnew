import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BlockUnblockUserApi,
  GetAdminUsersApi,
  HoldUnholdUserApi,
  GetCountriesApi,
} from "../../api/Adminapi";
import { ToastContainer, toast } from "react-toastify";

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
  const [filter, setFilter] = useState("all");

  const [searchUserId, setSearchUserId] = useState("");
  const [countries, setCountries] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [searchRank, setSearchRank] = useState("");
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const PAGE_WINDOW_SIZE = 10;

  const TABS = ["BANK", "INCOME", "WALLET", "DEPOSIT", "WITHDRAW", "DEAL", "ORDER", "TEAM"];

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      const data = await GetCountriesApi();
      setCountries(data);
      setLoading(false);
    };
    fetchCountries();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let status;
      if (filter === "active") status = true;
      else if (filter === "inactive") status = false;
      else status = undefined;

      const res = await GetAdminUsersApi(
        page,
        limit,
        status,
        searchUserId.trim(),
        searchCountry,
        searchRank
      );

      if (res.success) {
        setUsers(res.data.users || []);
        setTotalPages(Math.ceil(res.data.count / limit));
      } else {
        toast.error(res.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("User fetch error:", err);
      toast.error("Error fetching users");
    }
    setLoading(false);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setPageWindowStart(1);
  }, [filter, searchUserId, searchCountry, searchRank]);

  useEffect(() => {
    fetchUsers();
  }, [page, filter, searchUserId, searchCountry, searchRank]);

  const openPopup = (event, userId) => {
    const rect = event.target.getBoundingClientRect();
    const popupWidth = 250;
    const gap = 10;

    if (window.innerWidth < 768) {
      setPopupPosition({
        x: window.innerWidth / 2 - popupWidth / 2,
        y: rect.bottom + window.scrollY + 10,
      });
    } else {
      setPopupPosition({
        x: rect.right - popupWidth - gap,
        y: rect.top + window.scrollY,
      });
    }

    setSelectedUser(userId);
    setModalOpen(true);
  };

  const goToDetailsPage = (type) => {
    navigate(`/admin/users/details?type=${type}&id=${selectedUser}`);
    setModalOpen(false);
  };

  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      const action = !isBlocked;
      const res = await BlockUnblockUserApi(userId, action);
      if (res?.success) {
        toast.success(`User ${action ? "blocked" : "unblocked"} successfully!`);
        fetchUsers();
      } else {
        toast.error(res?.message || `Failed to ${action ? "block" : "unblock"} user`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isBlocked ? "unblock" : "block"} user. Try again.`);
    }
  };

  const toggleHoldUser = async (userId, isHold) => {
    try {
      const action = !isHold;
      const res = await HoldUnholdUserApi(userId, action);
      if (res?.success) {
        toast.success(`User account ${action ? "hold" : "unhold"} successfully!`);
        fetchUsers();
      } else {
        toast.error(res?.message || "Operation failed.");
      }
    } catch (err) {
      toast.error("Error updating hold status.");
      console.error(err);
    }
  };

  const getPageNumbers = () => {
    const start = pageWindowStart;
    const end = Math.min(start + PAGE_WINDOW_SIZE - 1, totalPages);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handlePrevBlock = () => {
    const newStart = Math.max(pageWindowStart - PAGE_WINDOW_SIZE, 1);
    setPageWindowStart(newStart);
    setPage(newStart);
  };

  const handleNextBlock = () => {
    const newStart = Math.min(pageWindowStart + PAGE_WINDOW_SIZE, totalPages);
    setPageWindowStart(newStart);
    setPage(newStart);
  };

  // Static rank options
  const ranks = ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];
  return (
    <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6 flex-wrap">
        {/* ---------------- Search Input ---------------- */}
        <div className="flex items-center gap-2 flex-1 md:flex-none w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-60 transition"
          />
          {searchUserId && (
            <button
              onClick={() => setSearchUserId("")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* ---------------- Status Filter Buttons ---------------- */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "active"
              ? "bg-green-600 text-white shadow-md"
              : "bg-green-200 text-green-800 hover:bg-green-500 hover:text-white"
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "inactive"
              ? "bg-red-600 text-white shadow-md"
              : "bg-red-200 text-red-800 hover:bg-red-500 hover:text-white"
              }`}
          >
            Inactive
          </button>
        </div>

        {/* ---------------- Country Filter ---------------- */}
        <div className="flex items-center gap-2">
          <select
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            className="border border-gray-300 px-1 py-2 text-sm
             rounded-md shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

        </div>

        {/* ---------------- Rank Filter ---------------- */}
        <div className="flex items-center gap-2">
          <select
            value={searchRank}
            onChange={(e) => setSearchRank(e.target.value)}
            className="border border-gray-300 px-2 py-2 text-sm
             rounded-md shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition"
          >
            <option value="">All Ranks</option>
            {ranks.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

        </div>
      </div>


      {loading ? (
        <p className="text-2xl font-semibold">Loading List…</p>
      ) : (
        <div className="w-full">
          {/* ---------------- Desktop Table ---------------- */}
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

          {/* ---------------- Mobile Card View ---------------- */}
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

                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
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

      {/* ---------------- Popup ---------------- */}
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

      {/* ---------------- Pagination ---------------- */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        <button
          disabled={pageWindowStart === 1}
          onClick={handlePrevBlock}
          className={`px-4 py-2 rounded-lg shadow-md ${pageWindowStart === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
        >
          ← Prev
        </button>

        <div className="flex items-center gap-0.5 flex-wrap">
          <span className="font-medium text-gray-700">Page</span>
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-1 text-sm font-medium cursor-pointer ${page === p
                ? "text-blue-600 underline"
                : "text-gray-700 hover:text-blue-500"
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={pageWindowStart + PAGE_WINDOW_SIZE > totalPages}
          onClick={handleNextBlock}
          className={`px-4 py-2 rounded-lg shadow-md ${pageWindowStart + PAGE_WINDOW_SIZE > totalPages
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
