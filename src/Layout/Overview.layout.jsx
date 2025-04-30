import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Icons from lucide-react (adjust as needed)
import { 
  DollarSign, 
  Folder, 
  Clock, 
  CheckSquare 
} from "lucide-react";

// Recharts (install if not already installed: npm install recharts)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Mock data for bar chart
const barData = [
  { name: "Completed", value: 65 },
  { name: "On going", value: 78 },
  { name: "Pending", value: 45 },
];

// Mock data for project summary table
const projectSummaryData = [
  { name: "Nelsa web app", dueDate: "25/01/24", status: "Completed" },
  { name: "Datascale AI app", dueDate: "25/01/24", status: "At risk" },
  { name: "Media channel branding", dueDate: "25/01/24", status: "At risk" },
  { name: "Coralix App redesign", dueDate: "25/01/24", status: "Completed" },
  { name: "Website builder developement", dueDate: "25/01/24", status: "On going" },
];

export default function OverviewLayout() {
  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Overview
        </h2>
        <Button variant="outline" className="text-sm font-medium">
          Last 30 days
        </Button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <OverviewCard
          icon={<DollarSign size={24} className="text-white" />}
          iconBg="bg-green-500"
          title="Total revenue"
          value="$53,900"
          subValue="+10%"
        />
        <OverviewCard
          icon={<Folder size={24} className="text-white" />}
          iconBg="bg-blue-500"
          title="Projects"
          value="95 / 100"
          subValue="+10%"
        />
        <OverviewCard
          icon={<Clock size={24} className="text-white" />}
          iconBg="bg-orange-500"
          title="Time spent"
          value="1022 / 1300 Hrs"
          subValue="+9%"
        />
        <OverviewCard
          icon={<CheckSquare size={24} className="text-white" />}
          iconBg="bg-purple-500"
          title="Hours Billed"
          value="101 / 120"
          subValue="+12%"
        />
      </div>

      {/* Separator */}
      <Separator />

      {/* Bottom Row: Project summary & Overall Progress */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Project summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-3 px-4 text-left">Project name</th>
                  <th className="py-3 px-4 text-left">Due date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {projectSummaryData.map((project, idx) => (
                  <tr key={idx} className="border-b last:border-none">
                    <td className="py-3 px-4">{project.name}</td>
                    <td className="py-3 px-4">{project.dueDate}</td>
                    <td className="py-3 px-4">{getStatusBadge(project.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF9F43" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Percentages under the chart if desired */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              {barData.map((bar, idx) => (
                <div key={idx}>
                  <p className="font-bold text-gray-800">{bar.value}%</p>
                  <p className="text-gray-500">{bar.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * A reusable stats card used in the top row
 */
function OverviewCard({ icon, iconBg, title, value, subValue }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Icon circle */}
          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${iconBg}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
            {subValue}
          </span>
        </div>
        <CardTitle className="mt-4 text-sm text-gray-500">{title}</CardTitle>
        <CardDescription className="text-2xl font-bold text-gray-900">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

/**
 * Returns a Shadcn UI <Badge> based on a project status.
 */
function getStatusBadge(status) {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-600">Completed</Badge>;
    case "at risk":
      return <Badge variant="outline" className="bg-red-100 text-red-600">At risk</Badge>;
    case "ongoing":
    case "on going":
      return <Badge variant="outline" className="bg-orange-100 text-orange-600">On going</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-600 capitalize">
        {status}
      </Badge>;
  }
}
