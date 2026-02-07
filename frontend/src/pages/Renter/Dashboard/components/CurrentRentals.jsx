import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function CurrentRental() {
  const { account } = useContext(Web3Context);
  const [activeCar, setActiveCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findMyActiveRental = async () => {
      if (!account) return;
      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        // Look for a car where the status is 1 (Rented) 
        // and check if the current user is the renter
        for (const car of allCars) {
          if (Number(car.status) === 1) {
            const rental = await getActiveRental(car.id);
            if (rental && rental.renter.toLowerCase() === account.toLowerCase() && rental.active) {
              setActiveCar({ ...car, rentalDetails: rental });
              break;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching current rental:", err);
      } finally {
        setLoading(false);
      }
    };

    findMyActiveRental();
  }, [account]);

  return (
    <div className="card">
      <h3>Current Rental</h3>
      {loading ? (
        <p>Checking active rentals...</p>
      ) : activeCar ? (
        <div style={{ marginTop: "12px", padding: "12px", border: "1px solid #444", borderRadius: "8px" }}>
          <h4>{activeCar.model}</h4>
          <p>📍 {activeCar.location}</p>
          <p>📅 Ends: {new Date(activeCar.rentalDetails.endDate * 1000).toLocaleDateString()}</p>
          <span className="status rented">Active Now</span>
        </div>
      ) : (
        <p>No active rental found.</p>
      )}
    </div>
  );
}