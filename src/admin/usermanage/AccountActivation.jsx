import React, { useEffect, useState } from "react";
import {  ActivateAccountApi, GetAdminUsersApi } from "../../api/Adminapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountActivation = () => {
  const [userId, setUserId] = useState("");
  const [validatedUser, setValidatedUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

 

  useEffect(() => {
    GetAdminUsersApi(1, 500)
      .then((res) => {
        if (res.success) setAllUsers(res.data.users);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!userId) return setValidatedUser("");

    const user = allUsers.find((u) => u.userId === userId.trim());
    setValidatedUser(user ? user.name : "");
  }, [userId, allUsers]);

//   const checkUser = () => {
//     if (!userId.trim()) return toast.error("Please enter a User ID.");
//     if (!validatedUser) return toast.error("User not found!");
//     toast.success(`User verified: ${validatedUser}`);
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return toast.error("User ID is required.");
    if (!validatedUser) return toast.error("Cannot activate. User not found.");

    setLoading(true);
    try {
      const res = await ActivateAccountApi(userId);
      if (res.success) {
        toast.success(res.message || "Account activated successfully!");
        setUserId("");
        setValidatedUser("");
      } else {
        toast.error(res.message || "Activation failed!");
      }
    } catch (err) {
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto mt-10 bg-white rounded-xl shadow-md p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-xl font-semibold mb-4 text-center">Activate Account</h2>

      

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter User ID"
          />

          {userId && validatedUser && (
            <p className="text-green-600 font-medium mt-1">✔ {validatedUser}</p>
          )}

          {userId && !validatedUser && (
            <p className="text-red-500 text-sm mt-1">User not found</p>
          )}
        </div>

        <div className="flex gap-3">
          {/* <button
            type="button"
            onClick={checkUser}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Check User
          </button> */}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Activating..." : "Activate Account"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default AccountActivation;
