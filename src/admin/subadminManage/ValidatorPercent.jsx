import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SetValidatorPercentApi } from "../../api/Adminapi";

const ValidatorPercent = () => {
  const [percent, setPercent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const value = Number(percent);

    if (!value || value <= 0) {
      return toast.error("Enter valid percent");
    }

    setLoading(true);

    const payload = {
      percent: value,
    };

    const res = await SetValidatorPercentApi(payload);

    setLoading(false);

    if (res?.success) {
      toast.success("Percent updated successfully");
      setPercent("");
    } else {
      toast.error(res?.message || "Failed to update percent");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-lg font-semibold mb-4">
        Set Validator Profit %
      </h2>

      <input
        type="number"
        step="0.1"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="e.g. 2.5"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default ValidatorPercent;
