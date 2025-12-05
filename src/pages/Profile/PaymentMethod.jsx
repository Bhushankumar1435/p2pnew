import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { t } from "../../components/i18n";
import { getData } from "../../api/protectedApi";
import { ToastContainer, toast } from "react-toastify";

const PaymentMethod = () => {
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState(false);
  const [bankData, setBankData] = useState({});
  const [upiData, setUpiData] = useState({});

  useEffect(() => {
    getData("/user/bankDetails")
      .then((res) => {
        const api = res?.data || res;

        if (api?.success !== true) {
          toast.error(api?.message || "Failed to load details");
          return;
        }

        const d = api?.data || {};

        // UPI
        setUpi(d.upi || "");
        setUpiData({
          upi: d.upi,
          upiName: d.upiName,
        });

        // BANK
        if (d.bankName && d.accountNumber) {
          setBank(true);
          setBankData({
            name: d.name,
            bankName: d.bankName,
            branchName: d.branchName,
            accountNumber: d.accountNumber,
            ifscCode: d.ifscCode,
          });
        } else {
          setBank(false);
          setBankData({});
        }
      })
      .catch(() => {
        toast.error("Server error");
      });
  }, []);

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1]">
            <div className="w-full pt-3">
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                {t("AddPaymentMethod")}
              </h1>

              <div className="w-full space-y-4 px-4 mt-4">

                {/* ---------------- BANK CARD ---------------- */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
                  <div className={`h-1 w-full ${bank ? "bg-green-500" : "bg-blue-300"}`}></div>
                  <div className="p-4 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-800">{t("bankDetails")}</h2>
                      <button
                        className={`text-sm px-3 py-1 rounded transition ${
                          bank
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => (window.location.href = "/addbank")}
                      >
                        {bank ? "Edit" : "Add"}
                      </button>
                    </div>

                    {bank ? (
                      <div className="space-y-1 text-sm">
                        <p><strong>{t("AccountHolder")}:</strong> {bankData.name}</p>
                        <p><strong>{t("BankName")}:</strong> {bankData.bankName}</p>
                        <p><strong>{t("BranchName")}:</strong> {bankData.branchName}</p>
                        <p><strong>{t("AccountNumber")}:</strong> {bankData.accountNumber}</p>
                        <p><strong>{t("IFSC")}:</strong> {bankData.ifscCode}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No bank details added yet</p>
                    )}
                  </div>
                </div>

                {/* ---------------- UPI CARD ---------------- */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
                  <div className={`h-1 w-full ${upi ? "bg-green-500" : "bg-blue-300"}`}></div>
                  <div className="p-4 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-800">{t("UPIDetails")}</h2>
                      <button
                        className={`text-sm px-3 py-1 rounded transition ${
                          upi
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => (window.location.href = "/addupi")}
                      >
                        {upi ? "Edit" : "Add"}
                      </button>
                    </div>

                    {upi ? (
                      <div className="space-y-1 text-sm">
                        <p><strong>{t("UPI")}:</strong> {upiData.upi}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No UPI ID added yet</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PaymentMethod;
