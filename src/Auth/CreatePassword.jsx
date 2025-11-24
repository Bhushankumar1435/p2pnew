import React, { useState } from 'react';
import Logo from '../assets/svgs/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyForgotPassword } from "../api/api";

const CreatePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        email,
        otp: Number(otp),
        password,
        confirmPassword,
      };

      const response = await verifyForgotPassword(payload);

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success("Password changed successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='max-w-[600px] mx-auto'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className='flex flex-col justify-center w-full'>
        <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block mx-auto" />

        <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10 text-center">
          Create Password
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">

          <div className="w-full">
            <label className="text-[15px] mb-3 block font-medium">
              OTP
            </label>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="text-[15px] mb-3 block font-medium">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="text-[15px] mb-3 block font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl py-3 px-4 bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
