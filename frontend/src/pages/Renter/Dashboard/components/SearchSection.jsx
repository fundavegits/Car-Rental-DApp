import { useState } from "react";

export default function SearchSection({ onSearch }) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearchTrigger = () => {
    // We send all three pieces of data up to the RenterDashboard
    onSearch({
      location,
      startDate,
      endDate
    });
  };

  return (
    <div className="card" style={{ padding: "24px" }}>
      <h3 style={{ marginBottom: "16px" }}>Find Your Next Ride</h3>
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        flexWrap: "wrap", 
        alignItems: "flex-end" 
      }}>
        {/* Location Input */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            Pickup Location
          </label>
          <input
            type="text"
            placeholder="e.g. New York, London..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #333",
              color: "white"
            }}
          />
        </div>

        {/* Start Date Input */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]} // Prevents picking past dates
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #333",
              color: "white"
            }}
          />
        </div>

        {/* End Date Input */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]} // Must be after start date
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #333",
              color: "white"
            }}
          />
        </div>

        <button
          onClick={handleSearchTrigger}
          className="primary-btn"
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            height: "48px",
            fontWeight: "bold"
          }}
        >
          Search & Book
        </button>
      </div>
    </div>
  );
}