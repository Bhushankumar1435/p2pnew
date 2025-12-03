import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaChevronDown, FaUpload } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { postData, getData } from '../../api/protectedApi';

export default function Raiseticket() {
    const [subjectList, setSubjectList] = useState([]);
    const [subject, setSubject] = useState("");
    const [orderId, setOrderId] = useState("");
    const [message, setMessage] = useState("");
    const [contact, setcontact] = useState("");
    const [ticketImage, setTicketImage] = useState(null);
    const [loading, setLoading] = useState(false)

    // ✅ Load ticket subjects from backend
    useEffect(() => {
        const fetchSubjects = async () => {
            const res = await getData("/user/ticketSubject");

            if (res?.data?.success) {
                setSubjectList(res.data.data); // subject array from backend
            } else {
                toast.error("Failed to load subjects");
            }
        };

        fetchSubjects();
    }, []);

    const handleFileChange = (e) => {
        setTicketImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (!subject) {
            toast.error("Please select a subject");
            setLoading(false);
            return;
        }

        if (!message.trim()) {
            toast.error("Please enter a description");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("message", message);
        if (orderId) formData.append("orderId", orderId);
        if (contact) formData.append("contact", contact);
        if (ticketImage) formData.append("ticketImage", ticketImage);

        try {
            const res = await postData("/user/raiseTicket", formData);

            if (res?.success) {
                toast.success(res.message || "Ticket sent successfully!");

                setSubject("");
                setMessage("");
                setOrderId("");
                Contact("");
                setTicketImage(null);
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to submit ticket");
        }

        setLoading(false);
    };


    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="min-h-screen flex flex-col items-center bg-white text-black">
                <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] px-4 py-6">
                    <Header />

                    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h2 className="text-lg font-medium mb-4">Raise New Ticket</h2>

                        {/* Subject Dropdown */}
                        <label className="block mb-1 font-medium text-sm">Subject</label>
                        <div className="relative mb-4">
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select one reason</option>

                                {subjectList.map((item, i) => (
                                    <option key={i} value={item}>{item}</option>
                                ))}
                            </select>

                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                        </div>

                        {/* Attachment */}
                        <label className="block mb-1 font-medium text-sm ">Attachment (Optional)</label>
                        <label className="w-full border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer mb-2">
                            <FaUpload className="text-gray-500" />
                            <span className="text-sm">
                                {ticketImage ? ticketImage.name : "Upload Document"}
                            </span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>

                        {/* Order ID */}
                        <label className="block mb-1 font-medium text-sm pt-1">Order Id (Optional)</label>
                        <input
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            placeholder="Enter Order ID"
                        />
                        {/* Contact */}
                        <label className="block mb-1 font-medium text-sm ">WhatsApp Number: (Optional)</label>
                        <input
                            value={contact}
                            onChange={(e) => setcontact(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            placeholder="WhatsApp Number"
                        />

                        {/* Description */}
                        <label className="block mb-1 font-medium text-sm ">Description</label>
                        <textarea
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-6"
                            placeholder="Type your message here..."
                        ></textarea>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-2 text-white rounded-md font-medium bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? "Sending..." : "Send"}
                        </button>

                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
