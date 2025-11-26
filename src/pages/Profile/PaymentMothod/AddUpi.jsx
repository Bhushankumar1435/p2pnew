import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { t } from "../../../components/i18n";
import Footer from '../../../components/Footer';
import { postData, getData } from '../../../api/protectedApi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddUpi = () => {

  const [upi, setUpi] = useState('');

  useEffect(() => {
    fetchOldUpi();
  }, []);

  const fetchOldUpi = async () => {
    try {
      const res = await getData("/user/bankDetails");

      // console.log("🔥 API response:", res);

      const oldUpi = res?.data?.data?.upi;

      if (oldUpi) {
        setUpi(oldUpi);
      }

    } catch (err) {
      console.error("🔥 Error fetching UPI:", err);
    }
  };

  //  Save or update UPI
  const HandleConfirm = async () => {
    try {
      const res = await postData('/user/addUpi', { upi });

      if (res?.success) {
        toast.success(res.message || "UPI added successfully!");
      } else {
        toast.error(res?.message || "Failed to add UPI!");
      }

    } catch (e) {
      toast.error("Something went wrong!");
      console.error(e);
    }
  };
  const navigate = useNavigate();

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black ">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>

          <Header />

          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>

            <ToastContainer position="top-right" autoClose={3000} />

            <div className='w-full pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                {t('AddPaymentMethod')}
              </h1>
              <div className="w-full space-y-3 px-4 mt-4">

                <label className="text-[15px] text-black font-medium mb-3 block">
                  {t('yourUPI')}
                </label>

                <input
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none bg-white"
                />

                <button
                  onClick={HandleConfirm}
                  className="mt-4 w-full rounded-xl py-3 text-base text-black font-normal bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
                >
                  {t('confirm')}
                </button>

              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AddUpi;
