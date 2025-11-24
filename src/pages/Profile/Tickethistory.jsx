import React, { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getData } from '../../api/protectedApi';

const Tickethistory = () => {
    const [activeTab, setActiveTab] = useState("Resolved");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainer = useRef(null);

    const tabs = ["Resolved", "Open", "Closed"];

    const statusMap = {
        "Resolved": "RESOLVED",
        "Open": "OPEN",
        "Closed": "CLOSED",
    };

    const fetchTickets = async (reset = false, customPage = page) => {
        try {
            setLoading(true);

            const status = statusMap[activeTab];

            const response = await getData("/user/ticketHistory", {
                status,
                page: customPage
            });

            const list = response?.data?.data?.ticket || [];

            if (reset) {
                setTickets(list);
            } else {
                setTickets((prev) => [...prev, ...list]);
            }

            setHasMore(list.length > 0);

        } catch (error) {
            console.error("Error loading tickets:", error);
        }

        setLoading(false);
    };

    // When tab changes → reset
    useEffect(() => {
        setTickets([]);
        setPage(1);
        setHasMore(true);
        fetchTickets(true, 1);
    }, [activeTab]);

    // Page change (infinite scroll)
    useEffect(() => {
        if (page > 1) {
            fetchTickets(false, page);
        }
    }, [page]);

    // Infinite scroll handler
    const handleScroll = () => {
        const el = scrollContainer.current;
        if (!el || loading || !hasMore) return;

        const { scrollTop, clientHeight, scrollHeight } = el;

        if (scrollHeight - (scrollTop + clientHeight) < 120) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <div className="min-h-screen flex flex-col items-center bg-white text-black">

                <div
                    ref={scrollContainer}
                    onScroll={handleScroll}
                    className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] px-4 py-6"
                >
                    <Header />

                    <div className="min-h-screen">
                        <div className="max-w-[600px] mx-auto w-full pt-6">
                            <div className="bg-white shadow-md rounded-xl overflow-hidden">

                                {/* Tabs */}
                                <div className="flex border-b text-sm font-medium text-gray-600">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            className={`w-full py-3 transition-colors ${activeTab === tab
                                                    ? "text-black border-b-2 border-blue-600 bg-gray-100"
                                                    : "hover:bg-gray-50"
                                                }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tickets */}
                                {tickets.length > 0 && (
                                    <div className="p-4 text-sm text-gray-700 space-y-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket._id} className="border-b pb-3 last:border-none">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Subject</span>
                                                    <span>{ticket.subject}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Message</span>
                                                    <span className="truncate max-w-[200px]">
                                                        {ticket.message}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="font-medium">Time</span>
                                                    <span>
                                                        {new Date(ticket.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Loader (BOTTOM LOADER) */}
                                {loading && (
                                    <div className="p-4 text-center text-gray-500">
                                        Loading...
                                    </div>
                                )}

                                {/* Empty state */}
                                {!loading && tickets.length === 0 && (
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
