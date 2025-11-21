import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminGet } from "../../api/Adminapi"; // adjust path

const IncomeHistory = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // items per page
  const [totalPages, setTotalPages] = useState(1);
  const [searchUserId, setSearchUserId] = useState("");

  // Fetch income history
  const fetchIncomeHistory = async () => {
    setLoading(true);
    try {
      let endpoint = `admin/incomeHistory?page=${page}&limit=${limit}`;
      if (searchUserId.trim()) {
        endpoint += `&userId=${encodeURIComponent(searchUserId.trim())}`;
      }

      const res = await adminGet(endpoint, true);
      if (res.success) {
        setIncomeData(res.data.data);
        const count = res.data.count || 0;
        setTotalPages(Math.ceil(count / limit));
      } else {
        toast.error(res.message || "Failed to fetch income history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeHistory();
  }, [page, searchUserId]);

  const handleSearchChange = (e) => {
    setSearchUserId(e.target.value);
    setPage(1); // reset to first page on new search
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold mb-4">Income History</h1>

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

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : incomeData.length === 0 ? (
        <p className="text-center">No income history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">UserID</th>
                {/* <th className="p-2 border">From User</th> */}
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Token</th>
                <th className="p-2 border">Mode</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Remark</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((item, index) => (
                <tr key={item._id} className="text-center">
                  <td className="border p-2">{ index + 1}</td>
                  <td className="p-2 border">{item.userId.userId}</td>
                  {/* <td className="p-2 border">{item.from || "-"}</td> */}
                  <td
                    className={`p-2 border ${item.mode === "CREDIT" ? "text-green-600" : "text-red-600"
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
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${page === 1
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
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${page >= totalPages
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

export default IncomeHistory;
