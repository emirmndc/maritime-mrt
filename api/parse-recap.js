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
You are assisting with a maritime voyage recap workflow draft.
Return ONLY valid JSON.
Do not wrap the JSON in markdown fences.
Do not include explanations outside the JSON.
Use cautious assistive language.
Do not decide who is right.
Do not make legal conclusions.
Every suggested item must be traceable back to recap wording.
Timing advisories must be cautious and operational.
Do not state that operations will definitely stop.
Use language like:
- may affect banking days
- may slow local documentation
- local agent or customs availability may vary
- local holiday window should be reviewed
Do not invent exact holiday names or dates unless the recap explicitly supports them.

Confidence rules:
- high = directly stated in recap
- medium = reasonable synthesis from one or more recap items
- low = weak basis, incomplete support, or strong interpretation

Source trace rules:
- each generated card should include sourceTrace
- sourceTrace must quote short recap snippets
- prefer the strongest source first

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
  "voyage_status": "Pending review|Loading|Discharging|Completed",
  "upcoming_trigger": "string",
  "next_deadline": "string",
  "voyage_health": "Attention required|Risk signals detected|Pending review",
  "health_reasons": ["string"],
  "commercial_risk": "Low|Medium|High",
  "parser_summary": [
    { "label": "string", "value": "string" }
  ],
  "timing_advisories": [
    {
      "country": "string",
      "port_context": "loadport|disport|possible call",
      "holiday_name": "string",
      "advisory": "string",
      "impact": "banking|port_ops|docs|customs",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "payment_term|documentary_requirement|approval_dependency|operational_condition",
          "reasoning": "string"
        }
      ]
    }
  ],
  "flags": [
    {
      "title": "string",
      "guidance": "string",
      "severity": "medium|high",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "explicit_obligation|payment_term|documentary_requirement|approval_dependency|commercial_uncertainty|operational_condition",
          "reasoning": "string"
        }
      ]
    }
  ],
  "documents": [
    {
      "title": "string",
      "status": "uploaded|missing|awaiting_review|draft_only|confirmed",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "explicit_obligation|payment_term|documentary_requirement|approval_dependency|commercial_uncertainty|operational_condition",
          "reasoning": "string"
        }
      ]
    }
  ],
  "risk_notes": [
    {
      "title": "string",
      "body": "string",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "explicit_obligation|payment_term|documentary_requirement|approval_dependency|commercial_uncertainty|operational_condition",
          "reasoning": "string"
        }
      ]
    }
  ],
  "changes_since_last_update": [
    { "title": "string", "detail": "string", "stamp": "string" }
  ],
  "owner_tasks": [
    {
      "title": "string",
      "detail": "string",
      "status": "pending|ready|active|complete",
      "clause_source_title": "string",
      "clause_source_text": "string",
      "why_matters": "string",
      "risk_if_missed": "string",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "explicit_obligation|payment_term|documentary_requirement|approval_dependency|commercial_uncertainty|operational_condition",
          "reasoning": "string"
        }
      ]
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
      "risk_if_missed": "string",
      "confidence": "high|medium|low",
      "sourceTrace": [
        {
          "sectionId": "string",
          "sectionTitle": "string",
          "snippet": "string",
          "sourceType": "explicit_obligation|payment_term|documentary_requirement|approval_dependency|commercial_uncertainty|operational_condition",
          "reasoning": "string"
        }
      ]
    }
  ]
}

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
