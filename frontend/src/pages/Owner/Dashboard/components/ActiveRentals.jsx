import React from "react";
import { useNavigate } from "react-router-dom";

const ActiveRentals = ({ rentals }) => {
  const navigate = useNavigate();

  return (
    <div className="active-rentals-section" style={{ width: '100%', marginTop: '40px' }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px" 
      }}>
        <h3 style={{ margin: 0, color: "white", fontSize: "1.2rem" }}>Active Rentals</h3>
        <button 
          onClick={() => navigate("/owner/rentals")}
          style={{
            background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
            border: "none",
            color: "white",
            padding: "8px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.85rem",
          }}
        >
          View All
        </button>
      </div>

      {/* HORIZONTAL SPREAD: Flex container to match 'My Registered Cars' */}
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        flexWrap: "wrap", 
        width: "100%" 
      }}>
        {rentals && rentals.length > 0 ? (
          rentals.slice(0, 4).map((rental, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "20px",
              borderRadius: "12px",
              flex: "1 1 calc(25% - 15px)", // Forces horizontal growth
              minWidth: "220px",
              border: "1px solid #333",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "white", fontSize: "1rem" }}>
                {rental.carModel}
              </p>
              <div style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "600",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}>
                ● Currently Rented
              </div>
            </div>
          ))
        ) : (
          <div style={{ width: "100%", textAlign: "center", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
            <p style={{ color: "#666", margin: 0 }}>No active rentals found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRentals;