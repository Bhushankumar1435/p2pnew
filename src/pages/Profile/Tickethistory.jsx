import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Tickethistory = () => {
    const [activeTab, setActiveTab] = useState('Resolved');

    const tabs = ['Resolved', 'Open', 'Closed'];

    const ticket = {
        subject: 'Payment Not Received',
        time: '23-01-2025 12:00pm',
    };
    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <div className="min-h-screen flex flex-col items-center bg-white text-black">
                <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] px-4 py-6">
                    <Header />

                    <div className="min-h-screen ">
                        <div className="max-w-[600px] mx-auto w-full pt-6 ">
                            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                                {/* Tabs */}
                                <div className="flex border-b text-sm font-medium text-gray-600">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            className={`w-full py-3 transition-colors ${activeTab === tab
                                                ? 'text-black border-b-2 border-blue-600 bg-gray-100'
                                                : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Content for Resolved Tab */}
                                {activeTab === 'Resolved' && (
                                    <div className="p-4 text-sm text-gray-700 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Subject</span>
                                            <span>{ticket.subject}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Solution</span>
                                            <button className="px-4 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                                                View
                                            </button>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-medium">Time</span>
                                            <span>{ticket.time}</span>
                                        </div>
                                    </div>
                                )}
                                


                                {/* Empty states for other tabs */}
                                {activeTab !== 'Resolved' && (
                                    <div className="p-4 text-gray-500 text-center text-sm">
                                        No tickets in <strong>{activeTab}</strong> tab.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};



export default Tickethistory;
