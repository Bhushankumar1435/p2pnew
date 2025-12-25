
// ✅ Read API base URL from env
const API_BASE = import.meta.env.VITE_API_URL;

// --------------------------------------------
// 🟦 Request Wrappers
// --------------------------------------------

// 🔹 POST wrapper
// 🔹 POST wrapper (JSON + FormData support)
export async function adminPost(endpoint, data = {}, auth = false) {
  try {
    const headers = {};
    const isFormData = data instanceof FormData;

    // ❗ Only set JSON header when NOT FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = localStorage.getItem("admin_token");
      if (!token) return { success: false, message: "Admin not logged in!" };
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}


export async function adminGet(endpoint, auth = false) {
  try {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = localStorage.getItem("admin_token");
      if (!token) return { success: false, message: "Admin not logged in!" };
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers,
    });

    return await res.json();
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
export const GetAdminUsersApi = (
  page = 1,
  limit = 10,
  paidStatus = "",
  userId = "",
  country = "",
  rank = ""
) => {
  let query = `?page=${page}&limit=${limit}`;

  if (paidStatus !== "") {
    query += `&paidStatus=${paidStatus}`;
  }

  if (userId !== "") {
    query += `&userId=${encodeURIComponent(userId)}`;
  }

  if (country !== "") {
    query += `&country=${encodeURIComponent(country)}`;
  }

  if (rank !== "") {
    query += `&rank=${encodeURIComponent(rank)}`;
  }

  return adminGet(`admin/users${query}`, true);
};





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

export const HoldUnholdUserApi = (userId, action) =>
  adminPost("admin/holdUser", { id: userId, action }, true);

export const ActivateAccountApi = (userId) =>
  adminPost("admin/activateAccount", { userId }, true);


// export const GetAdminWalletHistoryApi = (page = 1, limit = 10, type) => {
//   let query = `?page=${page}&limit=${limit}`;
//   if (type) query += `&type=${type}`;
//   return adminGet(`admin/walletHistory${query}`, true);
// };
// export const GetAdminIncomeHistoryApi = (page = 1, limit = 10, type) => {
//   let query = `?page=${page}&limit=${limit}`;
//   if (type) query += `&type=${type}`;
//   return adminGet(`admin/incomeHistory${query}`, true);
// };


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


// Get Global Dividend (and also distribute if amount is provided)
export const GetGlobalDividendApi = (data = {}) =>
  adminPost("admin/globalIncome", data, true);


//  resolve dispute 

// ✅ Resolve a dispute
export const resolveDisputeApi = async (id) => {
  try {
    const res = await adminGet(`admin/resolveDispute?id=${id}`, true);
    return res; 
  } catch (err) {
    console.error("Dispute Error:", err);
    return { success: false, message: err.message };
  }
};

// ✅ Get all disputed orders
export const getAllDisputesApi = async () => {
  try {
    const res = await adminGet("admin/dispute-orders?status=DISPUTE", true);
    return res;
  } catch (err) {
    console.error("Fetch Disputes Error:", err);
    return { success: false, data: { orders: [] } };
  }
};

// Fetch all countries
export const GetCountriesApi = async () => {
  try {
    const res = await adminGet("user/getCountry", true); // add auth if required
    if (res.success) return res.data || [];
    console.error("Failed to fetch countries:", res.message);
    return [];
  } catch (err) {
    console.error("Error fetching countries:", err);
    return [];
  }
};

// --------------------------------------------
// ADMIN - SET VALIDATOR PERCENT
// --------------------------------------------
export const SetValidatorPercentApi = (data) =>
  adminPost("admin/set-percent", data, true);

// --------------------------------------------
// ADMIN - DUMMY DEAL
// --------------------------------------------
export const CreateDummyDealApi = (data) =>
  adminPost("admin/dummy-deal", data, true);

export const GetCurrencyByCountryApi = (country) =>
  adminGet(`user/getCurrency?country=${encodeURIComponent(country)}`, true);

export const UpdateUserProfileApi = (data) => {
  const payload = { ...data, id: data._id };
  delete payload._id;

  return adminPost("admin/update-profile", payload, true);
};












