import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {resetPassword} from "../../services/auth.js";

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {}

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        errors: {},
        isError: false
    });

    useEffect(() => {
        if (!email || !otp) {
            navigate("/");
        }
    }, [email, otp, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError({ errors: {}, isError: false });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError({
                errors: { confirmPassword: "Passwords don't match." },
                isError: true,
            });
            setIsLoading(false)
            return
        }

        setIsLoading(true);
        resetPassword(email, otp, formData.password).then(() => {
            setFormData({
                password: "",
                newPassword: ""
            });
            navigate("/");
        }).catch((error) => {
            console.error('Error', error);
            setError({
                errors: error,
                isError: true
            })
        }).finally(() => {
            setIsLoading(false);
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from blue-50 to-indigo-100 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600 mb-2">Create a new password for your account</p>
                    <p className="text-sm text-indigo-600 font-medium">{formData.email}</p>
                </div>

                {/* form for changing password */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${error.errors?.response?.data?.password ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Create a password"
                            autoComplete="off"
                        />
                        {error.errors?.response?.data?.newPassword && <p className="block text-sm font-medium text-red-600 mt-1">{error.errors.response.data.newPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${error.errors?.confirmPassword ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Confirm your password"
                            autoComplete="off"
                        />
                        {error.errors?.confirmPassword && <p className="block text-sm font-medium text-red-600 mt-1">{error.errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to={"/"} className="text-gray-500 hover:text-gray-700 text-sm">← Back to login</Link>
                </div>
            </div>
        </div>
    )
}

export default NewPassword;