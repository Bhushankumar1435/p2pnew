import React, { useEffect, useState } from "react";
import { GetSubAdminsRequestsApi } from "../../api/Adminapi"; // ✅ Correct import

const SubAdminrequest = () => {
  const [subAdminsReq, setSubAdminsReq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await GetSubAdminsRequestsApi(); // ✅ Correct function

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
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sub-Admin Request List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">S. No</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>

          <tbody>
            {subAdminsReq.length > 0 ? (
              subAdminsReq.map((item, index) => (
                <tr key={item._id} className="text-center">
                  <td className="py-2 px-3 border font-medium">{index + 1}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.email}</td>
                  <td className="p-2 border">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No Sub-Admin Requests Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubAdminrequest;
