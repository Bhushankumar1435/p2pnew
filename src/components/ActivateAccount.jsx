import React, { useEffect, useState } from "react";
import { getData, postData } from "../api/protectedApi";
import { validateSponser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaTimes } from "react-icons/fa";

const ActivateAccount = () => {
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);
  // const [activationList, setActivationList] = useState([]);
  const [validatedUser, setValidatedUser] = useState("");
  const navigate = useNavigate();

  // ============================================
  // 🔍 Check if User Exists Before Activation
  // ============================================
  const checkUser = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID.");
      return;
    }

    try {
      const response = await validateSponser(userId);

      if (!response?.success) {
        toast.error(response?.message || "User not found.");
        setUserId("");
        setValidatedUser("");
        return;
      }

      toast.success(response?.message || "User verified.");
      setValidatedUser(response?.data?.name || "User verified");
    } catch (err) {
      toast.error("Unable to validate user.");
      setValidatedUser("");
    }
  };

  // ============================================
  // 🚀 Activate User Account
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("User ID is required.");
      return;
    }

    try {
      const res = await postData("/user/activateAccount", { userId });

      // Extract success safely (covers all backend structures)
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
      const backend = err?.response?.data;
      toast.error(backend?.message || "Something went wrong.");
    }
  };
  // const activationTransactions = () => {
  //   getData('/user/walletHistory', { limit: 10, page: 1 })
  //     .then((res) => {
  //       setActivationList(res.data?.data?.data || []);
  //     })
  //     .catch((err) => console.error(err));
  // };
  // activationTransactions();

  useEffect(() => {

    getData('/user/userBalance?type=WALLET', {})
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

                {/* Navigation */}
                {/* <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                  >
                    <FaArrowLeft />
                    <span className="font-medium">Back</span>
                  </button>

                  <button
                    onClick={() => navigate("/account")}
                    className="text-gray-500 hover:text-black text-xl"
                  >
                    <FaTimes />
                  </button>
                </div> */}

                <h2 className="font-semibold mb-4 text-lg">Activate Account</h2>
                <div className="flex items-center justify-between w-full border border-gray-300 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-700 font-medium">Wallet Balance:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${balance.toFixed(2)}
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button
                      type="button"
                      onClick={checkUser}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Check User
                    </button>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Activate Account
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
