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
import RentalDashboard from "./pages/rentals/Dashboard";
import RentalCustomers from "./pages/rentals/Customers";
import RentalAttributes from "./pages/rentals/Attributes";
import RentalBrand from "./pages/rentals/Brand";
import RentalMainType from "./pages/rentals/MainType";
import RentalSubType from "./pages/rentals/SubType";
import RentalStockReport from "./pages/rentals/StockReport";
import RentalOrders from "./pages/rentals/Orders";
import RentalListOrders from "./pages/rentals/ListOrders";
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
              <Route path="/rentals" element={<RentalDashboard />} />
              <Route path="/rentals/dashboard" element={<RentalDashboard />} />
              <Route path="/rentals/customers" element={<RentalCustomers />} />
              <Route path="/rentals/attributes" element={<RentalAttributes />} />
              <Route path="/rentals/brand" element={<RentalBrand />} />
              <Route path="/rentals/main-type" element={<RentalMainType />} />
              <Route path="/rentals/sub-type" element={<RentalSubType />} />
              <Route path="/rentals/stock-report" element={<RentalStockReport />} />
              <Route path="/rentals/orders" element={<RentalOrders />} />
              <Route path="/rentals/list-orders" element={<RentalListOrders />} />
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
