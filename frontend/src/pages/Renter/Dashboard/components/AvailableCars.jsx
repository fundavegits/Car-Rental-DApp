import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../context/useCarRental";
import CarCard from "./CarCard";
import NoCars from "./NoCars";

export default function AvailableCars({ filters }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        const filtered = allCars.filter((car) => {
          const isAvailable = Number(car.status) === 0;
          const matchLocation = filters?.location
            ? car.location.toLowerCase().includes(filters.location.toLowerCase())
            : true;
          return isAvailable && matchLocation;
        });
        setCars(filtered);
      } catch (error) {
        console.error("Load Cars Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, [filters]); 

  if (loading) return <div className="card"><h3>Available Cars</h3><p>Loading...</p></div>;

  return (
    <div className="card">
      <h3>Available Cars</h3>
      {cars.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} bookingDates={filters} />
          ))}
        </div>
      ) : <NoCars />}
    </div>
  );
}