import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { postData } from '../../api/protectedApi';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Account() {
  const [walletAddress, setWalletAddress] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWalletAddress(text);
    } catch (err) {
      toast.error("Failed to read clipboard");
    }
  };

  const handleSave = async () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter a valid wallet address");
      return;
    }

    try {
      const res = await postData("/user/addAddress", { address: walletAddress });

      const api = res?.data && typeof res.data === "object" ? res.data : res;

      if (api?.success) {
        toast.success(api?.message || "Wallet address saved successfully!");
      } else {
        toast.error(api?.message || "Failed to save wallet address");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]'>
          <Header />
          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
            <div className='w-full pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                Wallet Address
              </h1>

              <div className="w-full space-y-4 px-4 mt-4">
                <label className="block text-sm text-gray-700">Enter Address (BEP20)</label>

                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 text-sm text-blue-600 hover:text-blue-800"
                    onClick={handlePaste}
                  >
                    Paste
                  </button>
                </div>

                <button
                  className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
