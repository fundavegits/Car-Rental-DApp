import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function CurrentRentals({ isModalOpen, openModal, closeModal }) {
  const { account } = useContext(Web3Context);
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const findAllMyRentals = async () => {
      if (!account) { setLoading(false); return; }
      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        const activeRentalsFound = [];
        for (const car of allCars) {
          if (Number(car.status) === 1) {
            const rental = await getActiveRental(car.id);
            if (rental?.active && rental.renter?.toLowerCase() === account?.toLowerCase()) {
              activeRentalsFound.push({ ...car, rentalDetails: rental });
            }
          }
        }
        if (isMounted) setRentedCars(activeRentalsFound);
      } catch (err) { console.error(err); } finally { if (isMounted) setLoading(false); }
    };
    findAllMyRentals();
    return () => { isMounted = false; };
  }, [account]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222", minHeight: "350px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "white" }}>Current Rentals</h3>
        <button onClick={openModal} style={{ background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)", border: "none", color: "white", padding: "8px 16px", borderRadius: "12px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>
          View All ({rentedCars.length})
        </button>
      </div>

      {loading ? <p style={{ color: "#666" }}>Loading rentals...</p> : rentedCars.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", flexGrow: 1 }}>
          {rentedCars.slice(0, 6).map((car, index) => (
            <div key={index} style={{ padding: "12px", border: "1px solid #333", borderRadius: "10px", background: "#111" }}>
              <p style={{ margin: 0, fontWeight: "bold", color: "white" }}>{car.model}</p>
              <small style={{ color: "#22c55e" }}>● Active Now</small>
            </div>
          ))}
        </div>
      ) : <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>No active rentals.</p>}

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.92)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "35px", borderRadius: "20px", width: "95%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", border: "1px solid #444" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
              <h2 style={{ color: "white", margin: 0 }}>Active Rental Details</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }}>&times;</button>
            </div>
            {rentedCars.map((car, index) => (
              <div key={index} style={{ padding: "20px", border: "1px solid #444", borderRadius: "15px", marginBottom: "15px", background: "#1a1a1a" }}>
                <h3 style={{ color: "#a855f7", marginTop: 0 }}>{car.model}</h3>
                <p style={{ color: "#ccc" }}>📍 {car.location} | 📅 Ends: {new Date(car.rentalDetails.endDate * 1000).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}