import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { ArrowLeft } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-background/50 selection:bg-primary/30">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-card/60 backdrop-blur-xl ring-1 ring-white/5">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => navigate("/dashboard")}
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xs">KB</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter gradient-text">
                KUTTYBROTHERS
              </h1>
            </div>
            {title && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/30 font-light">/</span>
                <span className="text-sm font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50">{title}</span>
              </div>
            )}
          </div>
          <ThemeToggle />
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
