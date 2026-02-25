import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Search, Users, DollarSign, UserCheck } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  contact: string;
  salary: number;
  status: "active" | "inactive";
}

const initialEmployees: Employee[] = [
  { id: "1", name: "Arun Kumar", role: "Site Manager", contact: "arun@email.com", salary: 45000, status: "active" },
  { id: "2", name: "Priya Sharma", role: "Accountant", contact: "priya@email.com", salary: 35000, status: "active" },
  { id: "3", name: "Rajesh Nair", role: "Equipment Operator", contact: "rajesh@email.com", salary: 28000, status: "active" },
  { id: "4", name: "Deepa Menon", role: "HR Manager", contact: "deepa@email.com", salary: 40000, status: "inactive" },
];

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", contact: "", salary: "", status: "active" as "active" | "inactive" });

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayroll = employees.filter(e => e.status === "active").reduce((sum, e) => sum + e.salary, 0);
  const activeCount = employees.filter(e => e.status === "active").length;

  const openAdd = () => { setEditingId(null); setForm({ name: "", role: "", contact: "", salary: "", status: "active" }); setDialogOpen(true); };
  const openEdit = (emp: Employee) => { setEditingId(emp.id); setForm({ name: emp.name, role: emp.role, contact: emp.contact, salary: emp.salary.toString(), status: emp.status }); setDialogOpen(true); };

  const save = () => {
    if (!form.name || !form.role) return;
    if (editingId) {
      setEmployees(employees.map(e => e.id === editingId ? { ...e, name: form.name, role: form.role, contact: form.contact, salary: parseFloat(form.salary) || 0, status: form.status } : e));
    } else {
      setEmployees([{ id: Date.now().toString(), name: form.name, role: form.role, contact: form.contact, salary: parseFloat(form.salary) || 0, status: form.status }, ...employees]);
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => setEmployees(employees.filter(e => e.id !== id));

  return (
    <Layout showBack title="Employees">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Employees</p><p className="text-2xl font-bold">{employees.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-emerald-500/10"><UserCheck className="h-6 w-6 text-emerald-500" /></div>
              <div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-emerald-500">{activeCount}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-accent/10"><DollarSign className="h-6 w-6 text-accent" /></div>
              <div><p className="text-sm text-muted-foreground">Monthly Payroll</p><p className="text-2xl font-bold">${totalPayroll.toLocaleString()}</p></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Employee Directory</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="gradient-primary text-white" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Employee</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                    <div><Label>Contact</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></div>
                    <div><Label>Salary</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></div>
                    <Button onClick={save} className="w-full gradient-primary text-white">{editingId ? "Update" : "Add"} Employee</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Contact</TableHead><TableHead>Salary</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.contact}</TableCell>
                    <TableCell>${emp.salary.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={emp.status === "active" ? "default" : "secondary"}>{emp.status}</Badge></TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(emp)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(emp.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default Employees;
