import React, { useState, useEffect } from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import Logo from '../assets/svgs/logo.svg';
import LogoWhite from '../assets/svgs/logo_white.svg';
// import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`/user/getCountry?search=ind`);
        const data = await res.json();
        console.log('API response:', data); 
        setCountries(data || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);


  // 🔒 Logged-in header
  if (isAuthenticated) {
    return (
      <div className="bg-blue-600 text-white pt-10 pb-6 px-4 flex items-center justify-between w-full relative z-0 after:absolute after:-bottom-5 after:left-0 after:w-full after:h-6 after:bg-blue-600 after:-z-10">
        <img src={LogoWhite} alt="Logo" className="h-8" />

        {loading ? (
          <span>Loading...</span>
        ) : (
          <Menu as="div" className="z-10 relative">
            <MenuButton className="inline-flex items-center gap-2 rounded-md border border-white px-2 py-1.5 text-sm font-semibold text-white">
              {selected?.flag && (
                <img src={selected.flag} className="w-5 h-5" alt="flag" />
              )}
              {selected?.code || 'Select'}
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </MenuButton>

            <MenuItems
              as="div"
              transition
              anchor="bottom end"
              className="z-10 bg-white w-52 origin-top-right rounded-xl border border-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
            >
              {countries.map((country) => (
                <MenuItem key={country.code}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelected(country)}
                      className={`${active ? 'bg-gray-100' : ''
                        } group flex items-center w-full px-4 py-2 text-sm text-black`}
                    >
                      {country.flag && (
                        <img src={country.flag} className="w-5 h-5 mr-2" />
                      )}
                      {country.code}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        )}
      </div>
    );
  }

  // 🔓 Public header (same as before)
  return (
    <Disclosure as="nav" className="bg-white shadow-2xl relative z-[1]">
      {/* ...your existing public header code... */}
    </Disclosure>
  );
};

export default Header;
