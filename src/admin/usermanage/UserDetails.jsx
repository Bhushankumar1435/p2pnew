import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetUserDetailsApi } from "../../api/Adminapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetails = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const type = query.get("type");
  const id = query.get("id");

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [walletData, setWalletData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const res = await GetUserDetailsApi(type, id);

      if (res.success) {
        let data = res.data?.data || [];

        switch (type) {
          case "INCOME": case "DEPOSIT": case "WITHDRAW": case "DEAL":
            setDetails(Array.isArray(data) ? data : []);
            break;

          case "WALLET":
            setWalletData(Array.isArray(data) ? data : []);
            break;

          case "BANK":
            setDetails(Array.isArray(data) ? data : [data]);
            break;

          default:
            setDetails(Array.isArray(data) ? data : [data]);
        }
      }
    } catch (err) {
      console.error("Detail fetch error:", err);
    }

    setLoading(false);
  };



  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  if (loading) return <p className="text-center mt-4 text-2xl font-medium">Loading Details...</p>;

  // ---------------- PAGINATION FIX --------------------
  const items = type === "WALLET" ? walletData : details;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // FIX: No Data FOUND must run AFTER items exist
  // if (!items || items.length === 0) {
  //   return <p className="text-center mt-4">No data found</p>;
  // }

  // ------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-xl shadow relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Close button */}
      <button
        onClick={() => navigate("/admin/users")}
        className="absolute top-8 right-8 text-gray-500 hover:text-red-600 font-bold text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <p className="text-gray-600">
        <strong>Selected Type:</strong> {type}
      </p>

      {/* ---------------- TEAM ---------------- */}
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

      {/* ---------------- BANK ---------------- */}
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
                <td className="p-2 border">{item.bankName || "-"}</td>
                <td className="p-2 border">{item.accountNumber || "-"}</td>
                <td className="p-2 border">{item.ifscCode || "-"}</td>
                <td className="p-2 border">{item.upi || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- INCOME ---------------- */}
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
                  <td className="p-2 border">{item.token}</td>
                  <td className="p-2 border">{item.amount}</td>
                  <td className="p-2 border">{item.mode}</td>
                  <td className="p-2 border">{item.transactionType}</td>
                  <td className="p-2 border">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-2 text-gray-700">
            <strong>Remark:</strong> {currentItems[0]?.remark || "-"}
          </p>
        </>
      )}

      {/* ---------------- ORDER ---------------- */}
      {type === "ORDER" && (
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
                <td className="p-1 border">{item.buyer?.userId || "-"}</td>
                <td className="p-1 border">{item.seller?.userId || "-"}</td>
                <td className="p-1 border">{item.tokenAmount}</td>
                <td className="p-1 border">{item.fiatAmount}</td>
                <td className="p-1 border">{item.sellerCommission}</td>
                <td className="p-1 border">{item.buyerCommission}</td>
                <td className="p-1 border">{item.status}</td>
                <td className="p-1 border">
                  {item.buyerReceipt ? (
                    <a
                      href={item.buyerReceipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.buyerReceipt.slice(0, 15)}...
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- WALLET ---------------- */}
      {type === "WALLET" && (
        <table className="w-full border rounded-lg mt-4">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2 border">S.No.</th>
              <th className="p-2 border">Token</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Mode</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Remark</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((w, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                <td className="p-2 border">{w.token}</td>
                <td
                  className={`p-2 border font-semibold ${w.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {w.amount}
                </td>
                <td className="p-2 border">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold text-white ${w.mode === "CREDIT" ? "bg-green-600" : "bg-red-600"
                      }`}
                  >
                    {w.mode}
                  </span>
                </td>
                <td className="p-2 border">{w.transactionType}</td>
                <td className="p-2 border text-sm">{w.remark}</td>
                <td className="p-2 border text-sm">
                  {new Date(w.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- DEPOSIT ---------------- */}
      {type === "DEPOSIT" && (
        <table className="w-full border rounded-lg mt-4 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">S.No.</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Token</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((d, index) => (
              <tr key={d._id || index} className="border-b">
                <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
                <td className="p-2 border">
                  {d.userId?.userId || d.userId || "-"}
                </td>
                <td className="p-2 border">{d.token}</td>
                <td className="p-2 border font-semibold text-blue-600">
                  {d.amount}
                </td>
                <td className="p-2 border">{d.transactionType}</td>
                <td className="p-2 border text-sm">
                  {new Date(d.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- WITHDRAW ---------------- */}
      {type === "WITHDRAW" && (
        <table className="w-full border rounded-lg mt-4 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">S.No.</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Token</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Remark</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((w, index) => (
              <tr key={w._id || index} className="border-b">
                <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
                <td className="p-2 border">{w.userId?.userId || "-"}</td>
                <td className="p-2 border">{w.token}</td>
                <td className="p-2 border text-red-600 font-semibold">
                  {w.amount}
                </td>
                <td className="p-2 border">
                  <span
                    className={`p-2 text-xs font-semibold ${w.status === "APPROVED"
                      ? "text-green-600"
                      : w.status === "REJECTED"
                        ? "text-red-600"
                        : "text-gray-600"
                      }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="p-2 border">{w.remark}</td>
                <td className="p-2 border text-sm">
                  {new Date(w.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- DEAL ---------------- */}
      {type === "DEAL" && (
        <>
          <table className="w-full border rounded-lg mt-4 text-center text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S.No.</th>
                {/* <th className="p-2 border">User ID</th> */}
                <th className="p-2 border">Token</th>
                <th className="p-2 border">Fiat</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Available Amount</th>
                <th className="p-2 border">Payment Methods</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((d, index) => (
                <tr key={d._id || index} className="border-b">
                  <td className="p-2 border">{indexOfFirstItem + index + 1}</td>

                  {/* <td className="p-2 border">
                    {typeof d.userId === "object"
                      ? d.userId.userId
                      : d.userId || "-"}
                  </td> */}

                  <td className="p-2 border">{d.token}</td>
                  <td className="p-2 border">{d.fiat}</td>
                  <td className="p-2 border">{d.price}</td>
                  <td className="p-2 border">{d.availableAmount}</td>

                  <td className="p-2 border">
                    {Array.isArray(d.paymentMethods)
                      ? d.paymentMethods.join(", ")
                      : "-"}
                  </td>

                  <td className="p-2 border">{d.status}</td>
                  <td className="p-2 border">{d.orderId}</td>

                  <td className="p-2 border text-sm">
                    {new Date(d.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}


      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
              }`}
          >
            Prev
          </button>

          <span className="px-4 py-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
