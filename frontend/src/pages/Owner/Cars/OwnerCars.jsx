import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars } from "../../../context/useCarRental";

export default function OwnerCars() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate(); // Hook for the Back button
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch owner's cars ---------------- */
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
    <div className="page owner-cars-page" style={{ padding: "2rem", color: "white", background: "#0f0f12", minHeight: "100vh" }}>
      
      {/* Back Button Section */}
      <div style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => navigate("/owner")}
          style={{
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            border: "1px solid #444",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 0.3s"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>My Full Fleet</h1>

      {loading ? (
        <p>Loading your vehicles...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "25px" 
        }}>
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} style={{ 
                background: "#1e1e24", 
                padding: "25px", 
                borderRadius: "15px", 
                border: "1px solid #333",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
              }}>
                <h3 style={{ marginTop: 0, color: "#a855f7" }}>{car.model}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                  <p style={{ margin: 0 }}><strong>Location:</strong> {car.location || "Not specified"}</p>
                  <p style={{ margin: 0 }}><strong>Price/Day:</strong> {car.pricePerDay} ETH</p>
                  <p style={{ margin: 0 }}>
                    <strong>Status:</strong> 
                    <span style={{ 
                      marginLeft: "8px",
                      color: car.status === 0 ? "#22c55e" : "#ef4444" 
                    }}>
                      {car.status === 0 ? "● Available" : "● Rented"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#888" }}>You haven't registered any cars yet.</p>
          )}
        </div>
      )}
    </div>
  );
}