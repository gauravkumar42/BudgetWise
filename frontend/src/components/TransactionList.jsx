import { useState } from "react";
import { formatINR, formatDate, CATEGORY_COLORS } from "../services/constants";
import { deleteTransaction } from "../services/api";
import { useToast } from "../context/ToastContext";

const CATEGORY_ICONS = {
  "Food & Dining": "restaurant",
  Groceries: "shopping_basket",
  Transport: "directions_car",
  Shopping: "shopping_bag",
  Entertainment: "movie",
  "Bills & Utilities": "receipt",
  Rent: "home",
  Healthcare: "local_hospital",
  Education: "school",
  Travel: "flight",
  Investment: "trending_up",
  "EMI/Loan": "account_balance",
  Other: "category",
  Salary: "payments",
  Freelance: "laptop_mac",
  Business: "business_center",
  "Investment Returns": "show_chart",
  Gift: "redeem",
  Refund: "replay",
};

const TransactionList = ({ transactions, onChanged, onEdit, compact = false }) => {
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      showToast("Transaction deleted", "success");
      onChanged();
    } catch (err) {
      showToast("Failed to delete transaction", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <span className="material-icons-round">inbox</span>
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div className="transaction-item" key={t._id}>
          <div
            className="transaction-icon"
            style={{
              background: `${CATEGORY_COLORS[t.category] || "#94A3B8"}18`,
              color: CATEGORY_COLORS[t.category] || "#94A3B8",
            }}
          >
            <span className="material-icons-round">{CATEGORY_ICONS[t.category] || "category"}</span>
          </div>

          <div className="transaction-info">
            <strong>{t.category}</strong>
            <p>
              {t.note ? `${t.note} · ` : ""}
              {formatDate(t.date)}
              {!compact ? ` · ${t.paymentMethod}` : ""}
            </p>
          </div>

          <div className="transaction-right">
            <span className={`transaction-amount ${t.type === "income" ? "positive" : "negative"}`}>
              {t.type === "income" ? "+" : "−"}
              {formatINR(t.amount)}
            </span>

            {!compact && (
              <div className="transaction-actions">
                <button className="btn-icon" onClick={() => onEdit(t)} aria-label="Edit">
                  <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
                    edit
                  </span>
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(t._id)}
                  disabled={deletingId === t._id}
                  aria-label="Delete"
                >
                  {deletingId === t._id ? (
                    <div className="spinner spinner-dark" style={{ width: 16, height: 16 }}></div>
                  ) : (
                    <span className="material-icons-round" style={{ fontSize: "1.1rem", color: "var(--danger)" }}>
                      delete
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
