import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ This reads from your .env file
});

// 🔐 Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ✅ GET request wrapper
export const getData = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong";

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("isAuthenticated");
    }

    throw new Error(errorMessage);
  }
};

// ✅ POST request wrapper
export const postData = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error:", error);
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// ✅ FIXED: cancelDeal now uses Axios and env base URL


export const cancelDeal = async (dealId) => {
  try {
    const res = await api.get(`/user/cancelDeal?id=${dealId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Cancel Deal Error:", err);
    return (
      err?.response?.data || {
        success: false,
        message: "Request failed",
      }
    );
  }
};



// (Keep this as-is if you plan to implement it later)
export const postFileData = async (url, data) => {
  // left intentionally blank
};


// GET USER PROFILE
export const getUserProfile = async () => {
  try {
    const res = await api.get("/user/userProfile");
    return res.data; 
  } catch (err) {
    console.error("User Profile Error:", err);
    return null;
  }
};


// UPDATE USER PROFILE
export const updateUserProfile = async (data) => {
  try {
    const res = await api.post("/user/updateProfile", data);
    return res.data;
  } catch (err) {
    console.error("Update Profile Error:", err);
    return (
      err?.response?.data || {
        success: false,
        message: "Update failed!",
      }
    );
  }
};


export const handleUpgrade = async () => {
  try {
    const res = await api.get("/user/upgrade"); 
    return res.data;
  } catch (err) {
    console.error("Upgrade Error:", err);
    return (
      err?.response?.data || {
        success: false,
        message: "Upgrade request failed!",
      }
    );
  }
};

export const GetUserTxnTypesApi = async (type) => {
  try {
    const res = await getData(`user/txnType?type=${type}`, null);
    return res.data; 
  } catch (err) {
    console.error("Failed to fetch wallet types:", err);
    return { success: false, data: [] };
  }
};
export const raiseDisputeApi = async (id) => {
  try {
    const res = await getData(`user/dispute?id=${id}`, null);
    return res.data;  
  } catch (err) {
    console.error("Dispute Error:", err);
    return { success: false, message: err.message };
  }
};










export default api;
