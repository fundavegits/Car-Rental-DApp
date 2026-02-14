import { useState } from "react";
import "./RenterDashboard.css";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  const initialFilters = { model: "", location: "", startDate: "", endDate: "" };
  const [filters, setFilters] = useState(initialFilters);
  
  // 'market', 'current', 'history', or null
  const [activeView, setActiveView] = useState(null);

  const handleAutoFill = (carDetails) => {
    setFilters(prev => ({ ...prev, model: carDetails.model, location: carDetails.location }));
    setActiveView(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="renter-page" style={{ minHeight: "100vh", backgroundColor: "#0b0b0d", color: "white" }}>
      <div className="renter-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <h1 className="renter-title" style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "40px" }}>
          Renter Dashboard
        </h1>

        {/* --- FOCUS MODE VIEW --- */}
        {activeView === 'market' && (
          <AvailableCars expanded={true} filters={filters} onAutoFill={handleAutoFill} close={() => setActiveView(null)} />
        )}
        
        {activeView === 'current' && (
          <CurrentRental expanded={true} close={() => setActiveView(null)} />
        )}

        {activeView === 'history' && (
          <RentalHistory expanded={true} close={() => setActiveView(null)} />
        )}

        {/* --- STANDARD DASHBOARD GRID --- */}
        {!activeView && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SearchSection onSearch={setFilters} onClear={() => setFilters(initialFilters)} currentFilters={filters} />

            <AvailableCars expanded={false} filters={filters} onAutoFill={handleAutoFill} open={() => setActiveView('market')} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
              <CurrentRental expanded={false} open={() => setActiveView('current')} />
              <RentalHistory expanded={false} open={() => setActiveView('history')} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}