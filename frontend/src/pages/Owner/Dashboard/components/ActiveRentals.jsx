import React from "react";
import { useNavigate } from "react-router-dom";

const ActiveRentals = ({ rentals }) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Active Rentals</h3>
        <button 
          onClick={() => navigate("/owner/rentals")}
          style={{ background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)", border: "none", color: "white", padding: "5px 15px", borderRadius: "15px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
        >
          View All
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", width: "100%" }}>
        {rentals && rentals.length > 0 ? rentals.slice(0, 4).map((rental, index) => (
          <div key={index} style={{ background: "#1e1e24", padding: "20px", borderRadius: "12px", border: "1px solid #333", textAlign: "center" }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "white" }}>{rental.model}</p>
            <div style={{ padding: "5px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontSize: "0.75rem", fontWeight: "bold", marginTop: "10px" }}>
              Currently Rented
            </div>
          </div>
        )) : <p style={{ color: "#666" }}>No active rentals currently.</p>}
      </div>
    </div>
  );
};

export default ActiveRentals;