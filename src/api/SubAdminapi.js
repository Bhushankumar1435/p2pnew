const BASE_URL = import.meta.env.VITE_API_URL;

// Ensure BASE_URL ends with a `/`
const API_BASE = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

/** ---------- 🟢 Sub-Admin Auth APIs ---------- **/

// 🔹 Register Sub-Admin


// 🔹 Login Sub-Admin
export async function subAdminLogin(data) {
  const res = await fetch(`${API_BASE}sub-admin/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Verify Sub-Admin Signin (OTP verification)
export async function subAdminVerifySignin(data) {
  const res = await fetch(`${API_BASE}sub-admin/verifySignin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Resend OTP (for Signin)
export async function subAdminResendOtp(data) {
  const res = await fetch(`${API_BASE}sub-admin/resendOtp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Forgot Password
export async function subAdminForgotPassword(data) {
  const res = await fetch(`${API_BASE}sub-admin/forgotPassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Reset Password
export async function subAdminResetPassword(data) {
  const res = await fetch(`${API_BASE}sub-admin/resetPassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Get Sub-Admin Profile
export async function subAdminProfile() {
  const TOKEN = localStorage.getItem('sub_admin_token');
  const res = await fetch(`${API_BASE}sub-admin/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  });
  return handleResponse(res);
}

/** ---------- 🧩 Helper Function ---------- **/

async function handleResponse(res) {
  try {
    const data = await res.json();
    if (!res.ok) {
      // Throw an error with a clear message
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: err.message || 'Unexpected error occurred' };
  }
}


export async function getSubAdminDashboard() {
  const TOKEN = localStorage.getItem("sub_admin_token");
  const res = await fetch(`${BASE_URL}sub-admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
  });
  return res.json();
}
