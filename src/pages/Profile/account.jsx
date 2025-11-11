import React, { useState, useEffect } from 'react';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { getData, postData } from '../../api/protectedApi';
import { validateSponser } from "../../api/api";
import Deposite from '../Saller/Deposite';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function account() {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(0);
    // const [activationList, setActivationList] = useState(0);
    const [depositeList, setDepositeList] = useState(false);

    const activationTransactions = () => {
        getData('/user/walletHistory', { limit: 10, page: 1 })
            .then((res) => {
                setActivationList(res.data.data);
                console.log('aaa', res.data);
            })
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        activationTransactions();
        getData('/user/userBalance?type=WALLET', {})
            .then((res) => {
                setBalance(res.data?.data);
                console.log('aaa', res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId.trim()) {
            setError('User ID is required.');
        } else {
            try {
                const res = await postData('/user/activateAccount', { userId: userId });
                if (res.data.success == true)
                    toast.success(res.data.message);
                else
                    setError(res.data.message);
            } catch (e) {
                toast.error(e.message);
            }
        }
    };

    const checkUser = async () => {
        let response = await validateSponser(userId);
        if (response.success == false) {
            toast.error(response.message);
            setUserId('');
        } else {
            setError(response.data.name);
            toast.success(response.message);
        }
    };

    const navigate = useNavigate();

    const menuItems = [
        { label: "Activate", path: "/activate" },
        { label: "History", path: "/history" },
        { label: "Deposit", path: "deposit" }, // We'll handle this one manually below
        { label: "Bonus", path: "/bonus" },
        { label: "Withdraw", path: "/withdraw" },
    ];

    return (
        <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="min-h-screen flex flex-col items-center bg-white text-black ">
                <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
                    <Header />
                    <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
                        <div className='w-full py-5'>
                            <div className=" items-center justify-center align-items-center mt-auto px-3">
                                <h2 className='font-semibold mb-2'>Account Management</h2>
                                <div className="flex flex-col p-3 gap-3">
                                    {menuItems.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (item.label === "Deposit") {
                                                    setDepositeList(true); // ✅ Opens Deposite
                                                } else {
                                                    navigate(item.path);
                                                }
                                            }}
                                            className="flex items-center justify-between border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                                        >
                                            <h4 className="text-base font-medium text-black">{item.label}</h4>
                                            <FaChevronRight className="text-gray-400 text-sm" />
                                        </button>
                                    ))}
                                </div>

                                {/* {activationList.length === 0 ? (
                                    <p>No deals found.</p>
                                ) : (
                                    activationList.data?.map((activity, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span
                                                    className={`text-xl font-bold ${activity.amount < 0 ? 'text-red-600' : 'text-green-600'
                                                        }`}
                                                >
                                                    {activity.amount} {activity.token}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-md text-sm font-semibold ${activity.transactionType === 'DEPOSIT'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {activity.transactionType.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )} */}

                                {/* ✅ Deposit Modal (only shows when depositeList is true) */}
                                {depositeList && (
                                    <Deposite
                                        isOpen={depositeList}
                                        onClose={() => setDepositeList(false)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}
