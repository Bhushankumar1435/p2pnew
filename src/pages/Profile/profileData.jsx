import React, { useEffect, useState } from "react";
import api from "../../api/protectedApi";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/user/userProfile");

            if (res.data?.success) {
                setUser(res.data.data.data); // user info
                setStats({
                    sponsorCount: res.data.data.sponsorCount,
                    teamCount: res.data.data.teamCount,
                    activeDeals: res.data.data.activeDeals,
                    totalDeals: res.data.data.totalDeals,
                });
            }
        } catch (err) {
            console.log("Failed to fetch profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!user || !stats) return <div className="text-center mt-5">Loading...</div>;

    return (
        <>
            <div className="max-w-[600px] mx-auto bg-white p-6 mt-5 rounded-xl">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">User Info</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="w-full flex justify-between font-medium"><strong>Name:-</strong> {user.name}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Email:-</strong> {user.email}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Phone:-</strong> {user.phoneNumber}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Sponsor:-</strong> {user?.sponsorId?.userId || "N/A"}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Country:-</strong> {user.country}</li>
                    <li className="w-full flex justify-between font-medium">
                        <strong>Created:-</strong> {new Date(user.createdAt).toLocaleString()}
                    </li>
                </ul>
            </div>

            <div className="max-w-[600px] mx-auto bg-white p-6 mt-5 rounded-xl">
                {/* <h2 className="text-lg font-bold mb-4 border-b pb-2">Stats</h2> */}
                <ul className="text-gray-700 space-y-2">
                    <li className="w-full flex justify-between font-medium"><strong>Sponsor Count:-</strong> {stats.sponsorCount}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Team Count:-</strong> {stats.teamCount}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Active Deals:-</strong> {stats.activeDeals}</li>
                    <li className="w-full flex justify-between font-medium"><strong>Total Deals:-</strong> {stats.totalDeals}</li>
                </ul>
            </div>
        </>
    );
};

export default ProfilePage;
