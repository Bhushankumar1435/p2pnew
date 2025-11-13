import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { t } from '../components/i18n';
import Profiledata from './Profile/profileData';
import MyAds from './Profile/myAds';
import { FaCrown, FaShareAlt, FaCog } from 'react-icons/fa';
import { getData } from '../api/protectedApi';
import Teams from './Profile/Teams';
import { myDeals } from '../api/api'; // assuming this can handle query params

const Profile = () => {
  const [profile, setProfileData] = useState(null);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Profile
  useEffect(() => {
    getData('/user/userProfile', {})
      .then((res) => {
        console.log('📦 Profile API Response:', res.data);
        setProfileData(res.data?.data?.data || null);
      })
      .catch((err) => console.error('❌ Profile fetch error:', err));
  }, []);

  // ✅ Fetch Ads with Query Params
  const fetchAds = async () => {
    try {
      setLoading(true);
      // 👇 Pass query parameters (limit + page)
      const res = await getData('/user/myDeals', { limit: 10, page: 1 });
      console.log('🪧 MyDeals API response:', res);

      // ✅ Handle all possible data shapes
      const fetched =
        Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

      console.log('✅ Deals extracted:', fetched);
      setAds(fetched);
    } catch (error) {
      console.error('❌ Error fetching ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch once + auto refresh every 10 seconds
  // useEffect(() => {
  //   fetchAds();
  //   const interval = setInterval(fetchAds, 10000); // 🔄 refresh every 10s
  //   return () => clearInterval(interval);
  // }, []);

  // ✅ Dynamic ads count
  const adsCount = Array.isArray(ads) ? ads.length : 0;

  const tabs = [
    { key: 'info', label: 'Info' },
    { key: 'team', label: 'Team' },
    { key: 'ads', label: `Ads (${adsCount})` },
  ];

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <div className="min-h-screen flex flex-col items-center bg-white text-black font-sans">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />
          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1] pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-col w-full">
                <div className="flex w-full items-center justify-between px-4">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="Avatar"
                    className="h-14 w-14 rounded-full"
                  />
                  <div className="flex space-x-4 text-gray-500 text-lg">
                    <FaShareAlt className="text-black" />
                    <Link to="/Settings">
                      <FaCog className="text-black" />
                    </Link>
                  </div>
                </div>

                <div className="w-full mt-3 px-4">
                  {!profile ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg flex items-center gap-1">
                        {t('hello')} {profile?.name}
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
                          alt="verified"
                          className="h-4 w-4"
                        />
                      </h2>
                      <span className="text-xs bg-[#FFF6D5] text-black font-normal px-2 py-1 rounded mt-1 inline-block">
                        Professional Crypto Exchange
                      </span>
                      <div className="text-sm mt-1 flex items-center gap-2">
                        <FaCrown className="text-yellow-500" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-300 text-sm px-4 font-medium overflow-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 text-black relative text-nowrap ${
                    activeTab === tab.key
                      ? 'font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
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
