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
import { Plus, Trash2, Edit, Wrench, Package, CheckCircle } from "lucide-react";

interface RentalItem {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  status: "available" | "rented" | "returned";
  rentedTo?: string;
  rentDate?: string;
}

const initialItems: RentalItem[] = [
  { id: "1", name: "Excavator CAT 320", category: "Heavy Equipment", dailyRate: 500, status: "rented", rentedTo: "ABC Corp", rentDate: "2025-01-15" },
  { id: "2", name: "Concrete Mixer", category: "Machinery", dailyRate: 150, status: "available" },
  { id: "3", name: "Scaffolding Set", category: "Structure", dailyRate: 75, status: "returned", rentedTo: "XYZ Ltd", rentDate: "2025-01-10" },
  { id: "4", name: "Power Drill Set", category: "Tools", dailyRate: 25, status: "available" },
  { id: "5", name: "Welding Machine", category: "Tools", dailyRate: 80, status: "rented", rentedTo: "Acme Inc", rentDate: "2025-01-18" },
];

const Rentals = () => {
  const [items, setItems] = useState<RentalItem[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "", dailyRate: "", status: "available" as RentalItem["status"] });

  const availableCount = items.filter(i => i.status === "available").length;
  const rentedCount = items.filter(i => i.status === "rented").length;

  const openAdd = () => { setEditingId(null); setForm({ name: "", category: "", dailyRate: "", status: "available" }); setDialogOpen(true); };
  const openEdit = (item: RentalItem) => { setEditingId(item.id); setForm({ name: item.name, category: item.category, dailyRate: item.dailyRate.toString(), status: item.status }); setDialogOpen(true); };

  const save = () => {
    if (!form.name || !form.category) return;
    if (editingId) {
      setItems(items.map(i => i.id === editingId ? { ...i, name: form.name, category: form.category, dailyRate: parseFloat(form.dailyRate) || 0, status: form.status } : i));
    } else {
      setItems([{ id: Date.now().toString(), name: form.name, category: form.category, dailyRate: parseFloat(form.dailyRate) || 0, status: form.status }, ...items]);
    }
    setDialogOpen(false);
  };

  const statusColor = (s: string) => s === "available" ? "bg-emerald-500/10 text-emerald-600" : s === "rented" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600";

  return (
    <Layout showBack title="Rentals">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-primary/10"><Package className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{items.length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-emerald-500/10"><CheckCircle className="h-6 w-6 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-emerald-500">{availableCount}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-amber-500/10"><Wrench className="h-6 w-6 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Rented</p><p className="text-2xl font-bold text-amber-500">{rentedCount}</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Rental Catalog</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild><Button size="sm" className="gradient-primary text-white" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Item</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Rental Item</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                  <div><Label>Daily Rate ($)</Label><Input type="number" value={form.dailyRate} onChange={e => setForm({ ...form, dailyRate: e.target.value })} /></div>
                  <div><Label>Status</Label>
                    <Select value={form.status} onValueChange={(v: RentalItem["status"]) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="available">Available</SelectItem><SelectItem value="rented">Rented</SelectItem><SelectItem value="returned">Returned</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <Button onClick={save} className="w-full gradient-primary text-white">{editingId ? "Update" : "Add"} Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Daily Rate</TableHead><TableHead>Status</TableHead><TableHead>Rented To</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.dailyRate}/day</TableCell>
                    <TableCell><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(item.status)}`}>{item.status}</span></TableCell>
                    <TableCell>{item.rentedTo || "-"}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 className="h-4 w-4" /></Button>
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

export default Rentals;
