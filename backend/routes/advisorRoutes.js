const express = require("express");
const { getInsights, ask } = require("../controllers/advisorController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/insights", getInsights);
router.post("/ask", ask);

module.exports = router;
