import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Advisor from "./pages/Advisor";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const AppLayout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-content">
      <div className="page-container">{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <AppLayout>
              <Transactions />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <PrivateRoute>
            <AppLayout>
              <Budgets />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/advisor"
        element={
          <PrivateRoute>
            <AppLayout>
              <Advisor />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <AppLayout>
              <Reports />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
