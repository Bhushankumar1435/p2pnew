import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaChevronDown, FaUpload } from 'react-icons/fa';

export default function Raiseticket() {
    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <div className="min-h-screen flex flex-col items-center bg-white text-black">
                <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] px-4 py-6">
                    <Header />

                    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h2 className="text-lg font-medium mb-4">Raise New Ticket</h2>


                        <label className="block mb-1 font-medium text-sm">Subject</label>
                        <div className="relative mb-4">
                            <select className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Select one reason</option>
                                <option>Payment Issue</option>
                                <option>Account Issue</option>
                                <option>Other</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                        </div>


                        <label className="block mb-1 font-medium text-sm">Attachment</label>
                        <label className="w-full border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer mb-4">
                            <FaUpload className="text-gray-500" />
                            <span className="text-sm">Upload Document</span>
                            <input type="file" className="hidden" />
                        </label>


                        <label className="block mb-1 font-medium text-sm">Description</label>
                        <textarea
                            rows="5"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-6"
                            placeholder="Type your message here..."
                        ></textarea>


                        <button className="w-full py-2 text-white rounded-md font-medium bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition">
                            Send
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}



