import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminPost, GetAdminUsersApi } from "../../api/Adminapi";

const TransferFund = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [userName, setUserName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await GetAdminUsersApi(1, 500);

      if (res.success) {
        setAllUsers(res.data.users);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserName("");
      return;
    }

    const user = allUsers.find((u) => u.userId === userId.trim());

    setUserName(user ? user.name : "");
  }, [userId, allUsers]);

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
        toast.success(res.message || "Fund transferred!");
        setUserId("");
        setAmount("");
        setUserName("");
      } else {
        toast.error(res.message || "Transfer failed!");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <ToastContainer />

      <h2 className="text-3xl font-semibold mb-6 text-center">Transfer Fund</h2>

      {/* USER ID */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Recipient User ID</label>

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter user ID"
        />

        {/* Show username */}
        {userId && userName && (
          <p className="text-green-600 font-semibold mt-1">
            User Name: {userName}
          </p>
        )}

        {/* User not found */}
        {userId && !userName && (
          <p className="text-red-500 text-sm mt-1">User Not Found</p>
        )}
      </div>

      {/* AMOUNT */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter amount"
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleTransfer}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Transferring..." : "Transfer Fund"}
      </button>
    </div>
  );
};

export default TransferFund;
