import React, { useRef } from 'react';
import Logo from '../assets/svgs/logo.svg';

const CreatePassword = ({ setCreatePassword }) => {
  const inputRef = useRef(null);

  const handlePasteClick = () => {
    navigator.clipboard.readText().then(text => {
      if (inputRef.current) {
        inputRef.current.value = text;
      }
    });
  };

  const handleEnterOtp = (e) => {
    e.preventDefault();
    const walletAddress = inputRef.current?.value?.trim();

    if (!walletAddress) {
      alert("Please enter a wallet address.");
      return;
    }

    console.log("Submitted wallet address:", walletAddress);

    // You can navigate to next step here
  };

  return (
    <div className='flex flex-col justify-center w-full'>
      <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block mx-auto" />
      <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10 text-center">
      Create Password
      </h1>
      
      <form onSubmit={handleEnterOtp} className="w-full space-y-4">
        
        <div className="w-full mb-4 ">
        <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
          New Password
        </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter New Password"
            className="w-full px-4 py-3 rounded-xl border border-neutral-300  focus:outline-none"
          />
          
        </div>
        <div className="w-full mb-4 ">
        <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
         Re-enter Password
        </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 rounded-xl border border-neutral-300  focus:outline-none"
          />
          
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default CreatePassword;
