import { useContext, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { rentCar } from "../../../../context/useCarRental";

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
  // SAFE MATH: car.pricePerDay is already "0.002"
  const totalCost = (days > 0) ? (days * parseFloat(car.pricePerDay)).toFixed(4) : "0.0000";

  const handleRentClick = async () => {
    if (!account || !signer) return alert("Connect Wallet!");
    try {
      setLoading(true);
      await rentCar(signer, car.id, bookingDates.startDate, bookingDates.endDate, totalCost);
      alert("Success!");
      window.location.reload();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ padding: '15px', border: '1px solid #333', marginBottom: '10px' }}>
      <h4>{car.model}</h4>
      <p>📍 {car.location}</p>
      <p style={{ color: '#a855f7' }}>Ξ {car.pricePerDay} / day</p>
      {days > 0 && <p><strong>Total: {totalCost} ETH</strong></p>}
      <button onClick={handleRentClick} disabled={loading || days === 0} className="primary-btn" style={{ width: '100%', marginTop: '10px' }}>
        {loading ? "Processing..." : "Rent Now"}
      </button>
    </div>
  );
}