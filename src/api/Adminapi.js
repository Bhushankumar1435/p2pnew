// ✅ Read API base URL from env
const API_BASE = import.meta.env.VITE_API_URL;

// --------------------------------------------
// 🟦 Request Wrappers
// --------------------------------------------

// 🔹 POST wrapper
async function adminPost(endpoint, data, auth = false) {
  try {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = localStorage.getItem("admin_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 🔹 GET wrapper
async function adminGet(endpoint, auth = false) {
  try {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = localStorage.getItem("admin_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers,
    });

    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// --------------------------------------------
//  ADMIN AUTH APIS
// --------------------------------------------

// Login
export const AdminSignin = (data) => adminPost("admin/signin", data);


// Verify OTP
export const AdminVerifySignin = (data) => adminPost("admin/verifySignin", data);


// Resend OTP
export const AdminResendOtp = (data) => adminPost("admin/resendOtp", data);


// Forgot Password
export const AdminForgotPassword = (data) => adminPost("admin/forgotPassword", data);


// change password
export const AdminChangePassword = (data) =>
  adminPost("admin/changePassword", data);





// --------------------------------------------
// ADMIN DASHBOARD
// --------------------------------------------
export const getAdminDashboard = () => adminGet("admin/dashboard", true);





// --------------------------------------------
//  SUB ADMIN APIS
// --------------------------------------------

// Add Sub Admin
export const AddSubAdminApi = (data) =>
  adminPost("admin/addSubAdmin", data, true);

// Sub Admin List
export const GetSubAdminListApi = () =>
  adminGet("admin/Sub-Admins", true);

// Sub Admin Requests
export const GetSubAdminsRequestsApi = () =>
  adminGet("admin/subAdminRequests", true);



// --------------------------------------------
//  ADMIN USERS LIST
// --------------------------------------------
export const GetAdminUsersApi = (page = 1, limit = 10) =>
  adminGet(`admin/users?page=${page}&limit=${limit}`, true);

export const GetUserBankDetailsApi = (userId) =>
  adminGet(`admin/bankDetails?userId=${userId}`, true);


export const GetAdminDealsApi = (page = 1, limit = 10) =>
  adminGet(`admin/deals?page=${page}&limit=${limit}`, true);

export const GetAdminTicketHistoryApi = (page, limit) =>
  adminGet(`admin/ticketHistory?page=${page}&limit=${limit}`, true);
