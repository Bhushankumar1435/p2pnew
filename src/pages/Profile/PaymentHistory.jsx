import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import CopyIcon from '../../assets/images/copy_icon.png'
import { depositTxn } from '../../api/api'
import { ToastContainer, toast } from 'react-toastify';

const PaymentHistory = () => {
    const [paymentValue, setPaymentValue] = useState('');

    const PaymentHistoryCount = async () => {
        try {
            const response = await depositTxn();
            if (response.success === true) {
                toast.success(response.message);
                setPaymentValue(response?.data);

            } else {
                toast.error(response.message);
            }
        } catch (err) {
            toast.error('Failed to get wallet address');
            console.error(err);
        }
    };
    useEffect(() => {
        PaymentHistoryCount();
    }, []);
    return (
        <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
            <div className="min-h-screen flex flex-col items-center bg-white text-black ">
                <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
                    <Header />
                    <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto'>
                        <div className="flex justify-between gap-2 py-3 border-b border-[var(--border-light)] px-4 mb-4 text-base font-medium leading-5">Payment</div>
                        {paymentValue?.data?.map((item, index) => (
                            <div key={index} className='w-full pt-3 px-4'>
                                <div className="border-b border-[var(--border-light)] pb-3 mb-3 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-green-500">
                                            <span className="pl-1 text-black">Token</span>
                                        </span>
                                        <span className="px-2 py-0.5 text-xs rounded-sm bg-blue-100 text-blue-600">{item.token}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">Time</div>
                                        <div className="text-black text-sm">{item.timeStamp}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">Hash</div>
                                        {/* <div className="text-black text-sm">{item.hash}</div> */}
                                        <div className="text-[var(--link-color)] text-sm"> {item.adminDebitHash ? (
                                            <>
                                                <a href={`https://bscscan.com/tx/${item.adminDebitHash}`} target="_blank" rel="noopener noreferrer">
                                                    {item.adminDebitHash.slice(0, 15)}...
                                                </a>
                                            </>
                                        ) : (
                                            'None')}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">From</div>
                                        <div className="text-[var(--link-color)] text-sm"> {item.from ? (
                                            <>
                                                <a href={`https://bscscan.com/address/${item.from}`} target="_blank" rel="noopener noreferrer">
                                                    {item.from.slice(0, 15)}...
                                                </a>
                                            </>
                                        ) : (
                                            'None')}</div>
                                        {/* <div className="text-[var(--link-color)] text-sm">{item.from}</div> */}
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">To</div>
                                        <div className="text-[var(--link-color)] text-sm"> {item.to ? (
                                            <>
                                                <a href={`https://bscscan.com/address/${item.to}`} target="_blank" rel="noopener noreferrer">
                                                    {item.to.slice(0, 15)}...
                                                </a>
                                            </>
                                        ) : (
                                            'None')}</div>
                                        {/* <div className="text-[var(--link-color)] text-sm">{item.to}</div> */}
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">Amount</div>
                                        <div className="text-black text-sm">{item.amount}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-[var(--text-color)] text-sm">Value</div>
                                        <div className="text-black text-sm">{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))} {/* ✅ FIXED: Close map function here */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
