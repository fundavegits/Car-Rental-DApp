import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../context/Web3Context";
import { 
  fetchAllCars, 
  updateCarDetails, 
  setCarUnavailable 
} from "../../../context/useCarRental";
import "../../../styles/layout.css";
import "./OwnerCars.css";

export default function OwnerCars() {
  const { account, signer } = useContext(Web3Context);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const allCars = await fetchAllCars();
      // Filter: Match owner AND status 0 (Available)
      const ownerAvailableCars = allCars
        .filter(
          (car) =>
            car.owner.toLowerCase() === account.toLowerCase() &&
            Number(car.status) === 0
        )
        .map((car) => ({
          id: car.id,
          model: car.model,
          location: car.location, // Property name from useCarRental.js
          pricePerDay: car.pricePerDay,
        }));

      setCars(ownerAvailableCars);
    } catch (err) {
      console.error("Failed to load owner cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, [account]);

  const handleUpdate = async (carId, newLoc, newPrice) => {
    try {
      await updateCarDetails(signer, carId, newLoc, newPrice);
      alert("Car updated successfully!");
      loadCars();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Check console.");
    }
  };

  const handleMakeUnavailable = async (carId) => {
    try {
      await setCarUnavailable(signer, carId);
      alert("Car is now unavailable.");
      loadCars();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  if (!account) return <div className="owner-page">Please connect your wallet.</div>;

  return (
    <div className="owner-page">
      <h1 className="owner-title">My Cars</h1>
      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No available cars to manage.</p>
      ) : (
        <div className="owner-section">
          <div className="owner-grid">
            {cars.map((car) => (
              <div key={car.id} className="register-car-card">
                <h3 style={{ marginBottom: "16px" }}>{car.model}</h3>
                <div className="register-form">
                  <label>Pickup Location</label>
                  <input
                    type="text"
                    id={`loc-${car.id}`}
                    defaultValue={car.location}
                  />
                </div>
                <div className="register-form">
                  <label>Price per day (ETH)</label>
                  <input
                    type="text"
                    id={`price-${car.id}`}
                    defaultValue={car.pricePerDay}
                  />
                </div>
                <div className="car-actions-row">
                  <button 
                    className="primary-btn small-btn"
                    onClick={() => {
                      const l = document.getElementById(`loc-${car.id}`).value;
                      const p = document.getElementById(`price-${car.id}`).value;
                      handleUpdate(car.id, l, p);
                    }}
                  >
                    Save
                  </button>
                  <button 
                    className="secondary-btn small-btn"
                    onClick={() => handleMakeUnavailable(car.id)}
                  >
                    Unavailable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}