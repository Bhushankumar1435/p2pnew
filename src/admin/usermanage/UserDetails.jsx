import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetUserDetailsApi } from "../../api/Adminapi";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserDetails = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const type = query.get("type");
  const id = query.get("id");

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await GetUserDetailsApi(type, id);

      if (res.success) {
        let data = res.data?.data || [];
        if (!Array.isArray(data)) data = [data]; 
        setDetails(data);
      }
    } catch (err) {
      console.error("Detail fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!details.length) return <p className="text-center mt-4">No data found</p>;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = details.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(details.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-xl shadow relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Close button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="absolute top-8 right-8 text-gray-500 hover:text-red-600 font-bold text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <p className="text-gray-600"><strong>Selected Type:</strong> {type}</p>
      {/* <p className="text-gray-600 mb-4"><strong>User ID:</strong> {id}</p> */}

      {/* TEAM Table */}
      {type === "TEAM" && (
        <table className="w-full border mt-4 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Member</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id || index}>
                <td className="p-2 border">{item.level}</td>
                <td className="p-2 border">{item.member}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* BANK Table */}
      {type === "BANK" && (
        <table className="w-full border mt-4 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Bank Name</th>
              <th className="p-2 border">Account Number</th>
              <th className="p-2 border">IFSC Code</th>
              <th className="p-2 border">UPI</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id || index}>
                <td className="p-2 border">{item.bankName || '-'}</td>
                <td className="p-2 border">{item.accountNumber || '-'}</td>
                <td className="p-2 border">{item.ifscCode || '-'}</td>
                <td className="p-2 border">{item.upi || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* INCOME Table */}
      {type === "INCOME" && (
        <>
          <table className="w-full border mt-4 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Token</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Mode</th>
                <th className="p-2 border">Transaction Type</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="p-2 border">{item.token || '-'}</td>
                  <td className="p-2 border">{item.amount || '-'}</td>
                  <td className="p-2 border">{item.mode || '-'}</td>
                  <td className="p-2 border">{item.transactionType || '-'}</td>
                  <td className="p-2 border">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-gray-700">
            <strong>Remark:</strong> {currentItems[0]?.remark || '-'}
          </p>
        </>
      )}

      {/* ORDER Table */}
      {type === "ORDER" && (
        <>
          <table className="w-full border mt-4 text-center text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1 border">S. No.</th>
                <th className="p-1 border">Buyer ID</th>
                <th className="p-1 border">Seller ID</th>
                <th className="p-1 border">Token</th>
                <th className="p-1 border">Fiat</th>
                <th className="p-1 border">Seller Comm.</th>
                <th className="p-1 border">Buyer Comm.</th>
                <th className="p-1 border">Status</th>
                <th className="p-1 border">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="p-1 border">{indexOfFirstItem + index + 1}</td>
                  <td className="p-1 border">{item.buyer?.userId || '-'}</td>
                  <td className="p-1 border">{item.seller?.userId || '-'}</td>
                  <td className="p-1 border">{item.tokenAmount || '-'}</td>
                  <td className="p-1 border">{item.fiatAmount || '-'}</td>
                  <td className="p-1 border">{item.sellerCommission || '-'}</td>
                  <td className="p-1 border">{item.buyerCommission || '-'}</td>
                  <td className="p-1 border">{item.status || '-'}</td>
                  <td className="p-1 border">
                    {item.buyerReceipt ? (
                      <a
                        href={item.buyerReceipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {item.buyerReceipt.length > 15
                          ? item.buyerReceipt.slice(0, 15) + "..."
                          : item.buyerReceipt}
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDetails;
