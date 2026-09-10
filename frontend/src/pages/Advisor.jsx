import { useEffect, useState, useCallback } from "react";
import AdvisorChat from "../components/AdvisorChat";
import InsightCard from "../components/InsightCard";
import Loader from "../components/Loader";
import { getInsights } from "../services/api";
import { currentMonthStr } from "../services/constants";

const Advisor = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getInsights({ month: currentMonthStr() });
      setInsights(data.insights);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>
            <span className="material-icons-round" style={{ verticalAlign: "middle", marginRight: 6, color: "var(--primary)" }}>
              auto_awesome
            </span>
            AI Advisor
          </h2>
          <p>Chat with your personal finance assistant — always available, even offline</p>
        </div>
      </div>

      <div className="advisor-layout">
        <AdvisorChat />

        <div className="advisor-sidebar">
          <div className="card">
            <h3 style={{ fontSize: "0.98rem", marginBottom: 14 }}>Current Insights</h3>
            {loading ? (
              <Loader />
            ) : (
              <div className="insight-stack">
                {insights.map((ins, i) => (
                  <InsightCard key={i} insight={ins} />
                ))}
              </div>
            )}
          </div>

          <div className="card advisor-info-card">
            <span className="material-icons-round" style={{ color: "var(--secondary)", fontSize: "1.6rem" }}>
              offline_bolt
            </span>
            <div>
              <h4>Always-on reliability</h4>
              <p>
                BudgetWise tries a free AI model first. If it's ever unavailable, our built-in local
                advisor instantly takes over — so you always get an answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
