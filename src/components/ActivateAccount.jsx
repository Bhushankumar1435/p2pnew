import React, { useEffect, useState } from "react";
import { getData, postData } from "../api/protectedApi";
import { validateSponser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);
  const [validatedUser, setValidatedUser] = useState("");

  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState(false);

  const navigate = useNavigate();

  // ============================================
  // 🔍 CHECK USER
  // ============================================
  const checkUser = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID.");
      return;
    }

    setLoadingCheck(true);

    try {
      const response = await validateSponser(userId);

      if (!response?.success) {
        toast.error(response?.message || "User not found.");
        setUserId("");
        setValidatedUser("");
        setLoadingCheck(false);
        return;
      }

      toast.success(response?.message || "User verified.");
      setValidatedUser(response?.data?.name || "User verified");
    } catch (err) {
      toast.error("Unable to validate user.");
      setValidatedUser("");
    }

    setLoadingCheck(false);
  };

  // ============================================
  // 🚀 ACTIVATE USER
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("User ID is required.");
      return;
    }

    setLoadingActivate(true);

    try {
      const res = await postData("/user/activateAccount", { userId });

      const success =
        res?.data?.success ??
        res?.success ??
        res?.data?.data?.success ??
        false;

      const message =
        res?.data?.message ||
        res?.message ||
        res?.data?.data?.message ||
        "Unknown response";

      if (success) {
        toast.success(message);
        setUserId("");
        setValidatedUser("");
      } else {
        toast.error(message || "Activation failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }

    setLoadingActivate(false);
  };

  // ============================================
  // Get Wallet Balance
  // ============================================
  useEffect(() => {
    getData("/user/userBalance?type=WALLET")
      .then((res) => {
        setBalance(res.data?.data || 0);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="min-h-screen flex flex-col items-center bg-white text-black">
          <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
            <Header />

            <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
              <div className="w-full py-5 px-3">
                <h2 className="font-semibold mb-4 text-lg">Activate Account</h2>

                <div className="flex items-center justify-between w-full border border-gray-300 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-700 font-medium">Wallet Balance:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${balance.toFixed(2)}
                  </span>
                </div>

                {/* =================== FORM =================== */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter User ID
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. P2P12"
                    />
                  </div>

                  {validatedUser && (
                    <p className="text-sm text-green-600 font-medium">
                      ✔ {validatedUser}
                    </p>
                  )}

                  <div className="flex gap-3">
                    {/* 🔄 Check User Button */}
                    <button
                      type="button"
                      onClick={checkUser}
                      disabled={loadingCheck}
                      className={`px-4 py-2 rounded-lg text-white ${
                        loadingCheck ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
                      } flex items-center gap-2`}
                    >
                      {loadingCheck && (
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                      )}
                      {loadingCheck ? "Checking..." : "Check User"}
                    </button>

                    {/* 🚀 Activate Account Button */}
                    <button
                      type="submit"
                      disabled={loadingActivate}
                      className={`px-4 py-2 rounded-lg text-white ${
                        loadingActivate ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                      } flex items-center gap-2`}
                    >
                      {loadingActivate && (
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                      )}
                      {loadingActivate ? "Processing..." : "Activate Account"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default ActivateAccount;
