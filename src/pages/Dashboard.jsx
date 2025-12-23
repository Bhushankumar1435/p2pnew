import { useState, useEffect, useRef } from 'react';
import BellIcon from '../assets/svgs/notify_icon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Filter from '../components/Filter';
import Deal from '../components/Deal';
import Accept from '../components/Accept';
import { ToastContainer, toast } from 'react-toastify';
import { getNotificationHistory } from "../api/protectedApi";
import "../index.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [activeTab, setActiveTab] = useState("deal");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();
  const panelRef = useRef();

  // Fetch notifications
  const fetchNotifications = async (p = 1) => {
    try {
      setLoadingNotif(true);
      const res = await getNotificationHistory(p, limit);
      const payload = res?.data;

      if (payload?.success) {
        setNotifications(payload.data.notifications || []);
        setTotalCount(payload.data.count || 0);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      toast.error("Notification fetch failed");
      setNotifications([]);
    } finally {
      setLoadingNotif(false);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
  };

  const totalPages = Math.ceil(totalCount / limit);
  const handleNext = () => page < totalPages && setPage(p => p + 1);
  const handlePrev = () => page > 1 && setPage(p => p - 1);

  useEffect(() => {
    if (showNotifications) fetchNotifications(page);
  }, [showNotifications, page]);

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]'>
          <Header />

          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto'>
            <div className='w-full pt-3'>
              {/* Tabs */}
              <div className="flex items-center justify-around text-sm px-4">
                <div className='flex-1 flex items-center gap-2'>
                  <div className='flex items-center p-1 border border-[var(--border-light)] rounded-lg'>
                    <button
                      className={`px-3 py-1 w-15 text-sm rounded tracking-tighter font-medium ${activeTab === "deal" ? "bg-[#DCDCDC] text-black" : "text-[var(--tab-color)]"}`}
                      onClick={() => setActiveTab("deal")}
                    >
                      Deal
                    </button>
                    <button
                      className={`px-3 py-1 w-15 text-sm rounded tracking-tighter font-medium ${activeTab === "accept" ? "bg-[#DCDCDC] text-black" : "text-[var(--tab-color)]"}`}
                      onClick={() => setActiveTab("accept")}
                    >
                      Accept
                    </button>
                  </div>
                </div>

                {/* Bell */}
                <div className='shrink-0 flex items-center gap-2 relative'>
                  <button onClick={handleBellClick} className="relative">
                    <img src={BellIcon} />
                    {totalCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-1 border-white"></span>
                    )}
                  </button>

                  {/* Notification Panel */}
                  {showNotifications && (
                    <div
                      ref={panelRef}
                      className="absolute right-0 mt-2 w-[90vw] sm:w-96 bg-white shadow-2xl rounded-2xl z-50 flex flex-col max-h-[70vh] animate-slideDown"
                    >
                      {/* Header */}
                      <div className="sticky top-0 z-10 bg-white p-3 border-b font-semibold text-gray-800">
                        Notifications
                      </div>

                      {/* Notifications Body */}
                      <div className="flex-1 overflow-y-auto px-2 py-1 no-scrollbar space-y-2">
                        {loadingNotif ? (
                          <p className="p-4 text-sm text-gray-500 text-center">Loading...</p>
                        ) : notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item._id}
                              className="p-3 rounded-xl bg-white shadow hover:shadow-md transition cursor-pointer border border-gray-100"
                            >
                              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.body}</p>
                              <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="sticky bottom-0 bg-white border-t p-2 flex items-center justify-between">
                          <button onClick={handlePrev} disabled={page === 1} className="text-xs px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
                            Prev
                          </button>
                          <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
                          <button onClick={handleNext} disabled={page === totalPages} className="text-xs px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Filter />
              {/* Trade Card */}
              <div className='flex flex-col px-4'>
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
