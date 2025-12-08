import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { getUserProfile, updateUserProfile } from "../../api/protectedApi";
import api from "../../api/protectedApi";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
    const [loading, setLoading] = useState(false);
    const [fetchingCode, setFetchingCode] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [countries, setCountries] = useState([]);

    const [form, setForm] = useState({
        name: "",
        country: "",
        countryCode: "",
        phoneNumber: "",
    });

    const [originalForm, setOriginalForm] = useState({});

    const fetchCountries = async () => {
        try {
            const res = await api.get("/user/getCountry");
            const list = res?.data?.data || [];
            setCountries(list);
        } catch (error) {
            console.error("Country list fetch error:", error);
        }
    };

    const fetchCountryCode = async (countryName) => {
        try {
            setFetchingCode(true);
            const country = countries.find(
                (c) => c.name.toLowerCase() === countryName.toLowerCase()
            );
            return country?.code || "";
        } catch (error) {
            console.error("Country code fetch error:", error);
            return "";
        } finally {
            setFetchingCode(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await getUserProfile();
            const profile = res?.data?.data || res?.data || {};
            let countryCode = profile.countryCode || "";

            if (!countryCode && profile.country) {
                countryCode = await fetchCountryCode(profile.country);
            }

            let phoneNumberOnly = profile.phoneNumber || "";
            if (countryCode && phoneNumberOnly.startsWith(countryCode)) {
                phoneNumberOnly = phoneNumberOnly.replace(countryCode, "");
            }

            const profileData = {
                name: profile.name || "",
                country: profile.country || "",
                countryCode: countryCode,
                phoneNumber: phoneNumberOnly,
            };

            setForm(profileData);
            setOriginalForm(profileData);
            setProfileLoaded(true);
        } catch (error) {
            console.error("Profile error:", error);
            toast.error("Failed to load profile");
        }
    };

    useEffect(() => {
        fetchCountries();
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!profileLoaded || !form.country) return;

        const updateCode = async () => {
            const newCode = await fetchCountryCode(form.country);
            setForm((prev) => {
                let newPhone = prev.phoneNumber;
                if (prev.countryCode && newPhone.startsWith(prev.countryCode)) {
                    newPhone = newPhone.replace(prev.countryCode, "");
                }
                return { ...prev, countryCode: newCode, phoneNumber: newPhone };
            });
        };

        updateCode();
    }, [form.country, countries]);

    const updateProfile = async () => {
        setLoading(true);

        if (!form.name.trim()) {
            toast.error("Name is required!");
            setLoading(false);
            return;
        }

        try {
            const payload = {};
            if (form.name !== originalForm.name) payload.name = form.name;
            if (form.country !== originalForm.country) payload.country = form.country;
            if (form.phoneNumber !== originalForm.phoneNumber) {
                const phoneDigits = form.phoneNumber.replace(/\D/g, "");
                if (phoneDigits.length < 6 || phoneDigits.length > 15) {
                    toast.error("Phone number must contain 6 to 15 digits!");
                    setLoading(false);
                    return;
                }
                payload.phoneNumber = phoneDigits;
                payload.countryCode = form.countryCode;
            }

            if (Object.keys(payload).length === 0) {
                toast.error("Please change at least one field!");
                setLoading(false);
                return;
            }

            const res = await updateUserProfile(payload);

            if (res?.success) {
                toast.success("Profile updated successfully!");
                setOriginalForm({ ...originalForm, ...payload });
            } else {
                toast.error(res?.message || "Update failed");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Something went wrong!");
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
                        <h2 className="text-xl font-semibold mb-4 mt-4">Edit Profile</h2>

                        <div className="space-y-4">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-3 rounded-lg bg-white"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <label>Country</label>
                            <select
                                className="w-full p-3 rounded-lg bg-white"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <label>Country Code</label>
                            <input
                                type="text"
                                placeholder="Country Code"
                                className="w-full p-3 rounded-lg bg-white"
                                value={fetchingCode ? "Loading..." : form.countryCode}
                                readOnly
                            />

                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="w-full p-3 rounded-lg bg-white"
                                value={form.phoneNumber}
                                onChange={(e) =>
                                    setForm({ ...form, phoneNumber: e.target.value })
                                }
                            />
                        </div>

                        <button
                            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
                            onClick={updateProfile}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
