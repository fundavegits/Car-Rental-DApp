import React from "react";
import { useNavigate } from "react-router-dom";

const ActiveRentals = ({ rentals }) => {
  const navigate = useNavigate();

  return (
    <div className="active-rentals-container" style={{ width: '100%', marginTop: '30px' }}>
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
              flex: "1 1 calc(25% - 15px)",
              minWidth: "180px",
              border: "1px solid #333",
            }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "white" }}>{rental.carModel}</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>Renter: {rental.renter.slice(0,6)}...{rental.renter.slice(-4)}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>No active rentals at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRentals;