import { axiosInstance } from "./api";

const adminUsersUrl = import.meta.env.VITE_ADMIN_USERS;
const adminUserByIdUrl = import.meta.env.VITE_ADMIN_USER_BY_ID;
const adminUserByEmailUrl = import.meta.env.VITE_ADMIN_USER_BY_EMAIL;
const promoteToAdminUrl = import.meta.env.VITE_ADMIN_PROMOTE_TO_ADMIN;

// --------------- Admin APIs ----------------

// Fetch all users (admin)
export const getAllUsers = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get(`${adminUsersUrl}?page=${page + 1}&${size}`);
        return response.data;
    } catch (error) {
        console.error('Unexpected error while fetching users information');
        throw error;
    }
}

// Fetch user by ID (admin)
export const getUserById = async(id) => {
    try {
        const response = await axiosInstance.get(`${adminUserByIdUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Unexpected error while fetching user with id: ', id);
        throw error;
    }
}

// Fetch user by email (admin)
export const getUserByEmail = async(email) => {
    try {
        const response = await axiosInstance.get(`${adminUserByEmailUrl}/${email}`);
        return response.data;
    } catch (error) {
        console.error('Unexpected error while fetching user with email: ', email);
        throw error;
    }
}

// Promote to Admin
export const promoteToAdmin = async (id) => {
    try {
        const response = await axiosInstance.post(`${promoteToAdminUrl}/${id}/promote-to-admin`);
        return response.data;
    } catch (error) {
        console.error('Unexpected error while promoting user with id: ', id);
        throw error;
    }
};
