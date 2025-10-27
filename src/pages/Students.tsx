import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Eye, AlertTriangle } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { mockStudents } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Student Management
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Search and manage student engagement data</p>
      </div>

      <Card className="animate-fade-in-up hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <CardHeader className="relative">
          <CardTitle className="text-2xl">Student List</CardTitle>
          <CardDescription>
            View and search through all students
          </CardDescription>
          <div className="flex items-center gap-3 mt-6 relative">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-2 focus:border-primary transition-all duration-300"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="rounded-xl border-2 overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Student ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Year</TableHead>
                  <TableHead className="font-semibold">Risk Level</TableHead>
                  <TableHead className="font-semibold">Engagement Score</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow 
                    key={student.id}
                    className="hover:bg-muted/30 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium text-primary">{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary">
                        {student.department}
                      </span>
                    </TableCell>
                    <TableCell>Year {student.year}</TableCell>
                    <TableCell>
                      <RiskBadge level={student.riskLevel} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-full bg-muted rounded-full h-2.5 max-w-[120px] overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ${
                              student.engagementScore >= 75
                                ? "bg-gradient-to-r from-success to-success/80"
                                : student.engagementScore >= 50
                                ? "bg-gradient-to-r from-warning to-warning/80"
                                : "bg-gradient-to-r from-destructive to-destructive/80"
                            }`}
                            style={{ width: `${student.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[40px]">{student.engagementScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {student.riskLevel === "high" && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Alert
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
