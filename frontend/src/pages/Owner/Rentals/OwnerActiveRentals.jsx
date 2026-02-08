import React from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerActiveRentals = ({ activeRentals = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      {/* Top Navigation Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Active Rentals
          </h1>
        </div>

        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center gap-2 px-6 py-2 border border-purple-500/40 text-purple-300 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-semibold text-gray-100">Fleet</h2>
      </div>

      {/* Grid Layout for Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {activeRentals.map((car, index) => (
          <div 
            key={index} 
            className="bg-[#121212] border border-gray-800/60 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 shadow-xl"
          >
            {/* Car Name & Location */}
            <div className="mb-6">
              <h3 className="text-xl font-bold capitalize text-white mb-1">
                {car.carName || car.brand}
              </h3>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <span className="text-red-500">📍</span> {car.location || 'Unknown'}
              </p>
            </div>

            {/* Rental Details Box */}
            <div className="bg-[#1c1c1c] border border-gray-800 rounded-xl p-4">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">
                  Rental Period
                </p>
                <p className="text-[13px] text-gray-300 font-medium">
                  {car.startDate} — {car.endDate}
                </p>
              </div>

              <div className="flex justify-between items-end border-t border-gray-800 pt-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Duration</p>
                  <p className="text-sm font-semibold">{car.duration} Days</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Earnings</p>
                  <p className="text-sm font-bold text-green-400">
                    Ξ {car.earnings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeRentals.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-500">No active rentals found in the fleet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerActiveRentals;