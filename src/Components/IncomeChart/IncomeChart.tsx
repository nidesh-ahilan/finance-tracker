import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
}

const IncomeChart = ({ transactions }: { transactions: Transaction[] }) => {
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  const incomeCategories = [...new Set(incomeTransactions.map((t) => t.category))];
  const incomeData = incomeCategories.map((category) =>
    incomeTransactions.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0)
  );

  const data = {
    labels: incomeCategories,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: ["#4CAF50", "#FFEB3B", "#00BCD4", "#FF9800", "#E91E63"],
      },
    ],
  };

  return (
    <div>
      <h2>Income Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default IncomeChart;
