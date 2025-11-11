import React, { useState } from 'react';
import Logo from '../assets/svgs/logo.svg';
import GoogleIcon from '../assets/svgs/google-icon.svg';
import MicrosoftIcon from '../assets/svgs/microsoft-icon.svg';
import AppleIcon from '../assets/svgs/apple-icon.svg';
import VarifyIcon from '../assets/images/varify.png';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Password from "../Auth/Password"
import { loginUser } from "../api/api";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('button clicked')
    // try {

    //   let response = await loginUser({ email: email, password: password })
    //   console.log(' response ', response)
    //   if (response.success == false) {
    //     toast.error(response.message);
    //   } else {
    //     toast.success(response.message);
    //     login(response.data)
    //     const token = response?.data?.token; // <-- Extract actual token
    //     if (token) {
    //       localStorage.setItem('token', token); // ✅ save under a consistent key
    //       console.log("Token saved to localStorage:", token);
    //     } else {
    //       console.warn("No token found in response:", response);
    //     }

    //     console.log("Token from localStorage:", token);

    //     setTimeout(() => {
    //       navigate("/dashboard");
    //     }, 2000);
    //   }


    // } catch (err) {
    //   setError(err.message);
    //   toast.error(err.message);
    // } finally {
    //   setLoading(false);
    // }

    try {
      const response = await loginUser({ email, password });
      console.log('Login response:', response);

      if (!response.success) {
        toast.error(response.message || "Login failed");
        return;
      }

      toast.success(response.message || "Login successful!");

      // ✅ Token is directly in response.data
      const token = response.data;
      if (token) {
        localStorage.setItem('token', token);
        console.log("Token saved to localStorage:", token);
      } else {
        console.warn("No token found in response:", response);
      }

      // Optional: If useAuth() handles user context
      login(response.data);

      console.log("Token from localStorage:", localStorage.getItem('token'));

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-[600px] mx-auto'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen py-4 flex flex-col items-center justify-between bg-white text-black font-sans">

        <>
          <div className='w-full text-center'>
            <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
            <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">Welcome to Coin P2P Trader</h1>
            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="w-full mb-4 px-6 relative">
                <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                  User ID/ Email
                </label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
                />
                <div class="relative w-full ">
                  <label className="text-[15px] leading-4 text-black text-left font-medium my-3 block w-full">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    // className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
                    className='w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <div
                    className="absolute right-[6px] top-3/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>


                <Link to="/forgot_password" className="text-right flex mt-2 font-semibold text-[var(--link-color)] justify-end">Forgot Password</Link>
                <button type="submit" className=" mt-4 w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              <p>Don’t have an account? <Link className='font-semibold text-[var(--link-color)]' to="/signup">Register Now</Link></p>
              <div className='w-full flex items-center relative bg-transparent after:absolute after:top-1/2 after:left-0 after:w-full after:h-[1px] after:border-t-1 after:border-dashed border-neutral-100/10 justify-center z-1 after:-z[1]'>
                <span className='bg-white py-1 px-4 relative z-[1]'>Or</span>
              </div>


              {/* <div className="space-y-3 px-6">
                  <button className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base leading-5 bg-white text-black font-normal cursor-pointer rounded-xl border border-neutral-300 hover:bg-gray-100">
                    <img src={GoogleIcon} className="w-5 h-5" alt="Google" />
                    Sign in with Google
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base leading-5 bg-white text-black font-normal cursor-pointer rounded-xl border border-neutral-300 hover:bg-gray-100">
                    <img src={MicrosoftIcon} className="w-5 h-5" alt="Microsoft" />
                    Sign in with Microsoft
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base leading-5 bg-white text-black font-normal cursor-pointer rounded-xl border border-neutral-300 hover:bg-gray-100">
                    <img src={AppleIcon} className="w-5 h-5" alt="Apple" />
                    Sign in with Apple
                  </button>
                </div> */}
            </form>
          </div>
        </>

        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt='' className='w-4 h-4' />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default Login;
