import { useState } from "react";
import "./RenterDashboard.css";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  // 1. Initialized state now includes 'model' to match your professional search vision
  const [filters, setFilters] = useState({
    model: "",
    location: "",
    startDate: "",
    endDate: ""
  });

  const handleSearch = (searchData) => {
    // 2. searchData now receives { model, location, startDate, endDate } from SearchSection
    setFilters(searchData);
  };

  return (
    <div className="renter-page">
      <div className="renter-container">
        <h1 className="renter-title">Renter Dashboard</h1>
        
        {/* TOP SECTION: Search Bar with 4 criteria */}
        <div className="renter-section">
          <SearchSection onSearch={handleSearch} />
        </div>

        {/* MIDDLE SECTION: Dynamic Marketplace that filters by Model, Location, and Dates */}
        <div className="renter-section">
          <AvailableCars filters={filters} />
        </div>

        {/* BOTTOM SECTION: Your Active Keys and Transaction History */}
        <div className="renter-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <CurrentRental />
          <RentalHistory />
        </div>
      </div>
    </div>
  );
}