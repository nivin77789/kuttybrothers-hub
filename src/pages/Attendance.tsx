import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarCheck, UserCheck, UserX, Clock } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "half-day";

interface AttendanceRecord {
  id: string;
  employee: string;
  date: string;
  status: AttendanceStatus;
}

const employees = ["Arun Kumar", "Priya Sharma", "Rajesh Nair", "Deepa Menon"];

const generateRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceStatus[] = ["present", "absent", "half-day"];
  employees.forEach((emp, i) => {
    for (let d = 1; d <= 5; d++) {
      records.push({
        id: `${i}-${d}`,
        employee: emp,
        date: `2025-01-${String(d + 13).padStart(2, "0")}`,
        status: statuses[(i + d) % 3],
      });
    }
  });
  return records;
};

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(generateRecords);
  const [filterEmployee, setFilterEmployee] = useState("all");

  const filtered = filterEmployee === "all" ? records : records.filter(r => r.employee === filterEmployee);

  const presentCount = records.filter(r => r.status === "present").length;
  const absentCount = records.filter(r => r.status === "absent").length;
  const halfDayCount = records.filter(r => r.status === "half-day").length;

  const cycleStatus = (id: string) => {
    const order: AttendanceStatus[] = ["present", "absent", "half-day"];
    setRecords(records.map(r => {
      if (r.id !== id) return r;
      const next = order[(order.indexOf(r.status) + 1) % 3];
      return { ...r, status: next };
    }));
  };

  const statusColor = (s: AttendanceStatus) =>
    s === "present" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
    s === "absent" ? "bg-rose-500/10 text-rose-600 border-rose-200" :
    "bg-amber-500/10 text-amber-600 border-amber-200";

  return (
    <Layout showBack title="Attendance">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-emerald-500/10"><UserCheck className="h-6 w-6 text-emerald-500" /></div>
              <div><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-bold text-emerald-500">{presentCount}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-rose-500/10"><UserX className="h-6 w-6 text-rose-500" /></div>
              <div><p className="text-sm text-muted-foreground">Absent</p><p className="text-2xl font-bold text-rose-500">{absentCount}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-3 rounded-xl bg-amber-500/10"><Clock className="h-6 w-6 text-amber-500" /></div>
              <div><p className="text-sm text-muted-foreground">Half-Day</p><p className="text-2xl font-bold text-amber-500">{halfDayCount}</p></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarCheck className="h-5 w-5" /> Attendance Records</CardTitle>
            <Select value={filterEmployee} onValueChange={setFilterEmployee}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Filter by employee" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Click on a status badge to cycle through: Present → Absent → Half-Day</p>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="font-medium">{r.employee}</TableCell>
                    <TableCell>
                      <button onClick={() => cycleStatus(r.id)} className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer transition-colors ${statusColor(r.status)}`}>
                        {r.status}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;
