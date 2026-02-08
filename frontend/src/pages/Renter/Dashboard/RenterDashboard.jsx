import { useState } from "react";
import "./RenterDashboard.css";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  // Enhanced filters state to track dates and location
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    endDate: ""
  });

  const handleSearch = (searchData) => {
    // searchData should contain { location, startDate, endDate }
    setFilters(searchData);
  };

  return (
    <div className="renter-page">
      <div className="renter-container">
        <h1 className="renter-title">Renter Dashboard</h1>
        
        <div className="renter-section">
          <SearchSection onSearch={handleSearch} />
        </div>

        <div className="renter-section">
          {/* We pass the global selected dates to AvailableCars */}
          <AvailableCars filters={filters} />
        </div>

        <div className="renter-grid">
          <CurrentRental />
          <RentalHistory />
        </div>
      </div>
    </div>
  );
}