import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../../context/Web3Context";
import { getRenterHistory } from "../../../../context/useCarRental";

export default function RentalHistory() {
  const { account } = useContext(Web3Context);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (account) getRenterHistory(account).then(setHistory);
  }, [account]);

  return (
    <div className="card">
      <h3>History</h3>
      {history.map((h, i) => (
        <div key={i} style={{ borderBottom: '1px solid #333', padding: '5px 0' }}>
          <span>Car #{h.carId}</span> — <span style={{ color: '#a855f7' }}>Ξ {h.paid}</span>
        </div>
      ))}
    </div>
  );
}