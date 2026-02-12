import { useState, useRef, DragEvent } from "react";
import { Upload, Clipboard, FileCheck, Sparkles, Loader2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WorkspaceProps {
  onAnalyze: (resumeText: string, jobDescription: string) => void;
  isAnalyzing: boolean;
}

const Workspace = ({ onAnalyze, isAnalyzing }: WorkspaceProps) => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const readFile = async (file: File) => {
    setFileName(file.name);
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsParsing(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push(content.items.map((item: any) => item.str).join(" "));
        }
        setResumeText(pages.join("\n"));
      } catch {
        setResumeText("");
        setFileName(null);
      } finally {
        setIsParsing(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch {
      // Clipboard access denied
    }
  };

  const canAnalyze = resumeText.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto" id="workspace">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gradient mb-2">Your Workspace</h2>
      <p className="text-center text-muted-foreground mb-10">Upload your resume and paste the job description to get started.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Upload Zone */}
        <div
          className={`upload-zone glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px] cursor-pointer ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx,.md"
            className="hidden"
            onChange={handleFileSelect}
          />
          {isParsing ? (
            <div className="flex flex-col items-center gap-3 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
              </div>
              <p className="font-semibold text-foreground">Parsing PDF...</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-3 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-accent" />
              </div>
              <p className="font-semibold text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">Click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">Drag & Drop your Resume</p>
              <p className="text-sm text-muted-foreground">or click to browse (.pdf, .txt, .md)</p>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="glass-card rounded-2xl p-6 flex flex-col min-h-[260px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Job Description</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="gap-1.5 text-xs"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Paste
            </Button>
          </div>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="flex-1 resize-none bg-secondary/50 border-none rounded-xl text-sm focus-visible:ring-accent"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!canAnalyze || isAnalyzing}
          onClick={() => onAnalyze(resumeText, jobDescription)}
          className="gradient-cta text-accent-foreground font-bold text-base px-10 py-6 rounded-2xl shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze My Resume
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default Workspace;
