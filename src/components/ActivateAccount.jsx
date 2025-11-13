import React, { useState } from "react";
import { getData, postData } from "../api/protectedApi";
import { validateSponser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

const ActivateAccount = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Validate user before activation
  const checkUser = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID first.");
      return;
    }

    try {
      let response = await validateSponser(userId);
      if (response.success === false) {
        toast.error(response.message);
        setUserId("");
      } else {
        toast.success(response.message);
        setError(response.data?.name || "User verified");
      }
    } catch (err) {
      toast.error("Error validating user.");
    }
  };

  // ✅ Activate user account
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("User ID is required.");
      return;
    }

    try {
      const res = await postData("/user/activateAccount", { userId });
      if (res.data.success === true) {
        toast.success(res.data.message || "Account activated successfully!");
        setUserId("");
        setError("");
      } else {
        setError(res.data.message || "Activation failed.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
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

                {/* ✅ Navigation Controls */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                  >
                    <FaArrowLeft />
                    <span className="font-medium">Back</span>
                  </button>

                  <button
                    onClick={() => navigate("/account")}
                    className="text-gray-500 hover:text-black text-lg"
                  >
                    <FaTimes />
                  </button>
                </div>

                <h2 className="font-semibold mb-4 text-lg">Activate Account</h2>

                {/* ✅ Activation Form */}
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
                      placeholder="e.g. USER12345"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
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
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
