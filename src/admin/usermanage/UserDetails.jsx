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

  const maxVisiblePages = 10;

  const navigate = useNavigate();

  // Fetch user details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await GetUserDetailsApi(type, id);

      if (res.success) {
        const data = res.data?.data;

        switch (type) {
          case "INCOME":
          case "DEPOSIT":
          case "WITHDRAW":
          case "DEAL":
            setDetails(Array.isArray(data) ? data : []);
            break;
          case "TEAM":
            setDetails(Array.isArray(data) ? data : []);
            break;

          case "WALLET":
            setWalletData(Array.isArray(data) ? data : []);
            break;

          case "BANK":
          default:
            setDetails(data ? [data] : []);
        }

        // Reset current page after new data
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Detail fetch error:", err);
      toast.error("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  // Call fetch on type/id change
  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  // Fetch team by level
  const fetchTeamByLevel = async (level) => {
    try {
      const res = await GetTeamByLevelApi(id, level);
      if (res.success) {
        setLevelTeam(res.data);
        setIsModalOpen(true);
        setTeamPage(1); // reset team modal page
      } else {
        toast.error(res.message || "Failed to fetch team members");
      }
    } catch (error) {
      console.error("Team level fetch error:", error);
      toast.error("Error fetching team members");
    }
  };

  // Pagination logic (main list)
  const items = type === "WALLET" ? walletData : details;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(items) ? items.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Team modal pagination
  const teamItems = Array.isArray(levelTeam?.teamMembers) ? levelTeam.teamMembers : [];
  const teamIndexOfLast = teamPage * teamPageSize;
  const teamIndexOfFirst = teamIndexOfLast - teamPageSize;
  const currentTeamItems = teamItems.slice(teamIndexOfFirst, teamIndexOfLast);
  const teamTotalPages = Math.max(1, Math.ceil(teamItems.length / teamPageSize));

  // Loading fallback
  if (loading) {
    return <p className="text-center mt-4 text-2xl font-medium">Loading Details...</p>;
  }

  // Small card wrapper component for mobile views
  const CardWrapper = ({ children }) => (
    <div className="border rounded-lg p-4 shadow-sm bg-white">{children}</div>
  );


  const Field = ({ label, value }) => (
    <p className="text-sm text-gray-700">
      <span className="font-medium">{label}:</span> {value ?? "-"}
    </p>
  );

  const getVisiblePageNumbers = () => {
    let start = Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const getVisibleTeamPageNumbers = () => {
    let start = Math.floor((teamPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
    let end = Math.min(start + maxVisiblePages - 1, teamTotalPages);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const handlePrevPage = () =>
    setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setCurrentPage(prev => Math.min(prev + 1, totalPages));



  return (
    <div className="max-w-[960px] mx-auto bg-white p-6 mt-10 rounded-xl shadow relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Close */}
      <button
        onClick={() => navigate("/admin/users")}
        className="absolute top-6 right-6 text-gray-500 hover:text-red-600 font-bold text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-2">User Details</h2>
      <p className="text-gray-600 mb-4">
        <strong>Selected Type:</strong> {type}
      </p>

      {/* ================= TEAM (desktop table + mobile cards) ================= */}

      {type === "TEAM" && (
        <>
          {/* desktop table */}
          <div className="hidden md:block">
            <table className="w-full border text-center">
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
                        className="px-2 py-0.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="md:hidden space-y-4">
            {currentItems.map((item, index) => (
              <CardWrapper key={item._id || index}>
                <p className="font-semibold text-gray-800">Level {item.level}</p>
                <div className="mt-2 space-y-1">
                  <Field label="Member" value={item.member} />
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => fetchTeamByLevel(item.level)}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    View Members
                  </button>
                </div>
              </CardWrapper>
            ))}
          </div>

          {/* Team modal */}
          {isModalOpen && levelTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white w-full max-w-3xl rounded-lg p-5 shadow-lg overflow-auto max-h-[85vh]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-6 text-black hover:text-red-600 font-bold text-xl"
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold mb-3">
                  Team Members (Level {levelTeam.teamMembers?.[0]?.level ?? "-"})
                </h3>

                {/* desktop table inside modal */}
                <div className="hidden md:block">
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
                      {currentTeamItems.map((member, idx) => (
                        <tr key={member._id || idx}>
                          <td className="p-2 border">
                            {(teamPage - 1) * teamPageSize + idx + 1}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.name || "-"}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.userId || "-"}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.email || "-"}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.country || "-"}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.phoneNumber || "-"}
                          </td>
                          <td className="p-2 border">
                            {member.inviteId?.rank || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* mobile cards inside modal */}
                <div className="md:hidden space-y-3">
                  {currentTeamItems.map((member, idx) => (
                    <CardWrapper key={member._id || idx}>
                      <p className="font-semibold text-gray-800">
                        #{(teamPage - 1) * teamPageSize + idx + 1} —{" "}
                        {member.inviteId?.name || "-"}
                      </p>
                      <div className="mt-2 space-y-1">
                        <Field label="User ID" value={member.inviteId?.userId} />
                        <Field label="Email" value={member.inviteId?.email} />
                        <Field label="Country" value={member.inviteId?.country} />
                        <Field label="Phone" value={member.inviteId?.phoneNumber} />
                        <Field label="Rank" value={member.inviteId?.rank} />
                      </div>
                    </CardWrapper>
                  ))}
                </div>

                {/* team modal pagination */}
                {teamTotalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-3 flex-wrap">
                    <button
                      disabled={currentPage === 1}
                      onClick={handlePrevPage}
                    >
                      ← Prev
                    </button>

                    {getVisiblePageNumbers().map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={currentPage === p ? "underline text-blue-600" : ""}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={handleNextPage}
                    >
                      Next →
                    </button>

                  </div>
                )}


              </div>
            </div>
          )}
        </>
      )}

      {/* ================= BANK ================= */}

      {type === "BANK" && (
        <>
          {/* desktop table */}
          <div className="hidden md:block">
            <table className="w-full border mt-4 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Bank Name</th>
                  <th className="p-2 border">Account Number</th>
                  <th className="p-2 border">IFSC Code</th>
                  <th className="p-2 border">Branch Name</th>
                  <th className="p-2 border">UPI</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td className="p-2 border">{item.bankName || "-"}</td>
                    <td className="p-2 border">{item.accountNumber || "-"}</td>
                    <td className="p-2 border">{item.ifscCode || "-"}</td>
                    <td className="p-2 border">{item.branchName || "-"}</td>
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
          </div>

          {/* mobile cards */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((item, idx) => (
              <CardWrapper key={item._id || idx}>
                <Field label="Bank Name" value={item.bankName} />
                <Field label="Account Number" value={item.accountNumber} />
                <Field label="IFSC Code" value={item.ifscCode} />
                <Field label="IFSC Code" value={item.branchName} />
                <Field label="UPI" value={item.upi} />
                <div className="mt-2">
                  <h4 className="font-medium">BEP20 Address</h4>
                  <p className="text-sm text-gray-700">{item.address || "-"}</p>
                </div>
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {/* ================= INCOME ================= */}
      {type === "INCOME" && (
        <>
          {/* desktop */}
          <div className="hidden md:block">
            <table className="w-full border mt-4 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Mode</th>
                  <th className="p-2 border">Transaction Type</th>
                  <th className="p-2 border">Remark</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b">
                    <td className="p-2 border">{indexOfFirstItem + idx + 1}</td>
                    <td className="p-2 border">{item.token}</td>
                    <td className={`p-2 border font-semibold ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.amount}
                    </td>
                    <td className="p-2 border">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold text-white ${item.mode === "CREDIT" ? "bg-green-600" : "bg-red-600"}`}>
                        {item.mode}
                      </span>
                    </td>
                    <td className="p-2 border">{item.transactionType}</td>
                    <td className="p-2 border">{item.remark || "-"}</td>
                    <td className="p-2 border">
                      {new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((item, idx) => (
              <CardWrapper key={item._id || idx}>
                <p className="font-semibold text-gray-800">
                  #{indexOfFirstItem + idx + 1} — {item.transactionType}
                </p>
                <div className="mt-2 space-y-1">
                  <Field label="Token" value={item.token} />
                  <Field label="Amount" value={item.amount} />
                  <Field label="Mode" value={item.mode} />
                  <Field label="Type" value={item.transactionType} />
                  <Field label="Remark" value={item.remark || "-"} />
                  <Field
                    label="Date"
                    value={new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  />
                </div>
              </CardWrapper>
            ))}
          </div>

        </>
      )}

      {/* ================= ORDER ================= */}
      {type === "ORDER" && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
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
                {currentItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td className="p-1 border">{indexOfFirstItem + idx + 1}</td>
                    <td className="p-1 border">{item.buyer?.userId || "-"}</td>
                    <td className="p-1 border">{item.seller?.userId || "-"}</td>
                    <td className="p-1 border">{item.tokenAmount}</td>
                    <td className="p-1 border">{item.fiatAmount}</td>
                    <td className="p-1 border">{item.sellerCommission}</td>
                    <td className="p-1 border">{item.buyerCommission}</td>
                    <td className="p-1 border">{item.status}</td>
                    <td className="p-1 border">
                      {item.buyerReceipt ? (
                        <a href={item.buyerReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((item, idx) => (
              <CardWrapper key={item._id || idx}>
                <p className="font-semibold">Order #{indexOfFirstItem + idx + 1}</p>
                <Field label="Buyer ID" value={item.buyer?.userId} />
                <Field label="Seller ID" value={item.seller?.userId} />
                <Field label="Token Amount" value={item.tokenAmount} />
                <Field label="Fiat Amount" value={item.fiatAmount} />
                <Field label="Seller Comm." value={item.sellerCommission} />
                <Field label="Buyer Comm." value={item.buyerCommission} />
                <Field label="Status" value={item.status} />
                <p>
                  <span className="font-medium">Receipt:</span>{" "}
                  {item.buyerReceipt ? (
                    <a href={item.buyerReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {/* ================= WALLET ================= */}
      {type === "WALLET" && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
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
                {currentItems.map((w, idx) => (
                  <tr key={w._id || idx} className="border-b">
                    <td className="border p-2">{indexOfFirstItem + idx + 1}</td>
                    <td className="p-2 border">{w.token}</td>
                    <td className={`p-2 border font-semibold ${w.amount > 0 ? "text-green-600" : "text-red-600"}`}>{w.amount}</td>
                    <td className="p-2 border">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold text-white ${w.mode === "CREDIT" ? "bg-green-600" : "bg-red-600"}`}>{w.mode}</span>
                    </td>
                    <td className="p-2 border">{w.transactionType}</td>
                    <td className="p-2 border text-sm">{w.remark}</td>
                    <td className="p-2 border text-sm">{new Date(w.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((w, idx) => (
              <CardWrapper key={w._id || idx}>
                <p className="font-semibold">#{indexOfFirstItem + idx + 1} — {w.transactionType}</p>
                <div className="mt-2 space-y-1">
                  <Field label="Token" value={w.token} />
                  <Field label="Amount" value={w.amount} />
                  <Field label="Mode" value={w.mode} />
                  <Field label="Type" value={w.transactionType} />
                  <Field label="Remark" value={w.remark} />
                  <Field label="Date" value={new Date(w.createdAt).toLocaleString()} />
                </div>
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {/* ================= DEPOSIT ================= */}
      {type === "DEPOSIT" && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full border rounded-lg mt-4 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No.</th>
                  {/* <th className="p-2 border">User ID</th> */}
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((d, idx) => (
                  <tr key={d._id || idx} className="border-b">
                    <td className="p-2 border">{indexOfFirstItem + idx + 1}</td>
                    {/* <td className="p-2 border">{d.userId?.userId || d.userId || "-"}</td> */}
                    <td className="p-2 border">{d.token}</td>
                    <td className="p-2 border font-semibold text-blue-600">{d.amount}</td>
                    <td className="p-2 border">{d.transactionType}</td>
                    <td className="p-2 border text-sm">{new Date(d.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((d, idx) => (
              <CardWrapper key={d._id || idx}>
                <p className="font-semibold">Deposit #{indexOfFirstItem + idx + 1}</p>
                <Field label="User ID" value={d.userId?.userId || d.userId} />
                <Field label="Token" value={d.token} />
                <Field label="Amount" value={d.amount} />
                <Field label="Type" value={d.transactionType} />
                <Field label="Date" value={new Date(d.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} />
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {/* ================= WITHDRAW ================= */}
      {type === "WITHDRAW" && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full border rounded-lg mt-4 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No.</th>
                  {/* <th className="p-2 border">User ID</th> */}
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Remark</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((w, idx) => (
                  <tr key={w._id || idx} className="border-b">
                    <td className="p-2 border">{indexOfFirstItem + idx + 1}</td>
                    {/* <td className="p-2 border">{w.userId?.userId || "-"}</td> */}
                    <td className="p-2 border">{w.token}</td>
                    <td className="p-2 border text-red-600 font-semibold">{w.amount}</td>
                    <td className="p-2 border">
                      <span className={`p-2 text-xs font-semibold ${w.status === "APPROVED" ? "text-green-600" : w.status === "REJECTED" ? "text-red-600" : "text-gray-600"}`}>{w.status}</span>
                    </td>
                    <td className="p-2 border">{w.remark}</td>
                    <td className="p-2 border text-sm">{new Date(w.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((w, idx) => (
              <CardWrapper key={w._id || idx}>
                <p className="font-semibold">Withdraw #{indexOfFirstItem + idx + 1}</p>
                <Field label="User ID" value={w.userId?.userId} />
                <Field label="Token" value={w.token} />
                <Field label="Amount" value={w.amount} />
                <Field label="Status" value={w.status} />
                <Field label="Remark" value={w.remark} />
                <Field label="Date" value={new Date(w.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} />
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {/* ================= DEAL ================= */}
      {type === "DEAL" && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full border rounded-lg mt-4 text-center text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No.</th>
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
                {currentItems.map((d, idx) => (
                  <tr key={d._id || idx} className="border-b">
                    <td className="p-2 border">{indexOfFirstItem + idx + 1}</td>
                    <td className="p-2 border">{d.token}</td>
                    <td className="p-2 border">{d.fiat}</td>
                    <td className="p-2 border">{d.price}</td>
                    <td className="p-2 border">{d.availableAmount}</td>
                    <td className="p-2 border">{Array.isArray(d.paymentMethods) ? d.paymentMethods.join(", ") : "-"}</td>
                    <td className="p-2 border">{d.status}</td>
                    <td className="p-2 border">{d.orderId}</td>
                    <td className="p-2 border text-sm">{new Date(d.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((d, idx) => (
              <CardWrapper key={d._id || idx}>
                <p className="font-semibold">Deal #{indexOfFirstItem + idx + 1}</p>
                <Field label="Token" value={d.token} />
                <Field label="Fiat" value={d.fiat} />
                <Field label="Price" value={d.price} />
                <Field label="Available Amount" value={d.availableAmount} />
                <Field label="Payment Methods" value={Array.isArray(d.paymentMethods) ? d.paymentMethods.join(", ") : "-"} />
                <Field label="Status" value={d.status} />
                <Field label="Order ID" value={d.orderId} />
                <Field label="Date" value={new Date(d.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} />
              </CardWrapper>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
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

      )}


    </div>
  );
};

export default UserDetails;
