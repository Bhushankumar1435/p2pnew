import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { t } from "../../components/i18n";
import { Link } from "react-router-dom";
import checkIcon from "../../assets/images/checkIcon.png";
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
            bankName: d.bankName,
            accountHolder: d.accountHolder,
            accountNumber: d.accountNumber,
            ifsc: d.ifsc,
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

              <div className="w-full space-y-3 px-4 mt-4">

                {/* ---------------- BANK BUTTON ---------------- */}
                <Link
                  to="/addbank"
                  className="flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-3 bg-white"
                >
                  <span className="text-base font-normal">{t("bankDetails")}</span>

                  {bank ? (
                    <img src={checkIcon} alt="done" className="w-5 h-5" />
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>

                {/* BANK DETAILS CARD */}
                <div className="border border-gray-300 rounded-2xl p-4 bg-white shadow-sm">
                  <h2 className="text-sm font-semibold mb-2">{t("bankDetails")}</h2>
                  {bank && (

                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>{t("AccountHolder")}:</strong> {bankData.name}
                      </p>
                      <p>
                        <strong>{t("BankName")}:</strong> {bankData.bankName}
                      </p>
                      <p>
                        <strong>{t("AccountNumber")}:</strong> {bankData.accountNumber}
                      </p>
                      <p>
                        <strong>{t("IFSC")}:</strong> {bankData.ifscCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* ---------------- UPI BUTTON ---------------- */}
                <Link
                  to="/addupi"
                  className="flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-3 bg-white"
                >
                  <span className="text-base font-normal">{t("UPIDetails")}</span>

                  {upi ? (
                    <img src={checkIcon} alt="done" className="w-5 h-5" />
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>

                {/* UPI DETAILS CARD */}
                <div className="border border-gray-300 rounded-2xl p-4 bg-white shadow-sm">
                  <h2 className="text-sm font-semibold mb-2">{t("UPIDetails")}</h2>
                  {upi && (

                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>{t("UPI")}:</strong> {upiData.upi}
                      </p>
                      {/* <p>
                        <strong>{t("Name")}:</strong> {upiData.upiName}
                      </p> */}
                    </div>
                  )}
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
