import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminGet } from "../../api/Adminapi";
import { GetUserTxnTypesApi } from "../../api/protectedApi";

const WalletHistory = () => {
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchUserId, setSearchUserId] = useState("");
  const [walletTypes, setWalletTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const maxVisiblePages = 10;
  const dropdownRef = useRef();

  // Fetch wallet history
  const fetchWalletHistory = async () => {
    setLoading(true);
    try {
      let endpoint = `admin/walletHistory?page=${page}&limit=${limit}`;
      if (searchUserId.trim()) {
        endpoint += `&userId=${encodeURIComponent(searchUserId.trim())}`;
      }
      if (selectedType) {
        endpoint += `&transactionType=${selectedType}`;
      }

      const res = await adminGet(endpoint, true);
      if (res.success) {
        setWalletData(res.data.data);
        const count = res.data.count || 0;
        const pages = Math.ceil(count / limit);
        setTotalPages(pages > 0 ? pages : 1); // ✅ always minimum 1

      } else {
        toast.error(res.message || "Failed to fetch wallet history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletHistory();
  }, [page, searchUserId, selectedType]);

  const handleSearchChange = (e) => {
    setSearchUserId(e.target.value);
    setPage(1);
  };

  // Fetch wallet types from user API
  const fetchWalletTypes = async () => {
    try {
      const res = await GetUserTxnTypesApi("WALLET");
      if (res.success) {
        setWalletTypes(res.data);
      } else {
        toast.error(res.message || "Failed to load wallet types");
      }
    } catch (err) {
      console.error("Error fetching wallet types:", err);
      toast.error("Failed to load wallet types");
    }
  };

  useEffect(() => {
    fetchWalletTypes();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* Title + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Wallet History</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-900 transition shadow-md"
          >
            {selectedType || "All"} ▼
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-52 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedType("");
                  setDropdownOpen(false);
                  setPage(1);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b"
              >
                All Types
              </button>

              {walletTypes.map((type, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedType(type);
                    setDropdownOpen(false);
                    setPage(1);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={searchUserId}
          onChange={handleSearchChange}
          placeholder="Search by User ID"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Wallet Data Table / Cards */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : walletData.length === 0 ? (
        <p className="text-center">No wallet history found.</p>
      ) : (
        <div className="w-full">
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">S.No</th>
                  <th className="p-2 border">UserID</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Mode</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Remark</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {walletData.map((item, index) => (
                  <tr key={item._id} className="text-center">
                    <td className="border p-2">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="p-2 border">{item.userId.userId}</td>
                    <td
                      className={`p-2 border border-black ${item.mode === "CREDIT"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {item.amount}
                    </td>
                    <td className="p-2 border">{item.token}</td>
                    <td className="p-2 border">{item.mode}</td>
                    <td className="p-2 border">{item.transactionType}</td>
                    <td className="p-2 border">{item.remark}</td>
                    <td className="p-2 border">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {walletData.map((item, index) => (
              <div key={item._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <p className="font-semibold text-gray-800">
                  #{(page - 1) * limit + index + 1} — {item.transactionType}
                </p>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">User ID:</span> {item.userId.userId}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    <span
                      className={`font-semibold ${item.mode === "CREDIT" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {item.amount}
                    </span>
                  </p>
                  <p><span className="font-medium">Token:</span> {item.token}</p>
                  <p><span className="font-medium">Mode:</span> {item.mode}</p>
                  <p><span className="font-medium">Type:</span> {item.transactionType}</p>
                  <p><span className="font-medium">Remark:</span> {item.remark}</p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
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


    </div>
  );
};

export default WalletHistory;
