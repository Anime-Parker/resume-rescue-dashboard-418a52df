import { Upload, FileText, Sparkles } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Resume", description: "Drop your PDF" },
  { icon: FileText, label: "Paste JD", description: "Add job description" },
  { icon: Sparkles, label: "Optimize", description: "Get AI insights" },
];

const HeroSection = () => {
  return (
    <section className="gradient-hero min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="animate-fade-in-up max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4 text-accent" />
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gradient leading-tight mb-4">
          Beat the ATS.<br />Get the Interview.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-12">
          Instant AI feedback on your resume's compatibility with job descriptions. Land more interviews with optimized keywords and formatting.
        </p>
      </div>

      <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 sm:gap-0">
            <a href="#workspace" className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="glass-card w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </a>
            {i < steps.length - 1 && (
              <div className="hidden sm:block w-16 h-px bg-border mx-4 mt-[-1rem]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
