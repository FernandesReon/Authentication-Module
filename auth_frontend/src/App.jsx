import {Route, Routes} from "react-router-dom";
import RegistrationPage from "./pages/registration/RegistrationPage.jsx";
import AccountVerification from "./pages/registration/AccountVerification.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import ForgotPassword from "./pages/login/ForgotPassword.jsx";
import VerifyResetOTP from "./pages/login/VerifyResetOTP.jsx";
import UpdatePassword from "./pages/login/UpdatePassword.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import PrivateRoute from "./route/PrivateRoute.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

const App = () => {
    return (
        <AuthProvider>
            <div className="app">
                <Routes>
                    {/*login process*/}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                    <Route path="/new-password" element={<UpdatePassword />}/>

                    {/*registration process*/}
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/verify-account" element={<AccountVerification />} />

                    {/*Protected routes*/}
                    <Route>
                        <Route path="/user-profile" element={<UserProfile />} />
                    </Route>
                    {/* Only user with admin role can access it. */}
                    <Route element={<PrivateRoute requireAdmin={true} />}>
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>
            </Routes>
        </div>
        </AuthProvider>
    )
}

export default App;