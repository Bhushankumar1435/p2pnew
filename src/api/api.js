const BASE_URL = import.meta.env.VITE_API_URL;

export async function registerUser(data) {
    console.log(' data is ', data)
    const res = await fetch(`${BASE_URL}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function loginUser(data) {
    const res = await fetch(`${BASE_URL}user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function verifySignup(data) {
    const res = await fetch(`${BASE_URL}user/verifySignup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function resendVierifyOtpMail(data) {
    const res = await fetch(`${BASE_URL}user/resendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function verifyEmail(data) {
    const res = await fetch(`${BASE_URL}user/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}



export async function forgotPassword(data) {
    const res = await fetch(`${BASE_URL}user/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json();
}
export async function validateSponser(sponserId) {
    const res = await fetch(`${BASE_URL}user/getUser?userId=` + sponserId, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    return res.json()
}

export async function createpassword(data) {
    const TOKEN = localStorage.getItem("auth_token");
    const res = await fetch(`${BASE_URL}user/createPassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function verifyForgotPassword(data) {
    const res = await fetch(`${BASE_URL}user/verifyForgotPassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}


/** we have to delete these reset functions */
export async function CreateDeal(data) {
    const TOKEN = localStorage.getItem("auth_token");
    console.log({ TOKEN });

    const res = await fetch(`${BASE_URL}user/createDeal`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`,
        },

        body: JSON.stringify(data),
    })
    return res.json()
}
export const myDeals = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/user/myDeals`);
        return res.data; // should contain { success, data: [...] }
    } catch (error) {
        console.error("❌ myDeals error:", error);
        return { success: false, data: [] };
    }
};

export async function getWalletAddress() {
    const TOKEN = localStorage.getItem("auth_token");
    const res = await fetch(`${BASE_URL}user/getWalletAddress`, {
        method: "GeT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`,
        },
    })
    return res.json()
}
export async function depositTxn() {
    const TOKEN = localStorage.getItem("auth_token");
    const res = await fetch(`${BASE_URL}user/depositTxn`, {
        method: "GeT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`,
        },
    })
    return res.json()
}

export async function getTeamByLevel(level) {
    const TOKEN = localStorage.getItem("auth_token");

    const res = await fetch(`${BASE_URL}user/teamByLevel?level=${level}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
        }
    });

    return res.json();
}


export async function getWithdrawOrders(limit = 10, page = 1,status) {
    const TOKEN = localStorage.getItem("auth_token");

    const res = await fetch(
        `${BASE_URL}user/withdrawOrders?limit=${limit}&page=${page}&status=${status || "PENDING"}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`,
            },
        }
    );

    return res.json();
}

