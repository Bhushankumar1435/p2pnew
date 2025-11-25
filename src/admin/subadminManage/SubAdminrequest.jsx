import React, { useEffect, useState } from "react";
import { GetSubAdminsRequestsApi } from "../../api/Adminapi";

const SubAdminrequest = () => {
  const [subAdminsReq, setSubAdminsReq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await GetSubAdminsRequestsApi();

        if (res.success) {
          setSubAdminsReq(res.data?.subAdminsReq || []);
        }
      } catch (err) {
        console.error("Error loading sub-admin requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Sub-Admin Request List
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subAdminsReq.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          
          {/* 👉 Desktop Table */}
          <table className="w-full hidden md:table border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">S. No.</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Created At</th>
              </tr>
            </thead>

            <tbody>
              {subAdminsReq.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{item.name}</td>
                  <td className="p-3 border-b">{item.email}</td>
                  <td className="p-3 border-b">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 👉 Mobile Card View */}
          <div className="md:hidden space-y-4 p-2">
            {subAdminsReq.map((item, index) => (
              <div
                key={item._id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <p className="text-gray-800 font-semibold">
                  #{index + 1} — {item.name}
                </p>

                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Email: </span>
                    {item.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Created At: </span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No Sub-Admin Requests Found
        </p>
      )}
    </div>
  );
};

export default SubAdminrequest;
