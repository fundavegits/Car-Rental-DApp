import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import OwnerDashboard from "./pages/Owner/Dashboard/OwnerDashboard";
import RenterDashboard from "./pages/Renter/Dashboard/RenterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerCars from "./pages/Owner/Cars/OwnerCars";
/* NEW IMPORT: Added for the active rentals full view */
import OwnerActiveRentals from "./pages/Owner/Rentals/OwnerActiveRentals";

// This component handles the shared Navigation Bar and Wallet Logic
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Listen for MetaMask Account or Network changes automatically
  useEffect(() => {
    if (window.ethereum) {
      // Refresh the page if the user manually switches accounts in MetaMask
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          window.location.reload(); 
        } else {
          // If the user disconnects all accounts, send them to login
          window.location.href = "/login";
        }
      });

      // Refresh the page if the user switches networks (e.g., Sepolia to Mainnet)
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  // Hide the navbar on the login page so it doesn't look cluttered
  if (location.pathname === "/login") return null;

  const handleLogout = () => {
    // Clear the app session and stored wallet data
    localStorage.removeItem("userRole");
    localStorage.removeItem("walletAddress");
    
    // Fully reset the application state by redirecting to the login page
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
      {/* The Navigation bar stays visible as you switch between dashboards */}
      <Navigation /> 
      
      <Routes>
        {/* Default route redirects immediately to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Owner specific routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        {/* Navigation to see all cars */}
        <Route path="/owner/cars" element={<OwnerCars />} />
        
        {/* NEW ROUTE: Added for seeing all active rentals */}
        <Route 
          path="/owner/rentals" 
          element={
            <ProtectedRoute role="owner">
              <OwnerActiveRentals />
            </ProtectedRoute>
          } 
        />

        {/* Renter specific routes */}
        <Route
          path="/renter"
          element={
            <ProtectedRoute role="renter">
              <RenterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Login for any undefined URL */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}