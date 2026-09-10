import { useState } from "react";
import { EXPENSE_CATEGORIES, currentMonthStr } from "../services/constants";
import { upsertBudget } from "../services/api";
import { useToast } from "../context/ToastContext";

const BudgetForm = ({ onClose, onSaved, initial, existingCategories = [] }) => {
  const { showToast } = useToast();
  const [category, setCategory] = useState(initial?.category || "");
  const [limit, setLimit] = useState(initial?.limit || "");
  const [saving, setSaving] = useState(false);

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => c === initial?.category || !existingCategories.includes(c)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limit || Number(limit) <= 0) {
      showToast("Please fill all fields correctly", "error");
      return;
    }
    setSaving(true);
    try {
      await upsertBudget({ category, limit: Number(limit), month: currentMonthStr() });
      showToast(initial ? "Budget updated" : "Budget created", "success");
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initial ? "Edit Budget" : "Set New Budget"}</h3>
          <button className="btn-icon" onClick={onClose}>
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!initial}
              required
            >
              <option value="">Select category</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Monthly Limit (₹)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 5000"
              min="1"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? <div className="spinner"></div> : initial ? "Update Budget" : "Create Budget"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
