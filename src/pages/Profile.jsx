import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { t } from '../components/i18n';
import Profiledata from './Profile/profileData';
import MyAds from './Profile/myAds';
import Teams from './Profile/Teams';
import { FaShareAlt, FaCog } from 'react-icons/fa';
import { getData } from '../api/protectedApi';

const Profile = () => {
  const [profile, setProfileData] = useState(null);
  const [type, setType] = useState(null);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  // FETCH PROFILE
  useEffect(() => {
    getData('/user/userProfile', {})
      .then((res) => {
        setProfileData(res?.data?.data?.data || null);
        setType(res?.data?.data?.accountType || null);
      })
      .catch((err) => console.error('❌ Profile fetch error:', err));
  }, []);

  // FETCH MY DEALS
  const fetchAds = async () => {
    try {
      setLoading(true);

      const res = await getData('/user/myDeals', { limit: 50, page: 1 });

      const deals = res?.data?.data?.deals || [];
      const count = res?.data?.data?.count || 0;

      // console.log("Deals:", deals);
      // console.log("Count:", count);

      setAds(deals);
    } catch (error) {
      console.error("Deals error:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check this out!",
        text: "Have a look at this page! try it.",
        url: window.location.href,
      })
        .catch(err => console.log("Share failed:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);


  const tabs = useMemo(
    () => [
      { key: "info", label: "Info" },
      { key: "team", label: "Team" },
      { key: "ads", label: `Ads (${ads.length})` },
    ],
    [ads]
  );

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <div className="min-h-screen flex flex-col items-center bg-white text-black font-sans">

        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1] pt-3">

            {/* TOP SECTION */}
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-col w-full">
                <div className="flex w-full items-center justify-between px-4">
                  <div className="flex items-center gap-3 p-1">
                    <img
                      src="https://i.pravatar.cc/100"
                      alt="Avatar"
                      className="h-14 w-14 rounded-full"
                    />
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md">
                      {type}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-gray-500 text-lg">
                    <FaShareAlt className="text-black cursor-pointer" onClick={handleShare} />
                    <Link to="/Settings">
                      <FaCog className="text-black" />
                    </Link>
                  </div>
                </div>

                {/* USER NAME + USER ID */}
                <div className="w-full mt-3 px-5">
                  {!profile ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {profile?.name}

                          {/* Verified icon */}
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
                            alt="verified"
                            className="h-4 w-4"
                          />


                          {/* Active / Inactive Status */}
                          <span
                            className={`text-sm font-semibold ${profile?.paidStatus ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {profile?.paidStatus ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span>
                            ID - {profile?.userId}
                          </span>
                        </div>
                      </h2>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="flex space-x-4 border-b border-gray-300 text-sm px-4 font-medium overflow-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 text-black relative text-nowrap ${activeTab === tab.key ? 'font-semibold' : 'text-gray-500'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>


            {/* TAB CONTENT */}
            <div className="mt-4 text-sm text-gray-700 px-4">
              {activeTab === 'info' && <Profiledata data={profile?.data} />}
              {activeTab === 'team' && <Teams />}
              {activeTab === 'ads' &&
                (loading ? (
                  <p className="text-center text-gray-500">Loading ads...</p>
                ) : (
                  <MyAds ads={ads} />
                ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Profile;
