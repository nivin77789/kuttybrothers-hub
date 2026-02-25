import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomizationProvider } from "@/components/CustomizationProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Invoices from "./pages/Invoices";
import Rentals from "./pages/Rentals";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <CustomizationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CustomizationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
