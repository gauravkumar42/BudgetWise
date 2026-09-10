const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// @desc    Get all budgets for a given month (defaults to current month), with spent amount
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const month = req.query.month || currentMonth();
    const budgets = await Budget.find({ user: req.user._id, month });

    const [y, m] = month.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      date: { $gte: start, $lte: end },
    });

    const spentByCategory = {};
    transactions.forEach((t) => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
    });

    const enriched = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      month: b.month,
      spent: spentByCategory[b.category] || 0,
      percentUsed: b.limit > 0 ? Math.min(((spentByCategory[b.category] || 0) / b.limit) * 100, 999) : 0,
    }));

    res.status(200).json({ success: true, budgets: enriched });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or update a budget for a category+month
// @route   POST /api/budgets
// @access  Private
const upsertBudget = async (req, res, next) => {
  try {
    const { category, limit, month } = req.body;
    const targetMonth = month || currentMonth();

    if (!category || !limit) {
      return res.status(400).json({ success: false, message: "Category and limit are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month: targetMonth },
      { limit },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, budget });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
