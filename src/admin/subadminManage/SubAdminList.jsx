import React, { useEffect, useState } from "react";
import { GetSubAdminListApi } from "../../api/Adminapi";

const SubAdminList = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GetSubAdminListApi();

      if (res.success) {
        setSubAdmins(res.data.subAdmins || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sub-Admin List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">S. No.</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {subAdmins.length > 0 ? (
              subAdmins.map((sa,index) => (
                <tr key={sa._id} className="text-center">
                  <td className="p-2 border">{index+1}</td>
                  <td className="p-2 border">{sa.name}</td>
                  <td className="p-2 border">{sa.email}</td>
                  <td className="p-2 border">
                    {new Date(sa.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No Sub-Admins Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubAdminList;
