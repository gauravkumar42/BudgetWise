import { formatINR, CATEGORY_COLORS } from "../services/constants";

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const pct = Math.min(budget.percentUsed, 100);
  const isOver = budget.percentUsed >= 100;
  const isNear = budget.percentUsed >= 80 && budget.percentUsed < 100;
  const color = CATEGORY_COLORS[budget.category] || "#4F46E5";

  const barColor = isOver ? "var(--danger)" : isNear ? "var(--warning)" : color;

  return (
    <div className="card budget-card">
      <div className="budget-card-top">
        <div className="budget-card-title">
          <span className="budget-dot" style={{ background: color }}></span>
          <strong>{budget.category}</strong>
        </div>
        <div className="budget-card-actions">
          <button className="btn-icon" onClick={() => onEdit(budget)} aria-label="Edit budget">
            <span className="material-icons-round" style={{ fontSize: "1.05rem" }}>
              edit
            </span>
          </button>
          <button className="btn-icon" onClick={() => onDelete(budget._id)} aria-label="Delete budget">
            <span className="material-icons-round" style={{ fontSize: "1.05rem", color: "var(--danger)" }}>
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="progress-track" style={{ margin: "14px 0 10px" }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }}></div>
      </div>

      <div className="budget-card-bottom">
        <span>
          <strong>{formatINR(budget.spent)}</strong> of {formatINR(budget.limit)}
        </span>
        <span className={`badge ${isOver ? "badge-danger" : isNear ? "badge-warning" : "badge-success"}`}>
          {budget.percentUsed.toFixed(0)}%
        </span>
      </div>

      {isOver && (
        <p className="budget-warning">
          <span className="material-icons-round" style={{ fontSize: "1rem" }}>
            warning
          </span>
          Over budget by {formatINR(budget.spent - budget.limit)}
        </p>
      )}
    </div>
  );
};

export default BudgetCard;
