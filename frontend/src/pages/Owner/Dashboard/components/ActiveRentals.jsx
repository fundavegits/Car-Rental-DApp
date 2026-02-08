import React from "react";
import { useNavigate } from "react-router-dom";

const ActiveRentals = ({ rentals }) => {
  const navigate = useNavigate();

  return (
    <div className="active-rentals-section" style={{ width: '100%', marginTop: '40px' }}>
      {/* Header with Title and View All Button */}
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
            background: "#a855f7",
            border: "none",
            color: "white",
            padding: "6px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          View All
        </button>
      </div>

      {/* HORIZONTAL SPREAD: Flex container for side-by-side cards */}
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        flexWrap: "wrap", 
        width: "100%" 
      }}>
        {rentals && rentals.length > 0 ? (
          rentals.slice(0, 4).map((rental, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "20px",
              borderRadius: "15px",
              flex: "1 1 calc(25% - 20px)", // Forces 4 per row
              minWidth: "250px",
              border: "1px solid #333",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <h4 style={{ margin: 0, color: "white", fontSize: "1rem" }}>{rental.carModel}</h4>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                <p style={{ margin: "2px 0" }}>👤 {rental.renter.slice(0,6)}...{rental.renter.slice(-4)}</p>
                <p style={{ margin: "2px 0" }}>📅 Return: {new Date(rental.expiry * 1000).toLocaleDateString()}</p>
              </div>
              <div style={{
                marginTop: "10px",
                padding: "6px",
                borderRadius: "8px",
                textAlign: "center",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "bold",
                fontSize: "0.75rem",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}>
                Currently Rented
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>No active rentals found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRentals;