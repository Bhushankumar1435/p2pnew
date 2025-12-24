import { useState } from 'react';
import BellIcon from '../assets/svgs/notify_icon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Filter from '../components/Filter';
import Deal from '../components/Deal';
import Accept from '../components/Accept';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("deal");
  const navigate = useNavigate();

  // 🔔 Bell click → Notifications page
  const handleBellClick = () => {
    navigate("/notifications");
  };

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col bg-white text-black">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
            <div className="w-full pt-3">

              {/* Tabs + Bell */}
              <div className="flex items-center justify-between text-sm px-4">
                {/* Tabs */}
                <div className="flex items-center p-1 border border-[var(--border-light)] rounded-lg">
                  <button
                    className={`px-3 py-1 text-sm rounded font-medium ${
                      activeTab === "deal"
                        ? "bg-[#DCDCDC] text-black"
                        : "text-[var(--tab-color)]"
                    }`}
                    onClick={() => setActiveTab("deal")}
                  >
                    Deal
                  </button>

                  <button
                    className={`px-3 py-1 text-sm rounded font-medium ${
                      activeTab === "accept"
                        ? "bg-[#DCDCDC] text-black"
                        : "text-[var(--tab-color)]"
                    }`}
                    onClick={() => setActiveTab("accept")}
                  >
                    Accept
                  </button>
                </div>

                {/* Bell */}
                <button
                  onClick={handleBellClick}
                  className="relative"
                >
                  <img src={BellIcon} alt="Notifications" />
                  {/* red dot (optional – static or from backend later) */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <Filter />

              {/* Content */}
              <div className="flex flex-col px-4">
                {activeTab === "deal" && <Deal />}
                {activeTab === "accept" && <Accept />}
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
