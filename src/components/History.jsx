import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getData } from "../api/protectedApi";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa"; 

export default function History() {
  const [activationList, setActivationList] = useState([]);
  const navigate = useNavigate();

  const activationTransactions = () => {
    getData("/user/walletHistory", { limit: 10, page: 1 })
      .then((res) => {
        console.log("Wallet History Response:", res.data);
        setActivationList(res.data.data.data || []); 
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    activationTransactions();
  }, []);

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
            <div className="w-full py-5 px-3">

              {/* ✅ Back / Close Button */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigate(-1)} // 👈 go back to previous page
                  className="flex items-center gap-2 text-gray-600 hover:text-black"
                >
                  <FaArrowLeft />
                  <span className="font-medium">Back</span>
                </button>

                {/* Optional Cross Button on Right */}
                <button
                  onClick={() => navigate("/account")} // 👈 go directly to account page
                  className="text-gray-500 hover:text-black text-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <h2 className="font-semibold mb-4 text-lg">Wallet History</h2>

              {activationList.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found.
                </p>
              ) : (
                activationList.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white max-w-xl mx-auto mb-3"
                  >
                    {/* <div className="flex flex-col space-y-2">
                    </div> */}
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex justify-between items-center">
                        <button className="bg-gray-100 text-red-600 font-medium px-2 py-1 rounded-md hover:bg-red-100">
                          {activity.transactionType}
                        </button>
                        <p className="text-2xl font-semibold text-black mt-1">
                          {activity.amount}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            {activity.token || "USDT"}
                          </span>
                        </p>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <button className="border border-black text-black font-medium px-2 rounded-md hover:bg-black hover:text-white transition">
                          Details
                        </button>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p>{activity.remark}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
