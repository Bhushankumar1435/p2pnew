import React, { useEffect, useState } from "react";
import { GetAdminDealsApi } from "../../api/Adminapi";

const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDeals();
  }, [page]);

  const fetchDeals = async () => {
  setLoading(true);

  try {
    const res = await GetAdminDealsApi(page, limit);

    if (res.success) {
      const newDeals = res.data.deals || [];

      if (page === 1) {
        setDeals(newDeals);       // reset first page
      } else {
        setDeals((prev) => [...prev, ...newDeals]); // append next pages
      }

      const total = res.data.count || 1;
      setTotalPages(Math.ceil(total / limit));
    }
  } catch (err) {
    console.error("Deals Error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-6xl mx-auto bg-white p-6 mt-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Deals</h2>

      {loading ? (
        <p>Loading deals...</p>
      ) : (
        <>
          {/* ----------------------- Desktop Table ----------------------- */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-blue-50 text-center">
                <tr>
                  <th className="py-2 px-3 border">S.No</th>
                  <th className="py-2 px-3 border">User ID</th>
                  <th className="py-2 px-3 border">Token</th>
                  <th className="py-2 px-3 border">Fiat</th>
                  <th className="py-2 px-3 border">Price</th>
                  <th className="py-2 px-3 border">Available Amount</th>
                  <th className="py-2 px-3 border">Payment</th>
                  <th className="py-2 px-3 border">Status</th>
                  <th className="py-2 px-3 border">Order ID</th>
                  <th className="py-2 px-3 border">Created At</th>
                </tr>
              </thead>

              <tbody>
                {deals.length > 0 ? (
                  deals.map((deal, index) => (
                    <tr key={deal._id} className="hover:bg-gray-50 text-center">
                      <td className="py-2 px-3 border">{(page - 1) * limit + (index + 1)}</td>
                      <td className="py-2 px-3 border">{deal.userId?.userId || "—"}</td>
                      <td className="py-2 px-3 border">{deal.token}</td>
                      <td className="py-2 px-3 border">{deal.fiat}</td>
                      <td className="py-2 px-3 border">{deal.price}</td>
                      <td className="py-2 px-3 border">{deal.availableAmount}</td>

                      <td className="py-2 px-3 border">
                        {deal.paymentMethods?.join(", ")}
                      </td>

                      <td className="py-2 px-3 border">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            deal.status === "COMPLETED"
                              ? "bg-green-200 text-green-700"
                              : deal.status === "PROCESSING"
                              ? "bg-yellow-200 text-yellow-700"
                              : "bg-gray-300 text-gray-700"
                          }`}
                        >
                          {deal.status}
                        </span>
                      </td>

                      <td className="py-2 px-3 border">{deal.orderId}</td>

                      <td className="py-2 px-3 border">
                        {new Date(deal.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-4 text-center text-gray-500">
                      No deals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ----------------------- Mobile Cards ----------------------- */}
          <div className="lg:hidden flex flex-col gap-4 ">
            {deals.map((deal, index) => (
              <div key={deal._id} className="border rounded-xl p-4 bg-gray-50 shadow">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">#{(page - 1) * limit + (index + 1)}</h3>

                  <span className="px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">
                    {deal.status}
                  </span>
                </div>

                <p><strong>User:</strong> {deal.userId?.userId || "—"}</p>
                <p className="hidden md:block"><strong>Token:</strong> {deal.token}</p>
                <p className="hidden md:block"><strong>Fiat:</strong> {deal.fiat}</p>
                <p ><strong>Price:</strong> {deal.price}</p>
                <p><strong>Available:</strong> {deal.availableAmount}</p>
                <p className="hidden md:block"><strong>Payment:</strong> {deal.paymentMethods?.join(", ")}</p>
                <p><strong>Order ID:</strong> {deal.orderId}</p>

                <p className="text-sm mt-2">
                  <strong>Created:</strong>{" "}
                  {new Date(deal.createdAt).toLocaleString()}
                </p>
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

export default ManageDeals;
