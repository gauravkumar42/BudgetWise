const express = require("express");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;
