import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";
import "./CarCard.css";

export default function CarCard({ car }) {
  const { signer, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);

  const handleRentClick = async () => {
    if (!account || !signer) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);

      // Simple 1-day rental logic for testing
      const startTimestamp = Math.floor(Date.now() / 1000); 
      const endTimestamp = startTimestamp + 86400; // + 24 hours in seconds

      // The total price is just the daily rate for this 1-day test
      const totalEth = car.pricePerDay;

      console.log(`Attempting to rent car ${car.id} for ${totalEth} ETH`);

      await rentCar(signer, car.id, startTimestamp, endTimestamp, totalEth);

      alert("Success! Car rented on Sepolia.");
      window.location.reload(); // Refresh to update car status
    } catch (err) {
      console.error("Rental transaction failed:", err);
      alert(err.reason || "Transaction failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-card">
      <div className="car-info">
        <h4>{car.model}</h4>
        <p>📍 {car.location}</p>
        <p>Ξ {car.pricePerDay} / day</p>
        <span className="status available">Available</span>
      </div>
      
      <button 
        className="primary-btn" 
        onClick={handleRentClick}
        disabled={loading}
        style={{ marginTop: "12px", width: "100%", padding: "8px", fontSize: "0.8rem" }}
      >
        {loading ? "Processing..." : "Rent Now"}
      </button>
    </div>
  );
}