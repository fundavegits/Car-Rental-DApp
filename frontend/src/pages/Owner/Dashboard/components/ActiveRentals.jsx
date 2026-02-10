import React from "react";
import { useNavigate } from "react-router-dom";

const ActiveRentals = ({ rentals }) => {
  const navigate = useNavigate();

  return (
    /* Matches the outer wrapper style of My Registered Cars */
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222", width: "100%" }}>
      
      {/* HEADER: Matches the layout and button style exactly */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Active Rentals</h3>
        <button 
          onClick={() => navigate("/owner/rentals")}
          style={{
            background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
            border: "none",
            color: "white",
            padding: "8px 18px",
            borderRadius: "15px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "bold"
          }}
        >
          View All
        </button>
      </div>

      {/* GRID: Uses flexbox instead of grid to match Registered Cars behavior */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {rentals && rentals.length > 0 ? (
          rentals.slice(0, 4).map((rental, index) => (
            /* Card Design: Exact match for My Registered Cars cards */
            <div key={index} style={{ 
              background: "#1e1e24", 
              padding: "15px", 
              borderRadius: "10px", 
              flex: "1 1 200px", 
              border: "1px solid #333", 
              textAlign: "center" 
            }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "white" }}>
                {rental.model}
              </p>
              {/* Status: Using <small> and specific color #a855f7 for Rented status */}
              <small style={{ color: "#a855f7", fontWeight: "500" }}>
                Status: Currently Rented
              </small>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>No active rentals currently.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRentals;