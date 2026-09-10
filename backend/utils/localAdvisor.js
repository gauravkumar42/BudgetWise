/**
 * Local Advisor — a fully offline, rule-based financial insight engine.
 * This ALWAYS works, even if the external AI API fails, times out, or is unavailable.
 * It analyzes the user's transactions + budgets and returns human-readable,
 * actionable suggestions in Indian Rupee context.
 */

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function summarize(transactions = []) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

  return { income, expense, balance: income - expense, byCategory };
}

function generateInsights({ transactions = [], budgets = [] }) {
  const { income, expense, balance, byCategory } = summarize(transactions);
  const insights = [];

  // 1. Savings rate
  if (income > 0) {
    const savingsRate = ((income - expense) / income) * 100;
    if (savingsRate < 0) {
      insights.push({
        type: "danger",
        icon: "trending_down",
        title: "You're spending more than you earn",
        message: `Your expenses (${inr(expense)}) exceed your income (${inr(
          income
        )}) this period. Consider cutting discretionary spending immediately to avoid debt.`,
      });
    } else if (savingsRate < 10) {
      insights.push({
        type: "warning",
        icon: "savings",
        title: "Low savings rate",
        message: `You're saving only ${savingsRate.toFixed(
          1
        )}% of your income. Financial experts recommend saving at least 20%. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.`,
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: "success",
        icon: "emoji_events",
        title: "Great savings discipline!",
        message: `You're saving ${savingsRate.toFixed(
          1
        )}% of your income (${inr(
          income - expense
        )}). Consider investing the surplus in SIPs, PPF, or mutual funds for long-term growth.`,
      });
    } else {
      insights.push({
        type: "info",
        icon: "thumb_up",
        title: "Decent savings rate",
        message: `You're saving ${savingsRate.toFixed(
          1
        )}% of your income. Push a little more toward a 20% target for stronger financial security.`,
      });
    }
  }

  // 2. Top spending category
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCat, topAmt] = sortedCategories[0];
    const pctOfExpense = expense > 0 ? (topAmt / expense) * 100 : 0;
    if (pctOfExpense > 40) {
      insights.push({
        type: "warning",
        icon: "pie_chart",
        title: `${topCat} is dominating your budget`,
        message: `${inr(
          topAmt
        )} (${pctOfExpense.toFixed(
          0
        )}% of total spending) went to "${topCat}". Try to diversify or cap this category to improve balance.`,
      });
    }
  }

  // 3. Budget breach checks
  budgets.forEach((b) => {
    const spent = byCategory[b.category] || 0;
    const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    if (pct >= 100) {
      insights.push({
        type: "danger",
        icon: "warning",
        title: `Budget exceeded: ${b.category}`,
        message: `You've spent ${inr(spent)} against a budget of ${inr(
          b.limit
        )} for "${b.category}" — that's ${pct.toFixed(
          0
        )}% used. Consider pausing spending in this category.`,
      });
    } else if (pct >= 80) {
      insights.push({
        type: "warning",
        icon: "notification_important",
        title: `Nearing budget limit: ${b.category}`,
        message: `You've used ${pct.toFixed(0)}% (${inr(spent)} of ${inr(
          b.limit
        )}) of your "${b.category}" budget. Slow down to stay on track this month.`,
      });
    }
  });

  // 4. No budgets set
  if (budgets.length === 0 && transactions.length > 0) {
    insights.push({
      type: "info",
      icon: "flag",
      title: "Set up budgets for better control",
      message:
        "You haven't set any category budgets yet. Setting monthly limits per category is the #1 way to control overspending.",
    });
  }

  // 5. Not enough data
  if (transactions.length === 0) {
    insights.push({
      type: "info",
      icon: "auto_awesome",
      title: "Welcome to BudgetWise!",
      message:
        "Start adding your income and expenses to unlock personalized AI-powered financial insights tailored to your spending habits.",
    });
  }

  // 6. Frequent small expenses (potential leakage)
  const smallExpenses = transactions.filter(
    (t) => t.type === "expense" && t.amount <= 200
  );
  if (smallExpenses.length >= 8) {
    const total = smallExpenses.reduce((s, t) => s + t.amount, 0);
    insights.push({
      type: "info",
      icon: "coffee",
      title: "Small expenses add up",
      message: `You made ${smallExpenses.length} small purchases (≤ ₹200 each) totaling ${inr(
        total
      )}. These "invisible" expenses often account for significant monthly leakage — track them closely.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "success",
      icon: "check_circle",
      title: "You're on track!",
      message: "No red flags detected in your recent finances. Keep up the balanced spending habits.",
    });
  }

  return insights;
}

/**
 * Answers a free-text question locally using simple keyword matching + financial data context.
 * Used as a fallback when the external AI API is unreachable.
 */
function answerLocally(question = "", context = {}) {
  const { transactions = [], budgets = [] } = context;
  const { income, expense, balance, byCategory } = summarize(transactions);
  const q = question.toLowerCase();

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  if (q.includes("save") || q.includes("saving")) {
    const rate = income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;
    return `Based on your data, your current savings rate is ${rate}%. A healthy target is 20%+. Try automating a fixed transfer to savings right after you receive income, and review your top spending category (${
      topCategory ? topCategory[0] : "N/A"
    }) for cuts.`;
  }

  if (q.includes("budget")) {
    if (budgets.length === 0) {
      return "You don't have any budgets set yet. I'd suggest starting with your top 3 spending categories and applying the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings/investments.";
    }
    const overBudget = budgets.filter((b) => (byCategory[b.category] || 0) > b.limit);
    if (overBudget.length > 0) {
      return `You're currently over budget in: ${overBudget
        .map((b) => b.category)
        .join(", ")}. Consider reallocating funds from categories where you're under budget.`;
    }
    return "All your budgets are currently within limits. Great job! Keep monitoring weekly rather than just at month-end.";
  }

  if (q.includes("invest") || q.includes("investment")) {
    return "For long-term wealth building in India, consider a mix of: Equity Mutual Funds/SIPs (growth), PPF/EPF (safe, tax-saving), and an Emergency Fund equal to 3-6 months of expenses kept in a liquid fund or savings account before investing aggressively.";
  }

  if (q.includes("expense") || q.includes("spending") || q.includes("spend")) {
    return topCategory
      ? `Your highest spending category is "${topCategory[0]}" at ${inr(
          topCategory[1]
        )}. Total expenses so far: ${inr(expense)} against income of ${inr(
          income
        )}, leaving a balance of ${inr(balance)}.`
      : "You haven't logged any expenses yet. Start adding transactions to get detailed spending insights.";
  }

  if (q.includes("debt") || q.includes("loan") || q.includes("emi")) {
    return "For debt management: prioritize paying off high-interest debt (like credit cards, ~36-42% APR) first, using either the avalanche method (highest interest first) or snowball method (smallest balance first) for motivation. Avoid taking new loans until existing EMIs are under 40% of your monthly income.";
  }

  return `Here's a quick snapshot: Income ${inr(income)}, Expenses ${inr(
    expense
  )}, Balance ${inr(
    balance
  )}. Ask me about "savings", "budgets", "investments", "spending", or "debt" for more focused advice!`;
}

module.exports = { generateInsights, answerLocally, summarize, inr };
