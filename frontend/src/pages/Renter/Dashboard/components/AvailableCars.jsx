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
      
      let filtered = allCars.filter((car) => {
        // 1. Status Filter: Only show Available (0) cars
        const isAvailable = Number(car.status) === 0;

        // 2. Location Filter
        const matchLocation = filters && filters.location
          ? car.location.toLowerCase().includes(filters.location.toLowerCase())
          : true;

        // Note: Model filtering can be added back if needed
        return isAvailable && matchLocation;
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
            /* PASSING FILTERS: Now CarCard knows the selected dates */
            <CarCard 
              key={car.id} 
              car={car} 
              bookingDates={filters} 
            />
          ))}
        </div>
      ) : (
        <NoCars />
      )}
    </div>
  );
}