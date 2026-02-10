import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { fetchAllCars, getActiveRental } from "../../../../context/useCarRental";

export default function CurrentRentals() {
  const { account } = useContext(Web3Context);
  const [rentedCars, setRentedCars] = useState([]); // Changed to array to hold all rentals
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const findAllMyRentals = async () => {
      if (!account) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allCars = await fetchAllCars();
        const activeRentalsFound = [];

        for (const car of allCars) {
          if (Number(car.status) === 1) {
            const rental = await getActiveRental(car.id);
            
            if (
              rental && 
              rental.active && 
              rental.renter?.toLowerCase() === account?.toLowerCase()
            ) {
              // REMOVED 'break' so it keeps looking for more cars
              activeRentalsFound.push({ ...car, rentalDetails: rental });
            }
          }
        }

        if (isMounted) setRentedCars(activeRentalsFound);
      } catch (err) {
        console.error("Error fetching active rentals:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    findAllMyRentals();
    return () => { isMounted = false; };
  }, [account]);

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0 }}>Current Rentals</h3>
        {rentedCars.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
              border: "none", color: "white", padding: "6px 14px", borderRadius: "12px",
              cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold"
            }}
          >
            View All ({rentedCars.length})
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>Checking active rentals...</p>
      ) : rentedCars.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Dashboard Preview: Only shows the first 2 */}
          {rentedCars.slice(0, 2).map((car, index) => (
            <div key={index} style={{ padding: "12px", border: "1px solid #333", borderRadius: "10px", background: "#1e1e24" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#a855f7" }}>{car.model}</p>
              <small style={{ color: "#22c55e", fontWeight: "bold" }}>● Active Now</small>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic" }}>No active rentals found.</p>
      )}

      {/* VIEW ALL MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999, backdropFilter: "blur(8px)"
        }}>
          <div style={{
            background: "#111", padding: "30px", borderRadius: "20px",
            width: "95%", maxWidth: "600px", maxHeight: "85vh", overflowY: "auto",
            border: "1px solid #333"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0 }}>My Active Rentals</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }}>&times;</button>
            </div>

            {rentedCars.map((car, index) => (
              <div key={index} style={{
                padding: "20px", border: "1px solid #444", borderRadius: "15px",
                marginBottom: "15px", background: "rgba(255,255,255,0.03)"
              }}>
                <h3 style={{ color: "#a855f7", marginTop: 0 }}>{car.model}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem", color: "#ccc" }}>
                  <p><strong>📍 Location:</strong> {car.location}</p>
                  <p><strong>💰 Paid:</strong> {car.rentalDetails.paid} ETH</p>
                  <p><strong>📅 Start:</strong> {new Date(car.rentalDetails.startDate * 1000).toLocaleDateString()}</p>
                  <p><strong>📅 End:</strong> {new Date(car.rentalDetails.endDate * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}