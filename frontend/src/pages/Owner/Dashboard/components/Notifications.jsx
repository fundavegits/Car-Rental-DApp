import "./Notifications.css";
export default function Notifications() {
  return (
    <div className="card">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <p style={{ color: "#a1a7c4" }}>No notifications</p>
    </div>
  );
}
