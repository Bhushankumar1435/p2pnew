import React, { useState } from "react";
import { GetGlobalDividendApi } from "../../api/Adminapi";
import { toast, ToastContainer } from "react-toastify";

const DEFAULT_DATA = [
  { rank: "T1", percent: 5.56 },
  { rank: "T2", percent: 5.56 },
  { rank: "T3", percent: 5.56 },
  { rank: "T4", percent: 11.11 },
  { rank: "T5", percent: 11.11 },
  { rank: "T6", percent: 11.11 },
  { rank: "T7", percent: 16.67 },
  { rank: "T8", percent: 33.33 },
];

const Globaldividend = () => {
  const [amount, setAmount] = useState("");
  const [percentList, setPercentList] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);

  const handleDistribute = async () => {
    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid amount!");
    }

    // Only include ranks with percent > 0
    const validRanks = percentList.filter((p) => p.percent > 0);
    if (validRanks.length === 0) {
      return toast.error("No ranks eligible for distribution!");
    }

    const payload = {
      amount: Number(amount),
      percent: validRanks,
    };

    try {
      setLoading(true);
      const res = await GetGlobalDividendApi(payload);

      if (res?.success) {
        toast.success(res.message || "Income distributed successfully!");
      } else {
        toast.error(res?.message || "Distribution failed!");
      }
    } catch (error) {
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-semibold mb-4">Global Dividend</h2>
      <div className="bg-white p-3 rounded-xl shadow border flex flex-col">
        <label className="text-lg font-medium text-gray-700">
          Enter Dividend Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-2 border p-1.5 rounded-lg"
          placeholder="Enter amount"
        />
      </div>

      <div className="bg-white p-3 rounded-xl shadow border mt-3">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Rank Based Distribution
        </h3>
        <div className="space-y-3">
          {percentList.map((item, index) => (
            <div key={index}className="flex justify-between items-center p-1 border rounded-lg bg-gray-50">
              <span className="font-semibold">{item.rank}</span>
              <span
                className={`font-semibold ${item.percent === 0 ? "text-red-600" : "text-blue-600"
                  }`}
              >
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleDistribute}
        className="w-full mt-4 bg-blue-600 text-white text-xl font-medium p-3 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
        disabled={loading}
      >
        {loading ? "Distributing..." : "Distribute"}
      </button>
    </div>
  );
};

export default Globaldividend;
