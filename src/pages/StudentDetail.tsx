import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, AlertTriangle } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { mockStudents } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === id);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <Button onClick={() => navigate("/students")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const riskFactorsData = student.riskFactors.map(factor => ({
    name: factor,
    impact: Math.floor(Math.random() * 30) + 10,
  }));

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/students")}
            className="hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {student.name}
            </h1>
            <p className="text-muted-foreground text-lg mt-1">{student.id} • {student.department}</p>
          </div>
        </div>
        <div className="animate-scale-in">
          <RiskBadge level={student.riskLevel} className="text-base px-4 py-2" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="animate-fade-in-up hover:shadow-2xl transition-all duration-500 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Profile Information
            </CardTitle>
            <CardDescription>Personal and academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-xs font-medium text-muted-foreground mb-1">Student ID</p>
                <p className="text-lg font-bold text-primary">{student.id}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-xs font-medium text-muted-foreground mb-1">Year</p>
                <p className="text-lg font-bold">Year {student.year}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-xs font-medium text-muted-foreground mb-1">Department</p>
                <p className="text-lg font-bold">{student.department}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-xs font-medium text-muted-foreground mb-1">CGPA</p>
                <p className="text-lg font-bold text-success">{student.cgpa}/10</p>
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">{student.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Metrics */}
        <Card className="animate-fade-in-up animate-delay-100 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Academic Metrics
            </CardTitle>
            <CardDescription>Current performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Attendance</span>
                <span className="text-sm font-bold text-primary">{student.attendance}%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000"
                  style={{ width: `${student.attendance}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Engagement Score</span>
                <span className="text-sm font-bold text-success">{student.engagementScore}%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success/80 rounded-full transition-all duration-1000"
                  style={{ width: `${student.engagementScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Credits Completed</span>
                <span className="text-sm font-bold text-warning">{student.creditsCompleted}/160</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-warning to-warning/80 rounded-full transition-all duration-1000"
                  style={{ width: `${(student.creditsCompleted / 160) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Prediction Confidence</span>
                <span className="text-sm font-bold text-primary">{student.predictionConfidence}%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full transition-all duration-1000"
                  style={{ width: `${student.predictionConfidence}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
          <CardDescription>
            {student.riskFactors.length > 0 
              ? "Factors contributing to the risk assessment"
              : "No significant risk factors identified"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {student.riskFactors.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskFactorsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="impact" name="Impact Score">
                  {riskFactorsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={student.riskLevel === "high" 
                        ? "hsl(var(--destructive))" 
                        : "hsl(var(--warning))"
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              This student is performing well with no significant risk factors detected.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {student.riskLevel !== "low" && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Intervention Required
            </CardTitle>
            <CardDescription>
              This student requires immediate attention from academic counselors
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="destructive">
              <Mail className="mr-2 h-4 w-4" />
              Send Alert Email
            </Button>
            <Button variant="outline">Schedule Meeting</Button>
            <Button variant="outline">Assign Mentor</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
