import React from 'react'
import Header from '../../../components/Header'
import { t } from "../../../components/i18n";
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router';

const AddBank = () => {
    const navigate = useNavigate();
    const HandleConfirm = () => {
        navigate('/paymentmethod')
    }
  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
    <div className="min-h-screen flex flex-col items-center bg-white text-black ">
      <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
        <Header />
        <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
            <div className='w-full pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">{t('addBankDetails')}</h1>
              <div className="w-full space-y-3 px-4 mt-4">
                <div className='w-full'>
                  <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                  {t('NameInBank')}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Name"
                    
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none bg-white"
                  /></div>
                  <div className='w-full'>
                  <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                  {t('bankAccount')}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Account Number"
                    
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none bg-white"
                  /></div>
                  <div className='w-full'>
                  <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                  {t('ifscCode')}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter IFSC Code"
                    
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none bg-white"
                  /></div>
                  <div className='w-full'>
                  <label className="text-[15px] leading-4 text-black text-left font-medium mb-3 block w-full">
                  {t('bankName')}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Bank Name"
                    
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none bg-white"
                  /></div>
                  <button onClick={HandleConfirm} type="submit" className=" mt-4 w-full rounded-xl py-3 px-4 text-base leading-5 text-black font-normal cursor-pointer bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]">
                    {t('confirm')}
                  </button>
              </div>
            </div>
        </div>
    </div>
    <Footer/>
    </div>
    </div>
  )
}

export default AddBank