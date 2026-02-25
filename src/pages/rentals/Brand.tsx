import { useState, useEffect } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Package, Search, History } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface StockItem {
    brand: string;
    count: number;
    [key: string]: any;
}

const Brand = () => {
    const [brands, setBrands] = useState<{ name: string; itemCount: number; totalQuantity: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const stockRef = ref(db, 'rentals/stock');
        return onValue(stockRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const brandMap: { [key: string]: { itemCount: number; totalQuantity: number } } = {};

                Object.values(data as Record<string, StockItem>).forEach(item => {
                    const brandName = item.brand || "Unknown";
                    if (!brandMap[brandName]) {
                        brandMap[brandName] = { itemCount: 0, totalQuantity: 0 };
                    }
                    brandMap[brandName].itemCount += 1;
                    brandMap[brandName].totalQuantity += Number(item.count || 0);
                });

                const brandList = Object.keys(brandMap).map(name => ({
                    name,
                    ...brandMap[name]
                })).sort((a, b) => b.totalQuantity - a.totalQuantity);

                setBrands(brandList);
            } else {
                setBrands([]);
            }
            setIsLoading(false);
        });
    }, []);

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RentalLayout title="Brand Management">
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Award className="h-8 w-8 text-primary" />
                            Brand Identity
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60">
                            Aggregated metrics for all equipment manufacturers in fleet.
                        </p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/5 focus:bg-white/10 rounded-2xl transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] -mr-12 -mt-12 opacity-50" />
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-white/5 shadow-inner">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">{brands.length}</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Brands</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] -mr-12 -mt-12 opacity-50" />
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-white/5 shadow-inner">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">
                                        {brands.reduce((acc, b) => acc + b.totalQuantity, 0)}
                                    </h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Fleet Units</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-[40px] -mr-12 -mt-12 opacity-50" />
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-white/5 shadow-inner">
                                    <History className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">
                                        {brands.length > 0 ? (brands.reduce((acc, b) => acc + b.totalQuantity, 0) / brands.length).toFixed(1) : 0}
                                    </h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Avg. Units / Brand</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-white/5 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-black tracking-tight">Brand Distribution</CardTitle>
                        <CardDescription className="text-sm font-medium opacity-60">Complete list of equipment manufacturers and their stock density.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-50">Manufacturer Name</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50">Unique Item Types</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-50 text-right pr-8">Physical Inventory Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={3} className="h-40 text-center opacity-50">Loading Brand Intelligence...</TableCell>
                                    </TableRow>
                                ) : filteredBrands.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={3} className="h-40 text-center opacity-50 uppercase font-black text-[10px] tracking-widest">
                                            No brand data found in stock repository
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBrands.map((brand, idx) => (
                                    <motion.tr
                                        key={brand.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner ring-1 ring-primary/20 group-hover:rotate-3 transition-transform uppercase">
                                                    {brand.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-sm tracking-tight">{brand.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-base">{brand.itemCount}</span>
                                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Models</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                                <span className="font-black text-lg text-primary">{brand.totalQuantity}</span>
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

export default Brand;

