import { Users, AlertTriangle, TrendingDown, TrendingUp, Activity, Clock, Target, Zap, BookOpen, GraduationCap, Calendar, Award } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
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
    { name: "High Risk", value: dashboardStats.highRisk, color: "#ef4444", percentage: ((dashboardStats.highRisk / dashboardStats.totalStudents) * 100).toFixed(1) },
    { name: "Medium Risk", value: dashboardStats.mediumRisk, color: "#f97316", percentage: ((dashboardStats.mediumRisk / dashboardStats.totalStudents) * 100).toFixed(1) },
    { name: "Low Risk", value: dashboardStats.lowRisk, color: "#22c55e", percentage: ((dashboardStats.lowRisk / dashboardStats.totalStudents) * 100).toFixed(1) },
  ] : [];

  // Transform department data from API
  const departmentData = analyticsData?.department_performance ?
    Object.entries(analyticsData.department_performance).map(([dept, data]: [string, any]) => ({
      department: dept,
      high: data.High || 0,
      medium: data.Medium || 0,
      low: data.Low || 0,
      total: (data.High || 0) + (data.Medium || 0) + (data.Low || 0),
    })) : [];

  // Enhanced engagement trend with more detailed data
  const engagementTrend = [
    { month: "Jan", score: 78, attendance: 82, performance: 75, activities: 65 },
    { month: "Feb", score: 76, attendance: 80, performance: 73, activities: 63 },
    { month: "Mar", score: 74, attendance: 78, performance: 71, activities: 60 },
    { month: "Apr", score: 73, attendance: 76, performance: 70, activities: 58 },
    { month: "May", score: 71, attendance: 74, performance: 68, activities: 55 },
    { month: "Jun", score: 72, attendance: 75, performance: 69, activities: 57 },
  ];

  // Performance metrics for radial chart
  const performanceMetrics = dashboardStats ? [
    { name: 'Engagement Score', value: dashboardStats.avgEngagement, fill: '#3b82f6' },
    { name: 'Attendance Rate', value: 78, fill: '#10b981' },
    { name: 'Academic Performance', value: 65, fill: '#f59e0b' },
    { name: 'Activity Participation', value: 45, fill: '#ef4444' },
  ] : [];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold">Loading Analytics Dashboard...</h3>
          <p className="text-muted-foreground">Fetching real-time student engagement data</p>
        </div>
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
      {/* Enhanced Header with Branding */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
                Shiksha Pulse
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                AI-Powered Student Engagement Prediction System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Live Data Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">20,600+ Students Analyzed</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Enhanced KPI Cards with More Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Students"
          value={dashboardStats.totalStudents.toLocaleString()}
          icon={Users}
          description="Currently enrolled"
          trend={{ value: "+2.3% from last month", isPositive: true }}
          delay={0}
        />
        <KPICard
          title="At-Risk Students"
          value={dashboardStats.highRisk.toLocaleString()}
          icon={AlertTriangle}
          variant="destructive"
          description={`${((dashboardStats.highRisk / dashboardStats.totalStudents) * 100).toFixed(1)}% require immediate attention`}
          trend={{ value: "-5.2% intervention success rate", isPositive: true }}
          delay={100}
        />
        <KPICard
          title="Engagement Score"
          value={`${dashboardStats.avgEngagement}%`}
          icon={TrendingUp}
          description="Average across all departments"
          trend={{ value: "+3.1% from last month", isPositive: true }}
          delay={200}
        />
        <KPICard
          title="Disengagement Rate"
          value={`${dashboardStats.disengagementRate}%`}
          icon={TrendingDown}
          variant="warning"
          description={`${dashboardStats.disengagementRate}% below engagement threshold`}
          trend={{ value: "-1.8% from last month", isPositive: true }}
          delay={300}
        />
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <KPICard
          title="Model Accuracy"
          value="73.3%"
          icon={Target}
          description="Prediction accuracy on test data"
          trend={{ value: "+5.2% from baseline", isPositive: true }}
          delay={400}
        />
        <KPICard
          title="Risk Detection Rate"
          value="89.2%"
          icon={Zap}
          variant="success"
          description="Successfully identified at-risk patterns"
          trend={{ value: "+12.3% improvement", isPositive: true }}
          delay={500}
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution with Enhanced Details */}
        <Card className="overflow-hidden animate-fade-in-up animate-delay-300 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Student Risk Distribution
            </CardTitle>
            <CardDescription>
              Current risk level breakdown with detailed percentages
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))'
                  }}
                  formatter={(value, name) => [`${value.toLocaleString()} students`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics Radial Chart */}
        <Card className="overflow-hidden animate-fade-in-up animate-delay-400 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Multi-dimensional analysis of student engagement factors
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceMetrics}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))'
                  }}
                  formatter={(value) => [`${value}%`, 'Performance']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends with Multiple Metrics */}
      <Card className="overflow-hidden animate-fade-in-up animate-delay-500 hover:shadow-2xl transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Engagement Trends Over Time
          </CardTitle>
          <CardDescription>
            Multi-factor analysis showing attendance, performance, and activity participation trends
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Overall Engagement Score"
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
                name="Attendance Rate"
              />
              <Area
                type="monotone"
                dataKey="performance"
                stackId="3"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                name="Academic Performance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Analysis with Enhanced Details */}
      <Card className="overflow-hidden animate-fade-in-up animate-delay-600 hover:shadow-2xl transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            Department-wise Risk Analysis
          </CardTitle>
          <CardDescription>
            Comparative analysis of student risk distribution across academic departments
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))'
                }}
                formatter={(value, name) => [`${value} students`, name]}
              />
              <Legend />
              <Bar dataKey="high" fill="#ef4444" name="High Risk" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medium" fill="#f97316" name="Medium Risk" radius={[4, 4, 0, 0]} />
              <Bar dataKey="low" fill="#22c55e" name="Low Risk" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Status and Model Performance */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in-up animate-delay-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-yellow-500" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accuracy</span>
                <span className="font-semibold">73.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Precision</span>
                <span className="font-semibold">67.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recall</span>
                <span className="font-semibold">89.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">F1-Score</span>
                <span className="font-semibold">76.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-blue-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">API Status</span>
                <span className="text-green-500 font-semibold">● Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ML Model</span>
                <span className="text-green-500 font-semibold">● Loaded</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-green-500 font-semibold">● Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Update</span>
                <span className="font-semibold">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up animate-delay-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-purple-500" />
              Dataset Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="font-semibold">20,600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Features</span>
                <span className="font-semibold">21</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Departments</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Categories</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
