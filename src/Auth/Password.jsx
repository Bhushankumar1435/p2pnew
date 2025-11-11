import React, { useState } from 'react';
import Logo from '../assets/svgs/logo.svg';
import OTP from './VerifySignUp';

const Password = () => {
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleForgot = (e) => {
    e.preventDefault(); // FIXED: uppercase D
    setForgotPassword(true);
  };

  return (
    <>
      {forgotPassword ? (
        <OTP setForgotPassword={setForgotPassword} /> // FIXED: properly closed component
      ) : (
        <div className='w-full text-center'>
          <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
          <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">Enter Password</h1>
          <form className="w-full space-y-4">
            <div className="w-full mb-4 px-6">
              <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
              >
                Confirm
              </button>

              <button
                onClick={handleForgot}
                className="mt-1 w-full rounded-xl py-3 px-4 text-base leading-5 text-[#E72C44] font-medium cursor-pointer"
              >
                Forgot Password
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Password;
