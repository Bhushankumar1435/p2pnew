import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import api from "../../api/protectedApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            toast.error("All fields are required!");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("New Password & Confirm Password do not match!");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/user/changePassword", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });

            if (res?.data?.success) {
                toast.success("Password changed successfully!");

                setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(res?.data?.message || "Failed to change password");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="min-h-screen flex flex-col bg-white text-black">
                <div className="h-[calc(100vh_-_56px)] overflow-auto bg-[var(--primary)]">

                    <Header />

                    <div className="p-5 bg-[var(--primary)] rounded-t-xl">
                        <h2 className="text-xl font-semibold mb-4 mt-4">Change Password</h2>

                        <div className="space-y-4">

                            {/* Current Password */}
                            <div className="relative">
                                <label>Current Password</label>
                                <input
                                    type={show.current ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder="Enter current password"
                                    className="w-full p-3 rounded-lg bg-white"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                />

                                <div
                                    className="absolute right-3 top-11 cursor-pointer"
                                    onClick={() => setShow({ ...show, current: !show.current })}
                                >
                                    {show.current ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <label>New Password</label>
                                <input
                                    type={show.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    className="w-full p-3 rounded-lg bg-white"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                />

                                <div
                                    className="absolute right-3 top-11 cursor-pointer"
                                    onClick={() => setShow({ ...show, new: !show.new })}
                                >
                                    {show.new ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label>Confirm New Password</label>
                                <input
                                    type={show.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Re-enter new password"
                                    className="w-full p-3 rounded-lg bg-white"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />

                                <div
                                    className="absolute right-3 top-11 cursor-pointer"
                                    onClick={() =>
                                        setShow({ ...show, confirm: !show.confirm })
                                    }
                                >
                                    {show.confirm ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                        </div>

                        <button
                            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Change Password"}
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default ChangePassword;
