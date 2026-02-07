import "./EarningsChart.css";

export default function EarningsChart({ data }) {
  const days = Object.keys(data).sort();

  if (days.length === 0) {
    return <div className="empty-chart">No earnings yet</div>;
  }

  const max = Math.max(...Object.values(data));

  return (
    <div className="heatmap-grid">
      {days.map((day) => {
        const value = data[day];
        const intensity = max === 0 ? 0 : value / max;

        return (
          <div
            key={day}
            className="heatmap-cell"
            title={`${day}: Ξ ${value.toFixed(4)}`}
            style={{
              backgroundColor: `rgba(138, 43, 226, ${0.2 + intensity * 0.8})`,
            }}
          />
        );
      })}
    </div>
  );
}
