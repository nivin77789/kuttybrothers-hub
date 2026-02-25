import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { ArrowLeft, Bell, Search, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  title?: string;
}

export function Layout({ children, showBack = false, title }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 overflow-hidden">
      {/* Universal Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-card/20 backdrop-blur-3xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/dashboard")}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-xl shadow-primary/20 ring-2 ring-white/10">
                <span className="text-white font-black text-sm">KB</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter gradient-text leading-none">
                  KUTTYBROTHERS
                </h1>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none opacity-50 mt-1">
                  Management Hub
                </span>
              </div>
            </div>

            {(showBack || title) && (
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner ml-2">
                {showBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")}
                    className="rounded-xl h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                {title && (
                  <div className="flex items-center gap-3 px-2 pr-4 text-sm font-black text-foreground uppercase tracking-tight">
                    <span className="text-muted-foreground/20 font-light text-xl">/</span>
                    {title}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Universal Search..."
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

      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
