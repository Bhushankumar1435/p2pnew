import React, { useState } from "react";
import Logo from "../assets/svgs/logo.svg";
import VarifyIcon from "../assets/images/varify.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (!response.success) {
        toast.error(response.message || "Login failed");
        return;
      }

      toast.success("Login successful!");

      // Save only this token (simple logic)
      localStorage.setItem("token", response.data);

      // Update context
      login(response.data);

      // Always redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen py-4 flex flex-col items-center bg-white">
        <img src={Logo} alt="Logo" className="w-32 mt-5" />

        <h1 className="text-2xl font-semibold mt-6 mb-10">
          Welcome to Coin P2P Trader
        </h1>

        <form className="w-full space-y-4 px-6" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium mb-1 block">User ID / Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          <div className="relative w-full">
            <label className="font-medium mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="w-full px-4 py-3 pr-10 border rounded-xl"
            />

            <div
              className="absolute right-3 top-8/12 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <Link
            to="/forgot_password"
            className="text-right block font-semibold text-blue-600"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full rounded-xl py-3 bg-blue-500 text-white"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-3 text-center">
            Don’t have an account?{" "}
            <Link className="font-semibold text-blue-600" to="/signup">
              Register Now
            </Link>
          </p>
        </form>

        <div className="pt-4 text-xs text-gray-500 flex items-center gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default Login;
