import React, { useState } from 'react';
import Logo from '../../assets/svgs/logo.svg';
import VarifyIcon from '../../assets/images/varify.png';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {AdminSignin,  AdminVerifySignin, AdminResendOtp,AdminForgotPassword,AdminChangePassword,} from '../../api/Adminapi';

const AdminLogin = () => {
  const navigate = useNavigate();

  // 🔹 Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Step 1: Handle Signin Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await AdminSignin({ email, password });
      console.log('Admin signin response:', response);

      if (response.success) {
        toast.success(response.message || 'OTP sent to your email');
        setStep(2);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error signing in admin:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Handle OTP Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await AdminVerifySignin({ email, otp: Number(otp) });
      console.log('admin verify response:', response);

      if (!response.success) {
        toast.error(response.message || 'Invalid OTP');
        return;
      }

      const token = response.data;
      if (!token) {
        toast.error('Token not received from server!');
        return;
      }

      localStorage.setItem('admin_token', token);
      toast.success(response.message || 'Login successful!');

      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (err) {
      console.error(' OTP verification error:', err);
      toast.error('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await AdminResendOtp({ email });
      if (response.success) {
        toast.success(response.message || 'OTP resent successfully!');
      } else {
        toast.error(response.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      toast.error('Error resending OTP.');
    }
  };

  // 🔹 Step 3: Forgot Password — send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email');
      return;
    }

    try {
      setLoading(true);
      const response = await AdminForgotPassword({ email });
      console.log(' Forgot password response:', response);

      if (response.success) {
        toast.success(response.message || 'OTP sent to your email');
        setStep(4); 
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 4: Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await AdminChangePassword({
        email,
        otp: Number(otp),
        newPassword,
      });
      console.log('Change password response:', response);

      if (response.success) {
        toast.success(response.message || 'Password changed successfully!');
        setStep(1);
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Change password error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen px-6 py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
          <h1 className="text-xl font-semibold leading-4 mt-6 mb-10">
            {step === 1 && 'Admin Sign In'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Forgot Password'}
            {step === 4 && 'Reset Password'}
          </h1>

          {/* Step 1: Login Form */}
          {step === 1 && (
            <form className="w-full space-y-3" onSubmit={handleSubmit}>
              <label className="block text-left font-medium">Admin Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"   />

              <div className="relative w-full">
                <label className="block text-left font-medium my-3">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none"  />
                <div
                  className="absolute right-[10px] top-3/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}   >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 text-base text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]" >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="mt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[var(--link-color)] font-semibold" >
                  Forgot Password?
                </button>
              </p>

              {/* <p className="mt-2">
                Don’t have an account?{' '}
                <Link className="font-semibold text-[var(--link-color)]" to="/admin/register">
                  Register
                </Link>
              </p> */}
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form className="w-full space-y-4" onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className="w-full text-center px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 text-base text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]" >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <p className="text-sm mt-2">
                Didn’t get OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-semibold text-[var(--link-color)] underline"   >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* Step 3: Forgot Password */}
          {step === 3 && (
            <form className="w-full space-y-4" onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[var(--link-color)] font-semibold" >
                Back to Login
              </button>
            </form>
          )}

          {/* Step 4: Reset Password */}
          {step === 4 && (
            <form className="w-full space-y-4" onSubmit={handleChangePassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"/>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>

        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure admin portal
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
