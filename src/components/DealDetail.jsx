import React, { useState } from 'react'
import Header from '../components/Header'
import UploadRecipt from '../components/UploadRecipt'

const DealDetail = () => {
     const incomingAmount = 100;
  const price = 92;
  const amountInRupees = incomingAmount * price;
  const commissionRate = 2.5;
  const commission = (amountInRupees * commissionRate) / 100;
  const payableAmount = amountInRupees + commission;
  const [uploadReciept, setUploadReciept] =useState(false)
  const [ setUploadRecieptFinal] = useState(false)
  return (
    <>
   <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black">  
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]'> 
          <Header />

          {/* Add your deal detail UI here */}
          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto'>
          <div className='flex justify-between gap-2 py-3 border-b border-[var(--border-light)] px-4 mb-4 text-base font-medium leading-5'>
            Order Details
          </div>
                <div className='w-full px-4'>
                <h5 className='pb-3 text-black text-sm'>Billing Details</h5>
                <div className="border border-[var(--border-light)] rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-[var(--text-color)]">Incoming amount</span>
          <span className="text-black">${incomingAmount}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-[var(--text-color)]">Price</span>
          <span className="text-black">$ {price}</span>
        </div>
        <hr className="border-dashed border-t border-[var(--border-light)] my-4" />
        <div className="flex justify-between mb-2">
          <span className="text-[var(--text-color)]">Amount in Rupees</span>
          <span className="text-black">$ {amountInRupees}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-[var(--text-color)]">Commission $({commissionRate}%)</span>
          <span className="text-black">$ {commission}</span>
        </div>
        <hr className="border-dashed border-t border-[var(--border-light)] my-4" />
        <div className="flex justify-between">
          <span className="text-[var(--text-color)]">Payable Amount</span>
          <span className="text-[var(--success)] font-semibold">$ {payableAmount}</span>
        </div>
      </div>

      <button onClick={() => setUploadReciept(true)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full">
        Pay now
      </button>
                </div>
            </div>
        </div>
      </div>
    </div>
    <UploadRecipt  isOpen={uploadReciept}
  onClose={() => setUploadReciept(false)}
  onUploadConfirm={() => setUploadRecieptFinal(true)} />
    </>
  )
}

export default DealDetail