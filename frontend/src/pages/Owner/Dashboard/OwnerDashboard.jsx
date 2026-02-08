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

  const loadOwnerCars = async () => {
    if (!account) return;
    try {
      const allCars = await fetchAllCars();
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

  const handleRegisterCar = async () => {
    if (!model || !location || !pricePerDay) return alert("Please fill all fields");
    if (!signer) return alert("Wallet not connected");

    try {
      setLoading(true);
      await registerCarOnChain(signer, model, location, pricePerDay);
      setModel(""); setLocation(""); setPricePerDay("");
      setTimeout(async () => await loadOwnerCars(), 2000);
      alert("Car registered successfully!");
    } catch (err) {
      alert("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page owner-page" style={{ background: "#0f0f12", minHeight: "100vh", padding: "20px" }}>
      <h1 className="owner-title">Owner Dashboard</h1>

      <div className="section">
        <EarningsOverview cars={cars} />
      </div>

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

      <div className="section" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>My Registered Cars</h3>
          <button onClick={() => navigate("/owner/cars")} style={{ background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)", border: "none", color: "white", padding: "5px 15px", borderRadius: "15px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
            View All
          </button>
        </div>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {cars.length > 0 ? cars.slice(0, 4).map((car, index) => (
            <div key={index} style={{ background: "#1e1e24", padding: "15px", borderRadius: "10px", flex: "1 1 200px", border: "1px solid #333", textAlign: "center" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{car.model}</p>
              <small style={{ color: "#a855f7" }}>Status: {car.status === 0 ? "Available" : "Rented"}</small>
            </div>
          )) : <p style={{ color: "#666" }}>No cars registered yet.</p>}
        </div>
      </div>

      {/* FIXED: Passing rentals data and removing restrictive grid class */}
      <div className="section" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222", marginBottom: "20px" }}>
        <ActiveRentals rentals={cars.filter(car => car.status === 1)} />
      </div>

      <div className="section">
        <Notifications />
      </div>
    </div>
  );
}