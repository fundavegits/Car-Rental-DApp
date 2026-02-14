import CarCard from "./CarCard";

export default function AvailableCars({ expanded, data, filters, onAutoFill, open, close }) {
  const filteredCars = data.filter(car => {
    const matchModel = filters?.model ? car.model.toLowerCase().includes(filters.model.toLowerCase()) : true;
    const matchLocation = filters?.location ? car.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    return matchModel && matchLocation;
  });

  if (expanded) {
    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0 }}>Car Marketplace</h2>
          <button onClick={close} style={{ background: "#222", color: "white", border: "1px solid #444", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>Back to Dashboard</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredCars.map(car => <CarCard key={car.id} car={car} bookingDates={filters} onAutoFill={onAutoFill} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Available Cars</h3>
        <button onClick={open} style={{ background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)", border: "none", color: "white", padding: "8px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
          View All ({filteredCars.length})
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredCars.slice(0, 3).map(car => <CarCard key={car.id} car={car} bookingDates={filters} onAutoFill={onAutoFill} />)}
      </div>
    </div>
  );
}