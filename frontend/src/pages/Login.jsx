import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const { user, login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, name });
      showToast("Welcome to BudgetWise!", "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="brand-mark auth-brand-mark">₹</div>
          <h1>BudgetWise</h1>
          <p>AI-Driven Expense Tracker &amp; Budget Advisor</p>

          <ul className="auth-features">
            <li>
              <span className="material-icons-round">bolt</span>
              Track income &amp; expenses instantly
            </li>
            <li>
              <span className="material-icons-round">auto_awesome</span>
              Get AI-powered financial suggestions
            </li>
            <li>
              <span className="material-icons-round">pie_chart</span>
              Set smart category budgets
            </li>
            <li>
              <span className="material-icons-round">shield</span>
              Works offline with a built-in local advisor
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card">
          <h2>Welcome 👋</h2>
          <p className="auth-subtitle">Enter your email to sign in or create your account instantly.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <div className="spinner"></div> : "Continue"}
              {!submitting && <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>arrow_forward</span>}
            </button>
          </form>

          <p className="auth-note">
            <span className="material-icons-round" style={{ fontSize: "1rem" }}>
              lock
            </span>
            No password needed. We keep things simple — just your email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
