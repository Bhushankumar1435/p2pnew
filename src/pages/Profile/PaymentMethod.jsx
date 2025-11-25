import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { t } from "../../components/i18n";
import { Link, useNavigate } from "react-router-dom";
import checkIcon from "../../assets/images/checkIcon.png";
import { getData } from "../../api/protectedApi";
import { ToastContainer, toast } from "react-toastify";

const PaymentMethod = () => {
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData("/user/bankDetails")
      .then((res) => {
        // console.log("🔥 RAW RESPONSE:", res);

        const api = res?.data || res;

        if (api?.success !== true) {
          toast.error(api?.message || "Failed to load details");
          return;
        }

        const d = api?.data || {};

        setUpi(d.upi || "");

        if (d.bankName && d.accountNumber) {
          setBank(true);
        } else {
          setBank(false);
        }
      })
      .catch((err) => {
        // console.error("❌ Fetch Error:", err);
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
              <button
                onClick={() => navigate("/Settings")}
                className="absolute top-3 right-6 text-gray-500 hover:text-red-600 font-bold text-lg"
              >
                ✕
              </button>

              <div className="w-full space-y-3 px-4 mt-4">

                {/* Bank Button + Check Icon */}
                <Link
                  to="/addbank"
                  className="flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-3"
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

                {/* UPI Button + Check Icon */}
                <Link
                  to="/addupi"
                  className="flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-3"
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
