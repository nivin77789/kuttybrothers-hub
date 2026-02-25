import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Settings2,
    Award,
    Folder,
    FolderTree,
    BarChart2,
    ShoppingBag,
    ClipboardList,
    ChevronRight,
    ShieldCheck,
    Zap,
    Box
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/rentals/dashboard", color: "text-blue-500" },
    { title: "Customers", icon: Users, path: "/rentals/customers", color: "text-emerald-500" },
    {
        title: "Attributes",
        icon: Settings2,
        path: "/rentals/attributes",
        color: "text-amber-500",
        subItems: [
            { title: "Brand", icon: Award, path: "/rentals/brand", color: "text-rose-500" },
            { title: "Main Type", icon: Folder, path: "/rentals/main-type", color: "text-violet-500" },
            { title: "Sub Type", icon: FolderTree, path: "/rentals/sub-type", color: "text-indigo-500" },
        ]
    },
    { title: "Stock Report", icon: BarChart2, path: "/rentals/stock-report", color: "text-cyan-500" },
    { title: "Orders", icon: ShoppingBag, path: "/rentals/orders", color: "text-orange-500" },
    { title: "List Orders", icon: ClipboardList, path: "/rentals/list-orders", color: "text-slate-500" },
];

export function RentalSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-white/5 bg-card/40 backdrop-blur-2xl">
            <SidebarHeader className="p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 px-2 cursor-pointer group"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-primary/20 ring-2 ring-white/10">
                            <span className="text-white font-black text-sm">KB</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background shadow-lg shadow-emerald-500/20" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-black tracking-tighter gradient-text leading-tight truncate">
                            KUTTYBROTHERS
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-tight opacity-70 truncate">
                            Rental Panel
                        </span>
                    </div>
                </motion.div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-6 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        System Operations
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path || (item.subItems?.some(sub => location.pathname === sub.path) ?? false);

                                if (item.subItems) {
                                    return (
                                        <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={isActive}
                                                        className={`
                                                            relative group flex items-center gap-3 px-4 py-7 rounded-2xl transition-all duration-500
                                                            ${isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-white/5 text-muted-foreground hover:text-foreground"}
                                                        `}
                                                    >
                                                        <div className={`
                                                            flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-500
                                                            ${isActive ? "bg-primary text-white shadow-xl shadow-primary/40 rotate-6" : "bg-muted/30 group-hover:bg-muted group-hover:scale-110 group-hover:rotate-3"}
                                                        `}>
                                                            <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-primary/70"}`} />
                                                        </div>
                                                        <span className={`font-bold text-sm tracking-tight transition-all duration-300 ${isActive ? "scale-105" : ""}`}>
                                                            {item.title}
                                                        </span>
                                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="mx-0 px-2 mt-2 gap-1 border-none">
                                                        {item.subItems.map((sub) => {
                                                            const isSubActive = location.pathname === sub.path;
                                                            return (
                                                                <SidebarMenuSubItem key={sub.title}>
                                                                    <SidebarMenuSubButton
                                                                        onClick={() => navigate(sub.path)}
                                                                        isActive={isSubActive}
                                                                        className={`
                                                                            flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300
                                                                            ${isSubActive
                                                                                ? "bg-primary/10 text-primary"
                                                                                : "hover:bg-white/5 text-muted-foreground hover:text-foreground"}
                                                                        `}
                                                                    >
                                                                        <sub.icon className={`h-4 w-4 ${isSubActive ? "text-primary" : "text-muted-foreground"}`} />
                                                                        <span className="font-bold text-xs uppercase tracking-wider">{sub.title}</span>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            onClick={() => navigate(item.path)}
                                            isActive={isActive}
                                            className={`
                        relative group flex items-center gap-3 px-4 py-7 rounded-2xl transition-all duration-500
                        ${isActive
                                                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(31,38,135,0.05)]"
                                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"}
                      `}
                                        >
                                            <div className={`
                        flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-500
                        ${isActive ? "bg-primary text-white shadow-xl shadow-primary/40 rotate-6" : "bg-muted/30 group-hover:bg-muted group-hover:scale-110 group-hover:rotate-3"}
                      `}>
                                                <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-primary/70"}`} />
                                            </div>

                                            <span className={`font-bold text-sm tracking-tight transition-all duration-300 ${isActive ? "scale-105" : ""}`}>
                                                {item.title}
                                            </span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute right-3 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)]"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}

                                            {!isActive && (
                                                <ChevronRight className="absolute right-4 h-4 w-4 opacity-0 group-hover:opacity-40 transition-all duration-500 -translate-x-2 group-hover:translate-x-0" />
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-white/5 backdrop-blur-md overflow-hidden relative group">
                    {/* Animated Background Glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[40px] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />

                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2.5 rounded-xl bg-primary/20 ring-1 ring-primary/30">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-foreground leading-none mb-1">Infrastructure</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest leading-none">Healthy</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold mb-4 opacity-80 relative z-10">
                        KUTTYBROTHERS Hub v2.4.0 is performing at 100% capacity.
                    </p>

                    <button className="w-full py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 relative z-10 overflow-hidden group/btn">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        <Zap className="h-3 w-3 text-amber-300 fill-amber-300 relative z-10" />
                        <span className="relative z-10">System Status</span>
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
