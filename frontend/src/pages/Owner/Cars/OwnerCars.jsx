import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars } from "../../../context/useCarRental";

export default function OwnerCars() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate(); 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const allCars = await fetchAllCars();
      const owned = allCars.filter(
        (car) => car.owner.toLowerCase() === account.toLowerCase()
      );
      setCars(owned);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, [account]);

  return (
    <div className="page owner-cars-page" style={{ 
      padding: "3rem", 
      color: "white", 
      background: "#0f0f12", 
      minHeight: "100vh",
      width: "100%", // Explicitly uses the whole screen width
      boxSizing: "border-box"
    }}>
      
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold" }}>My Full Fleet</h1>
        <button 
          onClick={() => navigate("/owner")}
          style={{
            padding: "10px 25px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid #444",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Syncing with Blockchain...</p>
      ) : (
        /* THE HORIZONTAL GRID FIX */
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "30px",
          width: "100%" 
        }}>
          {cars.map((car) => (
            <div key={car.id} style={{ 
              background: "linear-gradient(145deg, #1e1e24 0%, #16161a 100%)", 
              padding: "30px", 
              borderRadius: "20px", 
              border: "1px solid #333",
              boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "240px"
            }}>
              <div>
                <h3 style={{ marginTop: 0, color: "#a855f7", fontSize: "1.6rem" }}>{car.model}</h3>
                <p style={{ color: "#888" }}>Location: {car.location || "Delhi"}</p>
                <p><strong>Price:</strong> {car.pricePerDay} ETH / Day</p>
              </div>
              
              <div style={{ 
                marginTop: "20px",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
                background: car.status === 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: car.status === 0 ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
                border: "1px solid currentColor"
              }}>
                {car.status === 0 ? "Available" : "Currently Rented"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}