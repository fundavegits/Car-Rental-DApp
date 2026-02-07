import { useState } from "react";
import "./RenterDashboard.css";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  const [filters, setFilters] = useState(null);

  const handleSearch = (searchData) => {
    setFilters(searchData);
  };

  return (
    <div className="renter-page">
      <div className="renter-container">
        <h1 className="renter-title">Renter Dashboard</h1>
        <div className="renter-section">
          {/* Pass the handler to capture search inputs */}
          <SearchSection onSearch={handleSearch} />
        </div>
        <div className="renter-section">
          {/* Pass filters to the list */}
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