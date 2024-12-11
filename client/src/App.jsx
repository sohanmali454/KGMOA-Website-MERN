import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminSignIn from "./pages/AdminSignIn";
import UserRegistration from "./pages/UserRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentGetway from "./pages/PaymentGetway";
import RegistrationSuccessful from "./pages/RegistrationSuccessful";
import Header from "./components/Header";
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-sign-in" element={<AdminSignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/payment-getway" element={<PaymentGetway />} />
        <Route
          path="/registration-successful"
          element={<RegistrationSuccessful />}
        />
      </Routes>
    </BrowserRouter>
  );
}
