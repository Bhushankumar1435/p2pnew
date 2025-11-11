import React, { useState } from 'react'; 
import Logo from '../assets/svgs/logo.svg'; 
import VarifyIcon from '../assets/images/varify.png'; 
import { useNavigate } from "react-router-dom"; 
import { forgotPassword } from "../api/api"; 
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const handleSubmit =  async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    try { 
        let response = await forgotPassword({email :email}) 
        console.log( ' response ' ,response)
        if (response.success == false) {
          toast.error(response.message);
        }else{
          toast.success(response.message);  
        }
        

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }  
  };
  
  return (
    <div className='max-w-[600px] mx-auto'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen py-4 flex flex-col items-center justify-between bg-white text-black font-sans">
            <>
            <div className='w-full text-center'>
              <img src={Logo} alt="Logo" className="w-32 mt-5 inline-block" />
              <h1 className="text-2xl font-semibold leading-4 mt-6 mb-10">Welcome to Coin P2P Trader</h1>
              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                <div className="w-full mb-4 px-6">
                  <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                    User ID/ Email
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none"
                  />  
                  <button type="submit" className=" mt-4 w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
                <p>Back to <Link to="/login">Login</Link></p> 
              </form>
            </div>
            </> 

      <div className="pt-3 w-full sticky bottom-0 bg-white flex justify-center items-center text-xs text-gray-500 gap-1">
        <img src={VarifyIcon} alt='' className='w-4 h-4' />
        A secure P2P service provider
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
