import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../context/useCarRental";
import CarCard from "./CarCard";

export default function AvailableCars({ filters }) {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchAllCars();
        // Keep all available cars in state
        setAllCars(all.filter(c => Number(c.status) === 0)); 
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, []); // Only fetch once on mount

  // PROFESSIONAL FILTER LOGIC
  const filteredCars = allCars.filter(car => {
    const matchModel = filters?.model 
      ? car.model.toLowerCase().includes(filters.model.toLowerCase()) 
      : true;
    const matchLocation = filters?.location 
      ? car.location.toLowerCase().includes(filters.location.toLowerCase()) 
      : true;
    
    return matchModel && matchLocation;
  });

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Available Cars</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
            border: "none", color: "white", padding: "8px 18px", borderRadius: "15px",
            cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold"
          }}
        >
          View All ({filteredCars.length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>Searching blockchain...</p>
      ) : filteredCars.length > 0 ? (
        /* Displaying the top row on the dashboard */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredCars.slice(0, 3).map(car => (
            <CarCard key={car.id} car={car} bookingDates={filters} />
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
          No cars match your search criteria.
        </p>
      )}

      {/* VIEW ALL MARKETPLACE MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.95)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999, backdropFilter: "blur(10px)"
        }}>
          <div style={{
            background: "#111", padding: "40px", borderRadius: "20px",
            width: "95%", maxWidth: "1200px", maxHeight: "90vh", overflowY: "auto",
            border: "1px solid #333"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
              <div>
                <h2 style={{ color: "white", margin: 0 }}>Car Marketplace</h2>
                <p style={{ color: "#666", margin: "5px 0 0 0" }}>
                  Showing {filteredCars.length} available vehicles
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: "2.5rem", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} bookingDates={filters} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}