import ScoreGauge from "@/components/ScoreGauge";
import { CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  summary: string;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const getStatusConfig = (score: number) => {
  if (score >= 75) return { label: "Excellent Match", icon: CheckCircle2, className: "bg-accent/10 text-accent border-accent/20" };
  if (score >= 50) return { label: "Needs Work", icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" };
  return { label: "Poor Match", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" };
};

const ResultsDashboard = ({ result }: ResultsDashboardProps) => {
  const status = getStatusConfig(result.score);
  const StatusIcon = status.icon;

  return (
    <section className="px-4 py-16 max-w-5xl mx-auto animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gradient mb-4">Analysis Results</h2>
      {result.summary && (
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">{result.summary}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score */}
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center md:col-span-1">
          <ScoreGauge score={result.score} />
          <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.className}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <h3 className="font-bold text-foreground mb-1">Missing Keywords</h3>
          <p className="text-sm text-muted-foreground mb-4">These skills from the job description were not found in your resume.</p>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.length > 0 ? (
              result.missingKeywords.map((kw) => (
                <Badge
                  key={kw}
                  variant="outline"
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  {kw}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-accent font-medium">All key skills found! Great match.</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h3 className="font-bold text-foreground">Quick Fix Action Plan</h3>
        </div>
        <ul className="space-y-3">
          {result.suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ResultsDashboard;
