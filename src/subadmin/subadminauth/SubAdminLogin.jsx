import React, { useState } from 'react';
import Logo from '../../assets/svgs/logo.svg';
import VarifyIcon from '../../assets/images/varify.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { subAdminLogin, subAdminVerifySignin, subAdminResendOtp, subAdminForgotPassword, subAdminResetPassword, } from '../../api/SubAdminapi';

const SubAdminLogin = () => {
  const navigate = useNavigate();

  //  Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Handle Login (Send OTP)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await subAdminLogin({ email, password });
      console.log('Sub-admin login response:', response);

      if (response.success) {
        toast.success(response.message || 'OTP sent to your email');
        setStep(2);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //  Step 2: Handle OTP Verification
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await subAdminVerifySignin({ email, otp: Number(otp) });
      console.log('Sub-admin verify response:', response);

      if (!response.success) {
        toast.error(response.message || 'Invalid OTP');
        return;
      }

      const token = response.data;
      if (!token) {
        toast.error('Token not received from server!');
        return;
      }

      localStorage.setItem('sub_admin_token', token);
      toast.success(response.message || 'Login successful!');

      setTimeout(() => navigate('/subadmin/dashboard'), 800);
    } catch (err) {
      console.error('OTP verification error:', err);
      toast.error('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
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

  //  Step 3: Forgot Password (Send Reset OTP)
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your registered email');
      return;
    }

    setLoading(true);
    try {
      const response = await subAdminForgotPassword({ email });
      console.log('Forgot password response:', response);

      if (response.success) {
        toast.success(response.message || 'OTP sent for password reset');
        setStep(4); // Move to reset password form
      } else {
        toast.error(response.message || 'Failed to send reset OTP');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //  Step 4: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error('Please enter OTP and new password');
      return;
    }

    setLoading(true);
    try {
      const response = await subAdminResetPassword({
        email,
        otp: Number(otp),
        newPassword,
      });

      console.log('Reset password response:', response);

      if (response.success) {
        toast.success(response.message || 'Password reset successful!');
        setStep(1);
        setPassword('');
        setNewPassword('');
        setOtp('');
      } else {
        toast.error(response.message || 'Password reset failed');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Something went wrong. Please try again.');
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
            {step === 1
              ? 'Validator Login'
              : step === 2
                ? 'Verify OTP'
                : step === 3
                  ? 'Forgot Password'
                  : 'Reset Password'}
          </h1>

          {/*  Step 1: Login Form */}
          {step === 1 && (
            <form className="w-full space-y-3 px-6" onSubmit={handleLogin}>
              <label className="block text-left font-medium">Validator Email / User ID</label>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <div className="relative w-full">
                <label className="block text-left font-medium my-3">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none" />
                <div className="absolute right-[10px] top-3/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}  >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button type="submit"
                disabled={loading}
                className={`mt-4 w-full rounded-xl py-3 px-4 text-base text-black font-medium bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`} >
                {loading ? 'Sending OTP...' : 'Sign In'}
              </button>
            </form>
          )}

          {/*  Step 2: Verify OTP */}
          {step === 2 && (
            <form className="w-full space-y-4 px-6" onSubmit={handleVerify}>
              <input type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none text-center tracking-widest" />
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 px-4 text-base text-black font-medium bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`} >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <p className="text-sm mt-2">
                Didn’t get OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="font-semibold text-[var(--link-color)] underline" >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/*  Step 3: Forgot Password */}
          {step === 3 && (
            <form className="w-full space-y-4 px-6" onSubmit={handleForgotPassword}>
              <input type="email"
                placeholder="Enter Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 text-base text-black font-medium bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"  >
                {loading ? 'Sending OTP...' : 'Send Reset OTP'}
              </button>

              <p className="text-sm mt-2 text-blue-600 cursor-pointer underline"
                onClick={() => setStep(1)} >
                Back to Login
              </p>
            </form>
          )}

          {/*  Step 4: Reset Password */}
          {step === 4 && (
            <form className="w-full space-y-4 px-6" onSubmit={handleResetPassword}>
              <input type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none text-center tracking-widest" />

              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none" />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 text-base text-black font-medium bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"  >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
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
