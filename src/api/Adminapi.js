const BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Ensure BASE_URL ends with a trailing slash
const API_BASE = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

/* -----------------------------------------------------
 🟢 ADMIN AUTH & ACCOUNT APIS
------------------------------------------------------ */

// 🔹 Login
export async function AdminSignin(data) {
  const res = await fetch(`${API_BASE}admin/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Verify Signin (OTP)
export async function AdminVerifySignin(data) {
  const res = await fetch(`${API_BASE}admin/verifySignin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Resend OTP
export async function AdminResendOtp(data) {
  const res = await fetch(`${API_BASE}admin/resendOtp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Forgot Password
export async function AdminForgotPassword(data) {
  const res = await fetch(`${API_BASE}admin/forgotPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Change / Reset Password
export async function AdminChangePassword(data) {
  const res = await fetch(`${API_BASE}admin/changePassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Get Admin Profile
// export async function AdminProfile() {
//   const TOKEN = localStorage.getItem("admin_token");
//   const res = await fetch(`${API_BASE}admin/profile`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   });
//   return handleResponse(res);
// }


/* -----------------------------------------------------
 🧩 Helper: Response Handler
------------------------------------------------------ */


async function handleResponse(res) {
  try {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    return {
      success: false,
      message: err.message || "Unexpected error occurred",
    };
  }
}

export async function getAdminDashboard() {
  const TOKEN = localStorage.getItem("admin_token");
  const res = await fetch(`${BASE_URL}admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
  });
  return res.json();
}
