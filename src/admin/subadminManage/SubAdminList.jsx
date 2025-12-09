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
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Sub-Admin List
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subAdmins.length > 0 ? (
        <div className="overflow-x-auto  ">
          {/* 👉 Desktop Table */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">S. No.</th>
                <th className="p-3 border">User id</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Country</th>
                <th className="p-3 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((sa, index) => (
                <tr key={sa._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{sa.userId}</td>
                  <td className="p-3 border">{sa.name}</td>
                  <td className="p-3 border">{sa.email}</td>
                  <td className="p-3 border">{sa.country}</td>
                  <td className="p-3 border">
                    {new Date(sa.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 👉 Mobile Card View */}
          <div className="md:hidden space-y-4 p-2">
            {subAdmins.map((sa, index) => (
              <div
                key={sa._id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <p className="text-gray-800 font-semibold">
                  #{index + 1} — {sa.name}
                </p>

                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Email: </span>
                    {sa.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Created At: </span>
                    {new Date(sa.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No Sub-Admins Found</p>
      )}
    </div>
  );
};

export default SubAdminList;
