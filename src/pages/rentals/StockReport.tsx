import { useState, useEffect, useMemo } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BarChart2,
    Plus,
    Search,
    Package,
    CheckCircle,
    AlertTriangle,
    History,
    TrendingUp,
    Filter,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, push, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type StockStatus = "Available" | "Rented" | "Damaged" | "Repairing" | "Expired" | "Blocked" | "Reserved" | "Pending";

interface StockItem {
    id: string;
    itemName: string;
    brand: string;
    mainType: string;
    subType: string;
    mainCode: string;
    subCode: string;
    description: string;
    count: number;
    status: StockStatus;
    createdAt: number;
}

interface GroupedStock {
    key: string;
    itemName: string;
    brand: string;
    mainType: string;
    subType: string;
    mainCode: string;
    subCode: string;
    description: string;
    counts: Record<StockStatus, number>;
    totalSum: number;
}

const StockReport = () => {
    const [items, setItems] = useState<StockItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        itemName: "",
        brand: "",
        mainType: "",
        subType: "",
        mainCode: "",
        subCode: "",
        description: "",
        count: 1,
        status: "Available" as StockStatus
    });

    useEffect(() => {
        const stockRef = ref(db, 'rentals/stock');
        console.log("Setting up listener for rentals/stock");

        return onValue(stockRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const itemList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setItems(itemList);
                } else {
                    setItems([]);
                }
                setIsLoading(false);
            },
            (error) => {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error("Firebase read error:", error);
                toast.error(`Firebase Connection Error: ${errorMessage}`);
                setIsLoading(false);
            }
        );
    }, []);

    const groupedItems = useMemo(() => {
        const groups: Record<string, GroupedStock> = {};
        const statuses: StockStatus[] = ["Available", "Rented", "Damaged", "Repairing", "Expired", "Blocked", "Reserved", "Pending"];

        items.forEach(item => {
            const key = `${item.itemName}-${item.brand}-${item.mainCode}-${item.subCode}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    itemName: item.itemName,
                    brand: item.brand,
                    mainType: item.mainType,
                    subType: item.subType,
                    mainCode: item.mainCode,
                    subCode: item.subCode,
                    description: item.description,
                    counts: statuses.reduce((acc, status) => ({ ...acc, [status]: 0 }), {} as Record<StockStatus, number>),
                    totalSum: 0
                };
            }
            groups[key].counts[item.status] += (Number(item.count) || 0);
            groups[key].totalSum += (Number(item.count) || 0);
        });

        return Object.values(groups).reverse();
    }, [items]);

    const handleAddStock = async () => {
        if (!formData.itemName || !formData.brand || !formData.mainCode) {
            toast.error("Please fill in required fields (Item Name, Brand, Main Code)");
            return;
        }

        try {
            const stockRef = ref(db, 'rentals/stock');
            await push(stockRef, {
                ...formData,
                count: Number(formData.count),
                createdAt: Date.now()
            });

            setIsDialogOpen(false);
            setFormData({
                itemName: "",
                brand: "",
                mainType: "",
                subType: "",
                mainCode: "",
                subCode: "",
                description: "",
                count: 1,
                status: "Available"
            });
            toast.success("Stock added successfully");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error adding stock:", error);
            toast.error(`Failed to add stock: ${errorMessage}`);
        }
    };

    const filteredGroupedItems = groupedItems.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mainCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statuses: StockStatus[] = ["Available", "Rented", "Damaged", "Repairing", "Expired", "Blocked", "Reserved", "Pending"];

    return (
        <RentalLayout title="Stock Report">
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <BarChart2 className="h-8 w-8 text-primary" />
                            Inventory Intelligence
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60">
                            Real-time Stock Management & Analytics
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                Add New Stock
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card/90 backdrop-blur-2xl border-white/10 rounded-[2rem] p-0 overflow-hidden">
                            <div className="p-8 pb-0">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tight">Register Asset</DialogTitle>
                                    <CardDescription className="text-sm font-medium">Add a new item to the KUTTYBROTHERS fleet repository.</CardDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Item Name</Label>
                                    <Input
                                        value={formData.itemName}
                                        onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-primary/20"
                                        placeholder="Item Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Brand</Label>
                                    <Input
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Brand"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Main Type</Label>
                                    <Input
                                        value={formData.mainType}
                                        onChange={e => setFormData({ ...formData, mainType: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Main Type"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Sub Type</Label>
                                    <Input
                                        value={formData.subType}
                                        onChange={e => setFormData({ ...formData, subType: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Sub Type"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Main Code</Label>
                                    <Input
                                        value={formData.mainCode}
                                        onChange={e => setFormData({ ...formData, mainCode: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Main Code"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Sub Code</Label>
                                    <Input
                                        value={formData.subCode}
                                        onChange={e => setFormData({ ...formData, subCode: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Sub Code"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Add Count</Label>
                                    <Input
                                        type="number"
                                        value={formData.count}
                                        onChange={e => setFormData({ ...formData, count: Number(e.target.value) })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Add Count"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v: StockStatus) => setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 px-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                            {statuses.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl min-h-[100px] px-6 py-4"
                                        placeholder="Description"
                                    />
                                </div>
                            </div>

                            <div className="p-8 pt-4 bg-white/5">
                                <Button
                                    onClick={handleAddStock}
                                    className="w-full h-14 gradient-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    Add Stock
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Fleet Capacity", value: groupedItems.reduce((acc, i) => acc + i.totalSum, 0), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Ready to Deploy", value: groupedItems.reduce((acc, i) => acc + i.counts.Available, 0), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Under Maintenance", value: groupedItems.reduce((acc, i) => acc + i.counts.Repairing, 0), icon: History, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { label: "Operational Risk", value: groupedItems.reduce((acc, i) => acc + i.counts.Damaged + i.counts.Expired, 0), icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-white/5 bg-card/40 backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[40px] -mr-12 -mt-12 opacity-50`} />
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-white/5 shadow-inner`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Stock Table Section */}
                <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tight">Fleet Repository</CardTitle>
                                <CardDescription className="text-sm font-medium opacity-60">Verified list of all physical assets in management.</CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative group w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Deep search assets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 bg-white/5 border-white/5 focus:bg-white/10 rounded-2xl transition-all"
                                    />
                                </div>
                                <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-white/10 border border-white/5">
                                    <Filter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">S.No</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Item Name</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Brand</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Main Type</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Sub Type</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Description</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Main Code</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Sub Code</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Available</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Rented</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Damaged</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Repairing</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Expired</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Blocked</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Reserved</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Pending</TableHead>
                                    <TableHead className="px-4 py-6 text-[10px] font-black uppercase tracking-widest opacity-50 text-center text-primary font-black">Total Sum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-white/5">
                                                <TableCell colSpan={17} className="h-20 text-center opacity-20">Loading Database...</TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredGroupedItems.length === 0 ? (
                                        <TableRow className="border-white/5">
                                            <TableCell colSpan={17} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-50">
                                                    <Package className="h-12 w-12" />
                                                    <p className="font-bold uppercase tracking-widest text-xs">No assets found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredGroupedItems.map((item, idx) => (
                                        <motion.tr
                                            key={item.key}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <TableCell className="px-4 py-4 font-bold opacity-40">{idx + 1}</TableCell>
                                            <TableCell className="px-4 py-4 font-black">{item.itemName}</TableCell>
                                            <TableCell className="px-4 py-4 font-bold text-muted-foreground uppercase text-[10px]">{item.brand}</TableCell>
                                            <TableCell className="px-4 py-4 text-[10px] uppercase font-black text-primary">{item.mainType}</TableCell>
                                            <TableCell className="px-4 py-4 text-[10px] uppercase font-bold text-muted-foreground">{item.subType}</TableCell>
                                            <TableCell className="px-4 py-4 text-[10px] max-w-[150px] truncate opacity-60">{item.description}</TableCell>
                                            <TableCell className="px-4 py-4"><span className="text-[10px] font-black px-2 py-1 rounded bg-white/5 border border-white/5">{item.mainCode}</span></TableCell>
                                            <TableCell className="px-4 py-4"><span className="text-[10px] font-black px-2 py-1 rounded bg-white/5 border border-white/5">{item.subCode}</span></TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-emerald-500">{item.counts.Available}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-blue-500">{item.counts.Rented}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-rose-500">{item.counts.Damaged}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-amber-500">{item.counts.Repairing}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-slate-500">{item.counts.Expired}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-red-600">{item.counts.Blocked}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-indigo-500">{item.counts.Reserved}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-bold text-orange-500">{item.counts.Pending}</TableCell>
                                            <TableCell className="px-4 py-4 text-center font-black text-primary text-base">{item.totalSum}</TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </RentalLayout>
    );
};

export default StockReport;

