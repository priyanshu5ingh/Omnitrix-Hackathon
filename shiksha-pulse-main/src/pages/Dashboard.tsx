import { Users, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiService, transformDashboardStats } from "@/lib/api";

export default function Dashboard() {
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const data = await apiService.getDashboardStats();
      return transformDashboardStats(data);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: apiService.getAnalytics,
    refetchInterval: 60000, // Refetch every minute
  });

  const riskDistribution = dashboardStats ? [
    { name: "High Risk", value: dashboardStats.highRisk, color: "hsl(var(--destructive))" },
    { name: "Medium Risk", value: dashboardStats.mediumRisk, color: "hsl(var(--warning))" },
    { name: "Low Risk", value: dashboardStats.lowRisk, color: "hsl(var(--success))" },
  ] : [];

  // Transform department data from API
  const departmentData = analyticsData?.department_performance ?
    Object.entries(analyticsData.department_performance).map(([dept, data]: [string, any]) => ({
      department: dept,
      high: data.High || 0,
      medium: data.Medium || 0,
      low: data.Low || 0,
    })) : [];

  // Mock engagement trend data (can be enhanced with real time-series data from API)
  const engagementTrend = [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 76 },
    { month: "Mar", score: 74 },
    { month: "Apr", score: 73 },
    { month: "May", score: 71 },
    { month: "Jun", score: 72 },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error loading dashboard</h3>
          <p className="text-muted-foreground">Please ensure the backend API is running</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No data available</h3>
          <p className="text-muted-foreground">Please train a model and upload student data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground mb-2">
            Student Engagement Dashboard
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Monitor student engagement and identify at-risk students early with AI-powered insights
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Students"
          value={dashboardStats.totalStudents}
          icon={Users}
          description="Enrolled students"
          delay={0}
        />
        <KPICard
          title="High Risk Students"
          value={dashboardStats.highRisk}
          icon={AlertTriangle}
          variant="destructive"
          description={`${((dashboardStats.highRisk / dashboardStats.totalStudents) * 100).toFixed(1)}% of total`}
          delay={100}
        />
        <KPICard
          title="Medium Risk Students"
          value={dashboardStats.mediumRisk}
          icon={TrendingDown}
          variant="warning"
          description={`${((dashboardStats.mediumRisk / dashboardStats.totalStudents) * 100).toFixed(1)}% of total`}
          delay={200}
        />
        <KPICard
          title="Low Risk Students"
          value={dashboardStats.lowRisk}
          icon={TrendingUp}
          variant="success"
          description={`${((dashboardStats.lowRisk / dashboardStats.totalStudents) * 100).toFixed(1)}% of total`}
          delay={300}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <KPICard
          title="Average Engagement Score"
          value={`${dashboardStats.avgEngagement}%`}
          icon={TrendingUp}
          trend={{ value: "2.3% from last month", isPositive: true }}
          delay={400}
        />
        <KPICard
          title="Disengagement Rate"
          value={`${dashboardStats.disengagementRate}%`}
          icon={TrendingDown}
          variant="destructive"
          trend={{ value: "1.2% from last month", isPositive: false }}
          delay={500}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <Card className="overflow-hidden animate-fade-in-up animate-delay-300 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Current student risk level breakdown</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trends */}
        <Card className="overflow-hidden animate-fade-in-up animate-delay-400 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Engagement Trends
            </CardTitle>
            <CardDescription>Average engagement score over time</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Engagement Score"
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department-wise Risk Analysis */}
      <Card className="overflow-hidden animate-fade-in-up animate-delay-500 hover:shadow-2xl transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            Department-wise Risk Analysis
          </CardTitle>
          <CardDescription>Student risk distribution across departments</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="department" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))'
                }} 
              />
              <Legend />
              <Bar 
                dataKey="high" 
                fill="hsl(var(--destructive))" 
                name="High Risk" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
              <Bar 
                dataKey="medium" 
                fill="hsl(var(--warning))" 
                name="Medium Risk" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
                animationBegin={200}
              />
              <Bar 
                dataKey="low" 
                fill="hsl(var(--success))" 
                name="Low Risk" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
                animationBegin={400}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
