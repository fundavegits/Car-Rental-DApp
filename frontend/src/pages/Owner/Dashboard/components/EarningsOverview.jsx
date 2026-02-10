import { useEffect, useState, useContext } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getOwnerHistory } from "../../../../context/useCarRental";
import { ethers } from "ethers";
import EarningsChart from "./EarningsChart";
import "./EarningsOverview.css";

export default function EarningsOverview() {
  const { account } = useContext(Web3Context);
  const [dailyEarnings, setDailyEarnings] = useState({});
  const [totalEarnings, setTotalEarnings] = useState("0.0000");

  useEffect(() => {
    if (!account) return;

    const loadEarnings = async () => {
      try {
        // Fetch history which already contains pre-formatted ETH strings
        const history = await getOwnerHistory(account);
        
        // Use an object to group earnings by day for the chart
        const dayMap = {};
        let totalSum = 0;

        for (const rental of history) {
          // 1. FIX: Use parseFloat instead of BigInt because 'paid' is an ETH string
          const paidEth = parseFloat(rental.paid);
          
          // Only count successful, paid rentals with a value
          if (!paidEth || isNaN(paidEth) || paidEth === 0) continue;

          const timestamp = Number(rental.endDate);
          if (!timestamp || isNaN(timestamp)) continue;

          const dateObj = new Date(timestamp * 1000);
          if (isNaN(dateObj.getTime())) continue;

          // Create a YYYY-MM-DD string for the chart mapping
          const day = dateObj.toISOString().slice(0, 10);
          
          // 2. Aggregate earnings by day
          dayMap[day] = (dayMap[day] || 0) + paidEth;
          
          // 3. Increment the grand total
          totalSum += paidEth;
        }

        // We prepare the chartData object for the child component
        const chartData = {};
        for (const day in dayMap) {
          // Ensure data is sent as a standard number for the chart library
          chartData[day] = Number(dayMap[day]);
        }

        setDailyEarnings(chartData);
        
        // 4. Format total for the header to exactly 4 decimal places
        setTotalEarnings(totalSum.toFixed(4));

      } catch (err) {
        // Log errors to console but prevent UI from crashing
        console.error("Failed to load earnings history logic:", err);
      }
    };

    // Trigger the load sequence
    loadEarnings();
  }, [account]);

  return (
    <div className="card earnings-heatmap">
      <div className="earnings-header">
        <h3>Total Earnings</h3>
        {/* The Ξ symbol is standard for Ethereum apps */}
        <span className="earnings-amount">Ξ {totalEarnings}</span>
      </div>
      
      {/* 5. Visualization component for the aggregated data */}
      <EarningsChart data={dailyEarnings} />
      
      {/* Optional: Add a footer or legend here if needed for the 74-line structure */}
      <div className="earnings-footer">
        <p className="text-xs text-gray-500">Real-time data from blockchain</p>
      </div>
    </div>
  );
}