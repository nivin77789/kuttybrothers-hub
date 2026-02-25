import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CalendarCheck, FileText, Wrench, Settings } from "lucide-react";

const modules = [
  {
    title: "Accounts",
    description: "Manage your ledgers, balances, and transactions easily.",
    icon: BookOpen,
    path: "/accounts",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Employees",
    description: "Track employee records, payroll, and attendance.",
    icon: Users,
    path: "/employees",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Attendance",
    description: "Assign, monitor, and manage project finances.",
    icon: CalendarCheck,
    path: "/attendance",
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Invoices",
    description: "Create and manage client invoices with ease.",
    icon: FileText,
    path: "/invoices",
    color: "from-rose-500 to-rose-600",
  },
  {
    title: "Rentals",
    description: "Providing rental tools and details.",
    icon: Wrench,
    path: "/rentals",
    color: "from-violet-500 to-violet-600",
  },
  {
    title: "Settings",
    description: "Configure system preferences and user permissions.",
    icon: Settings,
    path: "/settings",
    color: "from-slate-500 to-slate-600",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to <span className="gradient-text">KUTTYBROTHERS</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a module to get started with your management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((module) => (
            <Card
              key={module.title}
              className="group cursor-pointer border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              onClick={() => navigate(module.path)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
