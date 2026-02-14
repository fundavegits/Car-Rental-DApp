import { useState, useEffect, useContext } from "react";
import "./RenterDashboard.css";
import { Web3Context } from "../../../context/Web3Context";
import { fetchAllCars, getRenterHistory, getActiveRental } from "../../../context/useCarRental";
import SearchSection from "./components/SearchSection";
import AvailableCars from "./components/AvailableCars";
import CurrentRental from "./components/CurrentRentals";
import RentalHistory from "./components/RentalHistory";

export default function RenterDashboard() {
  const { account } = useContext(Web3Context);
  const initialFilters = { model: "", location: "", startDate: "", endDate: "" };
  
  // --- STATE MANAGEMENT ---
  const [filters, setFilters] = useState(initialFilters);
  const [activeView, setActiveView] = useState(null); // 'market', 'current', 'history', or null
  const [loading, setLoading] = useState(true);

  // --- CENTRALIZED DATA STORE ---
  const [blockchainData, setBlockchainData] = useState({
    available: [],
    current: [],
    history: []
  });

  // 1. Optimized Data Fetcher: Runs once on load or account change
  const loadDashboardData = async () => {
    if (!account) return;
    setLoading(true);
    try {
      // Parallel Fetching: Don't wait for one to finish before starting the next
      const [allCars, rawHistory] = await Promise.all([
        fetchAllCars(),
        getRenterHistory(account)
      ]);

      // Process Available Cars
      const available = allCars.filter(c => Number(c.status) === 0);

      // Process Active Rentals
      const activeRentals = [];
      for (const car of allCars) {
        if (Number(car.status) === 1) {
          const rental = await getActiveRental(car.id);
          if (rental?.active && rental.renter?.toLowerCase() === account.toLowerCase()) {
            activeRentals.push({ ...car, rentalDetails: rental });
          }
        }
      }

      // Process History with Model Names
      const detailedHistory = rawHistory.map(item => ({
        ...item,
        model: allCars.find(c => c.id === item.carId)?.model || `Car #${item.carId}`
      })).reverse();

      setBlockchainData({
        available: available,
        current: activeRentals,
        history: detailedHistory
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [account]);

  const handleAutoFill = (carDetails) => {
    setFilters(prev => ({ ...prev, model: carDetails.model, location: carDetails.location }));
    setActiveView(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="renter-page" style={{ minHeight: "100vh", backgroundColor: "#0b0b0d", color: "white" }}>
      <div className="renter-container" style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 className="renter-title" style={{ fontSize: "2.5rem", fontWeight: "800", margin: 0 }}>Renter Dashboard</h1>
          {loading && <span style={{ color: "#a855f7", fontSize: "0.9rem" }}>Syncing Blockchain...</span>}
        </div>

        {/* --- FOCUS MODES (Instant Load from Props) --- */}
        {activeView === 'market' && (
          <AvailableCars 
            expanded={true} 
            data={blockchainData.available} 
            filters={filters} 
            onAutoFill={handleAutoFill} 
            close={() => setActiveView(null)} 
          />
        )}
        
        {activeView === 'current' && (
          <CurrentRental 
            expanded={true} 
            data={blockchainData.current} 
            close={() => setActiveView(null)} 
            refresh={loadDashboardData}
          />
        )}

        {activeView === 'history' && (
          <RentalHistory 
            expanded={true} 
            data={blockchainData.history} 
            close={() => setActiveView(null)} 
          />
        )}

        {/* --- MAIN DASHBOARD VIEW --- */}
        {!activeView && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SearchSection onSearch={setFilters} onClear={() => setFilters(initialFilters)} currentFilters={filters} />

            <AvailableCars 
              expanded={false} 
              data={blockchainData.available} 
              filters={filters} 
              onAutoFill={handleAutoFill} 
              open={() => setActiveView('market')} 
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
              <CurrentRental 
                expanded={false} 
                data={blockchainData.current} 
                open={() => setActiveView('current')} 
              />
              <RentalHistory 
                expanded={false} 
                data={blockchainData.history} 
                open={() => setActiveView('history')} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}