import React, { useState } from 'react';
import LogoWhite from '../assets/svgs/logo_white.svg';
import { useAuth } from '../context/AuthContext';
import { t, setLang } from '../components/i18n';
// import LanguageIcon from '../assets/svgs/language.svg'; 

const Header = () => {
  const { isAuthenticated } = useAuth();

  const currentLang =
    localStorage.getItem("current_lang") || "en";

  const changeLanguage = (e) => {
    setLang(e.target.value);
  };

  // -----------------------------------------
  // 🔒 LOGGED-IN HEADER
  // -----------------------------------------
  if (isAuthenticated) {
    return (
      <div className="bg-blue-600 text-white pt-10 pb-6 px-4 flex items-center justify-between w-full relative z-0 after:absolute after:-bottom-5 after:left-0 after:w-full after:h-6 after:bg-blue-600 after:-z-10">
        <img src={LogoWhite} alt="Logo" className="h-8" />

        {/* Language Selector */}
        <div className="relative w-24">
          <select
            value={currentLang}
            onChange={changeLanguage}
            className="block w-full px-2 py-1 pr-4  border border-white/50 rounded-md text-black bg-white font-medium appearance-none focus:outline-none "
          >
            <option value="en">{t("English")}</option>
            <option value="hi">{t("Hindi")}</option>
            <option value="fr">{t("French")}</option>
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 ">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // 🔓 PUBLIC HEADER (unchanged)
  // -----------------------------------------
  return (
    <div className="bg-white shadow-2xl relative z-[1]">
      {/* your existing public header code here */}
    </div>
  );
};

export default Header;
