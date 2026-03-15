const GEMINI_MODEL = "gemini-2.5-flash";

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }

  return text.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { recap } = req.body ?? {};
  if (!recap || typeof recap !== "string") {
    return res.status(400).json({ error: "Missing recap text" });
  }

  const prompt = `
You are assisting with a maritime voyage recap demo.
Return ONLY valid JSON.
Do not wrap the JSON in markdown fences.
Do not include explanations.
If a field is missing, use an empty string or an empty array.
Use assistive, non-legal language only.
Never conclude fault, invalidity, enforceability, or legal liability.

Schema:
{
  "owner": "string",
  "charterer": "string",
  "broker": "string",
  "cargo": "string",
  "loadport": "string",
  "disport": "string",
  "route": "string",
  "freight_term": "string",
  "demurrage": "string",
  "claim_deadline": "string",
  "voyage_status": "Loading|Discharging|Completed|Pending review",
  "upcoming_trigger": "string",
  "next_deadline": "string",
  "voyage_health": "On track|At risk|Delayed",
  "health_reasons": ["string", "string", "string"],
  "commercial_risk": "Low|Medium|High",
  "flags": [
    {
      "title": "string",
      "guidance": "string",
      "severity": "medium|high"
    }
  ],
  "parser_summary": [
    {
      "label": "string",
      "value": "string"
    }
  ],
  "documents": [
    {
      "title": "string",
      "status": "uploaded|missing|awaiting_review|draft_only|confirmed"
    }
  ],
  "risk_notes": ["string", "string", "string"],
  "changes_since_last_update": [
    {
      "title": "string",
      "detail": "string",
      "stamp": "string"
    }
  ],
  "owner_tasks": [
    {
      "title": "string",
      "detail": "string",
      "status": "pending|ready|active|complete",
      "clause_source_title": "string",
      "clause_source_text": "string",
      "why_matters": "string",
      "risk_if_missed": "string"
    }
  ],
  "charterer_tasks": [
    {
      "title": "string",
      "detail": "string",
      "status": "pending|ready|active|complete",
      "clause_source_title": "string",
      "clause_source_text": "string",
      "why_matters": "string",
      "risk_if_missed": "string"
    }
  ]
}

Guidance:
- Build a useful operational draft from the recap text.
- If exact values are not explicit, use careful phrases like "Pending review" or "Review recommended".
- Make tasks practical and tied to apparent clauses or triggers.
- Keep arrays short and useful.

Recap:
${recap}
`.trim();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini request failed",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";

    const parsed = JSON.parse(extractJson(text));
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
}
