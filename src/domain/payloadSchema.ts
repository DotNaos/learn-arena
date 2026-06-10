export const LEARN_ARENA_APP_URL =
  import.meta.env.VITE_LEARN_ARENA_URL ?? "https://learn-arena.vercel.app";

export const SOLUTION_SECONDS_DEFAULT = 15;
export const SOLUTION_SECONDS_MIN = 5;
export const SOLUTION_SECONDS_MAX = 60;

export function buildPayloadGenerationPrompt(
  appUrl: string = LEARN_ARENA_APP_URL,
): string {
  return `Du hilfst mir, einen Recall-Fragensatz fuer die Learn Arena App zu erstellen.

Deine ERSTE Nachricht — genau so, nicht laenger:
"Was willst du ueben?"

Danach — Standard (faul):
- Ich antworte oft mit nur einem kurzen Satz oder Stichworten (z.B. "deep learning, ffNN, CNNs, RNNs").
- Ich kann PDFs oder andere Dateien anhaengen, ohne sie zu erwaehnen. Lies angehaengte Unterlagen still mit und nutze sie als Hauptquelle.
- Stelle KEINE Rueckfragen von dir aus. Entscheide selbst: Anzahl Fragen (typisch 3-5), Schwierigkeit, gemeinsame vs. einzelne Aufgabenstellung, Zeiten.
- Warte NICHT auf Bestaetigung. Nach meiner Antwort (Text + evtl. Anhaenge) erstellst du sofort den Fragensatz.
- Antworte mit EINEM JSON-Codeblock (\`\`\`json ... \`\`\`), danach direkt eine kurze Anleitung (siehe unten). Kein Fliesstext vor dem JSON.

Optional — Tunen (nur auf explizite Nachfrage):
- Nur wenn ich aktiv nach Anpassung frage (z.B. "will tunen", "noch anpassen", "mehr kontrolle", "wie viele fragen", "schwierigkeit aendern").
- Dann stelle kurz, menschlich und ohne Technik-Jargon ein paar Fragen — z.B. wie viele Fragen, wie anspruchsvoll (locker / mittel / pruefungsnah), eine gemeinsame Situation oder jede Frage fuer sich, wie viel Zeit pro Antwort, wie lange die Loesung sichtbar bleiben soll (5-60 Sekunden).
- Nenne keine JSON-Feldnamen, keine Schema-Begriffe, kein "mode" oder "settings".
- Nach meinen Antworten (oder wenn ich sage "passt so" / "mach einfach") JSON-Codeblock + kurze Anleitung ausgeben.

Ausgabeformat nach dem Fragensatz:
1. Zuerst der JSON-Codeblock (\`\`\`json ... \`\`\`).
2. Direkt darunter, in 2-3 kurzen Saetzen:
   - Den JSON-Codeblock komplett kopieren.
   - Dann ${appUrl} oeffnen.
   - Dort den kopierten JSON einfuegen und den Test starten.
   - Hinweis: Nach dem Test fuege ich meine Antworten hier wieder ein, damit du sie bewertest.
3. Nach dieser Anleitung nichts mehr schreiben.

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
      "type": "open",
      "solution": ["string", "string"]
    },
    {
      "title": "string",
      "prompt": "string (die Frage)",
      "type": "single",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correct": [1],
      "solution": ["string (kurze Begruendung)"]
    },
    {
      "title": "string",
      "prompt": "string (die Frage)",
      "type": "multiple",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correct": [0, 2],
      "solution": ["string (kurze Begruendung)"]
    }
  ],
  "settings": {
    "readSeconds": 45,
    "writeSeconds": 180,
    "solutionSeconds": ${SOLUTION_SECONDS_DEFAULT},
    "maxSolutionRequestsPerQuestion": 1,
    "allowSolution": true,
    "hideQuestionAfterRead": true
  }
}

Regeln fuer das JSON:
- "questions" muss ein nicht-leeres Array sein (typisch 3-5 Fragen, je nach Thema).
- Jede Frage braucht "prompt".
- "type" ist "open" (Freitext), "single" (genau eine richtige Option) oder "multiple" (eine oder mehrere richtige Optionen). Fehlt "type", gilt "open".
- Bei "single"/"multiple": "choices" ist ein Array mit 3-5 kurzen Optionen. "correct" ist ein Array mit den 0-basierten Indizes der richtigen Optionen (z.B. [1] oder [0, 2]).
- "open"-Fragen haben KEINE "choices" und KEIN "correct".
- Du darfst offene und Choice-Fragen im selben Test mischen — waehle den Typ passend zum Lernziel.
- "solution" ist immer string[]; jeder Eintrag ist ein Absatz (kurze Begruendung/Musterloesung). Keine \\n in Strings.
- "writeSeconds" muss groesser als 0 sein.
- "readSeconds" darf 0 oder groesser sein.
- "solutionSeconds": Standard ${SOLUTION_SECONDS_DEFAULT}, erlaubt ${SOLUTION_SECONDS_MIN}-${SOLUTION_SECONDS_MAX} (wie lange die Loesung angezeigt wird).
- Waehle "mode": "per-question" oder "shared-task" und optional "task" selbst — passend zum Thema.

Beginne jetzt mit deiner ersten Nachricht: "Was willst du ueben?"`;
}

export function buildChatGptUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
