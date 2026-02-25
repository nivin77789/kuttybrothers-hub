import { useState } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  Wrench,
  Package,
  CheckCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  DollarSign
} from "lucide-react";

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
  { id: "1", name: "Excavator CAT 320", category: "Heavy Equipment", dailyRate: 500, status: "rented", rentedTo: "ABC Corp", rentDate: "2025-02-15" },
  { id: "2", name: "Concrete Mixer", category: "Machinery", dailyRate: 150, status: "available" },
  { id: "3", name: "Scaffolding Set", category: "Structure", dailyRate: 75, status: "returned", rentedTo: "XYZ Ltd", rentDate: "2025-02-10" },
  { id: "4", name: "Power Drill Set", category: "Tools", dailyRate: 25, status: "available" },
  { id: "5", name: "Welding Machine", category: "Tools", dailyRate: 80, status: "rented", rentedTo: "Acme Inc", rentDate: "2025-02-18" },
];

const RentalDashboard = () => {
  const [items, setItems] = useState<RentalItem[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", category: "", dailyRate: "", status: "available" as RentalItem["status"] });

  const stats = [
    { label: "Total Assets", value: items.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Available", value: items.filter(i => i.status === "available").length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "On Rent", value: items.filter(i => i.status === "rented").length, icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Revenue", value: "$12.4k", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  ];

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-lg font-bold">AVAILABLE</Badge>;
      case "rented": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 rounded-lg font-bold">ON RENT</Badge>;
      case "returned": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 rounded-lg font-bold">RETURNED</Badge>;
      default: return null;
    }
  };

  return (
    <RentalLayout title="Rental Dashboard">
      <div className="space-y-8 pb-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-white/5 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[40px] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-white/5 shadow-inner`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest bg-white/5 px-2 py-1 rounded-md">Live</div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Catalog Section */}
        <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Fleet Inventory
                </CardTitle>
                <CardDescription className="text-sm font-medium opacity-60">Manage and track your premium rental assets across all locations.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest h-10 px-4 rounded-xl transition-all">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gradient-primary text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={openAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Deploy New Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card/90 backdrop-blur-2xl border-white/10 rounded-3xl p-8 max-w-lg">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-black tracking-tight">{editingId ? "Modify Asset" : "Deploy Asset"}</DialogTitle>
                      <DialogDescription className="font-medium text-sm">Fill in the details below to update your inventory status.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Asset Nomenclature</Label>
                        <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 rounded-xl h-12" placeholder="e.g. Caterpillar 320 GC" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Classification</Label>
                          <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-white/5 border-white/10 rounded-xl h-12" placeholder="Heavy Equipment" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Daily Yield ($)</Label>
                          <Input type="number" value={form.dailyRate} onChange={e => setForm({ ...form, dailyRate: e.target.value })} className="bg-white/5 border-white/10 rounded-xl h-12" placeholder="500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Operational Status</Label>
                        <Select value={form.status} onValueChange={(v: RentalItem["status"]) => setForm({ ...form, status: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-xl">
                            <SelectItem value="available">Ready for Deployment</SelectItem>
                            <SelectItem value="rented">Currently Deployed</SelectItem>
                            <SelectItem value="returned">Under Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={save} className="w-full h-12 gradient-primary text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 mt-4">{editingId ? "Update Configuration" : "Finalize Deployment"}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters Row */}
            <div className="py-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by name or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/5 focus:bg-white/10 rounded-2xl transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-white/10 border border-white/5">
                  <Filter className="h-5 w-5" />
                </Button>
                <div className="h-12 w-px bg-white/5 mx-2" />
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
                  Showing {filteredItems.length} Entries
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-50">Operational Asset</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Classification</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Daily Yield</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Assigned To</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner ring-1 ring-primary/20 group-hover:rotate-3 transition-transform">
                              {item.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-sm tracking-tight">{item.name}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">ID: {item.id.padStart(4, '0')}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-black text-sm">${item.dailyRate}</span>
                            <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase">Per Cycle</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-sm font-bold opacity-70 italic font-serif">
                          {item.rentedTo ? (
                            <div className="flex flex-col items-start gap-1">
                              <span>{item.rentedTo}</span>
                              <div className="flex items-center gap-1 text-[9px] text-muted-foreground not-italic uppercase font-sans tracking-widest">
                                <Calendar className="h-3 w-3" />
                                {item.rentDate}
                              </div>
                            </div>
                          ) : (
                            <span className="opacity-30 not-italic font-sans text-xs tracking-widest">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-8 flex justify-center py-6">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(item)}
                              className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setItems(items.filter(i => i.id !== item.id))}
                              className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RentalLayout>
  );
};

export default RentalDashboard;
