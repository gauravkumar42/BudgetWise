const Transaction = require("../models/Transaction");

// @desc    Get all transactions for logged in user (with optional filters)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { type, category, from, to, search, month } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.note = { $regex: search, $options: "i" };

    if (month) {
      // month format: YYYY-MM
      const [y, m] = month.split("-").map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    } else if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, note, date, paymentMethod } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      note,
      date: date || Date.now(),
      paymentMethod,
    });

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const fields = ["type", "amount", "category", "note", "date", "paymentMethod"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) transaction[f] = req.body[f];
    });

    await transaction.save();
    res.status(200).json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get summary stats (income, expense, balance, category breakdown)
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const query = { user: req.user._id };

    if (month) {
      const [y, m] = month.split("-").map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const transactions = await Transaction.find(query);

    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const byCategory = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });

    // last 6 months trend
    const now = new Date();
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-IN", { month: "short" });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthTx = await Transaction.find({
        user: req.user._id,
        date: { $gte: start, $lte: end },
      });

      trend.push({
        month: label,
        income: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        income,
        expense,
        balance: income - expense,
        byCategory,
        trend,
        transactionCount: transactions.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction, getSummary };
