import { useState, useEffect } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Folder, Box, Search, Layers } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface StockItem {
    mainType: string;
    count: number;
    [key: string]: any;
}

const MainType = () => {
    const [types, setTypes] = useState<{ name: string; itemCount: number; totalQuantity: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const stockRef = ref(db, 'rentals/stock');
        return onValue(stockRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const typeMap: { [key: string]: { itemCount: number; totalQuantity: number } } = {};

                Object.values(data as Record<string, StockItem>).forEach(item => {
                    const typeName = item.mainType || "Uncategorized";
                    if (!typeMap[typeName]) {
                        typeMap[typeName] = { itemCount: 0, totalQuantity: 0 };
                    }
                    typeMap[typeName].itemCount += 1;
                    typeMap[typeName].totalQuantity += Number(item.count || 0);
                });

                const typeList = Object.keys(typeMap).map(name => ({
                    name,
                    ...typeMap[name]
                })).sort((a, b) => b.totalQuantity - a.totalQuantity);

                setTypes(typeList);
            } else {
                setTypes([]);
            }
            setIsLoading(false);
        });
    }, []);

    const filteredTypes = types.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RentalLayout title="Main Types">
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Folder className="h-8 w-8 text-primary" />
                            Primary Categories
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60">
                            High-level classification of all physical assets in repository.
                        </p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/5 focus:bg-white/10 rounded-2xl transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] -mr-12 -mt-12 opacity-50" />
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-white/5 shadow-inner">
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">{types.length}</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Major Classifications</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -mr-12 -mt-12 opacity-50" />
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 ring-1 ring-white/5 shadow-inner">
                                    <Box className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">
                                        {types.reduce((acc, t) => acc + t.totalQuantity, 0)}
                                    </h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Items Distributed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-black tracking-tight">Classification Analytics</CardTitle>
                        <CardDescription className="text-sm font-medium opacity-60">Distribution of assets across primary work types.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Category Name</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Model Variation</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50 text-right pr-8">Total Assets</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={3} className="h-40 text-center opacity-50">Analyzing Schema...</TableCell>
                                    </TableRow>
                                ) : filteredTypes.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={3} className="h-40 text-center opacity-50 uppercase font-black text-[10px] tracking-widest">
                                            No categories found
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTypes.map((type, idx) => (
                                    <motion.tr
                                        key={type.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner ring-1 ring-primary/20 group-hover:rotate-3 transition-transform uppercase">
                                                    {type.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-sm tracking-tight">{type.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-base">{type.itemCount}</span>
                                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Types</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                                <span className="font-black text-lg text-primary">{type.totalQuantity}</span>
                                                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Units</span>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </RentalLayout>
    );
};

export default MainType;

