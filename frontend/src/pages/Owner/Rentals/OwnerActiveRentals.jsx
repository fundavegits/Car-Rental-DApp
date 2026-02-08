import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../context/useCarRental";

export default function OwnerActiveRentals() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Convert Unix Timestamp (seconds) to Readable Date
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper: Calculate days between two timestamps
  const calculateDuration = (start, end) => {
    const diff = end - start;
    const days = Math.ceil(diff / 86400); // 86400 seconds in a day
    return days > 0 ? days : 0;
  };

  const loadRentalsWithDetails = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const allCars = await fetchAllCars(); 
      
      // Filter for cars owned by user that are currently rented (status 1)
      const ownedRentedCars = allCars.filter(
        (car) => car.owner.toLowerCase() === account.toLowerCase() && Number(car.status) === 1
      );

      // For each rented car, fetch the specific rental details from the mapping
      const detailedRentals = await Promise.all(
        ownedRentedCars.map(async (car) => {
          const details = await getActiveRental(car.id);
          return { ...car, rentalDetails: details };
        })
      );

      setRentals(detailedRentals);
    } catch (err) {
      console.error("Error loading detailed rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) loadRentalsWithDetails();
  }, [account]);

  const handleBackToDashboard = (e) => {
    e.preventDefault();
    navigate("/owner"); 
  };

  return (
    <div className="page" style={{ padding: "40px", background: "#050505", minHeight: "100vh", color: "white" }}>
      
      {/* HEADER SECTION: This keeps the title and button on the same line */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: 0 }}>Active Rentals</h1>
        
        <button 
          onClick={handleBackToDashboard} 
          style={{
            background: "#1a1a1a",
            color: "#ccc",
            border: "1px solid #333",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => { e.target.style.background = "#a855f7"; e.target.style.color = "white"; }}
          onMouseOut={(e) => { e.target.style.background = "#1a1a1a"; e.target.style.color = "#ccc"; }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 style={{ fontSize: "1.8rem", color: "#666", marginBottom: "25px" }}>Fleet</h2>

      {loading ? (
        <p style={{ color: "#888" }}>Fetching rental schedules...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {rentals.length > 0 ? (
            rentals.map((item, index) => (
              <div key={index} style={{ background: "#111", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
                <h3 style={{ color: "white", fontSize: "1.4rem", marginBottom: "5px", textTransform: "capitalize" }}>{item.model}</h3>
                <p style={{ color: "#555", fontSize: "0.85rem", marginBottom: "20px" }}>📍 {item.location}</p>
                
                {item.rentalDetails ? (
                  <div style={{ background: "#1a1625", padding: "18px", borderRadius: "15px", border: "1px solid #3b2a54" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <small style={{ color: "#a855f7", display: "block", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px", marginBottom: "4px" }}>Rental Period</small>
                      <span style={{ color: "#eee", fontSize: "0.95rem" }}>
                        {formatDate(item.rentalDetails.startDate)} — {formatDate(item.rentalDetails.endDate)}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #333", paddingTop: "12px" }}>
                      <div>
                        <small style={{ color: "#666", display: "block", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Duration</small>
                        <span style={{ color: "white", fontWeight: "600" }}>{calculateDuration(item.rentalDetails.startDate, item.rentalDetails.endDate)} Days</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <small style={{ color: "#666", display: "block", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Earnings</small>
                        <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem" }}>Ξ {item.rentalDetails.paid}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>Details unavailable</p>
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px", color: "#444", border: "2px dashed #222", borderRadius: "20px" }}>
              No active rentals to display in the fleet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}