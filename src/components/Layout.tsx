import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1
              className="text-xl font-bold gradient-text cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              KUTTYBROTHERS
            </h1>
            {title && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
              </>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
