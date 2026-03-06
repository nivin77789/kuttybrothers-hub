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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    BarChart2,
    Plus,
    Search,
    Package,
    CheckCircle,
    AlertTriangle,
    History,
    Filter,
    Check,
    ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

    // Combobox open states
    const [openBrand, setOpenBrand] = useState(false);
    const [openMainType, setOpenMainType] = useState(false);
    const [openSubType, setOpenSubType] = useState(false);

    // Combobox search states
    const [brandSearch, setBrandSearch] = useState("");
    const [mainTypeSearch, setMainTypeSearch] = useState("");
    const [subTypeSearch, setSubTypeSearch] = useState("");

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

    const { uniqueBrands, uniqueMainTypes, uniqueSubTypes } = useMemo(() => {
        const brands = new Set<string>();
        const mainTypes = new Set<string>();
        const subTypes = new Set<string>();

        items.forEach(item => {
            if (item.brand) brands.add(item.brand);
            if (item.mainType) mainTypes.add(item.mainType);
            if (item.subType) subTypes.add(item.subType);
        });

        return {
            uniqueBrands: Array.from(brands).sort(),
            uniqueMainTypes: Array.from(mainTypes).sort(),
            uniqueSubTypes: Array.from(subTypes).sort(),
        };
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
            setBrandSearch("");
            setMainTypeSearch("");
            setSubTypeSearch("");
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
            <div className="space-y-4 pb-6 w-full">
                {/* Header Section with Stats Navbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <BarChart2 className="h-6 w-6 text-primary" />
                        Stock Report
                    </h2>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setBrandSearch("");
                            setMainTypeSearch("");
                            setSubTypeSearch("");
                            setOpenBrand(false);
                            setOpenMainType(false);
                            setOpenSubType(false);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary text-white font-black uppercase tracking-widest text-xs h-10 px-6 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                Add Stock
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
                                    <Popover open={openBrand} onOpenChange={setOpenBrand}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openBrand}
                                                className="w-full justify-between bg-white/5 border-white/10 rounded-2xl h-14 px-6 hover:bg-white/10"
                                            >
                                                {formData.brand || "Select or type brand..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0 bg-card/95 backdrop-blur-xl border-white/10">
                                            <Command className="bg-transparent" filter={() => 1}>
                                                <CommandInput
                                                    placeholder="Search or type brand..."
                                                    className="border-none bg-transparent"
                                                    value={brandSearch}
                                                    onValueChange={setBrandSearch}
                                                />
                                                <CommandList>
                                                    <CommandGroup>
                                                        {uniqueBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map((brand) => (
                                                            <CommandItem
                                                                key={brand}
                                                                value={brand}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, brand });
                                                                    setBrandSearch("");
                                                                    setOpenBrand(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.brand === brand ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {brand}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                    {brandSearch && !uniqueBrands.some(b => b.toLowerCase() === brandSearch.toLowerCase()) && (
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value={brandSearch}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, brand: brandSearch });
                                                                    setBrandSearch("");
                                                                    setOpenBrand(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10 text-primary font-semibold"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Create "{brandSearch}"
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Main Type</Label>
                                    <Popover open={openMainType} onOpenChange={setOpenMainType}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openMainType}
                                                className="w-full justify-between bg-white/5 border-white/10 rounded-2xl h-14 px-6 hover:bg-white/10"
                                            >
                                                {formData.mainType || "Select or type main type..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0 bg-card/95 backdrop-blur-xl border-white/10">
                                            <Command className="bg-transparent" filter={() => 1}>
                                                <CommandInput
                                                    placeholder="Search or type type..."
                                                    className="border-none bg-transparent"
                                                    value={mainTypeSearch}
                                                    onValueChange={setMainTypeSearch}
                                                />
                                                <CommandList>
                                                    <CommandGroup>
                                                        {uniqueMainTypes.filter(t => t.toLowerCase().includes(mainTypeSearch.toLowerCase())).map((type) => (
                                                            <CommandItem
                                                                key={type}
                                                                value={type}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, mainType: type });
                                                                    setMainTypeSearch("");
                                                                    setOpenMainType(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.mainType === type ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {type}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                    {mainTypeSearch && !uniqueMainTypes.some(t => t.toLowerCase() === mainTypeSearch.toLowerCase()) && (
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value={mainTypeSearch}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, mainType: mainTypeSearch });
                                                                    setMainTypeSearch("");
                                                                    setOpenMainType(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10 text-primary font-semibold"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Create "{mainTypeSearch}"
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Sub Type</Label>
                                    <Popover open={openSubType} onOpenChange={setOpenSubType}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openSubType}
                                                className="w-full justify-between bg-white/5 border-white/10 rounded-2xl h-14 px-6 hover:bg-white/10"
                                            >
                                                {formData.subType || "Select or type sub type..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0 bg-card/95 backdrop-blur-xl border-white/10">
                                            <Command className="bg-transparent" filter={() => 1}>
                                                <CommandInput
                                                    placeholder="Search or type type..."
                                                    className="border-none bg-transparent"
                                                    value={subTypeSearch}
                                                    onValueChange={setSubTypeSearch}
                                                />
                                                <CommandList>
                                                    <CommandGroup>
                                                        {uniqueSubTypes.filter(t => t.toLowerCase().includes(subTypeSearch.toLowerCase())).map((type) => (
                                                            <CommandItem
                                                                key={type}
                                                                value={type}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, subType: type });
                                                                    setSubTypeSearch("");
                                                                    setOpenSubType(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.subType === type ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {type}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                    {subTypeSearch && !uniqueSubTypes.some(t => t.toLowerCase() === subTypeSearch.toLowerCase()) && (
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value={subTypeSearch}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, subType: subTypeSearch });
                                                                    setSubTypeSearch("");
                                                                    setOpenSubType(false);
                                                                }}
                                                                className="cursor-pointer hover:bg-white/10 text-primary font-semibold"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Create "{subTypeSearch}"
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
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

                {/* Statistics Navbar */}
                <div className="flex flex-wrap gap-2 bg-card/30 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                    {[
                        { label: "Fleet Capacity", value: groupedItems.reduce((acc, i) => acc + i.totalSum, 0), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Ready to Deploy", value: groupedItems.reduce((acc, i) => acc + i.counts.Available, 0), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Under Maintenance", value: groupedItems.reduce((acc, i) => acc + i.counts.Repairing, 0), icon: History, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { label: "Operational Risk", value: groupedItems.reduce((acc, i) => acc + i.counts.Damaged + i.counts.Expired, 0), icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group flex-1 min-w-fit text-xs"
                        >
                            <div className={`p-1 rounded ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-none">{stat.label}</p>
                                <p className="text-base font-black text-primary leading-none">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stock Table Section */}
                <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl rounded-xl flex flex-col flex-1 min-w-0 w-full">
                    <CardHeader className="px-4 py-3 pb-3 flex-shrink-0 border-b border-white/5 min-w-0 w-full">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-black tracking-tight truncate">Inventory Assets</h3>
                            <div className="flex items-center gap-1 flex-1 max-w-xs">
                                <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-1.5 h-8 bg-white/5 border-white/5 focus:bg-white/10 rounded-lg transition-all text-xs w-full"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 flex flex-col min-h-0 min-w-0 w-full">
                        <div className="overflow-x-auto overflow-y-hidden flex-1 min-h-0 min-w-0 w-full">
                            <Table className="min-w-max text-xs w-full">
                                <TableHeader className="bg-white/5 sticky top-0">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">S.No</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Item Name</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Brand</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Main Type</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Sub Type</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Description</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Main Code</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Sub Code</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Available</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Rented</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Damaged</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Repairing</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Expired</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center">Blocked</TableHead>
                                        <TableHead className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap text-center text-primary">Reserved</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-white/5">
                                    <AnimatePresence mode="popLayout">
                                        {isLoading ? (
                                            [...Array(3)].map((_, i) => (
                                                <TableRow key={i} className="animate-pulse border-white/5">
                                                    <TableCell colSpan={15} className="h-12 text-center opacity-20">Loading...</TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredGroupedItems.length === 0 ? (
                                            <TableRow className="border-white/5">
                                                <TableCell colSpan={15} className="h-24 text-center">
                                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                                        <Package className="h-6 w-6" />
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
                                                className="border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <TableCell className="px-3 py-2 font-bold opacity-50 whitespace-nowrap text-xs">{idx + 1}</TableCell>
                                                <TableCell className="px-3 py-2 font-semibold whitespace-nowrap text-xs">{item.itemName}</TableCell>
                                                <TableCell className="px-3 py-2 text-xs text-muted-foreground uppercase font-medium whitespace-nowrap">{item.brand}</TableCell>
                                                <TableCell className="px-3 py-2 text-xs whitespace-nowrap">
                                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-primary font-semibold">{item.mainType}</span>
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-xs text-muted-foreground uppercase font-bold whitespace-nowrap">{item.subType}</TableCell>
                                                <TableCell className="px-3 py-2 text-xs opacity-60 whitespace-nowrap max-w-[120px] truncate">{item.description}</TableCell>
                                                <TableCell className="px-3 py-2 whitespace-nowrap">
                                                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/5">{item.mainCode}</span>
                                                </TableCell>
                                                <TableCell className="px-3 py-2 whitespace-nowrap">
                                                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/5">{item.subCode}</span>
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-emerald-500 whitespace-nowrap text-xs">{item.counts.Available}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-blue-500 whitespace-nowrap text-xs">{item.counts.Rented}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-rose-500 whitespace-nowrap text-xs">{item.counts.Damaged}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-amber-500 whitespace-nowrap text-xs">{item.counts.Repairing}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-slate-500 whitespace-nowrap text-xs">{item.counts.Expired}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-red-600 whitespace-nowrap text-xs">{item.counts.Blocked}</TableCell>
                                                <TableCell className="px-3 py-2 text-center font-bold text-indigo-500 whitespace-nowrap text-xs">{item.counts.Reserved}</TableCell>
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

export default StockReport;

