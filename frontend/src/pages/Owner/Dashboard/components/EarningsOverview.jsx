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
        const history = await getOwnerHistory(account);
        
        // We use an object to group earnings by day for the chart
        const dayMap = {};
        let totalWei = 0n;

        for (const rental of history) {
          // Only count successful, paid rentals
          if (!rental.paid || BigInt(rental.paid) === 0n) continue;

          const timestamp = Number(rental.endDate);
          if (!timestamp || isNaN(timestamp)) continue;

          const dateObj = new Date(timestamp * 1000);
          if (isNaN(dateObj.getTime())) continue;

          // Create a YYYY-MM-DD string for the chart mapping
          const day = dateObj.toISOString().slice(0, 10);
          const paidWei = BigInt(rental.paid);
          
          dayMap[day] = (dayMap[day] || 0n) + paidWei;
          totalWei += paidWei;
        }

        // Convert grouped Wei values to Numbers (ETH) for the chart
        const chartData = {};
        for (const day in dayMap) {
          chartData[day] = Number(ethers.formatEther(dayMap[day]));
        }

        setDailyEarnings(chartData);
        
        // Format total for the header: convert to ETH and fix to 4 decimal places
        const totalEth = ethers.formatEther(totalWei);
        setTotalEarnings(parseFloat(totalEth).toFixed(4));

      } catch (err) {
        console.error("Failed to load earnings history:", err);
      }
    };

    loadEarnings();
  }, [account]);

  return (
    <div className="card earnings-heatmap">
      <div className="earnings-header">
        <h3>Total Earnings</h3>
        {/* The symbol remains standardized as SepoliaETH via your contract.js context */}
        <span className="earnings-amount">Ξ {totalEarnings}</span>
      </div>
      
      {/* Pass the daily data to your chart component */}
      <EarningsChart data={dailyEarnings} />
    </div>
  );
}