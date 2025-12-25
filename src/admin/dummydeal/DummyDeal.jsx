import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreateDummyDealApi,
  GetCurrencyByCountryApi,
  GetCountriesApi
} from "../../api/Adminapi";

const DummyDeal = () => {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [currency, setCurrency] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  const [form, setForm] = useState({
    tokenAmount: "",
    price: "",
    buyerUserId: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    sellerUserId: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    status: "CONFIRMED",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "receiptImage") {
      setReceipt(files[0]);
      return;
    }

    if (name === "buyerUserId" || name === "sellerUserId") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    if (!selectedCountry) {
      setCurrency("");
      return;
    }

    try {
      const res = await GetCurrencyByCountryApi(selectedCountry);
      if (res?.success) {
        setCurrency(res.data || "");
      } else {
        toast.error(res.message || "Failed to fetch currency");
      }
    } catch (err) {
      toast.error("Currency fetch failed");
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await GetCountriesApi();

        if (Array.isArray(res)) {
          setCountries(res);
        } else if (res?.success && Array.isArray(res.data)) {
          setCountries(res.data);
        } else {
          toast.error("Invalid countries response");
        }

      } catch (error) {
        toast.error("Country fetch failed");
      }
    };

    fetchCountries();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receipt) {
      toast.error("Receipt is required!");
      return;
    }

    const formData = new FormData();
    const countryCode = countries.find((c) => c.name === country);
    formData.append("tokenAmount", Number(form.tokenAmount));
    formData.append("price", Number(form.price));
    formData.append("status", form.status);

    formData.append("buyer[userId]", form.buyerUserId);
    formData.append("buyer[name]", form.buyerName);
    formData.append("buyer[email]", form.buyerEmail);
    formData.append("buyer[phoneNumber]", countryCode?.code + form.buyerPhone);
    formData.append("buyer[country]", country);
    formData.append("buyer[currency]", currency);

    formData.append("seller[userId]", form.sellerUserId);
    formData.append("seller[name]", form.sellerName);
    formData.append("seller[email]", form.sellerEmail);
    formData.append("seller[phoneNumber]", countryCode?.code + form.sellerPhone);
    formData.append("seller[country]", country);
    formData.append("seller[currency]", currency)

    formData.append("receiptImage", receipt);

    setLoading(true);
    try {
      const res = await CreateDummyDealApi(formData);

      if (res.success) {
        toast.success("Dummy deal created successfully!");
        setForm({
          tokenAmount: "",
          price: "",
          buyerUserId: "",
          buyerName: "",
          buyerEmail: "",
          buyerPhone: "",
          sellerUserId: "",
          sellerName: "",
          sellerEmail: "",
          sellerPhone: "",
          status: "CONFIRMED",
        });
        setReceipt(null);
        setCountry("");
        setCurrency("");
      } else {
        toast.error(res.message || "Failed to create dummy deal");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const tokenAmount = [100, 200, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-md mt-2">
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create Dummy Deal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Deal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="tokenAmount"
            value={form.tokenAmount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl bg-white  "
          >
            <option value="">Select Token Amount</option>
            {tokenAmount.map((amount) => (
              <option key={amount} value={amount}>
                {amount}
              </option>
            ))}
          </select>

          <input
            // type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl  "
          />
        </div>

        {/* Country & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={country}
            onChange={handleCountryChange}
            required
            className="w-full px-4 py-2 border rounded-xl"
          >
            <option value="">Select Country</option>
            {countries.map((c, i) => {
              const countryName = typeof c === "string" ? c : c?.name;
              return (
                <option key={i} value={countryName}>
                  {countryName}
                </option>
              );
            })}
          </select>

          <input
            value={currency}
            readOnly
            placeholder="Currency"
            className="w-full px-4 py-2 border rounded-xl bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Buyer Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Buyer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="buyerUserId"
              placeholder="Buyer User ID"
              value={form.buyerUserId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="buyerName"
              placeholder="Buyer Name"
              value={form.buyerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="buyerEmail"
              placeholder="Buyer Email"
              value={form.buyerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="buyerPhone"
              placeholder="Buyer Phone"
              value={form.buyerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
        </div>

        {/* Seller Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Seller Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="sellerUserId"
              placeholder="Seller User ID"
              value={form.sellerUserId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="sellerName"
              placeholder="Seller Name"
              value={form.sellerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="sellerEmail"
              placeholder="Seller Email"
              value={form.sellerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              name="sellerPhone"
              placeholder="Seller Phone"
              value={form.sellerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
        </div>

        {/* Receipt */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Upload Receipt
          </label>

          <input
            type="file"
            name="receiptImage"
            accept="image/*"
            onChange={handleChange}
            key={receipt ? receipt.name : "empty"}
            className="w-full px-4 py-2 border rounded-xl
               bg-white text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               hover:border-blue-400 transition"
          />

          {receipt && (
            <p className="text-xs text-green-600 mt-1 truncate">
              ✔ Selected: {receipt.name}
            </p>
          )}
        </div>


        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
        >
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="FAILED">FAILED</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 disabled:opacity-70"
        >
          {loading ? "Creating Dummy Deal..." : "Create Dummy Deal"}
        </button>
      </form>
    </div>
  );
};

export default DummyDeal;
