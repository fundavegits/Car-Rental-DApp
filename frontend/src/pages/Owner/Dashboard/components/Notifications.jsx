import React, { useState, useEffect } from "react";
import { listenToAllEvents } from "../../../../context/useCarRental";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToAllEvents((newNotification) => {
      setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Live
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            No recent activity found.
          </div>
        ) : (
          notifications.map((n, index) => (
            <div 
              key={index} 
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${n.type === 'REGISTRATION' ? 'bg-blue-400' : 'bg-green-400'}`} />
                <div className="flex-1">
                  <h4 className={`font-bold ${n.type === 'REGISTRATION' ? 'text-blue-400' : 'text-green-400'}`}>
                    {n.title}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">{n.message}</p>
                  {n.amount && (
                    <p className="text-sm font-semibold text-green-300 mt-2 bg-green-900/30 inline-block px-2 py-0.5 rounded">
                      {n.amount}
                    </p>
                  )}
                  <span className="text-[10px] text-gray-500 block mt-2 text-right">
                    {n.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;