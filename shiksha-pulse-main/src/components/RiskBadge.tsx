import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RiskLevel = "high" | "medium" | "low";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const variants = {
    high: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    medium: "bg-warning text-warning-foreground hover:bg-warning/90",
    low: "bg-success text-success-foreground hover:bg-success/90",
  };

  const labels = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk",
  };

  return (
    <Badge className={cn(variants[level], className)}>
      {labels[level]}
    </Badge>
  );
}
