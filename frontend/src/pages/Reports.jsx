import { useEffect, useState, useCallback } from "react";
import { CategoryPieChart, TrendLineChart, IncomeExpenseBarChart } from "../components/ExpenseChart";
import Loader from "../components/Loader";
import { getSummary } from "../services/api";
import { formatINR, currentMonthStr, CATEGORY_COLORS } from "../services/constants";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const month = currentMonthStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSummary({ month });
      setSummary(data.summary);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <Loader fullPage label="Crunching your numbers..." />;

  const sortedCategories = Object.entries(summary?.byCategory || {}).sort((a, b) => b[1] - a[1]);
  const totalExpense = summary?.expense || 0;

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>Reports</h2>
          <p>Detailed analysis of your financial activity</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3 style={{ fontSize: "0.98rem", marginBottom: 10 }}>6-Month Trend</h3>
          <TrendLineChart data={summary?.trend || []} />
        </div>
        <div className="card">
          <h3 style={{ fontSize: "0.98rem", marginBottom: 10 }}>Income vs Expense</h3>
          <IncomeExpenseBarChart data={summary?.trend || []} />
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: 18 }}>
        <div className="card">
          <h3 style={{ fontSize: "0.98rem", marginBottom: 10 }}>Category Breakdown</h3>
          <CategoryPieChart data={summary?.byCategory} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: "0.98rem", marginBottom: 14 }}>Top Categories</h3>
          {sortedCategories.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons-round">bar_chart</span>
              <p>No expenses recorded this month</p>
            </div>
          ) : (
            <div className="category-rank-list">
              {sortedCategories.map(([cat, amt], i) => {
                const pct = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
                return (
                  <div className="category-rank-item" key={cat}>
                    <div className="category-rank-top">
                      <span>
                        <strong>#{i + 1}</strong> {cat}
                      </span>
                      <span>{formatINR(amt)}</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] || "#4F46E5" }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
