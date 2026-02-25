import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { RentalSidebar } from "./RentalSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RentalLayoutProps {
    children: ReactNode;
    title?: string;
}

export function RentalLayout({ children, title }: RentalLayoutProps) {
    const navigate = useNavigate();

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-background selection:bg-primary/30 text-foreground overflow-hidden">
                {/* Ambient background glow */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
                </div>

                <RentalSidebar />

                <SidebarInset className="flex flex-col flex-1 bg-transparent">
                    <header className="sticky top-0 z-40 border-b border-white/5 bg-card/20 backdrop-blur-3xl">
                        <div className="flex h-20 items-center justify-between px-8">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
                                    <SidebarTrigger className="h-10 w-10 text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-white/10" />
                                    <div className="w-px h-6 bg-white/10" />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigate("/dashboard")}
                                        className="rounded-xl h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </div>

                                {title && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-muted-foreground/20 font-light text-2xl">/</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1">Navigation</span>
                                            <span className="text-lg font-black text-foreground uppercase tracking-tight leading-none group flex items-center gap-2">
                                                {title}
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    <input
                                        placeholder="Quick search..."
                                        className="bg-transparent border-none outline-none text-sm w-48 text-foreground placeholder:text-muted-foreground/50 font-medium"
                                    />
                                </div>

                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 relative">
                                        <Bell className="h-5 w-5 text-muted-foreground" />
                                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
                                    </Button>
                                    <ThemeToggle />
                                    <div className="w-px h-6 bg-white/10 mx-1" />
                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 bg-primary/20 hover:bg-primary/30 transition-colors">
                                        <User className="h-5 w-5 text-primary" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden p-8">
                        <div className="max-w-[1600px] mx-auto">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
