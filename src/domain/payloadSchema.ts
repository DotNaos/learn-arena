export const LEARN_ARENA_APP_URL =
  import.meta.env.VITE_LEARN_ARENA_URL ?? "https://learn-arena.vercel.app";

export const SOLUTION_SECONDS_DEFAULT = 15;
export const SOLUTION_SECONDS_MIN = 5;
export const SOLUTION_SECONDS_MAX = 60;

export function buildPayloadGenerationPrompt(
  appUrl: string = LEARN_ARENA_APP_URL,
): string {
  return `Du hilfst mir, einen Recall-Fragensatz für die Learn Arena App zu erstellen.

Deine ERSTE Nachricht — genau so, nicht länger:
"Was willst du üben?"

Danach — Standard (faul):
- Ich antworte oft mit nur einem kurzen Satz oder Stichworten (z.B. "deep learning, ffNN, CNNs, RNNs").
- Ich kann PDFs oder andere Dateien anhängen, ohne sie zu erwähnen. Lies angehängte Unterlagen still mit und nutze sie als Hauptquelle.
- Stelle KEINE Rückfragen von dir aus. Entscheide selbst: Anzahl Fragen (typisch 3-5), Schwierigkeit, gemeinsame vs. einzelne Aufgabenstellung, Zeiten.
- Warte NICHT auf Bestätigung. Nach meiner Antwort (Text + evtl. Anhänge) erstellst du sofort den Fragensatz.
- Antworte mit EINEM JSON-Codeblock (\`\`\`json ... \`\`\`), danach direkt eine kurze Anleitung (siehe unten). Kein Fließtext vor dem JSON.

Optional — Tunen (nur auf explizite Nachfrage):
- Nur wenn ich aktiv nach Anpassung frage (z.B. "will tunen", "noch anpassen", "mehr Kontrolle", "wie viele Fragen", "Schwierigkeit ändern").
- Dann stelle kurz, menschlich und ohne Technik-Jargon ein paar Fragen — z.B. wie viele Fragen, wie anspruchsvoll (locker / mittel / prüfungsnah), eine gemeinsame Situation oder jede Frage für sich, wie viel Zeit pro Antwort, wie lange die Lösung sichtbar bleiben soll (5-60 Sekunden).
- Nenne keine JSON-Feldnamen, keine Schema-Begriffe, kein "mode" oder "settings".
- Nach meinen Antworten (oder wenn ich sage "passt so" / "mach einfach") JSON-Codeblock + kurze Anleitung ausgeben.

Ausgabeformat nach dem Fragensatz:
1. Zuerst der JSON-Codeblock (\`\`\`json ... \`\`\`).
2. Direkt darunter, in 2-3 kurzen Saetzen:
   - Den JSON-Codeblock komplett kopieren.
   - Dann ${appUrl} öffnen.
   - Dort den kopierten JSON einfügen und den Test starten.
   - Hinweis: Nach dem Test füge ich meine Antworten hier wieder ein, damit du sie bewertest.
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
      "solution": ["string (kurze Begründung)"]
    },
    {
      "title": "string",
      "prompt": "string (die Frage)",
      "type": "multiple",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correct": [0, 2],
      "solution": ["string (kurze Begründung)"]
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

Regeln für das JSON:
- "questions" muss ein nicht-leeres Array sein (typisch 3-5 Fragen, je nach Thema).
- Jede Frage braucht "prompt".
- "type" ist "open" (Freitext), "single" (genau eine richtige Option) oder "multiple" (eine oder mehrere richtige Optionen). Fehlt "type", gilt "open".
- Bei "single"/"multiple": "choices" ist ein Array mit 3-5 kurzen Optionen. "correct" ist ein Array mit den 0-basierten Indizes der richtigen Optionen (z.B. [1] oder [0, 2]).
- "open"-Fragen haben KEINE "choices" und KEIN "correct".
- Du darfst offene und Choice-Fragen im selben Test mischen — wähle den Typ passend zum Lernziel.
- "solution" ist immer string[]; jeder Eintrag ist ein Absatz (kurze Begründung/Musterlösung). Keine \\n in Strings.
- Deutsche Texte müssen echte Umlaute und ß verwenden: ä, ö, ü, Ä, Ö, Ü, ß. Schreibe nicht ae/oe/ue, Ae/Oe/Ue oder ss als Ersatz, außer ein Fachbegriff ist offiziell so geschrieben.
- Mathematik im JSON ("prompt", "choices", "solution"): als LaTeX (KaTeX) mit DOLLARZEICHEN.
- Nutze inline $...$ NUR für sehr kurze Ausdrücke, die im Satz natürlich lesbar bleiben (z.B. $p$, $O(n)$, $x_i$, $90\\\\%$).
- Längere Formeln, Zuweisungen, Gleichungen, Rekurrenzen, Summen, Brüche, Schleifen-Updates oder Ausdrücke mit Operatoren wie =, +, \\\\leftarrow, \\\\frac, \\\\sum NICHT inline in eine lange Frage setzen.
- Solche Formeln im "prompt" als eigene Zeile mit abgesetztem LaTeX schreiben: $$...$$. Beispiel: "Warum kann die einfache Schleife\\n$$s \\\\leftarrow s + a(i)$$\\nnicht direkt gut vektorisiert werden?"
- Die Frage soll auch ohne Formel-Wirrwarr schnell lesbar bleiben: lieber "Warum gilt das bei dieser Schleife?" + abgesetzte Formel als ein langer Satz mit großer Inline-Formel.
- Kurze Beispielregel: $p$ ist inline okay; $$s \\\\leftarrow s + a(i)$$ gehört abgesetzt auf eine eigene Zeile.
- WICHTIG (nur im JSON): Da es JSON ist, müssen LaTeX-Backslashes im String verdoppelt werden (also \\\\int, \\\\frac, \\\\cdot, \\\\sqrt statt \\int, \\frac, ...). Sonst ist das JSON ungültig.
- Mathematik in deinen normalen CHAT-Antworten (z.B. wenn du später meine Antworten bewertest): nutze \\(...\\) für inline und \\[...\\] für abgesetzte Formeln — NICHT Dollarzeichen. So rendert es im Chat zuverlässig. Backslashes werden hier NICHT verdoppelt (\\sin, \\frac, ...). Dollarzeichen sind ausschließlich fürs JSON.
- "writeSeconds" muss größer als 0 sein.
- "readSeconds" darf 0 oder größer sein.
- "solutionSeconds": Standard ${SOLUTION_SECONDS_DEFAULT}, erlaubt ${SOLUTION_SECONDS_MIN}-${SOLUTION_SECONDS_MAX} (wie lange die Lösung angezeigt wird).
- Wähle "mode": "per-question" oder "shared-task" und optional "task" selbst — passend zum Thema.

Lernplan (mehrere Tests auf einmal):
- Wenn ich mehrere Themen, Aufgabenblätter oder einen ganzen Kurs nennen (z.B. ein Moodle-Kurs mit mehreren Blättern), liefere EINEN Lernplan statt eines einzelnen Tests.
- Ein Lernplan ist dieses Format:
{
  "title": "Kurs- oder Plan-Name",
  "tests": [
    { ...kompletter Test wie oben... },
    { ...kompletter Test wie oben... }
  ]
}
- Jeder Eintrag in "tests" ist ein vollständiger Test mit eigenem "title", "questions" und "settings".
- Bei nur einem Thema gibst du wie gehabt ein einzelnes Test-JSON aus (kein "tests"-Array).

Beginne jetzt mit deiner ersten Nachricht: "Was willst du üben?"`;
}

export function buildChatGptUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
