// WalletAddress.jsx or .tsx
import React, {useRef, useState} from 'react';
import Logo from '../assets/svgs/logo.svg'; // <== Don't forget this import!
import OTP from './OTP';

const WalletAddress = () => {
    const inputRef = useRef(null);
    const [enterOtp, setEnterOtp] = useState(false);

    const handleEnterOtp = (e) => {
      e.preventDefault();
      setEnterOtp(true);
    };

    const handlePasteClick = async () => {
      try {
        const text = await navigator.clipboard.readText(); // Read clipboard
        if (inputRef.current) {
          inputRef.current.value = text; // Paste into input
        }
      } catch (err) {
        console.error('Failed to read clipboard: ', err);
      }
    };
    
  return (
    <div className="w-full text-center">
      {enterOtp ? (
        <OTP setEnterOtp={setEnterOtp} />
      ) : (
        <>
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
          <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">
            Welcome to Coin P2P Trader
          </h1>
          <form onSubmit={handleEnterOtp} className="w-full space-y-4">
            <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
              Enter (Bep20) address
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-neutral-300 flex gap-3 items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter Wallet Address"
                className="w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={handlePasteClick}
                className="m-0 p-0 bg-transparent border-0 shrink-0 text-[15px] leading-4 text-black font-medium pl-4 cursor-pointer"
              >
                Paste
              </button>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
            >
              Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default WalletAddress;
