import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Users, CalendarCheck, FileText, Wrench, Settings,
  ArrowRight, Activity, Search, Sparkles, TrendingUp, Clock
} from "lucide-react";

const modules = [
  {
    title: "Accounts",
    description: "Manage ledgers, balances, and real-time financial transitions.",
    icon: BookOpen,
    path: "/accounts",
    color: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-500/10",
    size: "large",
    tags: ["Finance", "Active"]
  },
  {
    title: "Employees",
    description: "Full-cycle HR management, payroll, and team tracking.",
    icon: Users,
    path: "/employees",
    color: "from-emerald-600 to-teal-700",
    shadow: "shadow-emerald-500/10",
    size: "medium",
    tags: ["HR"]
  },
  {
    title: "Invoices",
    description: "Automated billing and professional invoice generation.",
    icon: FileText,
    path: "/invoices",
    color: "from-rose-600 to-pink-700",
    shadow: "shadow-rose-500/10",
    size: "medium",
    tags: ["Sales"]
  },
  {
    title: "Attendance",
    description: "Smart monitoring and project-based attendance logs.",
    icon: CalendarCheck,
    path: "/attendance",
    color: "from-amber-600 to-orange-700",
    shadow: "shadow-amber-500/10",
    size: "small",
    tags: ["Ops"]
  },
  {
    title: "Rentals",
    description: "Equipment inventory and rental detail management.",
    icon: Wrench,
    path: "/rentals",
    color: "from-violet-600 to-purple-700",
    shadow: "shadow-violet-500/10",
    size: "small",
    tags: ["Assets"]
  },
  {
    title: "Settings",
    description: "System tuning and advanced user permissions.",
    icon: Settings,
    path: "/settings",
    color: "from-slate-700 to-slate-900",
    shadow: "shadow-slate-500/10",
    size: "small",
    tags: ["Admin"]
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 20, stiffness: 100 },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredModules = useMemo(() =>
    modules.filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  return (
    <Layout>
      <div className="min-h-screen relative bg-[#030712]/5 dark:bg-[#030712]/50">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse-slow" />
          <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-purple-500/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 text-primary mb-3">
                <Sparkles className="h-5 w-5 fill-primary/20" />
                <span className="text-sm font-bold tracking-widest uppercase">System Hub</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground">
                Control <span className="text-primary italic font-serif">Center</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative w-full md:w-80 group"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 focus:ring-2 focus:ring-primary/20 transition-all text-lg"
              />
            </motion.div>
          </div>

          {/* Module Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module) => (
                <motion.div
                  key={module.title}
                  layout
                  variants={cardVariants}
                  className={`
                    ${module.size === "large" ? "md:col-span-6 lg:col-span-8" : ""}
                    ${module.size === "medium" ? "md:col-span-3 lg:col-span-4" : ""}
                    ${module.size === "small" ? "md:col-span-2 lg:col-span-4" : ""}
                  `}
                >
                  <Card
                    onClick={() => navigate(module.path)}
                    className="h-full group cursor-pointer overflow-hidden ring-1 ring-white/10 hover:ring-primary/30"
                  >
                    <div className="p-8 h-full flex flex-col relative">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-white/5`}>
                          <module.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex gap-2">
                          {module.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                          {module.description}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center space-x-1 font-bold text-xs text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                          <span>Enter Hub</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <Activity className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                      </div>

                      {/* Animated Glow Effect */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-500`} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Analytics Ticker Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 flex flex-wrap items-center justify-around gap-12"
          >
            {[
              { label: "Active Sessions", value: "14", icon: Clock, trend: "+2" },
              { label: "Weekly Growth", value: "24%", icon: TrendingUp, trend: "+5%" },
              { label: "System Health", value: "100%", icon: Activity, trend: "Stable" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center space-x-6 px-8 py-2">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black flex items-center gap-2">
                    {stat.value}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
