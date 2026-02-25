import { useState, useEffect } from "react";
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
    Users,
    Plus,
    Search,
    UserCheck,
    Briefcase,
    MapPin,
    Phone,
    Mail,
    Filter,
    Pencil,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Customer {
    id: string;
    name: string;
    shortName: string;
    phone: string;
    email: string;
    type: "Individual" | "Company";
    gstNumber: string;
    address: string;
    status: "Active" | "InActive";
    createdAt: number;
}

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [formData, setFormData] = useState<{
        name: string;
        shortName: string;
        phone: string;
        email: string;
        type: "Individual" | "Company";
        gstNumber: string;
        address: string;
        status: "Active" | "InActive";
    }>({
        name: "",
        shortName: "",
        phone: "",
        email: "",
        type: "Individual",
        gstNumber: "",
        address: "",
        status: "Active"
    });

    useEffect(() => {
        const customersRef = ref(db, 'rentals/customers');
        return onValue(customersRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const customerList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setCustomers(customerList.reverse());
                } else {
                    setCustomers([]);
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

    const handleSaveCustomer = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("Name and Phone are required");
            return;
        }

        try {
            if (editingId) {
                const customerRef = ref(db, `rentals/customers/${editingId}`);
                await update(customerRef, {
                    ...formData,
                    updatedAt: Date.now()
                });
                toast.success("Customer updated successfully");
            } else {
                const customersRef = ref(db, 'rentals/customers');
                await push(customersRef, {
                    ...formData,
                    createdAt: Date.now()
                });
                toast.success("Customer saved successfully");
            }

            closeDialog();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error saving customer:", error);
            toast.error(`Failed to save customer: ${errorMessage}`);
        }
    };

    const handleDeleteCustomer = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                const customerRef = ref(db, `rentals/customers/${id}`);
                await remove(customerRef);
                toast.success("Customer deleted successfully");
            } catch (error) {
                console.error("Error deleting customer:", error);
                toast.error("Failed to delete customer");
            }
        }
    };

    const handleEditClick = (customer: Customer) => {
        setEditingId(customer.id);
        setFormData({
            name: customer.name,
            shortName: customer.shortName,
            phone: customer.phone,
            email: customer.email,
            type: customer.type,
            gstNumber: customer.gstNumber,
            address: customer.address,
            status: customer.status
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            name: "",
            shortName: "",
            phone: "",
            email: "",
            type: "Individual",
            gstNumber: "",
            address: "",
            status: "Active"
        });
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RentalLayout title="Customers">
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/10 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-7 w-7 text-primary" />
                                <h2 className="text-2xl font-black tracking-tight">
                                    Customers
                                </h2>
                            </div>

                            {/* Stats Bubbles */}
                            <div className="flex items-center gap-2">
                                {[
                                    { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "bg-emerald-500", icon: UserCheck },
                                    { label: "Corp", value: customers.filter(c => c.type === "Company").length, color: "bg-blue-500", icon: Briefcase },
                                    { label: "Ind", value: customers.filter(c => c.type === "Individual").length, color: "bg-amber-500", icon: Users },
                                    { label: "Total", value: customers.length, color: "bg-primary", icon: Users },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${stat.color} shadow-[0_0_8px] shadow-current`} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
                                            {stat.label}
                                        </span>
                                        <span className="text-xs font-black tracking-tighter">
                                            {stat.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[8px] opacity-40 ml-1">
                            Management of Rental Partnerships & Clients
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        if (!open) closeDialog();
                        else setIsDialogOpen(true);
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary text-white font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        {/* ... DialogContent remains same ... */}
                        <DialogContent className="max-w-2xl bg-card/90 backdrop-blur-2xl border-white/10 rounded-[2rem] p-0 overflow-hidden">
                            <div className="p-8 pb-0">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tight">
                                        {editingId ? "Edit Customer" : "Add New Customer"}
                                    </DialogTitle>
                                    <CardDescription className="text-sm font-medium">
                                        {editingId ? "Update existing partner details." : "Register a new client or company for rental operations."}
                                    </CardDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Customer Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-primary/20"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Short Name</Label>
                                    <Input
                                        value={formData.shortName}
                                        onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Nick Name / Alias"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Phone Number</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="+91..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Email Address</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(v: "Individual" | "Company") => setFormData({ ...formData, type: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 px-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                            <SelectItem value="Individual">Individual</SelectItem>
                                            <SelectItem value="Company">Company</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">GST Number</Label>
                                    <Input
                                        value={formData.gstNumber}
                                        onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6"
                                        placeholder="Optional for Individuals"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v: "Active" | "InActive") => setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 px-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="InActive">InActive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Address</Label>
                                    <Textarea
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl min-h-[100px] px-6 py-4"
                                        placeholder="Primary Location"
                                    />
                                </div>
                            </div>

                            <div className="p-8 pt-4 bg-white/5 flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={closeDialog}
                                    className="flex-1 h-14 rounded-2xl border border-white/10 font-black uppercase tracking-widest"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveCustomer}
                                    className="flex-[2] h-14 gradient-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    {editingId ? "Update Customer" : "Save Customer"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Customers Table Section */}
                <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tight">Client Directory</CardTitle>
                                <CardDescription className="text-sm font-medium opacity-60">Verified list of all rental partners.</CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative group w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Search by name, phone, email..."
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
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Customer</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Contact info</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Identity</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Location</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Status</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50 text-right pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-white/5">
                                                <TableCell colSpan={5} className="h-20 text-center opacity-20">Syncing with Cloud...</TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredCustomers.length === 0 ? (
                                        <TableRow className="border-white/5">
                                            <TableCell colSpan={5} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-50">
                                                    <Users className="h-12 w-12" />
                                                    <p className="font-bold uppercase tracking-widest text-xs">No partners identified</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCustomers.map((customer, idx) => (
                                        <motion.tr
                                            key={customer.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner ring-1 ring-primary/20 group-hover:rotate-3 transition-transform">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-sm tracking-tight">{customer.name}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{customer.shortName || "No Alias"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold">
                                                        <Phone className="h-3 w-3 text-primary opacity-60" />
                                                        {customer.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-medium opacity-50">
                                                        <Mail className="h-3 w-3" />
                                                        {customer.email || "N/A"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <Badge variant="outline" className="w-fit text-[9px] uppercase font-black px-2 py-0 border-white/10 mb-1">
                                                        {customer.type}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                        GST: {customer.gstNumber || "Unregistered"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-2 max-w-[200px]">
                                                    <MapPin className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                    <span className="text-[10px] font-medium leading-relaxed opacity-70">
                                                        {customer.address || "Contact for address"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`rounded-xl px-4 py-1 font-black text-[10px] uppercase tracking-[0.2em] border shadow-sm ${customer.status === "Active"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                    }`}>
                                                    {customer.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-white/10 rounded-xl">
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditClick(customer)}
                                                            className="flex items-center gap-2 cursor-pointer focus:bg-white/5"
                                                        >
                                                            <Pencil className="h-4 w-4 text-primary" />
                                                            <span className="font-bold text-xs">Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteCustomer(customer.id)}
                                                            className="flex items-center gap-2 cursor-pointer focus:bg-rose-500/10 text-rose-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="font-bold text-xs">Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
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

export default Customers;

