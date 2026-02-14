import { forwardRef, useImperativeHandle, useRef } from "react";

const SearchSection = forwardRef(({ onSearch, onClear, currentFilters }, ref) => {
  const startDateRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusStartDate: () => {
      if (startDateRef.current) {
        startDateRef.current.focus();
        if (startDateRef.current.showPicker) startDateRef.current.showPicker();
      }
    }
  }));

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
      <h3 style={{ marginTop: 0 }}>Find Your Next Ride</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "end" }}>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Car Model</label>
          <input type="text" value={currentFilters.model} onChange={(e) => onSearch({...currentFilters, model: e.target.value})} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Location</label>
          <input type="text" value={currentFilters.location} onChange={(e) => onSearch({...currentFilters, location: e.target.value})} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Start Date</label>
          <input ref={startDateRef} type="date" value={currentFilters.startDate} onChange={(e) => onSearch({...currentFilters, startDate: e.target.value})} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#888" }}>End Date</label>
          <input type="date" value={currentFilters.endDate} onChange={(e) => onSearch({...currentFilters, endDate: e.target.value})} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "8px" }} />
        </div>
        <button onClick={onClear} style={{ padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Clear</button>
      </div>
    </div>
  );
});

export default SearchSection;