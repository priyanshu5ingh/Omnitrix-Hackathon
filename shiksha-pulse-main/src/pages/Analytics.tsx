import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { mockStudents, departmentData } from "@/lib/mockData";

export default function Analytics() {
  const attendanceVsPerformance = mockStudents.map(student => ({
    attendance: student.attendance,
    cgpa: student.cgpa,
    name: student.name,
  }));

  const trendData = [
    { semester: "Sem 1", avgCGPA: 7.8, avgAttendance: 88, avgEngagement: 82 },
    { semester: "Sem 2", avgCGPA: 7.6, avgAttendance: 85, avgEngagement: 79 },
    { semester: "Sem 3", avgCGPA: 7.4, avgAttendance: 83, avgEngagement: 76 },
    { semester: "Sem 4", avgCGPA: 7.2, avgAttendance: 80, avgEngagement: 74 },
    { semester: "Sem 5", avgCGPA: 7.3, avgAttendance: 82, avgEngagement: 75 },
    { semester: "Sem 6", avgCGPA: 7.5, avgAttendance: 84, avgEngagement: 78 },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Deep dive into student engagement patterns and correlations</p>
      </div>

      <Tabs defaultValue="correlation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="department">Department Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance vs Academic Performance</CardTitle>
              <CardDescription>
                Correlation between student attendance and CGPA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="attendance" 
                    name="Attendance" 
                    unit="%" 
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="cgpa" 
                    name="CGPA" 
                    domain={[0, 10]}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Students" 
                    data={attendanceVsPerformance} 
                    fill="hsl(var(--primary))" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
              <CardDescription>
                Average metrics across semesters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgCGPA" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Average CGPA"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgAttendance" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Average Attendance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgEngagement" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2}
                    name="Average Engagement"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {departmentData.map((dept) => {
              const total = dept.high + dept.medium + dept.low;
              const successRate = ((dept.low / total) * 100).toFixed(1);
              const riskRate = ((dept.high / total) * 100).toFixed(1);

              return (
                <Card key={dept.department}>
                  <CardHeader>
                    <CardTitle>{dept.department}</CardTitle>
                    <CardDescription>Performance metrics and risk analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-success">{dept.low}</p>
                        <p className="text-xs text-muted-foreground">Low Risk</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-warning">{dept.medium}</p>
                        <p className="text-xs text-muted-foreground">Medium Risk</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-destructive">{dept.high}</p>
                        <p className="text-xs text-muted-foreground">High Risk</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium text-success">{successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Rate</span>
                        <span className="text-sm font-medium text-destructive">{riskRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Students</span>
                        <span className="text-sm font-medium">{total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
