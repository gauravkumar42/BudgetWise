import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("budgetwise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid token globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("budgetwise_token");
      localStorage.removeItem("budgetwise_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/* ---------------- Auth ---------------- */
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateMe = (data) => api.put("/auth/me", data);

/* ---------------- Transactions ---------------- */
export const getTransactions = (params) => api.get("/transactions", { params });
export const getSummary = (params) => api.get("/transactions/summary", { params });
export const createTransaction = (data) => api.post("/transactions", data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

/* ---------------- Budgets ---------------- */
export const getBudgets = (params) => api.get("/budgets", { params });
export const upsertBudget = (data) => api.post("/budgets", data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

/* ---------------- Advisor ---------------- */
export const getInsights = (params) => api.get("/advisor/insights", { params });
export const askAdvisor = (question) => api.post("/advisor/ask", { question });

export default api;
