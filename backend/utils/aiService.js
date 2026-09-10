/**
 * AI Service — attempts to use a FREE, no-signup, no-API-key text generation API
 * (Pollinations.ai text endpoint: https://text.pollinations.ai/) to generate a
 * natural-language financial suggestion.
 *
 * IMPORTANT: This call is wrapped in a strict timeout + try/catch. If it fails
 * for ANY reason (network down, API down, rate limited, timeout), the caller
 * (advisorController) automatically falls back to the 100% local rule-based
 * advisor (utils/localAdvisor.js) so the feature NEVER breaks for the user.
 */

const fetch = require("node-fetch");

const AI_TIMEOUT_MS = 8000;
const AI_ENDPOINT = "https://text.pollinations.ai";

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * @param {string} prompt - the full prompt (already includes financial context)
 * @returns {Promise<string|null>} AI-generated text, or null if it failed
 */
async function askAI(prompt) {
  try {
    const url = `${AI_ENDPOINT}/${encodeURIComponent(prompt)}?model=openai&private=true`;

    const response = await withTimeout(
      fetch(url, {
        method: "GET",
        headers: { "Content-Type": "text/plain" },
      }),
      AI_TIMEOUT_MS
    );

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("AI API returned empty response");
    }

    return text.trim();
  } catch (err) {
    console.warn("⚠️  AI API unavailable, will use local advisor fallback:", err.message);
    return null;
  }
}

/**
 * Builds a concise, context-rich prompt so the free-tier model gives
 * useful, on-topic Indian-Rupee financial advice.
 */
function buildFinancialPrompt({ question, income, expense, balance, topCategory, budgetsSummary }) {
  return (
    `You are BudgetWise, a concise and friendly Indian personal finance advisor. ` +
    `All amounts are in Indian Rupees (INR). User's monthly income: Rs.${income}, ` +
    `total expenses: Rs.${expense}, balance: Rs.${balance}. ` +
    `Top spending category: ${topCategory || "N/A"}. Budget status: ${budgetsSummary || "no budgets set"}. ` +
    `User question: "${question}". ` +
    `Give a short (max 60 words), practical, encouraging, specific answer. Do not use markdown formatting.`
  );
}

module.exports = { askAI, buildFinancialPrompt };
