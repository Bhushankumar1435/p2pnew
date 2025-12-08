import React, { useEffect, useState } from "react";
import api, { handleUpgrade } from "../../api/protectedApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [accountType, setAccountType] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  // -------------------------------
  // 📌 Fetch Profile
  // -------------------------------
  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/userProfile");
      if (res.data?.success) {
        const userData = res.data.data.data;
        setUser(userData);
        setStats({
          sponsorCount: res.data.data.sponsorCount,
          teamCount: res.data.data.teamCount,
          activeDeals: res.data.data.activeDeals,
          totalDeals: res.data.data.totalDeals,
        });
        setAccountType(res.data.data.accountType); 
      }
    } catch (err) {
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // -------------------------------
  // 🔥 Upgrade to Validator
  // -------------------------------
  const confirmUpgrade = async () => {
    setLoading(true);
    try {
      const res = await handleUpgrade();
      setLoading(false);
      setShowPopup(false);

      if (res.success) {
        toast.success("Upgrade successful!");
        setAccountType("VALIDATOR"); 
        toast.error(res.message);
      }
    } catch (err) {
      setLoading(false);
      setShowPopup(false);
      toast.error("Upgrade failed!");
    }
  };

  if (!user || !stats) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      {/* ---------------- POPUP MODAL ---------------- */}
      {showPopup && (
        <div className="fixed inset-0 bg-white/65 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] text-center shadow-lg">
            <h2 className="text-lg font-bold mb-3">Upgrade Confirmation</h2>
            <p className="text-sm text-gray-700 mb-4">
              <strong>200 USDT</strong> will be deducted from your wallet to upgrade your
              account to <strong>Validator</strong>.<br />
              After upgrade, you will get access to Validator Panel and can manage deals with the same email/password.
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={confirmUpgrade}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PROFILE CARD ---------------- */}
      <div className="max-w-[600px] mx-auto bg-white p-6 mt-5 rounded-xl">
        <div className="flex justify-between items-center border-b mb-4 pb-2">
          <h2 className="text-lg font-bold">User Info</h2>

          {accountType === "VALIDATOR" ? (
            <button
              onClick={() => navigate("/subadminauth/login")}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Go To Validator Panel
            </button>
          ) : (
            <button
              onClick={() => setShowPopup(true)}
              disabled={loading}
              className={`px-4 py-2 rounded text-white transition-all duration-300 ${
                loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Loading..." : "Upgrade To Validator"}
            </button>
          )}
        </div>

        <ul className="text-sm text-gray-700 space-y-2">
          <li className="w-full flex justify-between font-medium"><strong>Name:</strong> {user.name}</li>
          <li className="w-full flex justify-between font-medium"><strong>Email:</strong> {user.email}</li>
          <li className="w-full flex justify-between font-medium"><strong>Phone:</strong> {user.phoneNumber}</li>
          <li className="w-full flex justify-between font-medium"><strong>Sponsor:</strong> {user?.sponsorId?.userId || "N/A"}</li>
          <li className="w-full flex justify-between font-medium"><strong>Country:</strong> {user.country}</li>
          <li className="w-full flex justify-between font-medium">
            <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
          </li>
        </ul>
      </div>

      {/* ---------------- STATS CARD ---------------- */}
      <div className="max-w-[600px] mx-auto bg-white p-6 mt-5 rounded-xl">
        <ul className="text-gray-700 space-y-2">
          <li className="w-full flex justify-between font-medium"><strong>Sponsor Count:</strong> {stats.sponsorCount}</li>
          <li className="w-full flex justify-between font-medium"><strong>Team Count:</strong> {stats.teamCount}</li>
          <li className="w-full flex justify-between font-medium"><strong>Active Deals:</strong> {stats.activeDeals}</li>
          <li className="w-full flex justify-between font-medium"><strong>Total Deals:</strong> {stats.totalDeals}</li>
        </ul>
      </div>
    </>
  );
};

export default ProfilePage;
