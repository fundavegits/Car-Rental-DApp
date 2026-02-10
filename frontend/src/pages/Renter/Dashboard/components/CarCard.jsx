import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";
import "./CarCard.css";

export default function CarCard({ car, bookingDates }) {
  const { signer, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (!bookingDates?.startDate || !bookingDates?.endDate) return 0;
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();

  // FIX: Use parseFloat (JavaScript math) instead of ethers math.
  // car.pricePerDay is already a string like "0.002"
  const totalCost = (days > 0) 
    ? (days * parseFloat(car.pricePerDay)).toFixed(4) 
    : "0.0000";

  const handleRentClick = async () => {
    if (!account || !signer) return alert("Please connect wallet!");
    if (days <= 0) return alert("Please select a date range!");

    try {
      setLoading(true);
      // We pass totalCost as a string; rentCar handles the parseUnits.
      await rentCar(signer, car.id, bookingDates.startDate, bookingDates.endDate, totalCost);
      alert(`Success! Rented ${car.model}.`);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert(err.message || "Transaction failed");
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
        ) : <p className="text-xs mt-2 text-gray-500 italic">Select dates to see total</p>}
      </div>
      
      <button 
        className="primary-btn" 
        onClick={handleRentClick}
        disabled={loading || days <= 0}
        style={{ width: "100%", marginTop: "10px", opacity: (loading || days <= 0) ? 0.6 : 1 }}
      >
        {loading ? "Processing..." : days > 0 ? `Rent Now` : "Select Dates"}
      </button>
    </div>
  );
}