export default function CurrentRentals({ expanded, data, open, close }) {
  // EXPANDED VIEW: High-end management layout
  if (expanded) {
    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0 }}>Active Rentals</h2>
          <button onClick={close} style={{ background: "#222", color: "white", border: "1px solid #444", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {data.length > 0 ? data.map((car, i) => (
            <div key={i} style={{ padding: "30px", border: "1px solid #333", borderRadius: "24px", background: "#121216" }}>
              <h3 style={{ color: "#a855f7", marginTop: 0 }}>{car.model}</h3>
              <p style={{ color: "#ccc" }}>📍 {car.location}</p>
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #222" }}>
                <small style={{ color: "#888", display: "block" }}>Rental Period Ends:</small>
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {new Date(car.rentalDetails.endDate * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          )) : <p style={{ color: "#666" }}>No active rentals found.</p>}
        </div>
      </div>
    );
  }

  // DASHBOARD PREVIEW: Small grid card
  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222", minHeight: "300px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Current Rentals</h3>
        <button onClick={open} style={{ background: "none", border: "1px solid #7c3aed", color: "#a855f7", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>
          View All ({data.length})
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.slice(0, 4).map((car, i) => (
          <div key={i} style={{ padding: "12px", border: "1px solid #333", borderRadius: "12px", background: "#0e0e11" }}>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>{car.model}</p>
            <small style={{ color: "#22c55e" }}>● Active Now</small>
          </div>
        ))}
        {data.length === 0 && <p style={{ color: "#444", fontSize: "0.9rem" }}>No rentals active.</p>}
      </div>
    </div>
  );
}