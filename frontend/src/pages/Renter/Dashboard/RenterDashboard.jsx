import { useState, useEffect, useContext, useRef } from "react";
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
  
  const [filters, setFilters] = useState(initialFilters);
  const [activeView, setActiveView] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState({ available: [], current: [], history: [] });
  
  const searchSectionRef = useRef(null);

  const loadDashboardData = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const [allCars, rawHistory] = await Promise.all([fetchAllCars(), getRenterHistory(account)]);
      const rentedCars = allCars.filter(c => Number(c.status) === 1);
      const rentalDetailsArray = await Promise.all(rentedCars.map(car => getActiveRental(car.id)));

      const activeRentals = rentedCars
        .map((car, index) => ({ ...car, rentalDetails: rentalDetailsArray[index] }))
        .filter(item => item.rentalDetails?.active && item.rentalDetails.renter?.toLowerCase() === account.toLowerCase());

      const detailedHistory = rawHistory.map(item => ({
        ...item,
        model: allCars.find(c => c.id === item.carId)?.model || `Car #${item.carId}`
      })).reverse();

      setBlockchainData({
        available: allCars.filter(c => Number(c.status) === 0),
        current: activeRentals,
        history: detailedHistory
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, [account]);

  const handleAutoFill = (carDetails) => {
    setFilters(prev => ({ ...prev, model: carDetails.model, location: carDetails.location }));
    setActiveView(null);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      searchSectionRef.current?.focusStartDate();
    }, 400); 
  };

  return (
    <div className="renter-page" style={{ minHeight: "100vh", backgroundColor: "#0b0b0d", color: "white" }}>
      <div className="renter-container" style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 className="renter-title">Renter Dashboard</h1>
          {loading && <span style={{ color: "#a855f7" }}>Syncing Blockchain...</span>}
        </div>

        {activeView === 'market' && (
          <AvailableCars expanded={true} data={blockchainData.available} filters={filters} onAutoFill={handleAutoFill} close={() => setActiveView(null)} />
        )}
        
        {activeView === 'current' && (
          <CurrentRental expanded={true} data={blockchainData.current} close={() => setActiveView(null)} />
        )}

        {activeView === 'history' && (
          <RentalHistory expanded={true} data={blockchainData.history} close={() => setActiveView(null)} />
        )}

        {!activeView && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SearchSection 
              ref={searchSectionRef} 
              onSearch={setFilters} 
              onClear={() => setFilters(initialFilters)} 
              currentFilters={filters} 
            />
            <AvailableCars expanded={false} data={blockchainData.available} filters={filters} onAutoFill={handleAutoFill} open={() => setActiveView('market')} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
              <CurrentRental expanded={false} data={blockchainData.current} open={() => setActiveView('current')} />
              <RentalHistory expanded={false} data={blockchainData.history} open={() => setActiveView('history')} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}