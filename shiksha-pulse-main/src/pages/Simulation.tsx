import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { Progress } from "@/components/ui/progress";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type RiskLevel = "high" | "medium" | "low";

export default function Simulation() {
  const [attendance, setAttendance] = useState([75]);
  const [cgpa, setCgpa] = useState([7.0]);
  const [studyHours, setStudyHours] = useState([4]);
  const [participation, setParticipation] = useState([60]);

  // Calculate risk score and level based on metrics
  const calculateRiskScore = () => {
    const attendanceScore = (attendance[0] / 100) * 30;
    const cgpaScore = (cgpa[0] / 10) * 35;
    const studyScore = (Math.min(studyHours[0], 8) / 8) * 20;
    const participationScore = (participation[0] / 100) * 15;

    return Math.round(attendanceScore + cgpaScore + studyScore + participationScore);
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 75) return "low";
    if (score >= 50) return "medium";
    return "high";
  };

  const riskScore = calculateRiskScore();
  const riskLevel = getRiskLevel(riskScore);
  const confidence = Math.round(85 + Math.random() * 10);

  const handleReset = () => {
    setAttendance([75]);
    setCgpa([7.0]);
    setStudyHours([4]);
    setParticipation([60]);
    toast.success("Parameters reset to default values");
  };

  const handleSave = () => {
    toast.success("Scenario saved successfully", {
      description: `Risk Score: ${riskScore}% - ${riskLevel.toUpperCase()} Risk`,
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          What-If Simulation
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Adjust student parameters to predict engagement outcomes in real-time</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <Card className="lg:col-span-2 animate-fade-in-up hover:shadow-2xl transition-all duration-500 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Simulation Parameters
            </CardTitle>
            <CardDescription className="text-base">
              Adjust the sliders to see how different factors affect student risk in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative">
            {/* Attendance */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="attendance">Attendance Rate</Label>
                <span className="text-sm font-medium">{attendance[0]}%</span>
              </div>
              <Slider
                id="attendance"
                min={0}
                max={100}
                step={1}
                value={attendance}
                onValueChange={setAttendance}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher attendance correlates with better engagement
              </p>
            </div>

            {/* CGPA */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="cgpa">CGPA</Label>
                <span className="text-sm font-medium">{cgpa[0].toFixed(1)}/10</span>
              </div>
              <Slider
                id="cgpa"
                min={0}
                max={10}
                step={0.1}
                value={cgpa}
                onValueChange={setCgpa}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Academic performance indicator
              </p>
            </div>

            {/* Study Hours */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="studyHours">Daily Study Hours</Label>
                <span className="text-sm font-medium">{studyHours[0]} hours</span>
              </div>
              <Slider
                id="studyHours"
                min={0}
                max={12}
                step={0.5}
                value={studyHours}
                onValueChange={setStudyHours}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Self-reported study time per day
              </p>
            </div>

            {/* Participation */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="participation">Class Participation</Label>
                <span className="text-sm font-medium">{participation[0]}%</span>
              </div>
              <Slider
                id="participation"
                min={0}
                max={100}
                step={1}
                value={participation}
                onValueChange={setParticipation}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Active engagement in classes and discussions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Scenario
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="animate-fade-in-up animate-delay-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group sticky top-6">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Predicted Outcome
              </CardTitle>
              <CardDescription>Based on current parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="text-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Engagement Score</p>
                <p className="text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent animate-scale-in">
                  {riskScore}%
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Risk Level</span>
                  <RiskBadge level={riskLevel} className="animate-scale-in" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Prediction Confidence</span>
                  <span className="text-sm font-bold text-primary">{confidence}%</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskLevel === "high" && (
                <>
                  <div className="text-sm p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="font-medium text-destructive mb-1">Critical Intervention Needed</p>
                    <p className="text-xs text-muted-foreground">
                      Immediate counseling and academic support required
                    </p>
                  </div>
                  {attendance[0] < 75 && (
                    <p className="text-sm">• Improve attendance to at least 75%</p>
                  )}
                  {cgpa[0] < 6.0 && (
                    <p className="text-sm">• Focus on improving CGPA through tutoring</p>
                  )}
                  {studyHours[0] < 3 && (
                    <p className="text-sm">• Increase daily study hours</p>
                  )}
                </>
              )}

              {riskLevel === "medium" && (
                <>
                  <div className="text-sm p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="font-medium text-warning mb-1">Moderate Risk</p>
                    <p className="text-xs text-muted-foreground">
                      Monitor progress and provide regular support
                    </p>
                  </div>
                  <p className="text-sm">• Continue current support measures</p>
                  <p className="text-sm">• Regular check-ins recommended</p>
                </>
              )}

              {riskLevel === "low" && (
                <>
                  <div className="text-sm p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="font-medium text-success mb-1">On Track</p>
                    <p className="text-xs text-muted-foreground">
                      Student is performing well
                    </p>
                  </div>
                  <p className="text-sm">• Maintain current performance</p>
                  <p className="text-sm">• Consider peer mentoring opportunities</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
