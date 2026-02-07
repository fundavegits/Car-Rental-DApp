import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../context/Web3Context";
import {
  fetchAllCars,
  registerCar as registerCarOnChain,
} from "../../../context/useCarRental";

import "./OwnerDashboard.css";
import EarningsOverview from "./components/EarningsOverview";
import MyCarsPreview from "./components/MyCarsPreview";
import ActiveRentals from "./components/ActiveRentals";
import Notifications from "./components/Notifications";

export default function OwnerDashboard() {
  const { signer, account } = useContext(Web3Context);

  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [cars, setCars] = useState([]); 
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch owner's cars ---------------- */
  const loadOwnerCars = async () => {
    if (!account) return;

    try {
      const allCars = await fetchAllCars();
      
      // DEBUG LOGS: Open your browser console (F12) to see these
      console.log("--- Dashboard Sync Check ---");
      console.log("Connected Account:", account);
      console.log("Total Cars on Contract:", allCars.length);
      console.log("Raw Data from Chain:", allCars);

      // Filtering with case-insensitivity
      const owned = allCars.filter(
        (car) => car.owner.toLowerCase() === account.toLowerCase()
      );

      console.log("Filtered Cars for this Owner:", owned);

      setCars(
        owned.map((car) => ({
          id: car.id, 
          model: car.model,
          status: car.status, 
          earnings: car.earnings, 
        }))
      );
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setCars([]); 
    }
  };

  useEffect(() => {
    if (account) {
      loadOwnerCars();
    }
  }, [account]);

  /* ---------------- Register new car ---------------- */
  const handleRegisterCar = async () => {
    if (!model || !location || !pricePerDay) {
      alert("Please fill all fields");
      return;
    }

    if (!signer) {
      alert("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      await registerCarOnChain(signer, model, location, pricePerDay);

      setModel("");
      setLocation("");
      setPricePerDay("");
      
      // Brief delay to allow Sepolia nodes to index the new block
      setTimeout(async () => {
        await loadOwnerCars();
      }, 2000);

      alert("Car registered successfully on Sepolia!");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page owner-page">
      <h1 className="owner-title">Owner Dashboard</h1>

      <div className="section">
        <EarningsOverview cars={cars} />
      </div>

      <div className="section register-car-card">
        <h3>Register New Car</h3>
        <div className="register-form">
          <input
            type="text"
            placeholder="Car model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pickup location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price per day (ETH)"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
          />
          <button
            className="primary-btn"
            onClick={handleRegisterCar}
            disabled={loading}
          >
            {loading ? "Registering..." : "Add Car"}
          </button>
        </div>
      </div>

      <div className="section">
        <MyCarsPreview cars={cars ? cars.slice(0, 3) : []} />
      </div>

      <div className="section grid-2">
        <ActiveRentals />
      </div>

      <div className="section-grid-3">
        <Notifications />
      </div>
    </div>
  );
}