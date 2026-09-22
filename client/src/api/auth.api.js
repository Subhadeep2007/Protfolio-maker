import api from "./axios";


// ================================
// USER REGISTER
// ================================

export const registerUser = async(data) => {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};


// ================================
// ADMIN REGISTER
// ================================

export const registerAdmin = async(data) => {

    const response = await api.post(
        "/auth/admin/register",
        data
    );

    return response.data;
};


// ================================
// VERIFY EMAIL
// ================================

export const verifyEmail = async(data) => {

    const response = await api.post(
        "/auth/verify-email",
        data
    );

    return response.data;
};


// ================================
// RESEND OTP
// ================================

export const resendVerificationOTP = async(email) => {

    const response = await api.post(
        "/auth/resend-verification", {
            email
        }
    );

    return response.data;
};


// ================================
// USER LOGIN
// ================================

export const loginUser = async(data) => {

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};


// ================================
// ADMIN LOGIN
// ================================

export const loginAdmin = async(data) => {

    const response = await api.post(
        "/auth/admin/login",
        data
    );

    return response.data;
};


// ================================
// REFRESH TOKEN
// ================================

export const refreshToken = async() => {

    const response = await api.post(
        "/auth/refresh-token"
    );

    return response.data;
};


// ================================
// LOGOUT
// ================================

export const logout = async() => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};


// ================================
// FORGOT PASSWORD
// ================================

export const forgotPassword = async(email) => {

    const response = await api.post(
        "/auth/forgot-password", {
            email
        }
    );

    return response.data;
};


// ================================
// RESET PASSWORD
// ================================

export const resetPassword = async(data) => {

    const response = await api.post(
        "/auth/reset-password",
        data
    );

    return response.data;
};


// ================================
// CHANGE PASSWORD
// ================================

export const changePassword = async(data) => {

    const response = await api.post(
        "/auth/change-password",
        data
    );

    return response.data;
};