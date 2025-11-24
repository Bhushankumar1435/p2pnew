import React, { useState } from 'react';
import Logo from '../../assets/svgs/logo.svg';
import VarifyIcon from '../../assets/images/varify.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  AdminSignin,
  AdminVerifySignin,
  AdminResendOtp,
  // AdminForgotPassword,
  AdminChangePassword,
} from '../../api/Adminapi';

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

  /* --------------------------------------------
    🔹 Step 1: LOGIN
  -------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await AdminSignin({ email, password });

      if (response.success) {
        toast.success(response.message || "OTP sent to your email");
        setStep(2);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------
    🔹 Step 2: VERIFY OTP
  -------------------------------------------- */
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await AdminVerifySignin({ email, otp: Number(otp) });

      if (!response.success) {
        toast.error(response.message || "Invalid OTP");
        return;
      }

      const token = response.data;
      localStorage.setItem("admin_token", token);

      toast.success("Login successful!");

      setTimeout(() => navigate("/admin/dashboard"), 800);
    } catch (error) {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------
    🔁 RESEND OTP
  -------------------------------------------- */
  const handleResendOtp = async () => {
    try {
      const response = await AdminResendOtp({ email });
      if (response.success) {
        toast.success(response.message || "OTP resent successfully");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Error resending OTP");
    }
  };

  /* --------------------------------------------
    🔹 Step 3: FORGOT PASSWORD
  -------------------------------------------- */
  // const handleForgotPassword = async (e) => {
  //   e.preventDefault();

  //   if (!email) {
  //     toast.error("Please enter your email");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const response = await AdminForgotPassword({ email });

  //     if (response.success) {
  //       toast.success(response.message || "OTP sent to your email");
  //       setStep(4);
  //     } else {
  //       toast.error(response.message || "Failed to send OTP");
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /* --------------------------------------------
    🔹 Step 4: RESET PASSWORD
  -------------------------------------------- */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await AdminChangePassword({
        email,
        otp: Number(otp),
        newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        setStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setPassword("");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen px-6 py-4 flex flex-col items-center justify-between bg-white text-black">

        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 mx-auto" />

          <h1 className="text-xl font-semibold mt-6 mb-10">
            {step === 1 && "Admin Sign In"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Forgot Password"}
            {step === 4 && "Reset Password"}
          </h1>

          {/* ------------------ STEP 1: LOGIN ------------------ */}
          {step === 1 && (
            <form className="w-full space-y-3" onSubmit={handleSubmit}>
              <label className="block text-left font-medium">Admin Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border"
              />

              <div className="relative">
                <label className="block text-left font-medium my-3">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full px-4 py-2 pr-10 border rounded-md"
                />
                <div
                  className="absolute right-3 top-3/4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] text-black"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* <p className="mt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[var(--link-color)] font-semibold"
                >
                  Forgot Password?
                </button>
              </p> */}
            </form>
          )}

          {/* ------------------ STEP 2: OTP VERIFY ------------------ */}
          {step === 2 && (
            <form className="w-full space-y-4" onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-center"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-sm">
                Didn’t get OTP?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[var(--link-color)] underline font-semibold"
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* ------------------ STEP 3: FORGOT PASSWORD ------------------ */}
          {step === 3 && (
            <form className="w-full space-y-4" onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[var(--link-color)] font-semibold"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* ------------------ STEP 4: RESET PASSWORD ------------------ */}
          {step === 4 && (
            <form className="w-full space-y-4" onSubmit={handleChangePassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>

        <div className="pt-3 text-xs text-gray-500 flex items-center gap-1">
          <img src={VarifyIcon} alt="secure" className="w-4 h-4" />
          A secure admin portal
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
