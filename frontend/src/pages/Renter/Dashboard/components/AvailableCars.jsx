import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../context/useCarRental";
import CarCard from "./CarCard";

export default function AvailableCars({ filters }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchAllCars();
        setCars(all.filter(c => Number(c.status) === 0)); // Only show available
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, [filters]);

  return (
    <div className="card">
      <h3>Available Cars</h3>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {cars.map(car => <CarCard key={car.id} car={car} bookingDates={filters} />)}
        </div>
      )}
    </div>
  );
}