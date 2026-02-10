import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";

export default function CarCard({ car, bookingDates, onAutoFill }) {
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
  const totalCost = (days > 0) ? (days * parseFloat(car.pricePerDay)).toFixed(4) : "0.0000";

  const handleRentClick = async () => {
    if (!account || !signer) return alert("Connect Wallet!");
    
    // If dates are missing, trigger the Auto-Fill logic instead of the transaction
    if (days === 0) {
      onAutoFill({ model: car.model, location: car.location });
      return;
    }

    try {
      setLoading(true);
      await rentCar(signer, car.id, bookingDates.startDate, bookingDates.endDate, totalCost);
      alert("Success!");
      window.location.reload();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ padding: '20px', border: '1px solid #333', borderRadius: '15px', background: "#1e1e24" }}>
      <h4 style={{ color: "white" }}>{car.model}</h4>
      <p style={{ color: "#888", fontSize: "0.9rem" }}>📍 {car.location}</p>
      <p style={{ color: '#a855f7', fontWeight: "bold", margin: "10px 0" }}>Ξ {car.pricePerDay} / day</p>
      
      {days > 0 ? (
        <div style={{ padding: "10px", background: "rgba(168, 85, 247, 0.1)", borderRadius: "8px", marginBottom: "10px" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#ccc" }}>Total Cost ({days} days):</p>
          <strong style={{ color: "white" }}>{totalCost} ETH</strong>
        </div>
      ) : (
        <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: "10px" }}>* Select dates to calculate total</p>
      )}

      <button 
        onClick={handleRentClick} 
        disabled={loading} 
        className="primary-btn" 
        style={{ 
          width: '100%', 
          background: days > 0 ? "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)" : "#333",
          border: "none",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "Processing..." : days > 0 ? "Rent Now" : "Select Dates"}
      </button>
    </div>
  );
}