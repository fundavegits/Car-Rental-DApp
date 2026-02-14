import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getRenterHistory, fetchAllCars } from "../../../../context/useCarRental";

export default function RentalHistory() {
  const { account } = useContext(Web3Context);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. DATA LOADING LOGIC (Preserved exactly from your original)
  useEffect(() => {
    const loadHistoryData = async () => {
      if (!account) return;
      setLoading(true);
      try {
        // Fetch both history and all cars to match IDs to names
        const [historyData, allCars] = await Promise.all([
          getRenterHistory(account),
          fetchAllCars()
        ]);

        const detailedHistory = historyData.map(item => {
          const carMatch = allCars.find(c => c.id === item.carId);
          return {
            ...item,
            model: carMatch ? carMatch.model : `Car #${item.carId}`,
            location: carMatch ? carMatch.location : "N/A"
          };
        });

        setHistory(detailedHistory.reverse()); // Show most recent first
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistoryData();
  }, [account]);

  // 2. SCROLL LOCK LOGIC: Stops the "messy" background from moving
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isModalOpen]);

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Rental History</h3>
        {history.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              border: "1px solid #7c3aed", color: "#a855f7", padding: "6px 12px", borderRadius: "8px",
              cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold"
            }}
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>Loading history...</p>
      ) : history.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Preview: Last 5 items */}
          {history.slice(0, 5).map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #333" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold", color: "white" }}>{item.model}</p>
                <small style={{ color: "#666" }}>{new Date(item.endDate * 1000).toLocaleDateString()}</small>
              </div>
              <span style={{ color: "#a855f7", fontWeight: "bold" }}>Ξ {item.paid}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic" }}>No history found.</p>
      )}

      {/* 3. MODAL: UPDATED WITH BULLTEPROOF VIEWPORT CSS */}
      {isModalOpen && (
        <div style={{
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          width: "100vw", // Viewport Width
          height: "100vh", // Viewport Height
          backgroundColor: "rgba(0,0,0,0.92)", 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center", 
          zIndex: 99999, // Force to the top layer
          backdropFilter: "blur(12px)",
          padding: "20px"
        }}>
          <div style={{
            background: "#0d0d0d", 
            padding: "30px", 
            borderRadius: "20px",
            width: "100%", 
            maxWidth: "800px", 
            maxHeight: "85vh", 
            overflowY: "auto",
            border: "1px solid #333", 
            boxShadow: "0 20px 60px rgba(0,0,0,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0 }}>All Transactions</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: "none", border: "none", color: "white", fontSize: "2.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <table style={{ width: "100%", color: "#ccc", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #333", color: "#888", fontSize: "0.85rem" }}>
                  <th style={{ padding: "12px" }}>VEHICLE</th>
                  <th style={{ padding: "12px" }}>RENTAL PERIOD</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "15px 12px" }}>
                      <div style={{ fontWeight: "bold", color: "white" }}>{item.model}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>ID: {item.carId}</div>
                    </td>
                    <td style={{ padding: "15px 12px", fontSize: "0.85rem" }}>
                      {new Date(item.startDate * 1000).toLocaleDateString()} - {new Date(item.endDate * 1000).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "15px 12px", textAlign: "right", color: "#a855f7", fontWeight: "bold" }}>
                      {item.paid} ETH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}