import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import InsightCard from "../components/InsightCard";
import { CategoryPieChart } from "../components/ExpenseChart";
import Loader from "../components/Loader";
import { getSummary, getTransactions, getInsights } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatINR, monthLabel, currentMonthStr } from "../services/constants";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const month = currentMonthStr();

  const loadData = useCallback(async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        getSummary({ month }),
        getTransactions({ month }),
      ]);
      setSummary(summaryRes.data.summary);
      setRecent(txRes.data.transactions.slice(0, 6));
    } finally {
      setLoading(false);
    }
  }, [month]);

  const loadInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const { data } = await getInsights({ month });
      setInsights(data.insights.slice(0, 4));
    } catch (err) {
      // insights failing should never break the dashboard
    } finally {
      setInsightsLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadData();
    loadInsights();
  }, [loadData, loadInsights]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) return <Loader fullPage label="Loading your dashboard..." />;

  const savingsRate =
    summary?.income > 0 ? (((summary.income - summary.expense) / summary.income) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>
            {greeting()}, {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
          <p>{monthLabel(month)} overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
            add
          </span>
          Add Transaction
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon="account_balance_wallet" label="Balance" amount={summary?.balance} color="#4F46E5" />
        <StatCard icon="arrow_downward" label="Income" amount={summary?.income} color="#10B981" />
        <StatCard icon="arrow_upward" label="Expenses" amount={summary?.expense} color="#F43F5E" />
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "#F59E0B18", color: "#F59E0B" }}>
            <span className="material-icons-round">savings</span>
          </div>
          <div className="stat-body">
            <p className="stat-label">Savings Rate</p>
            <h3 className="stat-amount">{savingsRate}%</h3>
            <p className="stat-sub">{savingsRate >= 20 ? "Great job! 🎉" : "Target: 20%+"}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 6 }}>
            <h2 style={{ fontSize: "1.05rem" }}>Expense Breakdown</h2>
            <Link to="/reports" className="btn btn-secondary" style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
              Full Reports
            </Link>
          </div>
          <CategoryPieChart data={summary?.byCategory} />
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 6 }}>
            <h2 style={{ fontSize: "1.05rem" }}>Recent Transactions</h2>
            <Link to="/transactions" className="btn btn-secondary" style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
              View All
            </Link>
          </div>
          <TransactionList transactions={recent} onChanged={loadData} onEdit={() => {}} compact />
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 28 }}>
        <div>
          <h2>
            <span className="material-icons-round" style={{ verticalAlign: "middle", marginRight: 6, color: "var(--primary)" }}>
              auto_awesome
            </span>
            AI Insights
          </h2>
          <p>Personalized suggestions based on your recent activity</p>
        </div>
        <Link to="/advisor" className="btn btn-outline">
          Ask Advisor
        </Link>
      </div>

      {insightsLoading ? (
        <Loader />
      ) : (
        <div className="insights-grid">
          {insights.map((ins, i) => (
            <InsightCard key={i} insight={ins} />
          ))}
        </div>
      )}

      {showForm && (
        <TransactionForm
          onClose={() => {
            setShowForm(false);
            setEditTx(null);
          }}
          onSaved={() => {
            loadData();
            loadInsights();
          }}
          initial={editTx}
        />
      )}
    </div>
  );
};

export default Dashboard;
