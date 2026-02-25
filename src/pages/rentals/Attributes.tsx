import { useState, useEffect } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2, Award, Folder, FolderTree, ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StockItem {
    brand: string;
    mainType: string;
    subType: string;
    count: number;
    [key: string]: any;
}

const Attributes = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        brands: 0,
        mainTypes: 0,
        subTypes: 0,
        totalItems: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stockRef = ref(db, 'rentals/stock');
        return onValue(stockRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const brands = new Set();
                const mainTypes = new Set();
                const subTypes = new Set();
                let totalCount = 0;

                Object.values(data as Record<string, StockItem>).forEach(item => {
                    if (item.brand) brands.add(item.brand);
                    if (item.mainType) mainTypes.add(item.mainType);
                    if (item.subType) subTypes.add(item.subType);
                    totalCount += Number(item.count || 0);
                });

                setStats({
                    brands: brands.size,
                    mainTypes: mainTypes.size,
                    subTypes: subTypes.size,
                    totalItems: totalCount
                });
            }
            setIsLoading(false);
        });
    }, []);

    const attributeCards = [
        {
            title: "Brand Management",
            description: "Manage equipment manufacturers and brand-specific assets.",
            icon: Award,
            count: stats.brands,
            path: "/rentals/brand",
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            title: "Main Type Classification",
            description: "High-level categorization for primary equipment types.",
            icon: Folder,
            count: stats.mainTypes,
            path: "/rentals/main-type",
            color: "text-violet-500",
            bg: "bg-violet-500/10"
        },
        {
            title: "Sub Type Granularity",
            description: "Detailed classification for specific item variations.",
            icon: FolderTree,
            count: stats.subTypes,
            path: "/rentals/sub-type",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        }
    ];

    return (
        <RentalLayout title="Attribute Hub">
            <div className="space-y-8 pb-12">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Settings2 className="h-8 w-8 text-primary" />
                        Attribute Intelligence
                    </h2>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60">
                        Centralized management for your fleet's organizational schema.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {attributeCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group border-white/5 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-500 overflow-hidden relative h-full flex flex-col">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} blur-[50px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`} />

                                <CardHeader className="p-8 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 ring-1 ring-white/5 shadow-inner group-hover:rotate-6 transition-transform`}>
                                        <card.icon className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{card.title}</CardTitle>
                                    <CardDescription className="text-sm font-medium leading-relaxed opacity-60">
                                        {card.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-8 pt-0 mt-auto relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-3xl font-black tracking-tight">
                                                {isLoading ? "..." : card.count}
                                            </p>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Unique Entries</p>
                                        </div>
                                        <Button
                                            onClick={() => navigate(card.path)}
                                            className="rounded-2xl h-12 w-12 gradient-primary text-white shadow-xl shadow-primary/20 hover:scale-110 active:scale-90 transition-all"
                                        >
                                            <ArrowRight className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Card className="border-white/5 bg-card/20 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[200%] bg-primary/5 blur-[100px] rotate-12 group-hover:bg-primary/10 transition-colors duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black tracking-tight">System Schema Integrity</h3>
                            <p className="text-sm font-medium text-muted-foreground max-w-xl">
                                Your attributes are dynamically synchronized with the physical inventory. Every brand, category, and sub-type listed here represents live stock data from your repository.
                            </p>
                        </div>
                        <div className="flex items-center gap-8 px-12 py-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <div className="text-center">
                                <p className="text-3xl font-black text-primary">{stats.totalItems}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Managed Assets</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="text-3xl font-black text-emerald-500">100%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sync Status</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </RentalLayout>
    );
};

export default Attributes;

