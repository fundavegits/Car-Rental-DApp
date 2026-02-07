import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function ActiveRentals() {
  const { account } = useContext(Web3Context);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOwnerActiveRentals = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const allCars = await fetchAllCars();
      
      // Log for debugging - Check your console!
      console.log("All cars fetched:", allCars);
      console.log("My account:", account.toLowerCase());

      const myRentedCars = allCars.filter((car) => {
        const isOwner = car.owner?.toLowerCase() === account.toLowerCase();
        // Check for Status 1 (Rented) - sometimes returned as BigInt
        const isRented = Number(car.status) === 1;
        return isOwner && isRented;
      });

      const detailedRentals = await Promise.all(
        myRentedCars.map(async (car) => {
          try {
            const rental = await getActiveRental(car.id);
            // Only return if rental data exists and is active
            if (rental && rental.active) {
              return { ...car, rentalDetails: rental };
            }
            return null;
          } catch (e) {
            return null;
          }
        })
      );

      // Filter out any nulls from failed detail fetches
      setActiveRentals(detailedRentals.filter(r => r !== null));
    } catch (err) {
      console.error("Error loading active rentals for owner:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerActiveRentals();
    
    // Optional: Refresh every 30 seconds to catch new rentals
    const interval = setInterval(loadOwnerActiveRentals, 30000);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Active Rentals</h3>
        <button className="view-all-btn" onClick={loadOwnerActiveRentals}>
          Refresh
        </button>
      </div>
      
      {loading ? (
        <p>Loading active rentals...</p>
      ) : activeRentals.length > 0 ? (
        <div className="rentals-list">
          {activeRentals.map((rental) => (
            <div key={rental.id} className="rental-item" style={{ padding: "10px", borderBottom: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4>{rental.model}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                    👤 Renter: {rental.rentalDetails.renter.slice(0, 6)}...{rental.rentalDetails.renter.slice(-4)}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                    📅 Return Date: {new Date(rental.rentalDetails.endDate * 1000).toLocaleDateString()}
                  </p>
                </div>
                <span className="status-tag rented" style={{ background: "#ff4757", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem" }}>
                  Currently Rented
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No active rentals at the moment.</p>
      )}
    </div>
  );
}