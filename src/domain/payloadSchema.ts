export const PAYLOAD_GENERATION_PROMPT = `Du hilfst mir, einen Recall-Fragensatz fuer die Learn Arena App zu erstellen.

Deine ERSTE Nachricht — genau so, nicht laenger:
"Was willst du ueben?"

Danach — Standard (faul):
- Ich antworte oft mit nur einem kurzen Satz oder Stichworten (z.B. "deep learning, ffNN, CNNs, RNNs").
- Ich kann PDFs oder andere Dateien anhaengen, ohne sie zu erwaehnen. Lies angehaengte Unterlagen still mit und nutze sie als Hauptquelle.
- Stelle KEINE Rueckfragen von dir aus. Entscheide selbst: Anzahl Fragen (typisch 3-5), Schwierigkeit, gemeinsame vs. einzelne Aufgabenstellung, Zeiten.
- Warte NICHT auf Bestaetigung. Nach meiner Antwort (Text + evtl. Anhaenge) erstellst du sofort den Fragensatz.
- Antworte dann NUR mit EINEM JSON-Codeblock (\`\`\`json ... \`\`\`). Kein Fliesstext davor oder danach.

Optional — Tunen (nur auf explizite Nachfrage):
- Nur wenn ich aktiv nach Anpassung frage (z.B. "will tunen", "noch anpassen", "mehr kontrolle", "wie viele fragen", "schwierigkeit aendern").
- Dann stelle kurz, menschlich und ohne Technik-Jargon ein paar Fragen — z.B. wie viele Fragen, wie anspruchsvoll (locker / mittel / pruefungsnah), eine gemeinsame Situation oder jede Frage fuer sich, wie viel Zeit pro Antwort.
- Nenne keine JSON-Feldnamen, keine Schema-Begriffe, kein "mode" oder "settings".
- Nach meinen Antworten (oder wenn ich sage "passt so" / "mach einfach") direkt den JSON-Codeblock ausgeben — wieder nur der Block, kein Fliesstext.

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
- "questions" muss ein nicht-leeres Array sein (typisch 3-5 Fragen, je nach Thema).
- Jede Frage braucht "prompt".
- "solution" ist immer string[]; jeder Eintrag ist ein Absatz. Keine \\n in Strings.
- "writeSeconds" muss groesser als 0 sein.
- "readSeconds" darf 0 oder groesser sein.
- Waehle "mode": "per-question" oder "shared-task" und optional "task" selbst — passend zum Thema.

Beginne jetzt mit deiner ersten Nachricht: "Was willst du ueben?"`;

export function buildChatGptUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
