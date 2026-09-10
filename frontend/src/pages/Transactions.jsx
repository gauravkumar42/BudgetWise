import { useEffect, useState, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Loader from "../components/Loader";
import { getTransactions } from "../services/api";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, currentMonthStr } from "../services/constants";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(currentMonthStr());

  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { month };
      if (type) params.type = type;
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await getTransactions(params);
      setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  }, [type, category, search, month]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300); // debounce search
    return () => clearTimeout(timer);
  }, [loadData]);

  const openEdit = (tx) => {
    setEditTx(tx);
    setShowForm(true);
  };

  const totalIn = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>Transactions</h2>
          <p>{transactions.length} transactions found</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditTx(null);
            setShowForm(true);
          }}
        >
          <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
            add
          </span>
          Add Transaction
        </button>
      </div>

      <div className="card filter-bar">
        <div className="search-box">
          <span className="material-icons-round">search</span>
          <input
            type="text"
            placeholder="Search by note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input type="month" className="input filter-input" value={month} onChange={(e) => setMonth(e.target.value)} />

        <select className="input filter-input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="input filter-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mini-summary">
        <span className="badge badge-success">Income: ₹{totalIn.toLocaleString("en-IN")}</span>
        <span className="badge badge-danger">Expense: ₹{totalOut.toLocaleString("en-IN")}</span>
        <span className="badge badge-neutral">Net: ₹{(totalIn - totalOut).toLocaleString("en-IN")}</span>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {loading ? <Loader /> : <TransactionList transactions={transactions} onChanged={loadData} onEdit={openEdit} />}
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => {
            setShowForm(false);
            setEditTx(null);
          }}
          onSaved={loadData}
          initial={editTx}
        />
      )}
    </div>
  );
};

export default Transactions;
