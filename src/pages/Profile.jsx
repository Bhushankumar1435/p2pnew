import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { t } from '../components/i18n';
import Profiledata from './Profile/profileData';
import MyAds from './Profile/myAds';
// import Deposite from './Saller/Deposite';
import { FaCrown, FaShareAlt, FaCog } from 'react-icons/fa';
import { getData } from '../api/protectedApi';
import Teams from './Profile/Teams';
import { myDeals } from '../api/api';

const Profile = () => {
  const [profile, setProfileData] = useState(null);
  const [ads, setAds] = useState([]); // ✅ all ads
  // const [depositeList, setDepositeList] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Fetch Profile
  useEffect(() => {
    getData('/user/userProfile', {})
      .then((res) => {
        console.log('📦 Profile API Response:', res.data);
        setProfileData(res.data.data.data);
      })
      .catch((err) => console.error('❌ Profile fetch error:', err));
  }, []);

  // Fetch Ads (MyDeals)
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await myDeals();
        console.log('🪧 MyDeals API response:', res);

        // ✅ handle different response shapes
        if (res?.success && Array.isArray(res.data)) {
          setAds(res.data);
        } else if (Array.isArray(res)) {
          setAds(res);
        } else {
          console.warn('⚠️ Unexpected ads format:', res);
          setAds([]);
        }
      } catch (error) {
        console.error('❌ Error fetching ads:', error);
        setAds([]);
      }
    };

    fetchAds();
  }, []);

  // Dynamic Tabs with ads count
  const tabs = [
    { key: 'info', label: 'Info' },
    { key: 'team', label: 'Team' },
    { key: 'ads', label: `Ads (${ads.length})` },
    // { key: 'deposit', label: 'Deposit' },
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
              {activeTab === 'ads' && <MyAds ads={ads} />} {/* ✅ Show ads */}
              {/* {activeTab === 'deposit' && (
                <>
                  <Link onClick={() => setDepositeList(true)}>Deposit</Link>
                  <Deposite
                    isOpen={depositeList}
                    onClose={() => setDepositeList(false)}
                  />
                </>
              )} */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
