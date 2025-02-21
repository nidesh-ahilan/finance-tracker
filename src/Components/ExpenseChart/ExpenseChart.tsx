import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
}

const ExpenseChart = ({ transactions }: { transactions: Transaction[] }) => {
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const expenseCategories = [...new Set(expenseTransactions.map((t) => t.category))];
  const expenseData = expenseCategories.map((category) =>
    expenseTransactions.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0)
  );

  const data = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: ["#F44336", "#9C27B0", "#3F51B5", "#FFC107", "#795548"],
      },
    ],
  };

  return (
    <div>
      <h2>Expense Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseChart;
