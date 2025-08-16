import { useState, useEffect, useContext } from "react";
import { EllipsisVertical, LogOut, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getAllUsers } from "../services/admin.js";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    // Get the logged-in user's details and logout function from context
    const { logout, user } = useContext(AuthContext);

    const navigate = useNavigate();

    // State to store the list of users
    const [users, setUsers] = useState([]);

    // State to track loading status
    const [isLoading, setIsLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // How many users to show per page
    const usersPerPage = 5;

    // Fetch users when the page changes
    useEffect(() => {
        fetchUsers(currentPage - 1); // API is 0-based, so subtract 1
    }, [currentPage]);

    // Fetch all users from backend
    const fetchUsers = async (page) => {
        try {
            setIsLoading(true); // Show loading text
            const data = await getAllUsers(page, usersPerPage);
            setUsers(data.content || []); // Store users
            setTotalPages(data.totalPages || 0); // Store total pages
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Navigate to profile page (only if logged-in user is ADMIN)
    const goToProfile = () => {
        if (user?.roles?.includes("ADMIN")) {
            navigate("/user-profile");
        }
    };

    // Format dates nicely
    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        return new Date(dateTime).toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Pagination - Go to previous page
    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Pagination - Go to next page
    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Used for pagination info text
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    /**
     * Dropdown component for user actions
     * This shows options like "Promote" for non-admin users.
     */
    function Dropdown({ userId, onAction, roles }) {
        const [isOpen, setIsOpen] = useState(false);

        // Action list (starts empty)
        const actions = [];

        // Only add the "Promote" action if this user is NOT an admin
        if (!roles.includes("ADMIN")) {
            actions.push({ label: "Promote", value: "promote" });
        }

        // Handle action click
        const handleAction = (action) => {
            onAction(action, userId);
            setIsOpen(false);
        };

        return (
            <div className="relative">
                {/* Three-dot icon button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
                    aria-label="More options"
                >
                    <EllipsisVertical className="w-5 h-5 text-gray-500" />
                </button>

                {/* Dropdown menu (only shows if open AND there are actions) */}
                {isOpen && actions.length > 0 && (
                    <>
                        {/* Overlay to close dropdown when clicking outside */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {actions.map((action) => (
                                <button
                                    key={action.value}
                                    onClick={() => handleAction(action.value)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-8xl mx-auto">
                {/* HEADER */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                        <p className="text-gray-600">Manage users</p>
                    </div>
                    <div>
                        {/* Logout button */}
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-500 hover:text-red-600 p-2 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>

                        {/* Profile button (only for admins) */}
                        {user?.roles?.includes("ADMIN") && (
                            <button
                                onClick={goToProfile}
                                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 p-2 rounded-lg transition-all cursor-pointer"
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* USERS LIST */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">Loading users...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* USER HEADER */}
                                <div className="flex items-start justify-between mb-4">
                                    {/* User avatar and info */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{u.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    {/* Show dropdown ONLY if this user is NOT an admin */}
                                    {!u.roles?.includes("ADMIN") && (
                                        <Dropdown
                                            userId={u.id}
                                            roles={u.roles}
                                            onAction={(action, id) => console.log(`Action: ${action} for ${id}`)}
                                        />
                                    )}
                                </div>

                                {/* ROLES */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Roles</label>
                                    <div className="flex flex-wrap gap-1">
                                        {u.roles?.map((role, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {/* Email status */}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {u.emailVerified ? "Email Verified" : "Email Unverified"}
                                        </span>
                                        {/* Account status */}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.accountEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {u.accountEnabled ? "Account Active" : "Account Disabled"}
                                        </span>
                                    </div>
                                </div>

                                {/* DATES */}
                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Created:</span>
                                        <span>{formatDateTime(u.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Updated:</span>
                                        <span>{formatDateTime(u.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    {/* Showing X to Y of Z users */}
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(endIndex, users.length * totalPages)} of {users.length * totalPages} users
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Previous page button */}
                        <button
                            onClick={goToPrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {/* Next page button */}
                        <button
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
