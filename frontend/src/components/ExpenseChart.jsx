import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { formatINR, CATEGORY_COLORS } from "../services/constants";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        {label && <p className="chart-tooltip-label">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>
            {p.name}: <strong>{formatINR(p.value)}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CategoryPieChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="empty-state">
        <span className="material-icons-round">pie_chart</span>
        <p>No expense data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          animationDuration={700}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#94A3B8"} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "0.78rem", paddingTop: 10 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const TrendLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaecf3" vertical={false} />
        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.8rem" }} />
        <Line
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          animationDuration={800}
        />
        <Line
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#f43f5e"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const IncomeExpenseBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaecf3" vertical={false} />
        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,70,229,0.05)" }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.8rem" }} />
        <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={800} />
        <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
};
