import React, { useState } from "react";
import { BlockUnblockUserApi } from "../../api/Adminapi";

const BlockUnblock = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAction = async (action) => {
    if (!userId.trim()) {
      setMessage("Please enter a valid User ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await BlockUnblockUserApi(userId, action);

      if (res.success) {
        setMessage(
          action === "block"
            ? "User has been successfully blocked."
            : "User has been successfully unblocked."
        );
      } else {
        setMessage(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Block / Unblock User</h2>

      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4"
      />

      <div className="flex gap-4">
        <button
          onClick={() => handleAction("block")}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Block User
        </button>

        <button
          onClick={() => handleAction("unblock")}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Unblock User
        </button>
      </div>

      {message && (
        <p className="mt-4 font-medium text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default BlockUnblock;
