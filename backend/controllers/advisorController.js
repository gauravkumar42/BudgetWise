const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const { generateInsights, answerLocally, summarize } = require("../utils/localAdvisor");
const { askAI, buildFinancialPrompt } = require("../utils/aiService");

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// @desc    Get automatic AI + local insights based on user's current data
// @route   GET /api/advisor/insights
// @access  Private
const getInsights = async (req, res, next) => {
  try {
    const month = req.query.month || currentMonth();
    const [y, m] = month.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });
    const budgets = await Budget.find({ user: req.user._id, month });

    // Local insights ALWAYS generated first — guaranteed to work
    const localInsights = generateInsights({ transactions, budgets });

    res.status(200).json({
      success: true,
      source: "local",
      insights: localInsights,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Ask the advisor a free-text question. Tries free AI API first, falls back to local engine.
// @route   POST /api/advisor/ask
// @access  Private
const ask = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const month = currentMonth();
    const [y, m] = month.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });
    const budgets = await Budget.find({ user: req.user._id, month });
    const { income, expense, balance, byCategory } = summarize(transactions);

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const budgetsSummary = budgets
      .map((b) => `${b.category}: Rs.${byCategory[b.category] || 0}/Rs.${b.limit}`)
      .join(", ");

    // 1. Try free AI API (no key required)
    const prompt = buildFinancialPrompt({
      question,
      income,
      expense,
      balance,
      topCategory: topCategory ? topCategory[0] : null,
      budgetsSummary,
    });

    const aiAnswer = await askAI(prompt);

    if (aiAnswer) {
      return res.status(200).json({
        success: true,
        source: "ai",
        answer: aiAnswer,
      });
    }

    // 2. Fallback: 100% local rule-based answer — guaranteed to work
    const localAnswer = answerLocally(question, { transactions, budgets });

    res.status(200).json({
      success: true,
      source: "local",
      answer: localAnswer,
      note: "AI service was unavailable — answered using BudgetWise's built-in local advisor.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInsights, ask };
