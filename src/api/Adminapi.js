// ✅ Read API base URL from env
const API_BASE = import.meta.env.VITE_API_URL;

// --------------------------------------------
// 🟦 Request Wrappers
// --------------------------------------------

// 🔹 POST wrapper
export async function adminPost(endpoint, data, auth = false) {
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
export async function adminGet(endpoint, auth = false) {
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
// export const AdminForgotPassword = (data) => adminPost("admin/forgotPassword", data);


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

export const GetUserDetailsApi = (type, userId) =>
  adminGet(`admin/userDetails?type=${type}&id=${userId}`, true);

export const GetUserBankDetailsApi = (userId) =>
  adminGet(`admin/bankDetails?userId=${userId}`, true);

export const GetUserIncomeApi = (userId) =>
  adminGet(`admin/income?userId=${userId}`, true);

export const GetUserWalletApi = (userId) =>
  adminGet(`admin/wallet?userId=${userId}`, true);

export const GetUserDepositApi = (userId) =>
  adminGet(`admin/deposit?userId=${userId}`, true);

export const GetUserWithdrawApi = (userId) =>
  adminGet(`admin/withdraw?userId=${userId}`, true);

export const GetUserDealsApi = (userId) =>
  adminGet(`admin/deals?userId=${userId}`, true);

export const GetUserOrdersApi = (userId) =>
  adminGet(`admin/orders?userId=${userId}`, true);

export const GetUserTeamApi = (userId) =>
  adminGet(`admin/team?userId=${userId}`, true);

export const BlockUnblockUserApi = (userId, action) =>
  adminPost("admin/blockUser", { id: userId, action }, true);


// --------------------------------------------
//  ADMIN DEALS & TICKETS
// --------------------------------------------
export const GetAdminDealsApi = (page = 1, limit = 10) =>
  adminGet(`admin/deals?page=${page}&limit=${limit}`, true);

export const GetAdminTicketHistoryApi = (page, limit, status) =>
  adminGet(
    `admin/ticketHistory?page=${page}&limit=${limit}&status=${status}`,
    true
  );


export const ManageAdminTicketApi = (ticketId, data) =>
  adminPost(
    "admin/manageTicket", { id: ticketId, ...data, }, true);

export const GetOrderHistoryApi = (page, limit) =>
  adminGet(`admin/order-history?page=${page}&limit=${limit}`, true);

export const GetTeamByLevelApi = (userId, level) =>
  adminGet(`admin/teamByLevel?id=${userId}&level=${level}`, true);



