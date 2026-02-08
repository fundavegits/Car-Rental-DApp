import React from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerActiveRentals = ({ rentals = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-5">
      {/* Original Header */}
      <h1 className="text-6xl font-bold mb-8">Active Rentals</h1>

      {/* Original Full-Width Gradient Bar */}
      <div 
        onClick={() => navigate('/owner-dashboard')}
        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 rounded-full flex justify-center items-center cursor-pointer mb-10 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2 text-white font-bold">
          <span>←</span>
          <span>Back to Dashboard</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Fleet</h2>

      {/* Original Card Grid with Data Mapping */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {rentals.length > 0 ? (
          rentals.map((car, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 shadow-lg">
              <div className="mb-4">
                <h3 className="text-xl font-bold capitalize">{car.carName || car.brand}</h3>
                <p className="text-gray-400 text-sm">📍 {car.location || 'delhi'}</p>
              </div>

              <div className="bg-[#241a31] border border-purple-900/50 rounded-xl p-3">
                <div className="mb-3">
                  <p className="text-[10px] text-purple-400 uppercase font-bold">Rental Period</p>
                  <p className="text-[11px]">{car.startDate} — {car.endDate}</p>
                </div>

                <div className="flex justify-between items-end border-t border-gray-700 pt-2">
                  <div>
                    <p className="text-[10px] text-gray-500">Duration</p>
                    <p className="text-xs font-semibold">{car.duration} Days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">Earnings</p>
                    <p className="text-xs font-bold text-green-400">Ξ {car.earnings}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic px-2">No active rentals found in the fleet.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerActiveRentals;