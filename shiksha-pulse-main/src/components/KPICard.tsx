import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  variant = "default",
  trend,
  delay = 0
}: KPICardProps) {
  const variantStyles = {
    default: "border-primary/20 hover:border-primary/40",
    success: "border-success/20 bg-success/5 hover:border-success/40 hover:bg-success/10",
    warning: "border-warning/20 bg-warning/5 hover:border-warning/40 hover:bg-warning/10",
    destructive: "border-destructive/20 bg-destructive/5 hover:border-destructive/40 hover:bg-destructive/10",
  };

  const iconVariantStyles = {
    default: "text-primary bg-primary/10 group-hover:bg-primary/20",
    success: "text-success bg-success/10 group-hover:bg-success/20",
    warning: "text-warning bg-warning/10 group-hover:bg-warning/20",
    destructive: "text-destructive bg-destructive/10 group-hover:bg-destructive/20",
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up overflow-hidden relative",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2.5 rounded-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 group-hover:text-muted-foreground/80 transition-colors">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs mt-2 px-2 py-1 rounded-full font-medium",
            trend.isPositive 
              ? "bg-success/10 text-success" 
              : "bg-destructive/10 text-destructive"
          )}>
            <span className="text-sm">{trend.isPositive ? "↑" : "↓"}</span>
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
