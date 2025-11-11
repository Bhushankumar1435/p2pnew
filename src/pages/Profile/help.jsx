
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FiHeadphones } from "react-icons/fi";
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';

export default function Help() {
    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <div className="min-h-screen flex flex-col items-center bg-white text-black">
                <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
                    <Header />
                    <div className="w-full  rounded-t-xl relative z-[1]">
                        <div className="w-full pt-6  ">

                            <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                                Help & Support
                            </h1>
                            <div className="flex justify-center mt-8  mb-4">
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <FiHeadphones className="text-blue-600 text-4xl" />
                                </div>
                            </div>


                            <h2 className="text-lg font-semibold text-center mb-6">How can we help?</h2>


                            <div className="space-y-4">
                                <Link to={"/raiseTicket"} className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition">
                                    <span>Raise New Ticket</span>
                                    <span>&gt;</span>
                                </Link>
                                <Link to={"/Tickethistory"} className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition">
                                    <span>Ticket History</span>
                                    <span>&gt;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}



