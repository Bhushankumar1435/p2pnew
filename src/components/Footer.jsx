import React from 'react';
import { FaUserFriends } from "react-icons/fa";
import { FiList, FiSpeaker, FiUser } from "react-icons/fi";
import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { t, setLang } from '../components/i18n';
const Footer = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const navRoutes = ['/dashboard', '/profile', '/orders', '/ad'];

  // ✅ 1. Public Footer
  if (!isAuthenticated) {
    return (
      <div className="bg-[var(--primary)] text-center py-4 text-white">
        Public Footer
      </div>
    );
  } else {
    return (
      <div className="sticky w-full bottom-0 left-0 right-0 bg-white shadow-[0_0px_4px_0px_rgba(0,0,0,0.04)]  flex justify-around py-2 text-sm z-0">
        <NavLink

          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FaUserFriends size={20} />
          <span>{t('P2p')}</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiList size={20} />
          <span>{t('Orders')}</span>
        </NavLink>

        <NavLink
          to="/createads"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiSpeaker size={20} />
          <span>{t('ad')}</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiUser size={20} />
          <span>{t('profile')}</span>
        </NavLink>
      </div>
    );
  }

  // ✅ 2. FooterNav
  if (navRoutes.includes(pathname)) {
    return (
      <div className="sticky w-full bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm z-10">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FaUserFriends size={20} />
          <span>{t('P2p')}</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiList size={20} />
          <span>{t('Orders')}</span>
        </NavLink>

        <NavLink
          to="/createads"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiSpeaker size={20} />
          <span>{t('ad')}</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center text-blue-600'
              : 'flex flex-col items-center text-gray-500'
          }
        >
          <FiUser size={20} />
          <span>{t('profile')}</span>
        </NavLink>
      </div>
    );
  }

  // ✅ 3. Inner Page Footer (shown when logged in but not on main nav pages)
  return (
    <div className="bg-[var(--primary)] text-center py-4 text-white">
      Inner Page Footer - current path: {pathname}
    </div>
  );
};

export default Footer;
