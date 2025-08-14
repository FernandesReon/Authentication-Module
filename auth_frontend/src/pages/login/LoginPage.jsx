import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "../../services/auth.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState({
        errors: {},
        isError: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError({ errors: {}, isError: false });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.email.trim() === "") {
            setError({ errors: { email: "Email id is required" }, isError: true });
            setLoading(false);
            return;
        }

        if (formData.password.trim() === "") {
            setError({ errors: { password: "Kindly enter your password" }, isError: true });
            setLoading(false);
            return;
        }

        setLoading(true);
        login(formData)
            .then((response) => {
                console.log("Response", response);
                setFormData({ email: "", password: "" });
                navigate("/");
            })
            .catch((error) => {
                console.error("Error", error);
                if (error.response?.data) {
                    setError({ errors: error.response.data, isError: true });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*Email*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your email"
                        />
                        {error.errors.email && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.email}</p>}
                    </div>
                    {/*Password*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your password"
                        />
                        {error.errors.password && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.password}</p>}
                        {error.errors.credentials && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.credentials}</p>}
                        {error.errors.disabled && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.disabled}</p>}
                        <Link to="/forgot-password" className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium block text-right">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {"Don't have an account? "}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;