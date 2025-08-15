import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {sendResetPasswordOtp} from "../../services/auth.js";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setEmail(event.target.value);
        setError("");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email.trim() === "") {
            setError("Kindly mention your email address.");
            return;
        }
        setLoading(true);
        sendResetPasswordOtp(email).then((response) => {
            console.log(response);
            navigate("/verify-reset-otp", {state: {email}});
            setEmail("");
        }).catch((error) => {
            console.error(error);
            if (error.response?.data?.user) {
                setError(error.response.data.user);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-gray-600">Enter your email to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your email"
                        />
                        {error && <p className="block text-sm text-red-600 font-medium mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        ← Back to login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;