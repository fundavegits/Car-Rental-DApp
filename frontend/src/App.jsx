import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import OwnerDashboard from "./pages/Owner/Dashboard/OwnerDashboard";
import RenterDashboard from "./pages/Renter/Dashboard/RenterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerCars from "./pages/Owner/Cars/OwnerCars";

// This component handles the shared Navigation Bar
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the navbar on the login page
  if (location.pathname === "/login") return null;

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#0f0f12', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    }}>
      <h2 style={{ 
        color: 'white', 
        margin: 0, 
        fontSize: '1.5rem',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        Car Rental <span style={{ color: '#a855f7' }}>DApp</span>
      </h2>
      <button 
        onClick={() => navigate("/login")}
        style={{
          padding: '10px 20px',
          background: 'linear-gradient(90deg, #7c3aed 0%, #db2777 100%)', // Pink/Purple gradient
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 10px rgba(219, 39, 119, 0.3)'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        ← Logout / Switch Role
      </button>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar is placed here to stay on top of all pages */}
      <Navigation /> 
      
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Owner Routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/owner/cars" element={<OwnerCars />} />

        {/* Renter Routes */}
        <Route
          path="/renter"
          element={
            <ProtectedRoute role="renter">
              <RenterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect any unknown routes back to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}