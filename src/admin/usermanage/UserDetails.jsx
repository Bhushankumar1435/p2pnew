import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetUserDetailsApi, GetTeamByLevelApi } from "../../api/Adminapi";
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
  const [levelTeam, setLevelTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [teamPage, setTeamPage] = useState(1);
  const teamPageSize = 5;

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

  const fetchTeamByLevel = async (level) => {
    try {
      const res = await GetTeamByLevelApi(id, level);
      if (res.success) {
        setLevelTeam(res.data); // store team members
        setIsModalOpen(true);   // open modal
        setTeamPage(1);          // reset modal page
      } else {
        toast.error(res.message || "Failed to fetch team members");
      }
    } catch (error) {
      console.error("Team level fetch error:", error);
      toast.error("Error fetching team members");
    }
  };

  if (loading) return <p className="text-center mt-4 text-2xl font-medium">Loading Details...</p>;

  const teamItems = levelTeam?.teamMembers || [];
  const teamIndexOfLast = teamPage * teamPageSize;
  const teamIndexOfFirst = teamIndexOfLast - teamPageSize;
  const currentTeamItems = teamItems.slice(teamIndexOfFirst, teamIndexOfLast);
  const teamTotalPages = Math.ceil(teamItems.length / teamPageSize);

  // ---------------- PAGINATION FIX --------------------
  const items = type === "WALLET" ? walletData : details;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  

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
        <>
          {type === "TEAM" && (
            <table className="w-full border mt-4 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Level</th>
                  <th className="p-2 border">Member</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="p-2 border">{item.level}</td>
                    <td className="p-2 border">{item.member}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => fetchTeamByLevel(item.level)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {/* -------- Display Team By Level Result -------- */}
          {isModalOpen && levelTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
              <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 font-bold text-xl"
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">
                  Team Members (Level {levelTeam.teamMembers[0].level})
                </h3>

                <table className="w-full border text-center text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Sr. No.</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">User ID</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Country</th>
                      <th className="p-2 border">Phone</th>
                      <th className="p-2 border">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeamItems.map((member, index) => (
                      <tr key={member._id}>
                        <td className="p-2 border">
                          {(teamPage - 1) * teamPageSize + index + 1}
                        </td>
                        <td className="p-2 border">{member.inviteId?.name || "-"}</td>
                        <td className="p-2 border">{member.inviteId?.userId || "-"}</td>
                        <td className="p-2 border">{member.inviteId?.email || "-"}</td>
                        <td className="p-2 border">{member.inviteId?.country || "-"}</td>
                        <td className="p-2 border">{member.inviteId?.phoneNumber || "-"}</td>
                        <td className="p-2 border">{member.inviteId?.rank || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TEAM MODAL PAGINATION */}
                {teamTotalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-4">
                    <button
                      onClick={() => setTeamPage((p) => Math.max(1, p - 1))}
                      disabled={teamPage === 1}
                      className={`px-4 py-2 rounded-lg border ${teamPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                        }`}
                    >
                      Prev
                    </button>

                    <span className="px-4 py-2 font-medium">
                      Page {teamPage} of {teamTotalPages}
                    </span>

                    <button
                      onClick={() =>
                        setTeamPage((p) => Math.min(teamTotalPages, p + 1))
                      }
                      disabled={teamPage === teamTotalPages}
                      className={`px-4 py-2 rounded-lg border ${teamPage === teamTotalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                        }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}


      {/* ---------------- BANK ---------------- */}
      {type === "BANK" && (
        <>
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
          <div className="mt-4 w-full border rounded p-3 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2 text-left">BEP20 Address</h3>
            <p className="text-gray-700 text-left">
              {currentItems[0]?.address || "—"}
            </p>
          </div>
        </>
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
                <th className="p-2 border">Remark</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id || index} className="border-b">
                  <td className="p-2 border">{item.token}</td>
                  <td
                    className={`p-2 border font-semibold ${item.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {item.amount}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold text-white ${item.mode === "CREDIT" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                      {item.mode}
                    </span>
                  </td>
                  <td className="p-2 border">{item.transactionType}</td>
                  <td className="p-2 border">
                    {item.remark || "-"}
                  </td>
                  <td className="p-2 border">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
