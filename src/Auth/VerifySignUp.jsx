import React, { useRef, useState } from 'react';
import Logo from '../assets/svgs/logo.svg';
import CreatePassword from './CreatePassword';
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { verifySignup , resendVierifyOtpMail } from "../api/api";

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

const VerifySignUp = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [createPassword, setCreatePassword] = useState(false)
  const location = useLocation();
  const { email ,password} = location.state || {};

  const handleOtpSubmit =async (e) => {
    e.preventDefault(); 
    const otp = inputs.current.map((input) => input.value).join('');
    console.log('Entered OTP:', otp); 
    setLoading(true);
    setError('');
    try {
      let formData = {email : email,otp : parseInt(otp),password:password}
      let response = await verifySignup(formData);
      console.log(formData ,'resp is ' . resp)
     
      if(response.success == true){
        toast.success(response.message); 
        localStorage.setItem('auth_token', response.data.token);
        // let successMessage = 'Dear '+response.data.details.name + ' Your Acount Created Successfully <br>UserId : '+response.data.details.userId + '<br>Password : '+response.data.details.password
        setTimeout(() => {
          navigate("/register-success",{ state: {data: response.data.details} });
        }, 2000);
         // navigate("/veify_signup", { state: {email: formData.email} });//redirect to create password page
      }else{
        toast.error(response.message); 
      }
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      
    }finally {
      setLoading(false);
    }  
  };
  
  const handleResendOtp =  async () => {
    // Add resend OTP logic here
    let response = await resendVierifyOtpMail({email:email})

    console.log('Resend OTP');
    if(response.success == true){
      toast.success(response.message);
    }else{
      toast.error(response.message);
    }
  };

  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <> 
       <div className='max-w-[600px] mx-auto'>
        <ToastContainer position="top-right" autoClose={3000} />
        <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block mx-auto" />
        <h1 className="text-2xl font-semibold text-center  leading-4 mt-6 mb-10">Enter OTP</h1>
        <p className="text-base font-normal text-black leading-6 text-center">OTP sent to your registered Email Address</p>
        <p className='text-center'>{email}</p>
        <p className="text-base font-normal text-black leading-6 mb-6 text-center">
          Please enter the OTP and click on Continue
        </p>
        <form className="" onSubmit={handleOtpSubmit}>
          <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
            OTP
          </label>

          <div className="flex justify-between gap-2 mb-6">
            {Array(6)
              .fill()
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputs.current[i] = el)}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // className='w-10 h-10 border rounded-md text-center text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
          >
            Continue
          </button>

          {/* Resend OTP button */}
          <button
            type="button"
            onClick={handleResendOtp}
            className="mt-4  w-full text-base leading-5 text-black font-normal cursor-pointer text-center"
          >
          Resend OTP
          </button>
        </form>
      </div> 
      
    </>
  );
};

export default VerifySignUp;
