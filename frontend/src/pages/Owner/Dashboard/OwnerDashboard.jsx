import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Web3Context } from "../../../context/Web3Context";
import {
  fetchAllCars,
  registerCar as registerCarOnChain,
} from "../../../context/useCarRental";

import "./OwnerDashboard.css";
import EarningsOverview from "./components/EarningsOverview";
import ActiveRentals from "./components/ActiveRentals";
import Notifications from "./components/Notifications";

export default function OwnerDashboard() {
  const { signer, account } = useContext(Web3Context);
  const navigate = useNavigate(); 

  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [cars, setCars] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Function to load only the cars owned by the connected wallet
  const loadOwnerCars = async () => {
    if (!account) return;
    try {
      const allCars = await fetchAllCars();
      // Filter cars based on the owner's address
      const owned = allCars.filter(
        (car) => car.owner.toLowerCase() === account.toLowerCase()
      );
      setCars(owned.map((car) => ({
        id: car.id, 
        model: car.model,
        status: car.status, 
        earnings: car.earnings, 
      })));
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setCars([]); 
    }
  };

  useEffect(() => {
    if (account) loadOwnerCars();
  }, [account]);

  // Handle the registration of a new vehicle on the blockchain
  const handleRegisterCar = async () => {
    if (!model || !location || !pricePerDay) return alert("Please fill all fields");
    if (!signer) return alert("Wallet not connected");
    try {
      setLoading(true);
      // Calls the smart contract registerCar function
      await registerCarOnChain(signer, model, location, pricePerDay);
      
      // Reset form fields after success
      setModel(""); 
      setLocation(""); 
      setPricePerDay("");
      
      // Delay refresh to allow blockchain state to update
      setTimeout(async () => await loadOwnerCars(), 2000);
      alert("Car registration submitted successfully!");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page owner-page">
      <h1 className="owner-title">Owner Dashboard</h1>

      {/* Overview of lifetime earnings */}
      <div className="section">
        <EarningsOverview cars={cars} />
      </div>

      {/* Form to add a new car to the fleet */}
      <div className="section register-car-card">
        <h3>Register New Car</h3>
        <div className="register-form">
          <input type="text" placeholder="Car model" value={model} onChange={(e) => setModel(e.target.value)} />
          <input type="text" placeholder="Pickup location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type="text" placeholder="Price per day (ETH)" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />
          <button className="primary-btn" onClick={handleRegisterCar} disabled={loading}>
            {loading ? "Registering..." : "Add Car"}
          </button>
        </div>
      </div>

      {/* Display a preview of the owner's cars */}
      <div className="section" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>My Registered Cars</h3>
          <button 
            onClick={() => navigate("/owner/cars")} 
            className="view-all-btn"
            style={{ 
              background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)", 
              border: "none", color: "white", padding: "8px 18px", 
              borderRadius: "15px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" 
            }}
          >
            View All
          </button>
        </div>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {cars.length > 0 ? (
            cars.slice(0, 4).map((car, index) => (
              <div key={index} style={{ background: "#1e1e24", padding: "15px", borderRadius: "10px", flex: "1 1 200px", border: "1px solid #333", textAlign: "center" }}>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{car.model}</p>
                <small style={{ color: car.status === 0 ? "#10b981" : "#a855f7" }}>
                  Status: {car.status === 0 ? "Available" : "Rented"}
                </small>
              </div>
            ))
          ) : (
            <p style={{ color: "#666" }}>No cars registered yet.</p>
          )}
        </div>
      </div>

      {/* Show cars that are currently being rented */}
      <div className="section">
        <ActiveRentals rentals={cars.filter(car => car.status === 1)} />
      </div>

      {/* Real-time event notifications */}
      <div className="section">
        <Notifications />
      </div>
    </div>
  );
}