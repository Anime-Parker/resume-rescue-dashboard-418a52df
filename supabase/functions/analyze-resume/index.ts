import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Both resumeText and jobDescription are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const AI_SERVICE_API_KEY = Deno.env.get("AI_SERVICE_API_KEY");
    if (!AI_SERVICE_API_KEY) {
      throw new Error("AI_SERVICE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach. Analyze the resume against the job description and return structured feedback using the provided tool/function call.

You MUST respond using the provided tool/function call. Do not respond with plain text.

For the interviewQuestions field: Analyze the GAP between the resume and job description. Generate 3 specific, tough technical questions the interviewer is likely to ask to test those missing or weak skills.

For the connectionNote field: Write a professional, polite LinkedIn cold message under 300 characters. Mention the specific role title from the JD and highlight ONE key strength from the resume to sound authentic.

For the elevatorPitch field: Write a 3-sentence "Tell Me About Yourself" script.
- Sentence 1: Who they are (based on education/current role from resume).
- Sentence 2: Their top skill relevant to this JD.
- Sentence 3: Why they are excited about this specific company/role.`;

    const userPrompt = `Analyze this resume against the job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Evaluate keyword match, skills alignment, and overall fit. Provide a score from 0-100, list missing keywords, give actionable suggestions, and generate interview questions, a LinkedIn connection note, and an elevator pitch.`;

    const response = await fetch("https://api.example.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_SERVICE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "resume_analysis",
              description: "Return structured resume analysis results with career toolkit",
              parameters: {
                type: "object",
                properties: {
                  score: {
                    type: "number",
                    description: "Match score from 0 to 100",
                  },
                  missingKeywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Keywords/skills from the JD missing in the resume",
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "5 actionable suggestions to improve the resume for this role",
                  },
                  summary: {
                    type: "string",
                    description: "A brief 1-2 sentence summary of the analysis",
                  },
                  interviewQuestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 specific tough technical interview questions based on skill gaps between resume and JD",
                  },
                  connectionNote: {
                    type: "string",
                    description: "A professional LinkedIn cold message under 300 characters mentioning the role title and one key strength from the resume",
                  },
                  elevatorPitch: {
                    type: "string",
                    description: "A 3-sentence 'Tell Me About Yourself' script covering who they are, their top relevant skill, and excitement for the role",
                  },
                },
                required: ["score", "missingKeywords", "suggestions", "summary", "interviewQuestions", "connectionNote", "elevatorPitch"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "resume_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Fallbacks for new fields
    if (!analysis.interviewQuestions || !Array.isArray(analysis.interviewQuestions) || analysis.interviewQuestions.length === 0) {
      analysis.interviewQuestions = ["Could not generate interview questions. Please try again."];
    }
    if (!analysis.connectionNote || typeof analysis.connectionNote !== "string") {
      analysis.connectionNote = "Could not generate connection note. Please try again.";
    }
    if (!analysis.elevatorPitch || typeof analysis.elevatorPitch !== "string") {
      analysis.elevatorPitch = "Could not generate elevator pitch. Please try again.";
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
