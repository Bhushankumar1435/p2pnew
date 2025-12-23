import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔐 Add token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚨 Auto Redirect to Login on Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // ❌ Token invalid or expired → Logout
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("isAuthenticated");

      // 🔥 Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =======================================================
// ✅ GET request wrapper
// =======================================================
export const getData = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

// =======================================================
// ✅ POST request wrapper
// =======================================================
export const postData = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// =======================================================
// CANCEL DEAL
// =======================================================
export const cancelDeal = async (dealId) => {
  try {
    const res = await api.get(`/user/cancelDeal?id=${dealId}`);
    return res.data;
  } catch (err) {
    return (
      err?.response?.data || {
        success: false,
        message: "Request failed",
      }
    );
  }
};

// =======================================================
// POST FILE DATA (EMPTY FOR NOW)
// =======================================================
export const postFileData = async (url, data) => {};

// =======================================================
// USER PROFILE
// =======================================================
export const getUserProfile = async () => {
  try {
    const res = await api.get("/user/userProfile");
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const res = await api.post("/user/updateProfile", data);
    return res.data;
  } catch (err) {
    return (
      err?.response?.data || {
        success: false,
        message: "Update failed!",
      }
    );
  }
};

// =======================================================
// UPGRADE
// =======================================================
export const handleUpgrade = async () => {
  try {
    const res = await api.get("/user/upgrade");
    return res.data;
  } catch (err) {
    return (
      err?.response?.data || {
        success: false,
        message: "Upgrade request failed!",
      }
    );
  }
};

// =======================================================
// WALLET TXN TYPES
// =======================================================
export const GetUserTxnTypesApi = async (type) => {
  try {
    const res = await getData(`user/txnType?type=${type}`, null);
    return res.data;
  } catch (err) {
    return { success: false, data: [] };
  }
};

// =======================================================
// RAISE DISPUTE
// =======================================================
export const raiseDisputeApi = async (id) => {
  try {
    const res = await getData(`user/dispute?id=${id}`, null);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export default api;

export const getUserOrderhistory = async (page = 1, limit = 10) => {
  try {
    const res = await api.get("user/order-history", {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    return (
      err?.response?.data || {
        success: false,
        message: "Failed to fetch order history",
      }
    );
  }
};

// ================================
// GET USER PERCENT
// ================================
export const getUserPercentApi = async () => {
  try {
    const res = await api.get("user/percents");

    return {
      success: res.data.success,
      percents: res.data.data, 
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      percent: 0,
      message: "Failed to fetch percent",
    };
  }
};


export const getNotificationHistory = (page = 1, limit = 5) => {
  return api.get(
    `/user/notificationHistory?page=${page}&limit=${limit}`
  );
};


