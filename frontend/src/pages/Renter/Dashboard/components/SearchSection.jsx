import { useState, useEffect } from "react";

export default function SearchSection({ onSearch, onClear, currentFilters }) {
  const [model, setModel] = useState(currentFilters.model);
  const [location, setLocation] = useState(currentFilters.location);
  const [startDate, setStartDate] = useState(currentFilters.startDate);
  const [endDate, setEndDate] = useState(currentFilters.endDate);

  // Sync internal state if the dashboard triggers an auto-fill
  useEffect(() => {
    setModel(currentFilters.model);
    setLocation(currentFilters.location);
    setStartDate(currentFilters.startDate);
    setEndDate(currentFilters.endDate);
  }, [currentFilters]);

  const isFiltered = model || location || startDate || endDate;

  return (
    <div className="card" style={{ padding: "24px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0 }}>Find Your Next Ride</h3>
        {isFiltered && (
          <button 
            onClick={onClear} 
            style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
          >
            ✕ Clear Search
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#666", marginBottom: "5px" }}>Car Model</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model..." style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#111", border: "1px solid #333", color: "white" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#666", marginBottom: "5px" }}>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location..." style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#111", border: "1px solid #333", color: "white" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#666", marginBottom: "5px" }}>Start</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#111", border: "1px solid #333", color: "white" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#666", marginBottom: "5px" }}>End</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#111", border: "1px solid #333", color: "white" }} />
        </div>
        <button 
          onClick={() => onSearch({ model, location, startDate, endDate })}
          className="primary-btn" 
          style={{ height: "42px", borderRadius: "8px", fontWeight: "bold" }}
        >
          Search & Book
        </button>
      </div>
    </div>
  );
}