import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getData, postData } from "../api/protectedApi";
import { FaArrowLeft, FaTimes, FaHistory } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getWithdrawOrders } from "../api/api"; // adjust path



const Withdraw = () => {
  const navigate = useNavigate();

  // ✅ States
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch wallet balance
  useEffect(() => {
    getData("/user/userBalance?type=INCOME", {})
      .then((res) => {
        setBalance(res.data?.data || 0);
      })
      .catch((err) => console.error("Balance Error:", err));
  }, []);

  // ✅ Handle Withdraw
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance.");
      return;
    }

    try {
      setLoading(true);
      const res = await postData("/user/placeWithdraw", {
        amount: Number(amount),
        // walletAddress,
      });


      if (res.success) {
        toast.success(res.message || "Withdrawal request submitted!");
        setAmount("");
        // setWalletAddress("");
      } else {
        toast.error(res.message || "Withdrawal failed.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = async () => {
    const res = await getWithdrawOrders(10, 1);

    if (res.success) {
      toast.success(res.message);
      console.log("Withdraw Orders:", res.data?.data);
      console.log("Total Count:", res.data?.count);
    } else {
      toast.error(res.message || "Couldn't load withdraw history");
    }
  };



  return (
    <>
      <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="min-h-screen flex flex-col items-center bg-white text-black">
          <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
            <Header />

            <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
              <div className="w-full py-5 px-3">

                <div className="font-semibold mb-4 text-lg flex items-center justify-between">
                  <h2>Withdraw Funds</h2>

                  <FaHistory
                    size={22}
                    className="text-blue-600 cursor-pointer"
                    onClick={() => navigate("/withdraw-history")}
                  />

                </div>

                {/* ✅ Withdraw Form */}
                <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 rounded-xl shadow-sm">
                  {/* Wallet Balance */}
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-700 font-medium"> Available amount:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${balance.toFixed(2)}
                    </span>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount to withdraw"
                      min="1"
                      step="0.01"
                    />
                  </div>


                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-2 rounded-lg font-semibold transition ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-400 hover:hover:from-blue-700 hover:to-cyan-500 transition"
                      }`}
                  >
                    {loading ? "Processing..." : "Withdraw"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div >
    </>
  );
};

export default Withdraw;
