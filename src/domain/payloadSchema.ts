export const PAYLOAD_GENERATION_PROMPT = `Du hilfst mir, einen Recall-Fragensatz fuer die Learn Arena App zu erstellen.

WICHTIG - Ablauf in dieser Reihenfolge:
1. Begruesse mich kurz und frage, welches Thema ich ueben will. Stelle 2-3 gezielte Rueckfragen (z.B. Anzahl Fragen, Schwierigkeit, gemeinsame Aufgabenstellung).
2. Fasse zusammen, was du erstellen wirst, und warte auf meine Bestaetigung.
3. Erst nach meiner Bestaetigung: Gib den fertigen Fragensatz als EINEN JSON-Codeblock aus (\`\`\`json ... \`\`\`), den ich kopieren kann. Kein weiterer Fliesstext danach.

Das JSON muss diesem Schema entsprechen:
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

Regeln fuer das JSON:
- "questions" muss ein nicht-leeres Array sein.
- Jede Frage braucht "prompt".
- "solution" ist immer string[]; jeder Eintrag ist ein Absatz. Keine \\n in Strings.
- "writeSeconds" muss groesser als 0 sein.
- "readSeconds" darf 0 oder groesser sein.

Beginne jetzt mit Schritt 1.`;

export function buildChatGptUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
