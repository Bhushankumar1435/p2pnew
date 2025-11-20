import React, { useState } from 'react';
import Header from '../../../components/Header';
import { t } from "../../../components/i18n";
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router';
import { postData } from '../../../api/protectedApi';
import { ToastContainer, toast } from 'react-toastify';

const AddBank = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");

  const HandleConfirm = async () => {
    try {
      const payload = {
        name,
        accountNumber,
        ifscCode:ifsc,
        bankName
      };

      const res = await postData("/user/addBankDetails", payload);

      console.log("🔥 API RESPONSE:", res);

      if (res?.success === true) {
        toast.success(res.message || "Bank details added successfully!");

        setTimeout(() => {
          navigate("/paymentmethod");
        }, 800);

      } else {
        toast.error(res?.message || "Failed to add bank details!");
      }

    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black ">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>

          <Header />

          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>

            <ToastContainer position="top-right" autoClose={3000} />

            <div className='w-full pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                {t('addBankDetails')}
              </h1>

              <div className="w-full space-y-3 px-4 mt-4">

                {/* Name */}
                <div className='w-full'>
                  <label className="text-[15px] font-medium mb-3 block">
                    {t('NameInBank')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white"
                  />
                </div>

                {/* Account Number */}
                <div className='w-full'>
                  <label className="text-[15px] font-medium mb-3 block">
                    {t('bankAccount')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white"
                  />
                </div>

                {/* IFSC */}
                <div className='w-full'>
                  <label className="text-[15px] font-medium mb-3 block">
                    {t('ifscCode')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter IFSC Code"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white"
                  />
                </div>

                {/* Bank Name */}
                <div className='w-full'>
                  <label className="text-[15px] font-medium mb-3 block">
                    {t('bankName')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white"
                  />
                </div>

                <button
                  onClick={HandleConfirm}
                  className="mt-4 w-full rounded-xl py-3 text-base bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)]"
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

export default AddBank;
