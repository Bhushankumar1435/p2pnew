import React, { useState, useEffect } from 'react';
import Logo from '../assets/svgs/logo.svg';
import VarifyIcon from '../assets/images/varify.png';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, validateSponser } from "../api/api";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ⚙️ Make sure this is your actual backend URL (Vite env variable)
const BASE_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();

  // 🧠 Form states
  const [sponsorId, setSponserId] = useState('');
  const [sponserName, setSponserName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // 🌍 Fetch countries from backend dynamically
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}user/getCountry?search=`);
        if (!res.ok) throw new Error(`Failed to fetch countries: ${res.statusText}`);

        const data = await res.json();
        console.log('🌍 Country API response:', data);

        // ✅ Map plain strings into { value, label } format for react-select
        const formatted = (data?.data || []).map((country) => ({
          value: country.code,
          label: country.name,
        }));

        setCountries(formatted);

        // ✅ Set default to India if found
        const india = formatted.find(
          (c) => c.label.toLowerCase() === 'india'
        );
        if (india) setSelectedCountry(india);
      } catch (err) {
        console.error("❌ Error fetching countries:", err);
        toast.error("Error fetching countries");
      }
    };

    fetchCountries();
  }, []);

  // 🧾 Handle Signup Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    try {
      const formData = {
        name,
        email,
        countryCode: selectedCountry.value,
        phoneNumber,
        country: selectedCountry.label,
        sponsorId,
        password,
      };

      const response = await registerUser(formData);
      console.log('Signup response:', response);

      if (response.success) {
        toast.success(response.message);
        navigate("/verify_signup", { state: { email, password } });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // 🧩 Validate Sponsor ID
  const validateSponserId = async () => {
    if (!sponsorId) return;
    try {
      const response = await validateSponser(sponsorId);
      if (!response.success) {
        toast.error(response.message);
        setSponserName('');
      } else {
        setSponserName(response.data.name);
        toast.success(response.message);
      }
    } catch (err) {
      toast.error("Error validating sponsor");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen px-6 py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
        <div className="w-full text-center">
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
          <h1 className="text-xl font-semibold leading-4 mt-6 mb-10">
            Welcome to Coin P2P Trader
          </h1>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              onBlur={validateSponserId}
              onChange={(e) => setSponserId(e.target.value)}
              placeholder="Sponsor ID"
              className="w-full placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />

            <input
              type="text"
              placeholder="Sponsor Name"
              value={sponserName}
              className="w-full placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
              readOnly
            />

            <input
              type="text"
              placeholder="Enter your Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />

            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
            />

            {/* 🌍 Country Dropdown */}
            <Select
              options={countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Select country"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#ccc',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#888' },
                }),
                singleValue: (base) => ({ ...base, color: 'black' }),
                placeholder: (base) => ({
                  ...base,
                  color: 'black',
                  textAlign: 'left',
                }),
              }}
            />

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Country code"
                value={selectedCountry?.value || ''}
                readOnly
                className="w-1/3 placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-2/3 placeholder:text-black px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 px-4 text-base text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
            >
              Sign up
            </button>

            <p className="mt-2">
              Already have an account?{' '}
              <Link className="font-semibold text-[var(--link-color)]" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>

        <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default Signup;
