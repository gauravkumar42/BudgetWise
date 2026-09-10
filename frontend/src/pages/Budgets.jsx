import { useEffect, useState, useCallback } from "react";
import BudgetCard from "../components/BudgetCard";
import BudgetForm from "../components/BudgetForm";
import Loader from "../components/Loader";
import { getBudgets, deleteBudget as deleteBudgetApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import { monthLabel, currentMonthStr } from "../services/constants";

const Budgets = () => {
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const month = currentMonthStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBudgets({ month });
      setBudgets(data.budgets);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await deleteBudgetApi(id);
      showToast("Budget deleted", "success");
      loadData();
    } catch (err) {
      showToast("Failed to delete budget", "error");
    }
  };

  const openEdit = (b) => {
    setEditBudget(b);
    setShowForm(true);
  };

  const overBudgetCount = budgets.filter((b) => b.percentUsed >= 100).length;

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>Budgets</h2>
          <p>{monthLabel(month)} · {budgets.length} categories tracked</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditBudget(null);
            setShowForm(true);
          }}
        >
          <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
            add
          </span>
          New Budget
        </button>
      </div>

      {overBudgetCount > 0 && (
        <div className="alert-banner">
          <span className="material-icons-round">warning</span>
          You're over budget in {overBudgetCount} categor{overBudgetCount > 1 ? "ies" : "y"} this month.
        </div>
      )}

      {loading ? (
        <Loader />
      ) : budgets.length === 0 ? (
        <div className="card empty-state">
          <span className="material-icons-round">pie_chart</span>
          <p>No budgets set yet</p>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setShowForm(true)}>
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.map((b) => (
            <BudgetCard key={b._id} budget={b} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <BudgetForm
          onClose={() => {
            setShowForm(false);
            setEditBudget(null);
          }}
          onSaved={loadData}
          initial={editBudget}
          existingCategories={budgets.map((b) => b.category)}
        />
      )}
    </div>
  );
};

export default Budgets;
