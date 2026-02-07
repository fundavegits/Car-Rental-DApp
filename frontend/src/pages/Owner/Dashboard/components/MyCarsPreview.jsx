import { useNavigate } from "react-router-dom";
import "./MyCarsPreview.css";

export default function MyCarsPreview({ cars = [] }) {
  const navigate = useNavigate();

  // Only show AVAILABLE cars (status === 0)
  const availableCars = cars.filter((car) => car.status === 0);

  return (
    <div className="card">
      <div className="cars-header">
        <h3>My Cars</h3>
        <button
          className="view-all-btn"
          onClick={() => navigate("/owner/cars")}
        >
          View All
        </button>
      </div>

      <div className="cars-scroll">
        {availableCars.length === 0 ? (
          <div className="empty-state">No available cars</div>
        ) : (
          availableCars.map((car) => (
            <div key={car.id} className="car-mini">
              {car.model}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
