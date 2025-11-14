import React from "react";
import { Routes, Route } from "react-router-dom";

// 🌍 Public Pages
import Splash from "./Splash";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Home from "./Home";
import WhyP2p from "./landing_pages/whyp2p";
import VerifySignup from "./Auth/VerifySignUp";
import ForgotPassword from "./Auth/ForgotPassword";
import RegisterSuccess from "./Auth/RegisterSuccess";

// 🧍 User Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Profile/Settings";
import PaymentMethod from "./pages/Profile/PaymentMethod";
import AddBank from "./pages/Profile/PaymentMothod/AddBank";
import AddUpi from "./pages/Profile/PaymentMothod/AddUpi";
import CreateAds from "./pages/CreateAds";
import DealDetail from "./components/DealDetail";
import Orders from "./pages/Orders";
import Deposite from "./pages/Saller/Deposite";
import PaymentHistory from "./pages/Profile/PaymentHistory";
import Account from "./pages/Profile/account";
import Editprofile from "./pages/Profile/editprofile";
import Notifications from "./pages/Profile/notifications";
import Wallet from "./pages/Profile/wallet";
import Help from "./pages/Profile/help";
import About from "./pages/Profile/about";
import Raiseticket from "./pages/Profile/Raiseticket";
import Tickethistory from "./pages/Profile/Tickethistory";
import Teams from "./pages/Profile/Teams";
import History from "./components/History";
import ActivateAccount from "./components/ActivateAccount";
import Withdraw from "./components/Withdraw";
import Income from "./components/Income";

// Guards
import AuthGuard from "./components/AuthGuard";
import SubAdminAuthGuard from "./subadmin/subadminauth/SubAdminAuthGuard";
import AdminAuthGuard from "./Admin/AdminAuthGuard";

// Sub-Admin Pages
import SubAdminLogin from "./subadmin/subadminauth/SubAdminLogin";
import SubAdminDashboard from "./subadmin/SubAdminDashboard";
// import ManageDeals from "./subadmin/ManageDeals";

// Admin Pages
import AdminLogin from "./admin/adminauth/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddSubAdmin from "./admin/AddSubAdmin";





import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/pagination";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/whyp2p" element={<WhyP2p />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify_signup" element={<VerifySignup />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />

      {/*  Protected User Routes */}
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deal-detail" element={<DealDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/createads" element={<CreateAds />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/paymentmethod" element={<PaymentMethod />} />
        <Route path="/addbank" element={<AddBank />} />
        <Route path="/addupi" element={<AddUpi />} />
        <Route path="/deposite" element={<Deposite />} />
        <Route path="/paymenthistory" element={<PaymentHistory />} />
        <Route path="/account" element={<Account />} />
        <Route path="/editprofile" element={<Editprofile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/raiseTicket" element={<Raiseticket />} />
        <Route path="/tickethistory" element={<Tickethistory />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/history" element={<History />} />
        <Route path="/activateaccount" element={<ActivateAccount />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/income" element={<Income />} />
      </Route>

      {/*  Sub-Admin Routes */}
      <Route path="/subadminauth/login" element={<SubAdminLogin />} />
      <Route
        path="/subadmin/dashboard"
        element={
          <SubAdminAuthGuard>
            <SubAdminDashboard />
          </SubAdminAuthGuard>
        }
      />

      {/* Admin Routes */}
      <Route path="/adminauth/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminAuthGuard>
            <AdminDashboard />
          </AdminAuthGuard>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminAuthGuard>
            <AddSubAdmin />
          </AdminAuthGuard>
        }
      />

    </Routes>
  );
};

export default App;
