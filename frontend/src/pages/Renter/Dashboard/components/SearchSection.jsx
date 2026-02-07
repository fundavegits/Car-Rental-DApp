import { useState } from "react";
import "./SearchSection.css";

export default function SearchSection({ onSearch }) {
  const [formData, setFormData] = useState({
    model: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card">
      <h3>Search Cars</h3>

      <div className="search-grid">
        <input 
          name="model" 
          placeholder="Car model" 
          value={formData.model} 
          onChange={handleChange} 
        />
        <input type="date" />
        <input type="date" />
        <input 
          name="location" 
          placeholder="Pickup location" 
          value={formData.location} 
          onChange={handleChange} 
        />
        <input placeholder="Drop-off location" disabled />
      </div>

      <button 
        className="primary-btn search-btn"
        onClick={() => onSearch(formData)}
      >
        Search
      </button>
    </div>
  );
}