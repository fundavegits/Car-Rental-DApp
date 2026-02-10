import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function CurrentRental() {
  const { account } = useContext(Web3Context);
  const [activeCar, setActiveCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevents updating state if user leaves page

    const findMyActiveRental = async () => {
      // Safety check: if no account, we can't look for rentals
      if (!account) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        let found = null;

        for (const car of allCars) {
          // Status 1 means the car is currently Rented
          if (Number(car.status) === 1) {
            const rental = await getActiveRental(car.id);
            
            // SAFE CHECK: Ensure rental exists and account is valid before toLowerCase()
            if (
              rental && 
              rental.active && 
              rental.renter?.toLowerCase() === account?.toLowerCase()
            ) {
              found = { ...car, rentalDetails: rental };
              break;
            }
          }
        }

        if (isMounted) setActiveCar(found);
      } catch (err) {
        console.error("Error fetching current rental:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    findMyActiveRental();
    return () => { isMounted = false; }; // Cleanup
  }, [account]);

  return (
    <div className="card">
      <h3>Current Rental</h3>
      {loading ? (
        <p>Checking active rentals...</p>
      ) : activeCar ? (
        <div style={{ marginTop: "12px", padding: "12px", border: "1px solid #444", borderRadius: "8px" }}>
          <h4 style={{ color: "#a855f7" }}>{activeCar.model}</h4>
          <p style={{ fontSize: "0.9rem" }}>📍 {activeCar.location}</p>
          {/* Safety check for the date conversion */}
          <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
            📅 <strong>Ends:</strong> {activeCar.rentalDetails?.endDate 
              ? new Date(activeCar.rentalDetails.endDate * 1000).toLocaleDateString() 
              : "N/A"}
          </p>
          <div style={{ marginTop: "10px" }}>
             <span className="status-badge" style={{ background: "#22c55e", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem" }}>
               Active Now
             </span>
          </div>
        </div>
      ) : (
        <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>No active rental found.</p>
      )}
    </div>
  );
}