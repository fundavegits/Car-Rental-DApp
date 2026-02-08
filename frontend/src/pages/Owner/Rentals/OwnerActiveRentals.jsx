import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../../../context/Web3Context";
// FIXED: Using fetchAllCars as the source of truth
import { fetchAllCars } from "../../../context/useCarRental";

export default function OwnerActiveRentals() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRentals = async () => {
    if (!account) return;
    try {
      setLoading(true);
      // Fetching all cars and filtering for rented status (1)
      const allData = await fetchAllCars(); 
      const activeOnes = allData.filter(
        (item) => 
          item.owner.toLowerCase() === account.toLowerCase() && 
          item.status === 1
      );
      setRentals(activeOnes);
    } catch (err) {
      console.error("Error loading rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadRentals();
    }
  }, [account]);

  return (
    <div className="page" style={{ padding: "40px", background: "#0f0f12", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Active Rentals Fleet</h1>
        <button 
          onClick={() => navigate("/owner/dashboard")}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid #333",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading active fleet data...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "25px" 
        }}>
          {rentals.length > 0 ? (
            rentals.map((rental, index) => (
              <div key={index} style={{
                background: "#1e1e24",
                padding: "25px",
                borderRadius: "15px",
                border: "1px solid #333",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}>
                <h3 style={{ color: "white", marginTop: 0 }}>{rental.model}</h3>
                <div style={{ color: "#aaa", fontSize: "0.9rem" }}>
                  <p>📍 Location: {rental.location || "Not Specified"}</p>
                  <p>💰 Daily Rate: {rental.pricePerDay} ETH</p>
                  <p style={{ 
                    marginTop: "15px", 
                    color: "#ef4444", 
                    fontWeight: "bold",
                    padding: "8px",
                    background: "rgba(239, 68, 68, 0.1)",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    Status: Currently Rented
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px", background: "rgba(255,255,255,0.02)", borderRadius: "20px" }}>
              <p style={{ color: "#666", fontSize: "1.2rem" }}>No cars are currently out on rental.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}