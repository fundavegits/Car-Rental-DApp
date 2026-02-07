import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars } from "../../../context/useCarRental";

export default function OwnerCars() {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate(); 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch owner's cars ---------------- */
  const loadCars = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const allCars = await fetchAllCars();
      const owned = allCars.filter(
        (car) => car.owner.toLowerCase() === account.toLowerCase()
      );
      setCars(owned);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, [account]);

  return (
    <div className="page owner-cars-page" style={{ 
      padding: "2rem", 
      color: "white", 
      background: "#0f0f12", 
      minHeight: "100vh",
      width: "100%", // Ensures the page container uses all horizontal space
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      
      {/* Navigation Button Container */}
      <div style={{ marginBottom: "2rem", width: "100%" }}>
        <button 
          onClick={() => navigate("/owner")}
          style={{
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            border: "1px solid #444",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.15)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 style={{ marginBottom: "2.5rem", fontSize: "2.2rem", fontWeight: "800" }}>
        My Full Fleet
      </h1>

      {loading ? (
        <p style={{ color: "#888" }}>Loading your vehicles...</p>
      ) : (
        /* GRID SYSTEM: 
           'repeat(auto-fill, minmax(350px, 1fr))' is the key fix. 
           It forces cards to sit side-by-side and fill the empty right-hand space.
        */
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "30px",
          width: "100%", 
          margin: "0 auto"
        }}>
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} style={{ 
                background: "linear-gradient(145deg, #1e1e24 0%, #16161a 100%)", 
                padding: "30px", 
                borderRadius: "20px", 
                border: "1px solid #333",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "250px",
                transition: "transform 0.3s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div>
                  <h3 style={{ 
                    marginTop: 0, 
                    color: "#a855f7", 
                    fontSize: "1.6rem", 
                    textTransform: "capitalize" 
                  }}>
                    {car.model}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "1rem" }}>
                    <p style={{ margin: 0, color: "#ccc" }}>
                      <strong>Location:</strong> {car.location || "Not specified"}
                    </p>
                    <p style={{ margin: 0, color: "#ccc" }}>
                      <strong>Price/Day:</strong> <span style={{ color: "#fff" }}>{car.pricePerDay} ETH</span>
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: "25px",
                  padding: "12px",
                  borderRadius: "12px",
                  textAlign: "center",
                  background: car.status === 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: car.status === 0 ? "#22c55e" : "#ef4444",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  border: car.status === 0 ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)"
                }}>
                  {car.status === 0 ? "● Available for Rent" : "● Currently Rented"}
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: "100px", 
              background: "#16161a", 
              borderRadius: "20px",
              border: "1px dashed #444" 
            }}>
              <p style={{ color: "#666", fontSize: "1.2rem" }}>You haven't registered any cars yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}