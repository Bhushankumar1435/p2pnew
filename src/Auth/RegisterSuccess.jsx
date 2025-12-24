import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logo from '../assets/svgs/logo.svg';
import VarifyIcon from '../assets/images/varify.png';
import { createpassword } from '../api/api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const [newPassword, setNewPass] = useState('');
  const [confirmPassword, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  // STORED DETAILS FOR POPUP
  const [popupDetails, setPopupDetails] = useState({
    userId: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const formData = {
        password: newPassword,
        confirmPassword,
        ...(data?.email && { email: data.email }),
        ...(data?.token && { token: data.token }),
      };

      const response = await createpassword(formData);

      if (response?.success) {
        toast.success("Password created successfully!");

        const apiEmail = response?.data?.email || data?.email || "Not Provided";
        const apiUserId = response?.data?.userId || data?.userId || "N/A";

        setPopupDetails({
          userId: apiUserId,
          email: apiEmail,
          password: newPassword
        });

        setShowPopup(true);
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-white/95 bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4">Account Created Successfully</h2>

            <div className="text-left bg-gray-100 p-4 rounded-lg mb-4">
              <p><strong>User ID:</strong> {popupDetails.userId}</p>
              <p><strong>Email:</strong> {popupDetails.email}</p>
              <p><strong>Password:</strong> {popupDetails.password}</p>
            </div>

            <p className="text-red-600 font-semibold mb-3">
              Please take a screenshot of this information. This information has also been sent to your email.
            </p>

            <button
              onClick={handleContinue}
              className="w-full bg-black text-white py-2 mt-2 rounded-lg hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="min-h-screen py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />

          <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">
            Welcome to Coin P2P Trader
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full px-6">

            <label className="text-[15px] leading-4 font-medium text-left">
              Set Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full placeholder:text-gray-400 px-4 py-3 pr-12 rounded-xl border border-neutral-300"
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label className="text-[15px] leading-4 font-medium text-left">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password"
                className="w-full placeholder:text-gray-400 px-4 py-3 pr-12 rounded-xl border border-neutral-300"
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 px-4 text-base leading-5 font-medium 
              ${loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'text-black bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] hover:opacity-90'
                }`}
            >
              {loading ? 'Please wait...' : 'Confirm'}
            </button>
          </form>
        </div>

        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
