import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { t } from '../../components/i18n'
import { Link } from 'react-router-dom';
import checkIcon from '../../assets/images/checkIcon.png'

import { getData } from '../../api/protectedApi';
const PaymentMethod = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    getData('/user/bankDetails', {})
      .then((res) => { setData(res.data.data), console.log('data ', res.data.data) })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black ">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
          <Header />
          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
            <div className='w-full pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">{t('AddPaymentMethod')}</h1>
              <div className="w-full space-y-3 px-4 mt-4">
                <Link to="/addbank" className='flex justify-between relative border border-gray-300 rounded-2xl px-4 py-3'>
                  <span className='text-base font-normal'>{t('bankDetails')}</span>
                  <div className="pointer-events-none flex items-center text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link to="/addupi" className='flex justify-between relative border border-gray-300 rounded-2xl px-4 py-3'>
                  <span className='text-base font-normal'>{t('UPIDetails')}</span>
                  <div className="pointer-events-none flex items-center text-gray-500 gap-2">
                    {/* <button className='text-xs flex items-center text-black leading-5 px-3 bg-[var(--delete)] rounded-full'>{t('Delete')}</button> */}
                    <img src={checkIcon} />
                  </div>
                 
                </Link>
              </div>
              <div className=''>
                <h2>Bank Details</h2>
                <p> Name : {data?.name}</p>
                <p>Bank Name : {data?.bankName}</p>
                <p>Account Number : {data?.accountNumber}</p>
                <p>IFSC Code : {data?.ifscCode}</p>
                <p>UPI : {data?.upi}</p>

              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default PaymentMethod