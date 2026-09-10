import { formatINR } from "../services/constants";

const StatCard = ({ icon, label, amount, color, trend, sub }) => {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        <span className="material-icons-round">{icon}</span>
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <h3 className="stat-amount">{formatINR(amount)}</h3>
        {sub && <p className="stat-sub">{sub}</p>}
        {trend !== undefined && (
          <span className={`badge ${trend >= 0 ? "badge-success" : "badge-danger"}`}>
            <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>
              {trend >= 0 ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
