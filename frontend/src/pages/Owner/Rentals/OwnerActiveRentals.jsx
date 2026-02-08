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
    <div className="page" style={{ padding: "40px", background: "#0f0f12", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Active Rentals Fleet</h1>
        <button onClick={handleBackToDashboard} className="primary-btn">← Back to Dashboard</button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Fetching rental schedules...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {rentals.length > 0 ? (
            rentals.map((item, index) => (
              <div key={index} style={{ background: "#1e1e24", padding: "25px", borderRadius: "15px", border: "1px solid #333" }}>
                <h3 style={{ color: "white", marginBottom: "5px" }}>{item.model}</h3>
                <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: "15px" }}>📍 {item.location}</p>
                
                {item.rentalDetails ? (
                  <div style={{ background: "rgba(168, 85, 247, 0.05)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <small style={{ color: "#a855f7", display: "block", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "bold" }}>Rental Period</small>
                      <span style={{ color: "white", fontSize: "0.9rem" }}>
                        {formatDate(item.rentalDetails.startDate)} — {formatDate(item.rentalDetails.endDate)}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <small style={{ color: "#a855f7", display: "block", fontSize: "0.7rem", fontWeight: "bold" }}>Duration</small>
                        <span style={{ color: "white" }}>{calculateDuration(item.rentalDetails.startDate, item.rentalDetails.endDate)} Days</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <small style={{ color: "#a855f7", display: "block", fontSize: "0.7rem", fontWeight: "bold" }}>Earnings</small>
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>Ξ {item.rentalDetails.paid}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>Details unavailable</p>
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px", color: "#666" }}>
              No active rentals to display.
            </div>
          )}
        </div>
      )}
    </div>
  );
}