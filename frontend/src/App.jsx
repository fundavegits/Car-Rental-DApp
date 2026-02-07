import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import OwnerDashboard from "./pages/Owner/Dashboard/OwnerDashboard";
import RenterDashboard from "./pages/Renter/Dashboard/RenterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerCars from "./pages/Owner/Cars/OwnerCars";

// Shared Navigation Bar with Logout & Wallet Switching Logic
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Listen for MetaMask Account or Network changes
  useEffect(() => {
    if (window.ethereum) {
      // If user switches account in MetaMask extension
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          window.location.reload(); // Refresh to sync new wallet
        } else {
          window.location.href = "/login"; // Redirect if all accounts disconnected
        }
      });

      // If user switches network (e.g., moves away from Sepolia)
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  // Hide the navbar on the login page
  if (location.pathname === "/login") return null;

  const handleLogout = () => {
    // Clear app session data
    localStorage.removeItem("userRole");
    localStorage.removeItem("walletAddress");
    
    // Fully reset app state by redirecting to login
    window.location.href = "/login"; 
  };

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#0f0f12', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
        Car Rental <span style={{ color: '#a855f7' }}>DApp</span>
      </h2>
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: 'linear-gradient(90deg, #7c3aed 0%, #db2777 100%)',
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
        ← Disconnect & Switch
      </button>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation sits inside Router but outside Routes to stay global */}
      <Navigation /> 
      
      <Routes>
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

        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}