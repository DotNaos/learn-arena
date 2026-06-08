export const PAYLOAD_GENERATION_PROMPT = `Du erstellst einen JSON-Payload fuer die Learn Arena Recall-App.

Antworte NUR mit validem JSON. Kein Markdown, kein Codeblock, keine Erklaerung.

Pflichtschema:
{
  "title": "string",
  "topic": "string",
  "mode": "per-question",
  "task": "string (optionale gemeinsame Aufgabenstellung)",
  "questions": [
    {
      "title": "string",
      "prompt": "string (die eigentliche Frage)",
      "solution": ["string", "string"]
    }
  ],
  "settings": {
    "readSeconds": 45,
    "writeSeconds": 180,
    "solutionSeconds": 10,
    "maxSolutionRequestsPerQuestion": 1,
    "allowSolution": true,
    "hideQuestionAfterRead": true
  }
}

Regeln:
- "questions" muss ein nicht-leeres Array sein.
- Jede Frage braucht "prompt".
- "solution" ist immer string[]; jeder Eintrag ist ein Absatz. Keine \\n in Strings.
- "writeSeconds" muss groesser als 0 sein.
- "readSeconds" darf 0 oder groesser sein.

Beispiel:
{
  "title": "Analysis Recall",
  "topic": "Mathe",
  "mode": "per-question",
  "task": "Beantworte jede Frage aus dem Kopf.",
  "questions": [
    {
      "title": "Grenzwert",
      "prompt": "Was ist der Grenzwert von sin(x)/x fuer x gegen 0?",
      "solution": ["Der Grenzwert ist 1.", "L Hospital oder Taylorreihe."]
    }
  ],
  "settings": {
    "readSeconds": 45,
    "writeSeconds": 180,
    "solutionSeconds": 10,
    "maxSolutionRequestsPerQuestion": 1,
    "allowSolution": true,
    "hideQuestionAfterRead": true
  }
}`;
