import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getRenterHistory } from "../../../../context/useCarRental";
import { ethers } from "ethers";

export default function RentalHistory() {
  const { account } = useContext(Web3Context);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!account) return;
      setLoading(true);
      try {
        const pastRentals = await getRenterHistory(account);
        // Reverse to show the most recent transaction at the top
        setHistory([...pastRentals].reverse());
      } catch (err) {
        console.error("Error fetching rental history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [account]);

  return (
    <div className="card">
      <h3>Rental History</h3>
      {loading ? (
        <p>Loading past trips...</p>
      ) : history.length > 0 ? (
        <div style={{ marginTop: "12px", maxHeight: "300px", overflowY: "auto" }}>
          {history.map((trip, index) => (
            <div key={index} style={{ 
              marginBottom: "12px", 
              borderBottom: "1px solid #333", 
              paddingBottom: "8px" 
            }}>
              <p style={{ fontSize: "0.9rem" }}><strong>Car ID:</strong> {trip.carId.toString()}</p>
              <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
                💰 Paid: {trip.paid ? `${ethers.formatEther(trip.paid)} ETH` : "Confirmed"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No past rentals.</p>
      )}
    </div>
  );
}