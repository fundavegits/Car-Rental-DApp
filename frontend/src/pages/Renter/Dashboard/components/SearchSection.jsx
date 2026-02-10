import { useState } from "react";

export default function SearchSection({ onSearch }) {
  const [model, setModel] = useState(""); // New state for Car Model
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearchTrigger = () => {
    // Send all four pieces of criteria up to the RenterDashboard
    onSearch({
      model,
      location,
      startDate,
      endDate
    });
  };

  return (
    <div className="card" style={{ padding: "24px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "15px", border: "1px solid #222" }}>
      <h3 style={{ marginBottom: "16px", color: "white" }}>Find Your Next Ride</h3>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
        gap: "16px", 
        alignItems: "flex-end" 
      }}>
        
        {/* NEW: Car Model Input */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            Car Model
          </label>
          <input
            type="text"
            placeholder="e.g. BMW, Tesla..."
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "white"
            }}
          />
        </div>

        {/* Location Input */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            Pickup Location
          </label>
          <input
            type="text"
            placeholder="e.g. Bali, Delhi..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "white"
            }}
          />
        </div>

        {/* Start Date Input */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "white"
            }}
          />
        </div>

        {/* End Date Input */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "8px", color: "#aaa" }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "white"
            }}
          />
        </div>

        <button
          onClick={handleSearchTrigger}
          className="primary-btn"
          style={{
            background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
            border: "none", color: "white", padding: "12px", borderRadius: "10px",
            height: "48px", fontWeight: "bold", cursor: "pointer"
          }}
        >
          Search & Book
        </button>
      </div>
    </div>
  );
}