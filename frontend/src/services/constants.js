export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Rent",
  "Healthcare",
  "Education",
  "Travel",
  "Investment",
  "EMI/Loan",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment Returns",
  "Gift",
  "Refund",
  "Other",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#F59E0B",
  Groceries: "#10B981",
  Transport: "#0EA5E9",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  "Bills & Utilities": "#F43F5E",
  Rent: "#6366F1",
  Healthcare: "#14B8A6",
  Education: "#3B82F6",
  Travel: "#F97316",
  Investment: "#22C55E",
  "EMI/Loan": "#EF4444",
  Other: "#94A3B8",
  Salary: "#10B981",
  Freelance: "#4F46E5",
  Business: "#0EA5E9",
  "Investment Returns": "#22C55E",
  Gift: "#EC4899",
  Refund: "#14B8A6",
};

export const PAYMENT_METHODS = ["UPI", "Cash", "Card", "NetBanking", "Other"];

export const formatINR = (amount) => {
  const n = Number(amount || 0);
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

export const formatINRDecimal = (amount) => {
  const n = Number(amount || 0);
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const monthLabel = (monthStr) => {
  const [y, m] = monthStr.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
};

export const currentMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
