import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import {resendVerificationOtp, verifyResetOtp} from "../../services/auth.js";

const VerifyResetOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (otp.length !== 6) {
                setError("Please enter the full 6-digit code.");
                setLoading(false);
                return;
            }

            await verifyResetOtp(email, otp);
            navigate("/new-password", { state: { email, otp: otp } });
        } catch (err) {
            const data = err.response?.data;
            if (data?.invalid) {
                setError(data.invalid);
            } else if (data?.expired) {
                setError(data.expired);
            } else {
                setError("Something went wrong. Please try again.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        try {
            setTimeLeft(60);
            setError("");
            await resendVerificationOtp(email);
            console.log("Resending verification code...");
        } catch (err) {
            setError("Failed to resend code. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
                    <p className="text-gray-600 mb-4">
                        We've sent a verification code to
                    </p>
                    <p className="text-blue-600 font-medium">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Enter 6-digit verification code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value)) {
                                    setOtp(e.target.value);
                                    setError("");
                                }
                            }}
                            maxLength={6}
                            autoComplete="off"
                            className="w-full text-center text-3xl tracking-widest font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all p-3"
                            placeholder="••••••"
                        />
                    </div>

                    {error && <p className="font-medium text-red-600 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {timeLeft > 0 ? (
                        <p className="text-gray-600">
                            Resend code in {timeLeft} seconds
                        </p>
                    ) : (
                        <button
                            onClick={resendCode}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Resend verification code
                        </button>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <Link to={"/"} className="text-gray-500 hover:text-gray-700">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyResetOTP;