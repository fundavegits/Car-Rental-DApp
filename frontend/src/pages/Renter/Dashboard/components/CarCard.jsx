import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";
import "./CarCard.css";

export default function CarCard({ car, bookingDates }) {
  const { signer, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);

  // SAFE calculation to prevent NaN crashes
  const calculateDays = () => {
    if (!bookingDates?.startDate || !bookingDates?.endDate) return 0;
    
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    
    // Check if dates are valid numbers
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  // Safe cost calculation: only calculate if days is a valid positive number
  const totalCost = (days > 0) 
    ? (days * parseFloat(car.pricePerDay)).toFixed(4) 
    : "0.0000";

  const handleRentClick = async () => {
    if (!account || !signer) {
      alert("Please connect your wallet first!");
      return;
    }
    if (days <= 0) {
      alert("Please select a valid date range first!");
      return;
    }

    try {
      setLoading(true);
      await rentCar(signer, car.id, bookingDates.startDate, bookingDates.endDate, totalCost);
      alert(`Success! Rented ${car.model} for ${days} days.`);
      window.location.reload(); 
    } catch (err) {
      console.error("Rental failed:", err);
      alert(err.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-card">
      <div className="car-info">
        <h4>{car.model}</h4>
        <p>📍 {car.location}</p>
        <p style={{ fontWeight: "bold", color: "#a855f7" }}>Ξ {car.pricePerDay} / day</p>
        
        {days > 0 ? (
          <div style={{ marginTop: "10px", padding: "8px", background: "rgba(168, 85, 247, 0.1)", borderRadius: "8px" }}>
            <p className="text-xs">📅 <strong>{days} Days</strong> | 💰 <strong>{totalCost} ETH</strong></p>
          </div>
        ) : (
          <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "10px" }}>
            No recent activity (Select dates to see price)
          </p>
        )}
      </div>
      
      <button 
        className="primary-btn" 
        onClick={handleRentClick}
        disabled={loading || days <= 0}
        style={{ opacity: (loading || days <= 0) ? 0.6 : 1, width: "100%", marginTop: "10px" }}
      >
        {loading ? "Processing..." : days > 0 ? `Rent Now` : "Select Dates"}
      </button>
    </div>
  );
}