import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getRenterHistory, fetchAllCars } from "../../../../context/useCarRental";

export default function RentalHistory({ isModalOpen, openModal, closeModal }) {
  const { account } = useContext(Web3Context);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!account) return;
      const [h, cars] = await Promise.all([getRenterHistory(account), fetchAllCars()]);
      setHistory(h.map(item => ({
        ...item,
        model: cars.find(c => c.id === item.carId)?.model || `Car #${item.carId}`
      })).reverse());
    };
    load();
  }, [account]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Rental History</h3>
        <button onClick={openModal} className="view-btn" style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid #7c3aed", color: "#a855f7", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>View All</button>
      </div>

      {history.slice(0, 5).map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #333" }}>
          <p style={{ margin: 0, color: "white", fontSize: "0.9rem" }}>{item.model}</p>
          <span style={{ color: "#a855f7", fontWeight: "bold" }}>Ξ {item.paid}</span>
        </div>
      ))}

      {isModalOpen && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
          backgroundColor: "rgba(0,0,0,0.92)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 99999, backdropFilter: "blur(10px)" 
        }}>
          <div style={{ background: "#0d0d0d", padding: "30px", borderRadius: "20px", width: "95%", maxWidth: "800px", maxHeight: "80vh", overflowY: "auto", border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
              <h2 style={{ color: "white", margin: 0 }}>All Transactions</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }}>&times;</button>
            </div>
            <table style={{ width: "100%", color: "#ccc", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #333", color: "#888" }}>
                  <th style={{ padding: "12px" }}>VEHICLE</th>
                  <th style={{ padding: "12px" }}>DATE</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>PAID</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "12px" }}>{item.model}</td>
                    <td style={{ padding: "12px" }}>{new Date(item.endDate * 1000).toLocaleDateString()}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: "#a855f7" }}>{item.paid} ETH</td>
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