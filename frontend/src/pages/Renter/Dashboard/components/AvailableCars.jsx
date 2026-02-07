import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../context/useCarRental";
import CarCard from "./CarCard";
import NoCars from "./NoCars";

export default function AvailableCars({ filters }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    setLoading(true);
    try {
      const allCars = await fetchAllCars();
      
      // DEBUG: Check the status of cars coming from the blockchain
      console.log("Raw cars from chain:", allCars);

      let filtered = allCars.filter((car) => {
        /**
         * 1. Status Filter: Only show cars that are available.
         * In most Smart Contracts: 0 = Available, 1 = Booked/Rented.
         * We check both string and number just in case.
         */
        const isAvailable = car.status === "Available" || Number(car.status) === 0;

        // 2. Search Filters (Model and Location)
        const matchModel = filters && filters.model
          ? car.model.toLowerCase().includes(filters.model.toLowerCase())
          : true;
        
        const matchLocation = filters && filters.location
          ? car.location.toLowerCase().includes(filters.location.toLowerCase())
          : true;

        return isAvailable && matchModel && matchLocation;
      });
      
      setCars(filtered);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, [filters]); 

  if (loading) return (
    <div className="card">
      <h3>Available Cars</h3>
      <p>Loading cars from blockchain...</p>
    </div>
  );

  return (
    <div className="card">
      <h3>Available Cars</h3>
      {cars.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <NoCars />
      )}
    </div>
  );
}