import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getData, postData } from '../../api/protectedApi';
import { validateSponser } from "../../api/api";
import Deposite from '../Saller/Deposite';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [activationList, setActivationList] = useState([]);
  const [depositeList, setDepositeList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();

  const activationTransactions = () => {
    getData('/user/walletHistory', { limit: 10, page: 1 })
      .then((res) => {
        setActivationList(res.data?.data?.data || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    activationTransactions();

    getData('/user/userBalance?type=WALLET', {})
      .then((res) => {
        setBalance(res.data?.data || 0);
      })
      .catch((err) => console.error(err));
    getData('/user/userBalance?type=INCOME', {})
      .then((res) => {
        setIncome(res.data?.data || 0);
      })
      .catch((err) => console.error(err));
  }, []);



  const menuItems = [
    { label: "Activate", path: "/activateaccount" },
    { label: "Wallet", path: "/history" },
    { label: "Deposit", path: "deposit" },
    // { label: "Bonus", path: "/bonus" },
    { label: "Withdraw", path: "/withdraw" },
    { label: "Income", path: "/Income" },
  ];

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />
          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
            <div className="w-full py-5 px-3">

              {/* ✅ Title & Balance Section */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-full text-left">
                  <h2 className="font-semibold text-lg pb-4">Account Management</h2>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full border border-gray-300 bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">Wallet Balance:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full border border-gray-300 bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">Income Balance:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${income.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ Menu Buttons */}
              <div className="flex flex-col p-3 gap-3">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.label === "Deposit") {
                        setDepositeList(true);
                      } else if (item.label === "History") {
                        navigate("/history");
                      } else if (item.label === "Activate") {
                        navigate("/activateaccount");
                      } else if (item.label === "Withdraw") {
                        navigate("/withdraw");
                      } else if (item.label === "Income") {
                        navigate("/income")
                      }
                      else {
                        navigate(item.path);
                      }
                    }}
                    className="flex items-center justify-between border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                  >
                    <h4 className="text-base font-medium text-black">{item.label}</h4>
                    <FaChevronRight className="text-gray-400 text-sm" />
                  </button>
                ))}
              </div>

              {/* ✅ History Section */}
              {showHistory && (
                <div className="flex flex-col gap-3 mt-4">
                  {activationList.length === 0 ? (
                    <p className="text-center text-gray-500">No transactions found.</p>
                  ) : (
                    activationList.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white max-w-xl mx-auto"
                      >
                        <div>
                          <p className="text-2xl font-semibold text-black mt-1">
                            {activity.amount}{' '}
                            <span className="text-sm font-normal text-gray-500">
                              {activity.token || 'USDT'}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.createdAt}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-gray-100 text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-100">
                            {activity.transactionType}
                          </button>
                          <button className="border border-black text-black font-medium px-4 py-2 rounded-md hover:bg-black hover:text-white transition">
                            Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ✅ Deposit Modal */}
              {depositeList && (
                <Deposite
                  isOpen={depositeList}
                  onClose={() => setDepositeList(false)}
                />
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
