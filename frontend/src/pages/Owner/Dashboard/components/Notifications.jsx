import React, { useState, useEffect } from "react";
import { listenToAllEvents } from "../../../../context/useCarRental";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Set up the listener for blockchain events (Registration & Rental)
    const unsubscribe = listenToAllEvents((newNotification) => {
      // Keep only the most recent 5 notifications
      setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
    });

    // Cleanup the listener when the component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-blue-500 text-xs font-medium uppercase tracking-wider">Live Monitoring</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          /* UPDATED: Better wording for empty state */
          <div className="text-center py-10 text-gray-500 italic bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
            No recent activity.
          </div>
        ) : (
          notifications.map((n, index) => (
            <div 
              key={index} 
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold text-sm ${n.type === 'REGISTRATION' ? 'text-blue-400' : 'text-green-400'}`}>
                  {n.title}
                </h4>
                <span className="text-[10px] text-gray-500">{n.time}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
              {n.amount && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-green-400 font-bold">{n.amount}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;