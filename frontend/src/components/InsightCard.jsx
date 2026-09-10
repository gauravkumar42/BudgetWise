const TYPE_STYLES = {
  danger: { color: "var(--danger)", bg: "var(--danger-light)" },
  warning: { color: "#b45309", bg: "var(--warning-light)" },
  success: { color: "var(--secondary)", bg: "var(--secondary-light)" },
  info: { color: "var(--info)", bg: "var(--info-light)" },
};

const InsightCard = ({ insight }) => {
  const style = TYPE_STYLES[insight.type] || TYPE_STYLES.info;

  return (
    <div className="insight-card" style={{ borderLeftColor: style.color }}>
      <div className="insight-icon" style={{ background: style.bg, color: style.color }}>
        <span className="material-icons-round">{insight.icon || "lightbulb"}</span>
      </div>
      <div>
        <h4>{insight.title}</h4>
        <p>{insight.message}</p>
      </div>
    </div>
  );
};

export default InsightCard;
