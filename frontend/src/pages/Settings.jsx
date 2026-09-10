import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState(user?.monthlyIncomeGoal || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, monthlyIncomeGoal: Number(monthlyIncomeGoal) || 0 });
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>Settings</h2>
          <p>Manage your profile and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="settings-profile-header">
            <div className="settings-avatar" style={{ background: user?.avatarColor || "#4F46E5" }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3>{user?.name}</h3>
              <p className="text-muted">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ marginTop: 22 }}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" className="input" value={user?.email || ""} disabled />
            </div>

            <div className="input-group">
              <label>Monthly Income Goal (₹)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 50000"
                value={monthlyIncomeGoal}
                onChange={(e) => setMonthlyIncomeGoal(e.target.value)}
                min="0"
              />
            </div>

            <div className="input-group">
              <label>Currency</label>
              <input type="text" className="input" value="Indian Rupee (₹ INR)" disabled />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner"></div> : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="settings-side">
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", marginBottom: 12 }}>About BudgetWise</h3>
            <ul className="about-list">
              <li>
                <span className="material-icons-round">verified</span>
                No password required — simple email-based access
              </li>
              <li>
                <span className="material-icons-round">bolt</span>
                Fast, lightweight, built on the MERN stack
              </li>
              <li>
                <span className="material-icons-round">auto_awesome</span>
                Free AI advisor with guaranteed local fallback
              </li>
              <li>
                <span className="material-icons-round">currency_rupee</span>
                All amounts shown in Indian Rupees (₹)
              </li>
            </ul>
          </div>

          <div className="card danger-zone">
            <h3 style={{ fontSize: "0.95rem", marginBottom: 6, color: "var(--danger)" }}>Sign Out</h3>
            <p className="text-muted" style={{ fontSize: "0.83rem", marginBottom: 14 }}>
              You can always sign back in instantly using the same email.
            </p>
            <button className="btn btn-danger btn-block" onClick={handleLogout}>
              <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
                logout
              </span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
