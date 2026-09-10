import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from "../services/constants";
import { createTransaction, updateTransaction } from "../services/api";
import { useToast } from "../context/ToastContext";

const todayStr = () => new Date().toISOString().split("T")[0];

const TransactionForm = ({ onClose, onSaved, initial }) => {
  const { showToast } = useToast();
  const [type, setType] = useState(initial?.type || "expense");
  const [amount, setAmount] = useState(initial?.amount || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [note, setNote] = useState(initial?.note || "");
  const [date, setDate] = useState(initial ? initial.date.split("T")[0] : todayStr());
  const [paymentMethod, setPaymentMethod] = useState(initial?.paymentMethod || "UPI");
  const [saving, setSaving] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (!category) {
      showToast("Please select a category", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = { type, amount: Number(amount), category, note, date, paymentMethod };
      if (initial?._id) {
        await updateTransaction(initial._id, payload);
        showToast("Transaction updated", "success");
      } else {
        await createTransaction(payload);
        showToast("Transaction added", "success");
      }
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
          <h3>{initial ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="btn-icon" onClick={onClose}>
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="type-toggle">
          <button
            type="button"
            className={`type-toggle-btn ${type === "expense" ? "active-expense" : ""}`}
            onClick={() => {
              setType("expense");
              setCategory("");
            }}
          >
            <span className="material-icons-round">arrow_upward</span> Expense
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${type === "income" ? "active-income" : ""}`}
            onClick={() => {
              setType("income");
              setCategory("");
            }}
          >
            <span className="material-icons-round">arrow_downward</span> Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              className="input"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                className="input"
                value={date}
                max={todayStr()}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Payment Method</label>
              <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Note (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Dinner with friends"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={120}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? <div className="spinner"></div> : initial ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
