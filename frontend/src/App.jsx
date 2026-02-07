import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import OwnerDashboard from "./pages/Owner/Dashboard/OwnerDashboard";
import RenterDashboard from "./pages/Renter/Dashboard/RenterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerCars from "./pages/Owner/Cars/OwnerCars";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/renter"
          element={
            <ProtectedRoute role="renter">
              <RenterDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/owner/cars" element={<OwnerCars />} />
      </Routes>
    </BrowserRouter>
  );
}
