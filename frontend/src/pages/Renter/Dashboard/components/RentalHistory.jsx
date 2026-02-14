export default function RentalHistory({ expanded, data, open, close }) {
  if (expanded) {
    return (
      <div className="focus-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0 }}>Rental History</h2>
          <button onClick={close} style={{ background: "#222", color: "white", border: "1px solid #444", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#121216", borderRadius: "20px", overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#1c1c21", color: "#888" }}>
              <th style={{ padding: "20px" }}>VEHICLE</th>
              <th style={{ padding: "20px" }}>DATE</th>
              <th style={{ padding: "20px", textAlign: "right" }}>PAID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "20px" }}><strong>{item.model}</strong></td>
                <td style={{ padding: "20px" }}>{new Date(item.endDate * 1000).toLocaleDateString()}</td>
                <td style={{ padding: "20px", textAlign: "right", color: "#a855f7" }}>{item.paid} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Rental History</h3>
        <button onClick={open} style={{ background: "none", border: "1px solid #7c3aed", color: "#a855f7", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>
          View All
        </button>
      </div>
      {data.slice(0, 5).map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #333" }}>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>{item.model}</p>
          <span style={{ color: "#a855f7", fontWeight: "bold" }}>Ξ {item.paid}</span>
        </div>
      ))}
    </div>
  );
}