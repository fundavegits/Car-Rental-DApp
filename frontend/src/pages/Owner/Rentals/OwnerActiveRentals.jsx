import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllRentals } from "../../../context/useCarRental";

export default function OwnerActiveRentals() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRentals = async () => {
      if (!account) return;
      try {
        setLoading(true);
        const all = await fetchAllRentals();
        // Filter for rentals belonging to this owner that are currently active
        const active = all.filter(r => r.owner.toLowerCase() === account.toLowerCase() && r.isActive);
        setRentals(active);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRentals();
  }, [account]);

  return (
    <div style={{ padding: "3rem", color: "white", background: "#0f0f12", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
        <h1>All Active Rentals</h1>
        <button onClick={() => navigate("/owner")} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid #444", borderRadius: "8px", cursor: "pointer" }}>
          ← Back
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "25px", 
          width: "100%" 
        }}>
          {rentals.map((rental, idx) => (
            <div key={idx} style={{ background: "#1e1e24", padding: "30px", borderRadius: "20px", border: "1px solid #333" }}>
              <h3 style={{ color: "#a855f7", marginTop: 0 }}>{rental.carModel}</h3>
              <p><strong>Renter:</strong> {rental.renter}</p>
              <p><strong>Due Date:</strong> {new Date(rental.expiry * 1000).toLocaleDateString()}</p>
              <div style={{ marginTop: "20px", padding: "10px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", textAlign: "center", borderRadius: "8px", fontWeight: "bold" }}>
                IN PROGRESS
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}