import React, { Fragment, useState} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import UsdtIcon from '../assets/images/usdt.png'
const payments = [
   
  {
    name: 'Bank',
    symbol: 'BTC',
    icon: UsdtIcon,
  },
  {
    name: 'UPI',
    symbol: 'ETH',
    icon: UsdtIcon,
  },
  {
    name: 'Both',
    symbol: 'USDT',
    icon: UsdtIcon,
  },
];
const UploadRecipt = ({ isOpen, onClose, onUploadConfirm }) => {
  if (!isOpen) return null;

  const handleUploadReceipt = () => {
    onUploadConfirm(); // Confirm action
    onClose();          // Close modal
  };
  const [selectedPayment, setSelectedPayment] = useState(payments[0]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-[99]">
      <div className="bg-white w-full max-w-xs mx-auto rounded-xl p-5 relative shadow-lg">
        <div className='flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-light)]'>
          <h2 className="text-base font-medium text-center tracking-wide">Please Send to Seller’ account</h2>
          <button
            onClick={onClose}
            className="bg-gray-100 w-6 h-6 leading-6 flex items-center justify-center text-gray-400 hover:text-black text-base rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Amount details */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex justify-between">
            <span className='text-[var(--text-color)]'>Amount</span>
            <span className="font-medium text-black">9200rs</span>
          </div>
          <div className="flex justify-between">
            <span className='text-[var(--text-color)]'>Commission (2.5%)</span>
            <span className="font-medium text-black">230rs</span>
          </div>
          <div className="flex mt-3 pt-3 justify-between font-semibold border-dashed border-t border-[var(--border-light)]">
            <span className='text-[var(--text-color)]'>Total Amount</span>
            <span className='text-[var(--success)]'>9430rs</span>
          </div>
        </div>

        <hr className="my-4 border-t border-[var(--border-light)]" />

        {/* Payment method */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Choose payment method</label>
          <Listbox value={selectedPayment} onChange={setSelectedPayment}>
                              <div className="relative mt-1">
                                <Listbox.Button className="relative border border-[var(--border-light)] p-3 w-full cursor-default rounded-lg bg-transparent pr-7 text-left shadow-none focus:outline-none  sm:text-sm">
                                  <span className="flex items-center">
                                    <img src={selectedPayment.icon} alt="" className="h-5 w-5 mr-2" />
                                    {selectedPayment.name}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon className="h-5 w-5 text-black" />
                                  </span>
                                </Listbox.Button>
          
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                  <Listbox.Options className="absolute z-10 mt-1 max-h-60  right-0 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm w-full">
                                    {payments.map((payment) => (
                                      <Listbox.Option
                                        key={payment.symbol}
                                        className={({ active }) =>
                                          `relative cursor-pointer select-none py-2 px-4 ${
                                            active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                          }`
                                        }
                                        value={payment}
                                      >
                                        {({ selectedPayment }) => (
                                          <>
                                            <span className={`flex items-center ${selectedPayment ? 'font-semibold' : 'font-normal'}`}>
                                              <img src={payment.icon} alt="" className="h-5 w-5 mr-2" />
                                              {payment.name}
                                            </span>
                                            
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
        </div>

        {/* Bank details */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex justify-between">
            <span className="text-base text-[var(--text-color)]">Name</span>
            <span className="text-base text-black">Keshav Grover</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base text-[var(--text-color)]">Acc. No.</span>
            <span className="text-base text-black">940015575259453</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base text-[var(--text-color)]">IFSC Code</span>
            <span className="text-base text-black">HDFC0001234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base text-[var(--text-color)]">Bank</span>
            <span className="text-base text-black">HDFC Bank</span>
          </div>
        </div>

        <div className='w-full flex items-center relative bg-transparent after:absolute after:top-1/2 after:left-0 after:w-full after:h-[1px] after:border-t-1 after:border-dashed after:border-[var(--border-light)] justify-center z-1 after:-z[1]'>
                      <span className='bg-white py-1 px-4 relative z-[1]'>Or</span>
                </div>

        <div className="flex justify-between mb-4 text-sm text-gray-700">
          <span className="text-base text-[var(--text-color)]">UPI ID</span>
          <span className="text-base text-black">hdfcok@1255</span>
        </div>
<hr className="my-4 border-t border-[var(--border-light)]" />
        {/* Receipt View */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base text-[var(--text-color)]">Receipt</span>
          <button className="text-base bg-gray-100 text-blue-600 px-3 py-1 rounded-md hover:bg-gray-200">
            View
          </button>
        </div>


        <button
          onClick={handleUploadReceipt}
          className="mt-4 w-full bg-[var(--bg-color)] hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Sent payment to seller
        </button>
      </div>
    </div>
  );
};

export default UploadRecipt;
