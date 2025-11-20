import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminPost } from "../../api/Adminapi"; 

const TransferFund = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!userId || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await adminPost(
        "admin/transferFund",
        { userId, amount: Number(amount) },
        true 
      );

      if (res.success) {
        toast.success(res.message || "Fund transfer successfully!");
        setUserId("");
        setAmount("");
      } else {
        toast.error(res.message || "Transfer failed!");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-semibold mb-6 text-center">Transfer Fund</h2>

      <div className="mb-4">
        <label className="block text-base font-medium mb-1">Recipient User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter recipient ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-base font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter amount"
        />
      </div>

      <button
        onClick={handleTransfer}
        disabled={loading}
        className={`w-full py-2 mt-4 rounded-lg text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Transferring..." : "Transfer Fund"}
      </button>
    </div>
  );
};

export default TransferFund;
