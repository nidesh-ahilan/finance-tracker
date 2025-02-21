import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Transaction from "../Transaction/Transaction";
import IncomeChart from "../IncomeChart/IncomeChart";
import ExpenseChart from "../ExpenseChart/ExpenseChart";
interface DashboardProps {
  userId: string | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const [transactions, setTransactions] = useState<{ id: number; type: "income" | "expense"; category: string; amount: number }[]>([]);
  const [budget, setBudget] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const activeUser = localStorage.getItem("activeUser");

  useEffect(() => {
    if (!activeUser) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.username === activeUser);

    if (user) {
      setTransactions(user.transactions || []);
    }
  }, [activeUser]);

  useEffect(() => {
    let income = 0, expense = 0;

    transactions.forEach(t => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expense += t.amount;
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setBudget(income - expense);
  }, [transactions]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const updateTransactions = (newTransactions: typeof transactions) => {
    if (!activeUser) return;

    setTransactions([...newTransactions]);

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: any) =>
      user.username === activeUser ? { ...user, transactions: newTransactions } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <header className="dashboard-header">
        <h1>Personal Finance Tracker</h1>
        <div className="header-buttons">
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <div className="welcome">
        <h2>Welcome, {activeUser}</h2>
      </div>

      <div className="budget-summary">
        <div className="budget-box">
          <h2>Budget</h2>
          <p style={{ color: budget > 0 ? "green" : budget === 0 ? "orange" : "red" }}>
            ₹{budget}
          </p>
        </div>

        <div className="income-expense">
          <h2>Income</h2>
          <p style={{ color: "green" }}>₹{totalIncome}</p>
          <h2>Expense</h2>
          <p style={{ color: "red" }}>₹{totalExpense}</p>
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => navigate("/dashboard/transactions")}>Transactions</button>
        <button onClick={() => navigate("/dashboard/income-chart")}>Income Pie Chart</button>
        <button onClick={() => navigate("/dashboard/expense-chart")}>Expense Pie Chart</button>
      </div>

      <div className="dynamic-content">
        <Routes>
          <Route path="/" element={<Transaction userId={activeUser || ""} updateTransactions={updateTransactions} />} />
          <Route path="transactions" element={<Transaction userId={activeUser || ""} updateTransactions={updateTransactions} />} />
          <Route path="income-chart" element={<IncomeChart transactions={transactions} />} />
          <Route path="expense-chart" element={<ExpenseChart transactions={transactions} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
