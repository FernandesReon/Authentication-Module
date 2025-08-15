import { useState, useEffect, useContext } from "react";
import { LogOut, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getAllUsers } from "../services/admin.js";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const usersPerPage = 5;

    useEffect(() => {
        fetchUsers(currentPage - 1);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            setIsLoading(true);
            const data = await getAllUsers(page, usersPerPage);
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const goToProfile = () => {
        if (user?.roles?.includes("ADMIN")) {
            navigate("/user-profile");
        }
    };

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

    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    function Dropdown({ userId, onAction }) {
        const [isOpen, setIsOpen] = useState(false);

        const actions = [
            { label: "Promote", value: "promote" },
            { label: "Delete User", value: "delete", danger: true },
        ];

        const handleAction = (action) => {
            onAction(action, userId);
            setIsOpen(false);
        };

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
                    aria-label="More options"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {actions.map((action) => (
                                <button
                                    key={action.value}
                                    onClick={() => handleAction(action.value)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${action.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
                                    }`}
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
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                        <p className="text-gray-600">Manage users</p>
                    </div>
                    <div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-500 hover:text-red-600 p-2 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
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

                {/* Users Cards */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">Loading users...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Header with Avatar */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{u.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <Dropdown
                                        userId={u.id}
                                        onAction={(action, id) => console.log(`Action: ${action} for ${id}`)}
                                    />
                                </div>

                                {/* Roles */}
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

                                {/* Status */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {u.emailVerified ? "Email Verified" : "Email Unverified"}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.accountEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {u.accountEnabled ? "Account Active" : "Account Disabled"}
                                        </span>
                                    </div>
                                </div>

                                {/* Dates */}
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

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(endIndex, users.length * totalPages)} of {users.length * totalPages} users
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={goToPrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

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
