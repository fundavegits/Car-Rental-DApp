import React from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerActiveRentals = ({ rentals = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      
      {/* 1. FIXED HEADER: Title and Button on the same line */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold text-white">Active Rentals</h1>

        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-400">Fleet</h2>
      </div>

      {/* 2. RESTORED GRID & CARDS: Same style as your dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {rentals.length > 0 ? (
          rentals.map((car, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all">
              <div className="mb-4 text-center">
                <h3 className="text-xl font-bold capitalize mb-2">{car.carName || car.brand}</h3>
                <span className="text-[10px] bg-red-950/30 text-red-500 px-3 py-1 rounded-full border border-red-900/50 uppercase font-bold tracking-widest">
                  ● Currently Rented
                </span>
              </div>

              {/* Detail Box: Matches your Dashboard's purple/dark theme */}
              <div className="bg-[#241a31] rounded-xl p-4 border border-purple-900/30">
                <div className="mb-3">
                  <p className="text-[10px] uppercase text-purple-400 font-bold mb-1">Rental Period</p>
                  <p className="text-xs text-gray-300">{car.startDate} — {car.endDate}</p>
                </div>

                <div className="flex justify-between items-end border-t border-purple-900/50 pt-3">
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
            <p className="text-gray-500 italic text-lg">No active rentals found in the fleet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerActiveRentals;