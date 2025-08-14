import { axiosInstance } from "./api";

// -------------------- Environment Variables --------------------
const registrationUrl = import.meta.env.VITE_AUTH_REGISTER;
const verify_account = import.meta.env.VITE_AUTH_ACCOUNT_VERIFY;
const resend_account_verification_otp = import.meta.env.VITE_AUTH_RESEND_OTP;

const reset_password_otp = import.meta.env.VITE_AUTH_RESET_PASSWORD;
const verify_reset_otp = import.meta.env.VITE_AUTH_VERIFY_RESET_OTP;
const new_password_url = import.meta.env.VITE_AUTH_NEW_PASSWORD;

const loginUrl = import.meta.env.VITE_AUTH_LOGIN;

// -------------------- Registration --------------------

// 1. User registration
export const registration = async (userData) => {
    try {
        const response = await axiosInstance.post(registrationUrl, userData);
        return response.data;
    } catch (error) {
        console.error('Unexpected error during registration');
        throw error;
    }
};

// 2. Account verification via OTP
export const verifyAccount = async (email, otp) => {
    try {
        const response = await axiosInstance.post(
            verify_account,
            { otp },
            { params: { email } }
        );
        return response.data;
    } catch (error) {
        console.error('Unexpected error during account verification process');
        throw error;
    }
};

// 3. Resend account verification OTP
export const resendVerificationOtp = async (email) => {
    try {
        const response = await axiosInstance.post(
            resend_account_verification_otp,
            null,
            { params: { email } }
        );
        return response.data;
    } catch (error) {
        console.error('Unexpected error during OTP resend process');
        throw error;
    }
};

// -------------------- Reset Password --------------------

// 4. Request OTP for password reset
export const sendResetPasswordOtp = async (email) => {
    try {
        const response = await axiosInstance.post(
            reset_password_otp,
            null,
            { params: { email } }
        );
        return response.data;
    } catch (error) {
        console.error('Unexpected error during sending reset password OTP');
        throw error;
    }
};

// 5. Verify reset password OTP
export const verifyResetOtp = async (email, otp) => {
    try {
        const response = await axiosInstance.post(
            verify_reset_otp,
            { email, otp }
        );
        return response.data;
    } catch (error) {
        console.error('Unexpected error during verifying reset password OTP');
        throw error;
    }
};

// 6. Reset password with OTP
export const resetPassword = async (email, otp, newPassword) => {
    try {
        const response = await axiosInstance.post(
            new_password_url,
            { email, otp, newPassword }
        );
        return response.data;
    } catch (error) {
        console.error('Unexpected error during password reset');
        throw error;
    }
};

// -------------------- Login --------------------

// 7. User login
export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post(loginUrl, credentials);
        return response.data;
    } catch (error) {
        console.error('Unexpected error during login process');
        throw error;
    }
};
