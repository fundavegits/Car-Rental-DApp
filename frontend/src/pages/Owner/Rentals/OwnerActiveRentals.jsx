import React from 'react';
import { useNavigate } from 'react-router-dom';

// Changed prop name to 'rentals' to match parent component
const OwnerActiveRentals = ({ rentals = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      
      {/* HEADER: Large Title & Small Button */}
      <div className="flex justify-between items-center mb-12 w-full">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Active Rentals
        </h1>

        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-400">Fleet</h2>
      </div>

      {/* RENTAL GRID: Now using the 'rentals' prop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {rentals.length > 0 ? (
          rentals.map((car, index) => (
            <div key={index} className="bg-[#121212] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-bold capitalize mb-1">{car.carName || car.brand}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="text-red-500">📍</span> {car.location || 'Delhi'}
                </p>
              </div>

              <div className="bg-[#1c1c1c] rounded-xl p-4 border border-gray-800">
                <div className="mb-3">
                  <p className="text-[10px] uppercase text-purple-400 font-bold tracking-wider mb-1">Rental Period</p>
                  <p className="text-xs text-gray-300">{car.startDate} — {car.endDate}</p>
                </div>

                <div className="flex justify-between items-end border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Duration</p>
                    <p className="text-sm font-semibold">{car.duration} Days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Earnings</p>
                    <p className="text-sm font-bold text-green-400">Ξ {car.earnings}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 italic">No active rentals found in the fleet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerActiveRentals;