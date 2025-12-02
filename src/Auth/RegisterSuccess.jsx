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
        toast.success(response?.message || 'Password created successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />

          <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">
            Welcome to Coin P2P Trader
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full px-6">

            {/* Set Password */}
            <label className="text-[15px] leading-4 font-medium text-left">
              Set Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full placeholder:text-gray-400 px-4 py-3 pr-12 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--button-gradient-1)]"
              />

              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <label className="text-[15px] leading-4 font-medium text-left">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password"
                className="w-full placeholder:text-gray-400 px-4 py-3 pr-12 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--button-gradient-1)]"
              />

              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 px-4 text-base leading-5 font-medium transition-all duration-200 ${
                loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'text-black bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] hover:opacity-90'
              }`}
            >
              {loading ? 'Please wait...' : 'Confirm'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
