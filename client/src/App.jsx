import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AdminSignIn from "./pages/AdminSignIn";
import UserRegistration from "./pages/UserRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import RegistrationSuccessful from "./pages/RegistrationSuccessful";
import Header from "./components/Header";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Do not show Header if the path is /admin-dashboard */}
      {location.pathname !== "/admin-dashboard" && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-sign-in" element={<AdminSignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
