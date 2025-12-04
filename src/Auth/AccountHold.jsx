import React from "react";
import { Link } from "react-router-dom";

const AccountHold = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Account On Hold</h1>

        <p className="text-gray-700 mt-3">
          Your account is currently <strong>on hold</strong>.
        </p>

        <p className="text-gray-600 mt-2">
          Please raise a support ticket to verify or reactivate your account.
        </p>

        <Link
          to="/help"
          className="mt-5 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Raise Ticket
        </Link>
      </div>
    </div>
  );
};

export default AccountHold;
