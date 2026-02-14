import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../context/useCarRental";
import CarCard from "./CarCard";

export default function AvailableCars({ filters, onAutoFill }) {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. FETCH DATA FROM BLOCKCHAIN
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchAllCars();
        // Only show cars with status 0 (Available)
        setAllCars(all.filter(c => Number(c.status) === 0)); 
      } catch (e) { 
        console.error("Blockchain Fetch Error:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, []);

  // 2. SCROLL LOCK LOGIC: Prevents background mess when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isModalOpen]);

  // 3. MULTI-CRITERIA FILTER LOGIC
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
    <div className="card" style={{ 
      background: "rgba(255, 255, 255, 0.05)", 
      padding: "20px", 
      borderRadius: "15px", 
      border: "1px solid #222" 
    }}>
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Available Cars</h3>
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

      {/* DASHBOARD PREVIEW GRID */}
      {loading ? (
        <p style={{ color: "#666" }}>Searching blockchain...</p>
      ) : filteredCars.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredCars.slice(0, 3).map(car => (
            <CarCard 
              key={car.id} 
              car={car} 
              bookingDates={filters} 
              onAutoFill={onAutoFill} 
            />
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
          No cars match your search criteria.
        </p>
      )}

      {/* 4. THE FIXED MARKETPLACE MODAL (FULL SCREEN) */}
      {isModalOpen && (
        <div style={{
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", // Viewport width: covers entire browser
          height: "100vh", // Viewport height: covers entire browser
          backgroundColor: "rgba(0,0,0,0.95)", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          zIndex: 99999, // Highest priority layer
          backdropFilter: "blur(15px)" 
        }}>
          <div style={{
            background: "#0a0a0c", 
            padding: "40px", 
            borderRadius: "24px",
            width: "90%", 
            maxWidth: "1200px", 
            maxHeight: "85vh", 
            overflowY: "auto",
            border: "1px solid #333", 
            boxShadow: "0 0 50px rgba(0,0,0,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
              <div>
                <h2 style={{ color: "white", margin: 0 }}>Car Marketplace</h2>
                <p style={{ color: "#666", margin: "5px 0 0 0" }}>Browse all available vehicles</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: "none", border: "none", color: "white", fontSize: "2.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredCars.map(car => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  bookingDates={filters} 
                  onAutoFill={(data) => {
                    onAutoFill(data);
                    setIsModalOpen(false); // Close modal when auto-filling search
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}