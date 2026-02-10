import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getRenterHistory } from "../../../../context/useCarRental";

export default function RentalHistory() {
  const { account } = useContext(Web3Context);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!account) return;
      setLoading(true);
      try {
        const data = await getRenterHistory(account);
        setHistory(data);
      } catch (err) {
        console.error("Error loading rental history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [account]);

  return (
    <div className="card">
      <h3>Your Rental History</h3>
      {loading ? (
        <p>Loading history...</p>
      ) : history.length > 0 ? (
        <div className="history-list" style={{ marginTop: "12px" }}>
          {history.map((rental, index) => (
            <div key={index} style={{ padding: "10px", borderBottom: "1px solid #333", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Car ID: {rental.carId}</span>
                <span style={{ color: "#a855f7", fontWeight: "bold" }}>Ξ {rental.paid}</span>
              </div>
              <p style={{ color: "#999", fontSize: "0.75rem", margin: "4px 0" }}>
                {new Date(rental.startDate * 1000).toLocaleDateString()} - {new Date(rental.endDate * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic" }}>No past rentals found.</p>
      )}
    </div>
  );
}