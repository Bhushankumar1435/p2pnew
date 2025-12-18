import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateDummyDealApi } from "../../api/Adminapi";

const DummyDeal = () => {
  const [loading, setLoading] = useState(false);

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
  const { name, value } = e.target;

  if (
    name === "buyerUserId" ||
    name === "sellerUserId"
  ) {
    setForm({ ...form, [name]: value.toUpperCase() });
  } else {
    setForm({ ...form, [name]: value });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tokenAmount: Number(form.tokenAmount),
      price: Number(form.price),
      buyer: {
        userId: form.buyerUserId,
        name: form.buyerName,
        email: form.buyerEmail,
        phoneNumber: form.buyerPhone,
      },
      seller: {
        userId: form.sellerUserId,
        name: form.sellerName,
        email: form.sellerEmail,
        phoneNumber: form.sellerPhone,
      },
      status: form.status,
    };

    setLoading(true);
    try {
      const res = await CreateDummyDealApi(payload);

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
      } else {
        toast.error(res.message || "Failed to create dummy deal");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

const tokenAmount = [100, 200, 500, 1000];


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
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
            className="w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Token Amount</option>

            {tokenAmount.map((amount) => (
              <option key={amount} value={amount}>
                {amount}
              </option>
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
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Buyer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="buyerUserId"
              placeholder="Buyer User ID"
              value={form.buyerUserId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="buyerName"
              placeholder="Buyer Name"
              value={form.buyerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="buyerEmail"
              placeholder="Buyer Email"
              value={form.buyerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="buyerPhone"
              placeholder="Buyer Phone"
              value={form.buyerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Seller Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Seller Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="sellerUserId"
              placeholder="Seller User ID"
              value={form.sellerUserId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="sellerName"
              placeholder="Seller Name"
              value={form.sellerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="sellerEmail"
              placeholder="Seller Email"
              value={form.sellerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="sellerPhone"
              placeholder="Seller Phone"
              value={form.sellerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">FAILED</option>
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
