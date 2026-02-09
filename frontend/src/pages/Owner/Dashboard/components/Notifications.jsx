import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { listenToAllEvents } from "../../../../context/useCarRental";

export default function Notifications() {
  const { account } = useContext(Web3Context);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!account) return;

    // Connect to the blockchain event stream
    const unsubscribe = listenToAllEvents((data) => {
      const newAlert = {
        id: data.txHash || Date.now(),
        ...data
      };

      // Push to the top of the list
      setAlerts((prev) => [newAlert, ...prev].slice(0, 5));
    });

    return () => unsubscribe();
  }, [account]);

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
      <h3 style={{ margin: "0 0 15px 0" }}>Recent Activity</h3>
      <div className="notifications-list">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} style={{
              background: "#1e1e24",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              borderLeft: `4px solid ${alert.type === 'RENTAL' ? '#10b981' : '#a855f7'}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <strong style={{ color: "white" }}>{alert.title}</strong>
                <span style={{ color: "#666" }}>{alert.time}</span>
              </div>
              <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#ccc" }}>{alert.message}</p>
              {alert.amount && <p style={{ color: "#10b981", fontWeight: "bold", margin: 0, fontSize: "0.8rem" }}>{alert.amount}</p>}
            </div>
          ))
        ) : (
          <p style={{ color: "#666", textAlign: "center", padding: "10px" }}>Monitoring blockchain for new activity...</p>
        )}
      </div>
    </div>
  );
}