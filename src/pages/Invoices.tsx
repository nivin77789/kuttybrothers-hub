import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Eye, Search } from "lucide-react";

interface InvoiceItem { description: string; qty: number; rate: number; }
interface Invoice {
  id: string;
  client: string;
  date: string;
  items: InvoiceItem[];
  tax: number;
  status: "paid" | "pending" | "overdue";
}

const initialInvoices: Invoice[] = [
  { id: "INV-001", client: "ABC Corp", date: "2025-01-15", items: [{ description: "Web Development", qty: 1, rate: 5000 }], tax: 10, status: "paid" },
  { id: "INV-002", client: "XYZ Ltd", date: "2025-01-18", items: [{ description: "Equipment Rental", qty: 3, rate: 500 }], tax: 5, status: "pending" },
  { id: "INV-003", client: "Acme Inc", date: "2025-01-10", items: [{ description: "Consulting", qty: 10, rate: 200 }], tax: 8, status: "overdue" },
];

const calcTotal = (inv: Invoice) => {
  const sub = inv.items.reduce((s, i) => s + i.qty * i.rate, 0);
  return sub + sub * inv.tax / 100;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ client: "", itemDesc: "", qty: "1", rate: "", tax: "10" });

  const filtered = invoices
    .filter(i => filterStatus === "all" || i.status === filterStatus)
    .filter(i => i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()));

  const addInvoice = () => {
    if (!form.client || !form.itemDesc || !form.rate) return;
    const inv: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      client: form.client,
      date: new Date().toISOString().split("T")[0],
      items: [{ description: form.itemDesc, qty: parseInt(form.qty) || 1, rate: parseFloat(form.rate) || 0 }],
      tax: parseFloat(form.tax) || 0,
      status: "pending",
    };
    setInvoices([inv, ...invoices]);
    setForm({ client: "", itemDesc: "", qty: "1", rate: "", tax: "10" });
    setDialogOpen(false);
  };

  const statusColor = (s: string) => s === "paid" ? "default" : s === "pending" ? "secondary" : "destructive";

  return (
    <Layout showBack title="Invoices">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-primary/10"><FileText className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Invoices</p><p className="text-2xl font-bold">{invoices.length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-emerald-500/10"><FileText className="h-6 w-6 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Paid</p><p className="text-2xl font-bold text-emerald-500">{invoices.filter(i => i.status === "paid").length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-rose-500/10"><FileText className="h-6 w-6 text-rose-500" /></div>
            <div><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-rose-500">{invoices.filter(i => i.status === "overdue").length}</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg">Invoice List</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-40" /></div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="gradient-primary text-white"><Plus className="h-4 w-4 mr-1" /> New Invoice</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Client</Label><Input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></div>
                    <div><Label>Item Description</Label><Input value={form.itemDesc} onChange={e => setForm({ ...form, itemDesc: e.target.value })} /></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><Label>Qty</Label><Input type="number" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} /></div>
                      <div><Label>Rate</Label><Input type="number" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} /></div>
                      <div><Label>Tax %</Label><Input type="number" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })} /></div>
                    </div>
                    <Button onClick={addInvoice} className="w-full gradient-primary text-white">Create Invoice</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Client</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell><Badge variant={statusColor(inv.status) as any}>{inv.status}</Badge></TableCell>
                    <TableCell className="text-right font-medium">${calcTotal(inv).toLocaleString()}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewInvoice(inv)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setInvoices(invoices.filter(i => i.id !== inv.id))}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Invoice Dialog */}
        <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Invoice {viewInvoice?.id}</DialogTitle></DialogHeader>
            {viewInvoice && (
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Client:</span><span className="font-medium">{viewInvoice.client}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span>{viewInvoice.date}</span></div>
                <div className="border rounded-lg p-3">
                  {viewInvoice.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.description} (x{item.qty})</span><span>${(item.qty * item.rate).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 flex justify-between text-sm text-muted-foreground"><span>Tax ({viewInvoice.tax}%)</span><span>${(viewInvoice.items.reduce((s, i) => s + i.qty * i.rate, 0) * viewInvoice.tax / 100).toFixed(2)}</span></div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold"><span>Total</span><span>${calcTotal(viewInvoice).toLocaleString()}</span></div>
                </div>
                <Button onClick={() => window.print()} variant="outline" className="w-full">Print Invoice</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Invoices;
