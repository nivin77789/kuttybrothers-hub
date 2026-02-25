import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
}

const initialTransactions: Transaction[] = [
  { id: "1", date: "2025-01-15", description: "Client Payment - Project A", type: "income", amount: 5000, category: "Sales" },
  { id: "2", date: "2025-01-16", description: "Office Rent", type: "expense", amount: 1200, category: "Rent" },
  { id: "3", date: "2025-01-17", description: "Tool Rental Income", type: "income", amount: 800, category: "Rental" },
  { id: "4", date: "2025-01-18", description: "Employee Salary", type: "expense", amount: 3000, category: "Payroll" },
  { id: "5", date: "2025-01-20", description: "Equipment Purchase", type: "expense", amount: 500, category: "Equipment" },
];

const COLORS = ["hsl(235, 70%, 60%)", "hsl(260, 60%, 58%)", "hsl(200, 70%, 50%)", "hsl(150, 60%, 45%)"];

const Accounts = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filterType, setFilterType] = useState<string>("all");
  const [newTx, setNewTx] = useState({ description: "", type: "income" as "income" | "expense", amount: "", category: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filtered = filterType === "all" ? transactions : transactions.filter(t => t.type === filterType);

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpense },
  ];

  const monthlyData = [
    { month: "Jan", income: totalIncome, expense: totalExpense },
    { month: "Feb", income: totalIncome * 0.8, expense: totalExpense * 0.9 },
    { month: "Mar", income: totalIncome * 1.2, expense: totalExpense * 0.7 },
  ];

  const addTransaction = () => {
    if (!newTx.description || !newTx.amount || !newTx.category) return;
    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      description: newTx.description,
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
    };
    setTransactions([tx, ...transactions]);
    setNewTx({ description: "", type: "income", amount: "", category: "" });
    setDialogOpen(false);
  };

  const deleteTransaction = (id: string) => setTransactions(transactions.filter(t => t.id !== id));

  return (
    <Layout showBack title="Accounts">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-primary/10"><DollarSign className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Balance</p><p className="text-2xl font-bold">${balance.toLocaleString()}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-emerald-500/10"><TrendingUp className="h-6 w-6 text-emerald-500" /></div>
              <div><p className="text-sm text-muted-foreground">Total Income</p><p className="text-2xl font-bold text-emerald-500">${totalIncome.toLocaleString()}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-rose-500/10"><TrendingDown className="h-6 w-6 text-rose-500" /></div>
              <div><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold text-rose-500">${totalExpense.toLocaleString()}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-accent/10"><Wallet className="h-6 w-6 text-accent" /></div>
              <div><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{transactions.length}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Income vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="income" fill="hsl(150, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(0, 70%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Distribution</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Transactions</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary text-white"><Plus className="h-4 w-4 mr-1" /> Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Description</Label><Input value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} /></div>
                    <div><Label>Type</Label>
                      <Select value={newTx.type} onValueChange={(v: "income" | "expense") => setNewTx({ ...newTx, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Amount</Label><Input type="number" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} /></div>
                    <div><Label>Category</Label><Input value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })} /></div>
                    <Button onClick={addTransaction} className="w-full gradient-primary text-white">Add Transaction</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteTransaction(tx.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Accounts;
