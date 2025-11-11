import React, { useState, useEffect } from 'react'; 
import CopyIcon from '../../assets/images/copy_icon.png';
import { getWalletAddress } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import QRCode from 'qrcode';
import { postData } from '../../api/protectedApi';
import { FaSyncAlt, FaClipboard, FaHistory } from 'react-icons/fa';

import { Link } from 'react-router-dom';
const Deposite = ({ isOpen, onClose, onUploadConfirm }) => {
  if (!isOpen) return null;

  const [walletValue, setWalletValue] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  const handleDepositeValue = () => {
    onClose();             // Close modal
    onUploadConfirm();     // Tell parent to show PaymentHistory
  };
  const checkNewDeposit = async() => {
        try{
         const res = await postData('/user/checkDeposit', {address:walletValue});
             if(res.data.success == true)
                toast.success(res.data.message)
              else
                toast.error(res.data.message)
              // .then((res) => { 
              //    console.log('data ', res) 
              
              //   })
              // .catch((err) => toast.error(err));
        }catch(e){
         toast.error(e.message);
        }
         
  }
  const getWalletAmount = async () => {
    try {
      const response = await getWalletAddress();
      if (response.success === true) {
        toast.success(response.message);
        setWalletValue(response.data);
        const qrImage = await QRCode.toDataURL(response.data);
        setQrUrl(qrImage);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error('Failed to get wallet address');
      console.error(err);
    }
  };

  useEffect(() => {
    getWalletAmount();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-[99]">
        <div className="bg-white w-full max-w-xs mx-auto rounded-xl p-5 relative shadow-lg">
          <div className='flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-light)]'>
            <h2 className="text-base font-medium text-center tracking-wide">Payment</h2>
            <button
              onClick={onClose}
              className="bg-gray-100 w-6 h-6 leading-6 flex items-center justify-center text-gray-400 hover:text-black text-base rounded-sm"
            >
              ✕
            </button>
          </div>
          <div className='w-full'>
            <div className="mb-4 mt-4 flex gap-3 items-center flex-col text-sm text-[var(--text-color)] w-full">
              <span className='shrink-0'>
                {qrUrl && <img src={qrUrl} alt="QR Code" className="w-full" />}
              </span>
              <div className="w-full text-[var(--text-color)] flex flex-col">
                Address
                <span className='mb-2 text-black'>Deposit BEP20 USDT only</span>
                <div className='flex items-center gap-2 relative border border-[var(--border-light)] py-2 px-3 cursor-default rounded-lg bg-transparent text-left shadow-none focus:outline-none sm:text-sm justify-between'>
                  <span className='text-ellipsis overflow-hidden text-nowrap'>{walletValue}</span>
                  
                  <button onClick={() => {
                    if (walletValue) {
                      navigator.clipboard.writeText(walletValue);
                      toast.success('Copied to clipboard');
                    } else {
                      toast.error('Nothing to copy');
                    }
                  }} className='shrink-0'>
                    <img src={CopyIcon} alt="Copy" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2" onClick={checkNewDeposit}>
                Balance
                <button className="hover:text-blue-600">
                  <FaSyncAlt />
                </button>
              </span>
              <Link
                to="/paymenthistory"
                className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-sm font-medium"
              >
                {/* <FaHistory /> */}
                Payment History
              </Link>
            </div> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposite;
