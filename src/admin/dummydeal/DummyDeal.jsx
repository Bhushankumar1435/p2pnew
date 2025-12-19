import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateDummyDealApi } from "../../api/Adminapi";

const DummyDeal = () => {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

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

    // File input
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!receipt) {
    toast.error("Receipt is required!");
    return;
  }

  const formData = new FormData();
  formData.append("tokenAmount", Number(form.tokenAmount));
  formData.append("price", Number(form.price));
  formData.append("status", form.status);

  // Correct buyer & seller object keys
  formData.append("buyer[userId]", form.buyerUserId);
  formData.append("buyer[name]", form.buyerName);
  formData.append("buyer[email]", form.buyerEmail);
  formData.append("buyer[phoneNumber]", form.buyerPhone);

  formData.append("seller[userId]", form.sellerUserId);
  formData.append("seller[name]", form.sellerName);
  formData.append("seller[email]", form.sellerEmail);
  formData.append("seller[phoneNumber]", form.sellerPhone);

  // Receipt file
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-4">
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 ">
        Create Dummy Deal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Deal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="tokenAmount"
            value={form.tokenAmount}
            onChange={handleChange}
            required
            className="w-full px-2 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Token Amount</option>
            {tokenAmount.map((amount) => (
              <option key={amount} value={amount} className="">{amount}</option>
            ))}
          </select>

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buyer Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Seller Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="buyerUserId" placeholder="Buyer User ID" value={form.buyerUserId} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="buyerName" placeholder="Buyer Name" value={form.buyerName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="buyerEmail" placeholder="Buyer Email" value={form.buyerEmail} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="buyerPhone" placeholder="Buyer Phone" value={form.buyerPhone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        {/* Seller Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Buyer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="sellerUserId" placeholder="Seller User ID" value={form.sellerUserId} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="sellerName" placeholder="Seller Name" value={form.sellerName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="sellerEmail" placeholder="Seller Email" value={form.sellerEmail} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input name="sellerPhone" placeholder="Seller Phone" value={form.sellerPhone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload Receipt</label>
          <input
            type="file"
            name="receiptImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {receipt && <p className="text-sm text-green-600 mt-1">Selected: {receipt.name}</p>}
        </div>

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="FAILED">FAILED</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 transition disabled:opacity-70"
        >
          {loading ? "Creating Dummy Deal..." : "Create Dummy Deal"}
        </button>
      </form>
    </div>
  );
};

export default DummyDeal;
