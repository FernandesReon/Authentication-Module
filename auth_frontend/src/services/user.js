import { axiosInstance } from "./api";

const profile = import.meta.env.VITE_USER_PROFILE;
const updateProfile = import.meta.env.VITE_USER_PROFILE_UPDATE;

// -------------------- User Profile --------------------

// Fetch current logged-in user's details
export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get(profile);
        return response.data; // This will be your UserProfileDTO
    } catch (error) {
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error("Unexpected error while fetching user details:", error);
        }
        throw error;
    }
};

// Update profile
export const updateUser = async (id, updatedData) => {
    try {
        const response = await axiosInstance.put(`${updateProfile}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};