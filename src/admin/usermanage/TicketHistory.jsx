import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetAdminTicketHistoryApi, ManageAdminTicketApi } from "../../api/Adminapi";


const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("OPEN");

  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [solution, setSolution] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await GetAdminTicketHistoryApi(page, limit, activeTab);

      if (res.success) {
        setTickets(res.data.ticket || []);
        const count = res.data.count || 0;
        setTotalPages(Math.ceil(count / limit));
      } else {
        toast.error(res.message || "Failed to fetch tickets");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, activeTab]);

  const openPopup = (ticketId, status) => {
    setCurrentTicketId(ticketId);
    setSelectedAction(status);
    setSolution("");
    setShowPopup(true);
  };

  const submitSolution = async () => {
    if (!solution.trim()) {
      return toast.error("Solution is required!");
    }

    try {
      const res = await ManageAdminTicketApi(currentTicketId, {
        status: selectedAction,
        solution,
      });

      if (res.success) {
        toast.success("Ticket updated!");
        setShowPopup(false);
        fetchTickets();
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Ticket History</h1>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {["OPEN", "RESOLVED"].map((tab) => {
            const colors = {
              OPEN: "bg-gray-600 text-white",
              RESOLVED: "bg-green-600 text-white",
            };
            const defaultColors = {
              OPEN: "bg-gray-200 text-gray-600 hover:bg-gray-300",
              RESOLVED: "bg-green-100 text-green-600 hover:bg-green-200",
            };

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium ${activeTab === tab ? colors[tab] : defaultColors[tab]
                  }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>


      {/* TABLE */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-center">No {activeTab.toLowerCase()} tickets found.</p>
      ) : (
        <div className="w-full">

          {/* DESKTOP TABLE */}
          <div className="overflow-x-auto mt-4 hidden md:block">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">User ID</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">File</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((t, idx) => (
                  <tr key={t._id} className="text-center">
                    <td className="p-2 border"> {(page - 1) * limit + idx + 1} </td>
                    <td className="p-2 border">{t.userId?.userId || "-"}</td>
                    <td className="p-2 border">{t.orderId || "_"}</td>
                    <td className="p-2 border">{t.whatsapp}</td>
                    <td className="p-2 border">{t.message}</td>
                    <td className="p-2 border">{t.subject}</td>

                    <td className="p-2 border">
                      {t.doc ? (
                        <a href={t.doc} target="_blank" className="text-blue-600 underline">
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${t.status === "OPEN"
                          ? "text-yellow-600"
                          : "text-green-600"
                          }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="p-2 border">
                      {new Date(t.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </td>

                    <td className="p-2 border">
                      {activeTab === "OPEN" ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openPopup(t._id, "RESOLVED")}
                            className="px-3 py-1 bg-green-500 text-white rounded"
                          >
                            Resolve
                          </button>

                          {/* <button
                            onClick={() => openPopup(t._id, "CLOSED")}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Close
                          </button> */}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4 mt-4">
            {tickets.map((t) => (
              <div key={t._id} className="border rounded-xl p-4 shadow-sm bg-white">
                <p className="font-semibold text-gray-800">
                  {t.subject} — {t.status}
                </p>

                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">User ID:</span> {t.userId?.userId || "-"}</p>
                  <p><span className="font-medium">Order ID:</span> {t.orderId || "_"}</p>
                  <p><span className="font-medium">Contact:</span> {t.whatsapp || "—"}</p>
                  <p><span className="font-medium">Description:</span> {t.message}</p>
                  <p><span className="font-medium">Subject:</span> {t.subject}</p>

                  <p>
                    <span className="font-medium">File:</span>
                    {t.doc ? (
                      <a href={t.doc} target="_blank" className="text-blue-600 underline ml-1">
                        View
                      </a>
                    ) : (
                      " —"
                    )}
                  </p>

                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${t.status === "OPEN"
                        ? "text-yellow-600"
                        : "text-green-600"
                        }`}
                    >
                      {t.status}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(t.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>

                  {/* MOBILE ACTION BUTTONS */}
                  {activeTab === "OPEN" ? (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openPopup(t._id, "RESOLVED")}
                        className="flex-1 bg-green-500 text-white py-1 rounded"
                      >
                        Resolve
                      </button>

                      <button
                        onClick={() => openPopup(t._id, "CLOSED")}
                        className="flex-1 bg-red-500 text-white py-1 rounded"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-500">Action: —</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* PAGINATION */}
      <div className="flex justify-between items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
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
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg shadow-md ${page >= totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
        >
          <span className="md:hidden">→</span>
          <span className="hidden md:inline">Next →</span>
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-white/95 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Provide Solution</h2>

            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Enter solution..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitSolution}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketHistory;
