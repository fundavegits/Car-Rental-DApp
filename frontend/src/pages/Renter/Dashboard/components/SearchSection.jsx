import { forwardRef, useImperativeHandle, useRef } from "react";

const SearchSection = forwardRef(({ onSearch, onClear, currentFilters }, ref) => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusStartDate: () => {
      if (startDateRef.current) {
        startDateRef.current.focus();
        if (startDateRef.current.showPicker) startDateRef.current.showPicker();
      }
    }
  }));

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    onSearch({ ...currentFilters, startDate: val });
    if (val) {
      setTimeout(() => {
        if (endDateRef.current) {
          endDateRef.current.focus();
          if (endDateRef.current.showPicker) endDateRef.current.showPicker();
        }
      }, 100);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #333",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box" // Fixes border clipping
  };

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
      <h3 style={{ marginTop: 0, color: "white" }}>Find Your Next Ride</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "end" }}>
        <div className="input-wrap">
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Car Model</label>
          <input type="text" className="dash-input" value={currentFilters.model} onChange={(e) => onSearch({...currentFilters, model: e.target.value})} style={inputStyle} />
        </div>
        <div className="input-wrap">
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Location</label>
          <input type="text" className="dash-input" value={currentFilters.location} onChange={(e) => onSearch({...currentFilters, location: e.target.value})} style={inputStyle} />
        </div>
        <div className="input-wrap">
          <label style={{ fontSize: "0.8rem", color: "#888" }}>Start Date</label>
          <input ref={startDateRef} type="date" className="dash-input" value={currentFilters.startDate} onChange={handleStartDateChange} style={inputStyle} />
        </div>
        <div className="input-wrap">
          <label style={{ fontSize: "0.8rem", color: "#888" }}>End Date</label>
          <input ref={endDateRef} type="date" className="dash-input" value={currentFilters.endDate} onChange={(e) => onSearch({...currentFilters, endDate: e.target.value})} style={inputStyle} />
        </div>
        <button onClick={onClear} style={{ padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", height: "42px" }}>Clear</button>
      </div>

      <style>{`
        .dash-input:focus {
          border-color: white !important;
          box-shadow: 0 0 0 1px white; /* Forces right border visibility */
          z-index: 5;
          position: relative;
        }
        .input-wrap { position: relative; }
      `}</style>
    </div>
  );
});

export default SearchSection;