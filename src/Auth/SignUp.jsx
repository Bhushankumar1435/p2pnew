import React, { useState, useEffect } from 'react';
import Logo from '../assets/svgs/logo.svg';
import VarifyIcon from '../assets/images/varify.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser, validateSponser } from "../api/api";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // STATES
  const [sponsorId, setSponserId] = useState('');
  const [sponserName, setSponserName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  // -------------------------------
  // 1️⃣ AUTO-FILL SPONSOR ID FROM URL
  // -------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refSponsor = params.get("sponsorId");

    if (refSponsor) {
      setSponserId(refSponsor);

      // auto validate
      validateSponser(refSponsor)
        .then((res) => {
          if (res.success) {
            setSponserName(res.data.name);
          } else {
            toast.error(res.message);
          }
        })
        .catch(() => toast.error("Error validating sponsor"));
    }
  }, [location]);
  

  // -------------------------------
  // 2️⃣ Fetch Country List
  // -------------------------------
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}user/getCountry?search=`);
        const data = await res.json();

        const formatted = (data?.data || []).map(country => ({
          value: country.code,
          label: country.name
        }));

        setCountries(formatted);

        const india = formatted.find(c => c.label.toLowerCase() === "india");
        if (india) setSelectedCountry(india);

      } catch (err) {
        toast.error("Error fetching countries");
      }
    };

    fetchCountries();
  }, []);

  // -------------------------------
  // 3️⃣ Validate Sponsor ID manually (blur)
  // -------------------------------
  const validateSponserId = async () => {
    if (!sponsorId) return;

    try {
      const res = await validateSponser(sponsorId);
      if (!res.success) {
        toast.error(res.message);
        setSponserName('');
      } else {
        setSponserName(res.data.name);
        toast.success("Sponsor Verified");
      }
    } catch {
      toast.error("Error validating sponsor");
    }
  };

  // -------------------------------
  // 4️⃣ SUBMIT SIGNUP
  // -------------------------------
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
      };

      const response = await registerUser(formData);

      if (response.success) {
        toast.success(response.message);
        navigate("/verify_signup", { state: { email } });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <ToastContainer />

      <div className="min-h-screen px-6 py-4 flex flex-col items-center justify-between bg-white text-black">
        <div className="w-full text-center">

          <img src={Logo} alt="Logo" className="w-32 mt-5 mx-auto" />
          <h1 className="text-xl font-semibold mt-6 mb-10">Welcome to Coin P2P Trader</h1>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>

            {/* SPONSOR ID */}
            <input
              type="text"
              value={sponsorId}
              onChange={(e) => setSponserId(e.target.value)}
              onBlur={validateSponserId}
              placeholder="Sponsor ID"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300"
            />

            {/* SPONSOR NAME */}
            <input
              type="text"
              value={sponserName}
              placeholder="Sponsor Name"
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-neutral-300"
            />

            <input
              type="text"
              placeholder="Enter your Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300"
            />

            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300"
            />

            <Select
              options={countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Select country"
            />

            <div className="flex gap-3">
              <input
                type="text"
                value={selectedCountry?.value || ''}
                readOnly
                className="w-1/3 px-4 py-3 rounded-xl border border-neutral-300"
              />
              <input
                type="text"
                placeholder="Enter Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-2/3 px-4 py-3 rounded-xl border border-neutral-300"
              />
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
              Sign up
            </button>

            <p className="mt-2">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--link-color)]">
                Login
              </Link>
            </p>
          </form>
        </div>

        <div className="pt-3 w-full bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
          <img src={VarifyIcon} alt="" className="w-4 h-4" />
          A secure P2P service provider
        </div>
      </div>
    </div>
  );
};

export default Signup;
