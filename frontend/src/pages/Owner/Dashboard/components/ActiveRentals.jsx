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

      {/* FIXED CONTAINER: Forces items to spread horizontally */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", // Ensures horizontal flow
        gap: "20px", 
        flexWrap: "wrap", // Allows wrapping to next line if screen is small
        width: "100%" 
      }}>
        {rentals && rentals.length > 0 ? (
          rentals.slice(0, 4).map((rental, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "25px",
              borderRadius: "15px",
              flex: "1 1 calc(25% - 20px)", // Forces 4 items per row on large screens
              minWidth: "250px", // Prevents cards from getting too thin
              border: "1px solid #333",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "white", fontSize: "1.1rem" }}>
                {rental.carModel}
              </h4>
              
              <div style={{ fontSize: "0.85rem", color: "#ccc", marginBottom: "15px" }}>
                <p style={{ margin: "5px 0" }}>👤 Renter: {rental.renter.slice(0,6)}...{rental.renter.slice(-4)}</p>
                <p style={{ margin: "5px 0" }}>📅 Return: {new Date(rental.expiry * 1000).toLocaleDateString()}</p>
              </div>

              <div style={{ 
                marginTop: "auto",
                padding: "8px",
                borderRadius: "8px",
                textAlign: "center",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "bold",
                fontSize: "0.8rem",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}>
                ● Currently Rented
              </div>
            </div>
          ))
        ) : (
          <div style={{ width: "100%", textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", borderRadius: "15px" }}>
            <p style={{ color: "#666", margin: 0 }}>No active rentals found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRentals;