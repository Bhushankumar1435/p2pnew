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

  const [checkingUser, setCheckingUser] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState(false);

  const navigate = useNavigate();

  // ============================================
  // 🔍 AUTO CHECK USER (DEBOUNCED)
  // ============================================
  useEffect(() => {
    if (!userId.trim()) {
      setValidatedUser("");
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUser(true);

      try {
        const response = await validateSponser(userId);

        if (response?.success) {
          setValidatedUser(response?.data?.name || "User verified");
        } else {
          setValidatedUser("");
        }
      } catch {
        setValidatedUser("");
      }

      setCheckingUser(false);
    }, 600); // 👈 debounce delay

    return () => clearTimeout(timer);
  }, [userId]);

  // ============================================
  // 🚀 ACTIVATE USER
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("User ID is required.");
      return;
    }

    if (!validatedUser) {
      toast.error("Invalid User ID.");
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
    } catch {
      toast.error("Something went wrong.");
    }

    setLoadingActivate(false);
  };

  // ============================================
  // 💰 GET WALLET BALANCE
  // ============================================
  useEffect(() => {
    getData("/user/userBalance?type=WALLET")
      .then((res) => {
        setBalance(res.data?.data || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <div className="flex-1 px-4 py-5">
          <h2 className="font-semibold mb-4 text-lg">Activate Account</h2>

          {/* Wallet */}
          <div className="flex justify-between border bg-white p-4 rounded-lg shadow-sm mb-5">
            <span className="font-medium">Wallet Balance</span>
            <span className="text-green-600 font-bold">
              ${balance.toFixed(2)}
            </span>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Enter User ID
              </label>

              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border rounded-lg p-2 "
                placeholder="e.g. P2P12"
              />

              {/* AUTO USER STATUS */}
              <div className="mt-2 min-h-[20px]">
                {checkingUser && (
                  <p className="text-xs text-gray-400">
                    Checking user...
                  </p>
                )}

                {!checkingUser && validatedUser && (
                  <p className="text-sm text-green-600 font-medium">
                    ✔ {validatedUser}
                  </p>
                )}

                {!checkingUser && userId && !validatedUser && (
                  <p className="text-sm text-red-500">
                    ✖ User not found
                  </p>
                )}
              </div>
            </div>

            {/* ACTIVATE BUTTON */}
            <button
              type="submit"
              disabled={loadingActivate}
              className={`w-full py-2 rounded-lg text-white ${
                loadingActivate
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingActivate ? "Processing..." : "Activate Account"}
            </button>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ActivateAccount;
