import React, { useEffect, useState } from "react";
import { GetSubAdminListApi } from "../../api/Adminapi";

const SubAdminList = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchUserId, setSearchUserId] = useState("");
  const maxVisiblePages = 10;


  useEffect(() => {
    fetchSubAdmins();
  }, [page]);

  const fetchSubAdmins = async () => {
    setLoading(true);

    const res = await GetSubAdminListApi(page, limit);

    if (res.success) {
      setSubAdmins(res.data.subAdmins || []);

      const count = res.data.count || 0;
      const pages = Math.ceil(count / limit);
      setTotalPages(pages > 0 ? pages : 1); // ✅ always minimum 1

    }

    setLoading(false);
  };

  const filteredSubAdmins = subAdmins.filter((sa) =>
    sa.userId?.toLowerCase().includes(searchUserId.toLowerCase())
  );


  const getVisiblePageNumbers = () => {
    // calculate current block
    let start = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  // For Next / Prev page buttons
  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Validator List</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by User ID (e.g. OJD5I)"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="w-full md:w-52 px-2 py-1 rounded-lg border
               focus:outline-none focus:ring
               transition shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subAdmins.length > 0 ? (
        <div className="overflow-x-auto">

          {/* 👉 Desktop Table */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">S. No.</th>
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Country</th>
                <th className="p-3 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubAdmins.map((sa, index) => (
                <tr key={sa._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{(page - 1) * limit + (index + 1)}</td>
                  <td className="p-3 border">{sa.userId}</td>
                  <td className="p-3 border">{sa.name}</td>
                  <td className="p-3 border">{sa.email}</td>
                  <td className="p-3 border">{sa.country}</td>
                  <td className="p-3 border">
                    {new Date(sa.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 👉 Mobile Card View */}
          <div className="md:hidden space-y-4 p-2">
            {subAdmins.map((sa, index) => (
              <div key={sa._id} className="border rounded-xl p-4 shadow-sm bg-white">
                <p className="text-gray-800 font-semibold">
                  #{(page - 1) * limit + (index + 1)} — {sa.name}
                </p>

                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Email: </span>
                    {sa.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Created At: </span>
                    {new Date(sa.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 👉 Pagination Controls */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">

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
              <span className="font-medium text-gray-700">Page</span>

              {getVisiblePageNumbers().map(p => (
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
      ) : (
        <p className="text-center text-gray-500">No Sub-Admins Found</p>
      )}
    </div>
  );
};

export default SubAdminList;
