import {Route, Routes} from "react-router-dom";
import RegistrationPage from "./pages/registration/RegistrationPage.jsx";
import AccountVerification from "./pages/registration/AccountVerification.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/verify-account" element={<AccountVerification />} />

            </Routes>
        </div>
    )
}

export default App;