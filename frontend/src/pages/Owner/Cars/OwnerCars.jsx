import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars, toggleCarAvailability } from "../../../context/useCarRental";

export default function OwnerCars() {
  const { account, signer } = useContext(Web3Context);
  const navigate = useNavigate(); 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Tracks specific carId being updated

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

  const handleToggle = async (carId, currentStatus) => {
    if (!signer) return alert("Please connect your wallet first.");
    try {
      setActionLoading(carId);
      // Logic: If status is 0 (Available), isCurrentlyAvailable is true -> trigger Hide.
      // If status is 2 (Hidden), isCurrentlyAvailable is false -> trigger Show.
      const isAvailable = Number(currentStatus) === 0;
      await toggleCarAvailability(signer, carId, isAvailable);
      await loadCars(); // Refresh the fleet data from the blockchain
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    loadCars();
  }, [account]);

  return (
    <div className="page owner-cars-page" style={{ 
      padding: "40px", 
      color: "white", 
      background: "#0f0f12", 
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box"
    }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold" }}>My Full Fleet</h1>
        <button 
          onClick={() => navigate("/owner")}
          style={{
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid #444",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading fleet from blockchain...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "30px",
          width: "100%" 
        }}>
          {cars.map((car) => {
            const status = Number(car.status);
            const isProcessing = actionLoading === car.id;

            return (
              <div key={car.id} style={{ 
                background: "linear-gradient(145deg, #1e1e24 0%, #16161a 100%)", 
                padding: "30px", 
                borderRadius: "20px", 
                border: "1px solid #333",
                boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "280px"
              }}>
                <div>
                  <h3 style={{ marginTop: 0, color: "#a855f7", fontSize: "1.6rem" }}>{car.model}</h3>
                  <p style={{ color: "#ccc" }}>Location: {car.location || "Not specified"}</p>
                  <p><strong>Price:</strong> {car.pricePerDay} ETH / Day</p>
                </div>
                
                <div style={{ marginTop: "20px" }}>
                  {status === 1 ? (
                    /* RENTED STATE: Static Badge */
                    <div style={{
                      padding: "12px",
                      borderRadius: "12px",
                      textAlign: "center",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      fontWeight: "bold",
                      border: "1px solid #ef4444"
                    }}>
                      ● Currently Rented
                    </div>
                  ) : (
                    /* AVAILABLE (0) OR HIDDEN (2) STATES: Toggle Button */
                    <button
                      disabled={isProcessing}
                      onClick={() => handleToggle(car.id, status)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        textAlign: "center",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        background: status === 0 ? "rgba(239, 68, 68, 0.05)" : "rgba(34, 197, 94, 0.1)",
                        color: status === 0 ? "#ef4444" : "#22c55e",
                        fontWeight: "bold",
                        border: status === 0 ? "1px solid #ef4444" : "1px solid #22c55e",
                        transition: "0.3s",
                        opacity: isProcessing ? 0.6 : 1,
                        outline: "none"
                      }}
                    >
                      {isProcessing ? "Processing..." : (status === 0 ? "Hide from Market" : "Make Available")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}