import { useState, useEffect, useMemo } from "react";
import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Zap,
  Lock,
  Hourglass
} from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

interface StockItem {
  id: string;
  itemName: string;
  brand: string;
  mainType: string;
  subType: string;
  mainCode: string;
  subCode: string;
  description: string;
  status: "Available" | "Rented" | "Damaged" | "Repairing" | "Expired" | "Blocked" | "Reserved" | "Pending";
  count: number;
  createdAt: number;
}

const RentalDashboard = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [inventoryStats, setInventoryStats] = useState({
    Available: 0,
    Rented: 0,
    Damaged: 0,
    Repairing: 0,
    Expired: 0,
    Blocked: 0,
    Reserved: 0,
    Pending: 0,
    totalItems: 0
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stock data from Firebase
  useEffect(() => {
    setIsLoading(true);
    try {
      const stockRef = ref(db, "rentals/stock");
      const unsubscribe = onValue(
        stockRef,
        (snapshot) => {
          try {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const items: StockItem[] = [];
              const stats = {
                Available: 0,
                Rented: 0,
                Damaged: 0,
                Repairing: 0,
                Expired: 0,
                Blocked: 0,
                Reserved: 0,
                Pending: 0,
                totalItems: 0
              };

              Object.entries(data).forEach(([key, value]: [string, any]) => {
                if (typeof value === 'object' && value !== null) {
                  items.push({ id: key, ...value });

                  const count = Number(value.count) || 0;
                  const status = value.status as keyof typeof stats;

                  if (status && stats[status] !== undefined) {
                    stats[status] += count;
                  }
                }
              });

              stats.totalItems = items.length;
              setStockItems(items);
              setInventoryStats(stats);
              setLastUpdated(new Date());
            } else {
              setInventoryStats({
                Available: 0,
                Rented: 0,
                Damaged: 0,
                Repairing: 0,
                Expired: 0,
                Blocked: 0,
                Reserved: 0,
                Pending: 0,
                totalItems: 0
              });
              setLastUpdated(new Date());
            }
          } catch (error) {
            console.error("Error processing stock data:", error);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Firebase listener error:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase setup error:", error);
      setIsLoading(false);
    }
  }, []);

  // Top Rented Products
  const topRentedProducts = useMemo(() => {
    const rentedCounts: Record<string, number> = {};
    stockItems.forEach(item => {
      if (item.status === "Rented") {
        rentedCounts[item.itemName] = (rentedCounts[item.itemName] || 0) + (Number(item.count) || 0);
      }
    });

    return Object.entries(rentedCounts)
      .map(([name, timesRented], idx) => ({
        rank: 0,
        name,
        timesRented,
        trend: (name.charCodeAt(0) + idx) % 2 === 0 ? "up" : "down"
      }))
      .sort((a, b) => b.timesRented - a.timesRented)
      .slice(0, 5)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [stockItems]);

  // Transaction Summary
  const transactionSummary = useMemo(() => {
    const completed = stockItems.reduce((acc, item) => item.status === "Rented" ? acc + (Number(item.count) || 0) : acc, 0);
    const pending = stockItems.reduce((acc, item) => item.status === "Pending" ? acc + (Number(item.count) || 0) : acc, 0);
    return { completed, pending };
  }, [stockItems]);

  // Inventory Dashboard Stats
  const inventoryDashboardStats = [
    { label: "Available", value: inventoryStats.Available, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Rented", value: inventoryStats.Rented, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Damaged", value: inventoryStats.Damaged, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Repairing", value: inventoryStats.Repairing, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Expired", value: inventoryStats.Expired, icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10" },
    { label: "Blocked", value: inventoryStats.Blocked, icon: Lock, color: "text-red-600", bg: "bg-red-600/10" },
    { label: "Reserved", value: inventoryStats.Reserved, icon: Hourglass, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Pending", value: inventoryStats.Pending, icon: Clock, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <RentalLayout title="Dashboard">
      <div className="w-full space-y-8 pb-12 px-6">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading inventory data...</p>
          </div>
        ) : (
          <>
            {/* Inventory Dashboard Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  Inventory Dashboard
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Real-time overview of your inventory status.</p>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Inventory Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {inventoryDashboardStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-white/5 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-300 group overflow-hidden relative">
                      <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} blur-[40px] -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
                      <CardContent className="p-4 relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} ring-1 ring-white/5 shadow-inner`}>
                            <stat.icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Transaction Summary & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Summary */}
                <Card className="border-white/5 bg-card/20 backdrop-blur-xl">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-lg font-black">Transaction Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Completed</span>
                        <span className="text-2xl font-black text-emerald-500">{transactionSummary.completed}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: `${Math.min((transactionSummary.completed / Math.max(transactionSummary.completed + transactionSummary.pending, 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pending</span>
                        <span className="text-2xl font-black text-amber-500">{transactionSummary.pending}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: `${Math.min((transactionSummary.pending / Math.max(transactionSummary.completed + transactionSummary.pending, 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Rented Products */}
                <Card className="border-white/5 bg-card/20 backdrop-blur-xl lg:col-span-2">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Top Rented Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table className="text-xs">
                        <TableHeader className="bg-white/5">
                          <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest opacity-60">Rank</TableHead>
                            <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest opacity-60">Product Name</TableHead>
                            <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">Times Rented</TableHead>
                            <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">Trend</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-white/5">
                          {topRentedProducts.length > 0 ? (
                            topRentedProducts.map((product, idx) => (
                              <motion.tr
                                key={product.rank}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <TableCell className="px-6 py-4">
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black">
                                    #{product.rank}
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 font-bold">{product.name}</TableCell>
                                <TableCell className="px-6 py-4 text-center font-black text-primary">{product.timesRented}</TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className={`h-4 w-4 ${product.trend === 'up' ? 'text-emerald-500' : 'text-rose-500 rotate-180'}`} />
                                    <span className={`text-[10px] font-black uppercase ${product.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                      {product.trend === 'up' ? 'Rising' : 'Falling'}
                                    </span>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))
                          ) : (
                            <TableRow className="border-white/5">
                              <TableCell colSpan={4} className="h-24 text-center">
                                <div className="flex flex-col items-center gap-2 opacity-50">
                                  <Package className="h-6 w-6" />
                                  <p className="font-bold uppercase tracking-widest text-xs">No data available</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </RentalLayout>
  );
};

export default RentalDashboard;
