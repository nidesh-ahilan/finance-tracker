import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Transaction.css";

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
}

const Transaction = ({ userId, updateTransactions }: { userId: string; updateTransactions: (newTransactions: Transaction[]) => void }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.username === userId);

    if (user) {
      setTransactions(user.transactions || []);
    }
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === "" || category.trim() === "") return;

    const newTransaction = { id: Date.now(), type, category, amount: Number(amount) };
    const updatedTransactions = editId
      ? transactions.map((t) => (t.id === editId ? { ...t, type, category, amount: Number(amount) } : t))
      : [...transactions, newTransaction];

    setTransactions(updatedTransactions);
    updateTransactions(updatedTransactions);
    resetForm();
  };

  const handleDelete = (id: number) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    updateTransactions(updatedTransactions);
  };

  const handleEdit = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setType(transaction.type);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setEditId(id);
    }
  };

  const resetForm = () => {
    setType("income");
    setCategory("");
    setAmount("");
    setEditId(null);
  };

  return (
    <div className="transaction-container">
      <h2>Transactions</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}> 
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <ul className="transaction-list">
        {transactions.map((t) => (
          <li key={t.id} className={`transaction-item ${t.type}`}>
            <span>{t.category}: ₹{t.amount}</span>
            <div>
              <button onClick={() => handleEdit(t.id)}><FontAwesomeIcon icon={faPen}/></button>
              <button onClick={() => handleDelete(t.id)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;

