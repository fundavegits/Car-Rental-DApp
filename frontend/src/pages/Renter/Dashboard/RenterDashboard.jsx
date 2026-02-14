import { useState } from "react";
import "./RenterDashboard.css";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  const initialFilters = { model: "", location: "", startDate: "", endDate: "" };
  const [filters, setFilters] = useState(initialFilters);
  
  // Master state: 'market', 'current', 'history', or null
  const [activeModal, setActiveModal] = useState(null);

  const handleSearch = (searchData) => setFilters(searchData);
  const handleClear = () => setFilters(initialFilters);

  const handleAutoFill = (carDetails) => {
    setFilters(prev => ({ ...prev, model: carDetails.model, location: carDetails.location }));
    setActiveModal(null); // Close modal when selection is made
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="renter-page" style={{ overflowX: "hidden", minHeight: "100vh" }}>
      <div className="renter-container">
        <h1 className="renter-title" style={{ color: "white", marginBottom: "30px" }}>Renter Dashboard</h1>
        
        <div className="renter-section">
          <SearchSection onSearch={handleSearch} onClear={handleClear} currentFilters={filters} />
        </div>

        <div className="renter-section">
          <AvailableCars 
            filters={filters} 
            onAutoFill={handleAutoFill}
            isModalOpen={activeModal === 'market'}
            openModal={() => setActiveModal('market')}
            closeModal={() => setActiveModal(null)}
          />
        </div>

        <div className="renter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginTop: "20px" }}>
          <CurrentRental 
            isModalOpen={activeModal === 'current'}
            openModal={() => setActiveModal('current')}
            closeModal={() => setActiveModal(null)}
          />
          <RentalHistory 
            isModalOpen={activeModal === 'history'}
            openModal={() => setActiveModal('history')}
            closeModal={() => setActiveModal(null)}
          />
        </div>
      </div>
    </div>
  );
}