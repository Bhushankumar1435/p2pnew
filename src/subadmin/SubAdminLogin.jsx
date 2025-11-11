import React, { useState } from 'react';
import Logo from '../assets/svgs/logo.svg';
import VarifyIcon from '../assets/images/varify.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { subAdminLogin, subAdminVerifySignin, subAdminResendOtp } from '../api/SubAdminapi';

const SubAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Step 1: Handle Login (Send OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await subAdminLogin({ email, password });
      console.log('🟡 Sub-admin login response:', response);

      if (!response.success) {
        toast.error(response.message || 'Login failed');
        return;
      }

      toast.success(response.message || 'OTP sent to your email');
      setStep(2);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Step 2: Handle OTP Verification
  const handleVerify = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await subAdminVerifySignin({ email, otp: Number(otp) });
    // console.log("🟢 Sub-admin verify response:", response);

    if (!response.success) {
      toast.error(response.message || "Invalid OTP");
      return;
    }

    const token = response.data;
    if (!token) {
      toast.error("Token not received from server!");
      return;
    }

    localStorage.setItem("sub_admin_token", token);

    toast.success(response.message || "Login successful!");

    // ✅ Navigate to Sub-Admin Dashboard
    setTimeout(() => {
      navigate("/subadmin/dashboard");
    }, 800);
  } catch (err) {
    toast.error("OTP verification failed.");
  } finally {
    setLoading(false);
  }
};


  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await subAdminResendOtp({ email });
      if (response.success) {
        toast.success(response.message || 'OTP resent successfully!');
      } else {
        toast.error(response.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      toast.error('Error resending OTP.');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
          <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">
            Sub-Admin Login Portal
          </h1>

          {/* Step 1: Login Form */}
          {step === 1 && (
            <form className="w-full space-y-4" onSubmit={handleLogin}>
              <div className="w-full mb-4 px-6 relative">
                <label className="text-[15px] text-start leading-4 text-black font-medium mb-3 block">
                  Sub-Admin Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
                />

                <div className="relative w-full">
                  <label className="text-[15px] text-start leading-4 text-black font-medium my-3 block">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                    className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="absolute right-[10px] top-3/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl py-3 px-4 text-base text-black bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
                >
                  {loading ? 'Sending OTP...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form className="w-full space-y-4" onSubmit={handleVerify}>
              <div className="w-full mb-4 px-6 relative">
                <label className="text-[15px] leading-4 text-black font-medium mb-3 block">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl py-3 px-4 text-base text-black bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-500 font-medium mt-3"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          Sub-Admin Secure Access
        </div>
      </div>
    </div>
  );
};

export default SubAdminLogin;
