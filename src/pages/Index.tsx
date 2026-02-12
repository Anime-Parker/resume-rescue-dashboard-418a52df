import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Workspace from "@/components/Workspace";
import ResultsDashboard, { AnalysisResult } from "@/components/ResultsDashboard";
import SkeletonLoading from "@/components/SkeletonLoading";
import { FileSearch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AnalysisState = "idle" | "loading" | "done" | "error";

const Index = () => {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (resumeText: string, jobDescription: string) => {
    setState("loading");
    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText, jobDescription },
      });

      if (error) {
        throw new Error(error.message || "Analysis failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
      setState("done");
    } catch (e) {
      console.error("Analysis error:", e);
      setState("error");
      toast({
        title: "Analysis Failed",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
              <FileSearch className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Resume-Rescue AI</span>
          </div>
          <a
            href="#workspace"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Get Started →
          </a>
        </div>
      </nav>

      <HeroSection />
      <Workspace onAnalyze={handleAnalyze} isAnalyzing={state === "loading"} />

      {state === "loading" && <SkeletonLoading />}
      {state === "done" && result && <ResultsDashboard result={result} />}

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Resume-Rescue AI. Built to help you land your dream job.</p>
      </footer>
    </div>
  );
};

export default Index;
