import React, { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function ActiveRentals() {
  const { account } = useContext(Web3Context);
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveRentals = async () => {
      if (!account) return;
      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        // 1. Filter cars owned by user that are currently "Rented" (Status 1)
        const myRentedCars = allCars.filter(
          (car) => car.owner.toLowerCase() === account.toLowerCase() && Number(car.status) === 1
        );

        // 2. Fetch the specific rental details for each rented car
        const detailedCars = await Promise.all(
          myRentedCars.map(async (car) => {
            const details = await getActiveRental(car.id);
            return { ...car, rentalDetails: details };
          })
        );

        setRentedCars(detailedCars);
      } catch (err) {
        console.error("Error fetching active rentals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRentals();
  }, [account]);

  return (
    <div className="owner-section">
      <div className="section-header">
        <h3>Active Rentals</h3>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="cars-grid">
        {loading ? (
          <p className="loading-text">Loading active rentals...</p>
        ) : rentedCars.length > 0 ? (
          rentedCars.map((car) => (
            /* Updated Design: Matching 'My Registered Cars' layout */
            <div key={car.id} className="car-card-mini">
              <div className="car-card-content">
                <h4 className="car-model-title">{car.model}</h4>
                <div className="status-container">
                  <span className="pulse-dot"></span>
                  <p className="status-text rented">Currently Rented</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-text">No cars are currently out on rent.</p>
        )}
      </div>

      {/* Internal Styles to ensure exact match with your screenshot */}
      <style jsx>{`
        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .car-card-mini {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(75, 85, 99, 0.4);
          border-radius: 12px;
          padding: 24px;
          transition: transform 0.2s, border-color 0.2s;
          text-align: center;
        }
        .car-card-mini:hover {
          border-color: #a855f7;
          transform: translateY(-2px);
        }
        .car-model-title {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        .status-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .status-text.rented {
          color: #f87171; /* Matching the reddish/pink rented text in your screenshot */
          font-size: 0.85rem;
          font-weight: 500;
        }
        .pulse-dot {
          height: 6px;
          width: 6px;
          background-color: #f87171;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.7);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(248, 113, 113, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
      `}</style>
    </div>
  );
}