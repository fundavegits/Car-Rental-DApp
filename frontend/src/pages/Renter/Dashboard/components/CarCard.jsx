import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";
import "./CarCard.css";

// Receiving bookingDates (filters) from AvailableCars parent
export default function CarCard({ car, bookingDates }) {
  const { signer, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);

  // 1. SAFE calculation of the number of days selected
  const calculateDays = () => {
    // Check if dates exist and are not empty strings
    if (!bookingDates?.startDate || !bookingDates?.endDate) return 0;
    
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    
    // Check if the dates are valid Date objects (prevents NaN crash)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    // Difference in milliseconds
    const diffTime = end - start;
    // Convert to days (rounding up to ensure at least 1 day)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();

  // 2. SAFE calculation of the total cost in ETH
  // Only calculate if days is a valid positive number to avoid UI breaks
  const totalCost = (days > 0) 
    ? (days * parseFloat(car.pricePerDay)).toFixed(4) 
    : "0.0000";

  const handleRentClick = async () => {
    if (!account || !signer) {
      alert("Please connect your wallet first!");
      return;
    }

    if (days <= 0) {
      alert("Please select a valid date range in the search section first!");
      return;
    }

    try {
      setLoading(true);

      // Pass the actual dates from filters to our context function
      await rentCar(
        signer, 
        car.id, 
        bookingDates.startDate, 
        bookingDates.endDate, 
        totalCost
      );

      alert(`Success! Rented ${car.model} for ${days} days.`);
      window.location.reload(); 
    } catch (err) {
      console.error("Rental transaction failed:", err);
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
        
        {/* 3. Display specific booking details to the user with safety fallback */}
        {days > 0 ? (
          <div style={{ marginTop: "10px", padding: "8px", background: "rgba(168, 85, 247, 0.1)", borderRadius: "8px", fontSize: "0.8rem" }}>
            <p style={{ margin: 0 }}>📅 <strong>{days} Days</strong> selected</p>
            <p style={{ margin: 0 }}>💰 Total: <strong>{totalCost} ETH</strong></p>
          </div>
        ) : (
          <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "10px", fontStyle: "italic" }}>
            Select dates to see total price
          </p>
        )}
      </div>
      
      <button 
        className="primary-btn" 
        onClick={handleRentClick}
        // Disable button if no valid dates are picked or during loading
        disabled={loading || days <= 0}
        style={{ 
          marginTop: "12px", 
          width: "100%", 
          padding: "10px", 
          fontSize: "0.85rem",
          opacity: (loading || days <= 0) ? 0.6 : 1,
          cursor: (loading || days <= 0) ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Processing..." : days > 0 ? `Rent for ${totalCost} ETH` : "Select Dates"}
      </button>
    </div>
  );
}