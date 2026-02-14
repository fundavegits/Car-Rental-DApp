import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function CurrentRentals({ expanded, open, close }) {
  const { account } = useContext(Web3Context);
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!account) return;
      setLoading(true);
      try {
        const all = await fetchAllCars();
        const active = [];
        for (const car of all) {
          if (Number(car.status) === 1) {
            const r = await getActiveRental(car.id);
            if (r?.active && r.renter?.toLowerCase() === account.toLowerCase()) active.push({ ...car, rentalDetails: r });
          }
        }
        setRentedCars(active);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, [account]);

  if (expanded) {
    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0 }}>Active Rentals</h2>
          <button onClick={close} style={{ background: "#222", color: "white", border: "1px solid #444", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>Back to Dashboard</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {rentedCars.map((car, i) => (
            <div key={i} style={{ padding: "30px", border: "1px solid #333", borderRadius: "24px", background: "#121216" }}>
              <h3 style={{ color: "#a855f7", marginTop: 0 }}>{car.model}</h3>
              <p style={{ color: "#ccc" }}>📍 {car.location}</p>
              <small style={{ color: "#888" }}>Ends: {new Date(car.rentalDetails.endDate * 1000).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Current Rentals</h3>
        <button onClick={open} style={{ background: "none", border: "1px solid #7c3aed", color: "#a855f7", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>View All</button>
      </div>
      {rentedCars.slice(0, 4).map((car, i) => (
        <div key={i} style={{ padding: "15px", border: "1px solid #333", borderRadius: "12px", background: "#0e0e11", marginBottom: "10px" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>{car.model}</p>
          <small style={{ color: "#22c55e" }}>● Active Now</small>
        </div>
      ))}
    </div>
  );
}