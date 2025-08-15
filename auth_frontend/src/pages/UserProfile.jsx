import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { updateUser } from "../services/user.js";
import { ChartColumn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { user, fetchUserProfile, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        errors: {},
        isError: false
    });

    const formatRoles = (roles) => {
        if (!roles) return "user";
        return Array.isArray(roles) ? roles.join(", ") : String(roles);
    };

    const setInitialFormData = (u) => {
        setFormData({
            name: u.name || "",
            email: u.email || "",
            role: formatRoles(u.roles),
            id: u.id || "",
            createdAt: u.createdAt ? new Date(u.createdAt) : null,
            updatedAt: u.updatedAt ? new Date(u.updatedAt) : null,
        });
    };

    useEffect(() => {
        if (user) {
            setInitialFormData(user);
        }
    }, [user]);

    const handleRefreshFailure = () => {
        setIsLoading(false);
        navigate("/login");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError({ errors: {}, isError: false });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateUser(formData.id, {
                name: formData.name,
            });
            await fetchUserProfile();
            setIsEditing(false);
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Updating profile failed:", error);
            if (error.response?.status === 401) {
                handleRefreshFailure();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setInitialFormData(user);
        }
        setIsEditing(false);
    };

    const handleGoToAdmin = () => {
        if (user?.roles?.includes("ADMIN")) {
            navigate("/admin");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Profile</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-500 hover:text-red-600 p-2 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                        {user?.roles?.includes("ADMIN") && (
                            <button
                                onClick={handleGoToAdmin}
                                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 p-2 rounded-lg transition-all cursor-pointer"
                            >
                                <ChartColumn className="w-5 h-5" />
                                <span>Dashboard</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 relative">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : ""}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{formData.name}</p>
                            )}
                            {error.errors?.response?.data?.name && (
                                <p className="block text-sm font-medium text-red-600 mt-1">
                                    {error.errors.response.data.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{formData.email}</p>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">{formData.role}</p>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-mono text-sm">
                                    {formData.id}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Created (Time)</label>
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm">
                                    {formData.createdAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm">
                                    {formData.updatedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
