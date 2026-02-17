import { useState, useRef, useEffect } from "react";

const SKILL_MAP = {
  inhouse: [
    { name: "Static Ads (Feed/Story)", avgHours: 4, complexity: "niedrig", keywords: ["static ad", "static ads", "feed ad", "story ad", "bild ad", "image ad", "anzeige", "anzeigen", "statics"] },
    { name: "Carousel Ads", avgHours: 5, complexity: "niedrig", keywords: ["carousel", "karussell", "swipe", "mehrere slides"] },
    { name: "2D Motion Design", avgHours: 8, complexity: "mittel", keywords: ["2d motion", "2d animation", "motion design", "motion graphic", "animiert", "animation 2d", "parallax"] },
    { name: "UGC-Konzepte & Briefings", avgHours: 3, complexity: "niedrig", keywords: ["ugc", "creator", "briefing", "influencer brief", "content creator"] },
    { name: "Reels / Short-Form Editing", avgHours: 6, complexity: "mittel", keywords: ["reel", "reels", "short form", "tiktok", "kurzvideos", "kurze videos", "video edit", "schnitt", "videos"] },
    { name: "Ad-Varianten / Iterations", avgHours: 2, complexity: "niedrig", keywords: ["varianten", "iteration", "überarbeit", "anpass", "andere farb", "neuer claim", "neue headline", "abwandl", "nochmal"] },
    { name: "Moodboards & Konzeptdesign", avgHours: 4, complexity: "niedrig", keywords: ["moodboard", "konzept", "look and feel", "look & feel", "visuelles konzept", "styleguide"] },
    { name: "Banner & Display Ads", avgHours: 3, complexity: "niedrig", keywords: ["banner", "display ad", "google ads banner", "display"] },
    { name: "Social Media Templates", avgHours: 5, complexity: "niedrig", keywords: ["template", "vorlage", "social media template", "post template", "insta template"] },
    { name: "Farbkorrekturen / Überarbeitungen", avgHours: 2, complexity: "niedrig", keywords: ["farbkorrektur", "farben ändern", "andere farben", "überarbeit", "korrektur", "anpassung", "farben"] },
  ],
  external: [
    { name: "3D-Animation / Cinema 4D", partner: "Studio X", priceRange: "5.000–8.000 €", timeline: "2–3 Wochen", keywords: ["3d", "cinema 4d", "c4d", "3d animation", "apple style", "schwebend", "licht-reflex", "partikel", "produktanimation 3d"] },
    { name: "Illustration (von Grund auf)", partner: "Illustrator Y", priceRange: "1.500–3.000 €", timeline: "1–2 Wochen", keywords: ["illustration", "zeichnung", "illustrier", "custom illustration", "character design", "handgezeichnet"] },
    { name: "Live-Action Video / Produktion", partner: "Produktionsfirma Z", priceRange: "8.000–15.000 €", timeline: "3–4 Wochen", keywords: ["videodreh", "filmdreh", "videoproduktion", "schauspieler", "live action", "am set", "filmset", "produktionsteam", "kamerateam", "drehbuch", "drehen"] },
    { name: "Fotoshooting", partner: "Fotostudio A", priceRange: "2.000–5.000 €", timeline: "1–2 Wochen", keywords: ["fotoshooting", "shooting", "produktfoto", "fotograf", "studio foto", "bildmaterial neu"] },
    { name: "Voice-Over / Audio", partner: "Audio Studio B", priceRange: "500–1.500 €", timeline: "3–5 Tage", keywords: ["voice over", "voiceover", "sprecher", "audio", "vertonung", "musik", "sounddesign", "jingle"] },
  ],
};

function analyzeRequest(input) {
  const lower = input.toLowerCase();
  const inhouseMatches = [];
  const externalMatches = [];

  SKILL_MAP.inhouse.forEach(skill => {
    if (skill.keywords.some(kw => lower.includes(kw))) inhouseMatches.push(skill);
  });
  SKILL_MAP.external.forEach(skill => {
    if (skill.keywords.some(kw => lower.includes(kw))) externalMatches.push(skill);
  });

  const quantityMatch = lower.match(/(\d+)\s*(static|carousel|banner|ad|ads|video|reel|reels|stück|statics|stil)/);
  const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
  const urgentKeywords = ["heute", "morgen", "eod", "asap", "sofort", "bis montag", "nächste woche", "diese woche", "dringend", "schnell", "kurzfristig", "morgen früh"];
  const isUrgent = urgentKeywords.some(kw => lower.includes(kw));
  const isLargeScope = quantity > 8 || (lower.includes("video") && quantity > 2);

  let totalHours = 0;
  inhouseMatches.forEach(s => { totalHours += s.avgHours * Math.max(1, Math.ceil(quantity / 3)); });

  let machbarkeit, confidence, zusammenfassung, aufwand, timeline, risiken = [], alternativen = [], antwort;

  if (externalMatches.length > 0 && inhouseMatches.length === 0) {
    machbarkeit = "extern";
    confidence = "hoch";
    const ext = externalMatches[0];
    zusammenfassung = `Die Anfrage erfordert ${ext.name} – das liegt außerhalb unseres Inhouse-Setups. Wir können das über unseren Partner ${ext.partner} abdecken.`;
    aufwand = "Nicht inhouse";
    timeline = ext.timeline;
    risiken = [`${ext.name} ist nicht inhouse umsetzbar`, isUrgent ? "Die angefragte Timeline ist für externe Produktion nicht realistisch" : "Externe Abstimmung kann Timeline verlängern"];
    alternativen = [
      { label: "Option A: Inhouse-Alternative", beschreibung: `Statt ${ext.name} setzen wir eine hochwertige 2D-Motion-Animation mit Parallax-Effekten und Licht-Overlays um. Visuell stark, aber innerhalb unseres Skillsets.`, aufwand: "~8-12h", timeline: "5-7 Werktage" },
      { label: "Option B: Externer Partner", beschreibung: `Volle Umsetzung über ${ext.partner}. Professionelles Ergebnis, aber höheres Budget und längere Timeline.`, aufwand: ext.priceRange, timeline: ext.timeline },
    ];
    antwort = `Hi [Name],\n\ndie Idee verstehe ich total – das wäre visuell ein starkes Statement. Ich möchte aber transparent sein: ${ext.name} erfordert spezialisierte Produktion, die außerhalb unseres Inhouse-Setups liegt.${isUrgent ? " Die angefragte Timeline ist dafür leider auch zu knapp." : ""}\n\nWas ich dir anbieten kann: Zum einen eine hochwertige 2D-Motion-Variante mit Parallax-Effekten und Licht-Overlays – das kommt dem gewünschten Look nahe und ist bei uns in 5-7 Werktagen umsetzbar. Zum anderen können wir die volle ${ext.name} über unseren Partner ${ext.partner} realisieren – dann reden wir über ${ext.priceRange} und ${ext.timeline}.\n\nSoll ich für die Inhouse-Variante ein kurzes Moodboard vorbereiten, damit ihr euch das besser vorstellen könnt?`;
  } else if (externalMatches.length > 0 && inhouseMatches.length > 0) {
    machbarkeit = "teilweise_inhouse";
    confidence = "mittel";
    const ext = externalMatches[0];
    const inh = inhouseMatches.map(s => s.name).join(", ");
    zusammenfassung = `Teile der Anfrage können wir inhouse abdecken (${inh}), aber ${ext.name} müsste extern umgesetzt werden.`;
    aufwand = `~${totalHours}h (Inhouse-Anteil)`;
    timeline = isUrgent ? "Inhouse-Teil machbar, externer Teil braucht mehr Zeit" : "1-2 Wochen gesamt";
    risiken = ["Gemischte Produktion erfordert gute Koordination", `${ext.name} ist extern abhängig`, isUrgent ? "Zeitdruck erhöht Fehlerrisiko" : "Timeline hängt vom externen Partner ab"];
    alternativen = [
      { label: "Option A: Alles inhouse (reduzierter Scope)", beschreibung: `Wir konzentrieren uns auf ${inh} und ersetzen den externen Teil durch eine Inhouse-Lösung mit leicht angepasstem Ergebnis.`, aufwand: `~${totalHours + 8}h`, timeline: isUrgent ? "Eng, aber machbar" : "5-7 Werktage" },
      { label: "Option B: Hybrid mit externem Partner", beschreibung: `Inhouse-Teil starten wir sofort, ${ext.name} läuft parallel über ${ext.partner}.`, aufwand: `~${totalHours}h + ${ext.priceRange}`, timeline: ext.timeline },
    ];
    antwort = `Hi [Name],\n\ngute Anfrage – lass mich kurz einordnen, was wir wie umsetzen können. Den Teil mit ${inh} bekommen wir problemlos inhouse hin. Für ${ext.name} bräuchten wir allerdings unseren externen Partner ${ext.partner}, da das außerhalb unseres Inhouse-Setups liegt.\n\nMein Vorschlag: Wir starten den Inhouse-Teil sofort und klären parallel, ob ihr den externen Part dazunehmen wollt (${ext.priceRange}, ${ext.timeline}). Alternativ kann ich eine reine Inhouse-Lösung konzipieren, die das externe Element durch eine 2D-Variante ersetzt.\n\nWas klingt für euch sinnvoller? Dann lege ich direkt los.`;
  } else if (inhouseMatches.length > 0) {
    const isOverloaded = isLargeScope && isUrgent;
    machbarkeit = "inhouse";
    confidence = isOverloaded ? "mittel" : "hoch";
    const inh = inhouseMatches.map(s => s.name).join(", ");
    if (isOverloaded) {
      zusammenfassung = `Die Anfrage (${inh}) ist grundsätzlich inhouse machbar, aber der Umfang von ${quantity} Stück in Kombination mit der engen Timeline ist kritisch. Hier muss der Scope reduziert oder die Deadline verschoben werden.`;
      aufwand = `~${totalHours}h`;
      timeline = "In der angefragten Zeit nicht vollständig machbar";
      risiken = [`${quantity} Deliverables in kurzer Zeit gefährden die Qualität`, "Team-Kapazität könnte nicht ausreichen", "Andere laufende Projekte werden blockiert"];
      alternativen = [
        { label: "Option A: Reduzierter Scope, volle Qualität", beschreibung: `Wir liefern ${Math.ceil(quantity / 2)} der ${quantity} Deliverables zum Wunschtermin und die restlichen ${quantity - Math.ceil(quantity / 2)} 2-3 Tage später nach.`, aufwand: `~${Math.ceil(totalHours / 2)}h (erste Tranche)`, timeline: "Tranche 1 zum Wunschtermin, Tranche 2 nachgelagert" },
        { label: "Option B: Voller Scope, mehr Zeit", beschreibung: `Alle ${quantity} Deliverables, aber mit 2-3 zusätzlichen Werktagen. So bleibt die Qualität, die ihr gewohnt seid.`, aufwand: `~${totalHours}h`, timeline: "+2-3 Werktage" },
      ];
      antwort = `Hi [Name],\n\ndie Idee ist super und grundsätzlich voll in unserem Wheelhouse. Ich möchte aber ehrlich sein: ${quantity} Deliverables bis zum Wunschtermin können wir in der Qualität, die ihr von uns gewohnt seid, nicht leisten.\n\nWas ich dir anbieten kann: Wir liefern ${Math.ceil(quantity / 2)} Stück zum Wunschtermin – die wichtigsten Placements zuerst. Die restlichen ${quantity - Math.ceil(quantity / 2)} schieben wir 2-3 Tage nach, sodass ihr stufenweise nachfeuern könnt. Strategisch ist das sogar sinnvoll, weil ihr euer Creative-Set nicht auf einmal verbraucht.\n\nAlternativ: Alle ${quantity} auf einmal, aber mit 2-3 Tagen mehr Timeline. Was passt euch besser? Dann bräuchte ich heute noch die Details.`;
    } else {
      zusammenfassung = `Die Anfrage ist vollständig inhouse machbar (${inh}). ${isUrgent ? "Timeline ist eng, aber realistisch." : "Timeline und Umfang sind realistisch."}`;
      aufwand = `~${totalHours}h`;
      timeline = isUrgent ? "Eng, aber machbar" : "3-5 Werktage";
      risiken = isUrgent ? ["Enge Timeline lässt wenig Raum für Korrekturschleifen", "Briefing muss heute noch kommen"] : ["Standardrisiko: Korrekturrunden können Timeline verschieben"];
      alternativen = [{ label: "Empfohlener Weg", beschreibung: `Direkte Umsetzung durch unser Team. ${isUrgent ? "Briefing heute, Produktion morgen, Lieferung zum Wunschtermin." : "Briefing abstimmen, dann in Produktion."}`, aufwand: `~${totalHours}h`, timeline: isUrgent ? "Wunschtermin haltbar" : "3-5 Werktage" }];
      const needsSpecs = inhouseMatches.some(s => s.keywords.some(k => lower.includes(k) && (k.includes("farb") || k.includes("claim") || k.includes("überarbeit"))));
      antwort = `Hi [Name],\n\nklar, das bekommen wir hin! ${isUrgent ? "Timeline ist sportlich, aber machbar." : "Vom Umfang und der Timeline her passt das gut."}\n\nDamit wir direkt loslegen können, bräuchte ich von dir: ${needsSpecs ? "die neuen Vorgaben so konkret wie möglich – idealerweise mit Hex-Codes oder Referenzbeispielen, damit wir keine unnötige Korrekturschleife riskieren." : "das finale Briefing mit allen Assets und Texten, die rein sollen."}\n\n${isUrgent ? "Wenn ich die Infos bis heute Nachmittag habe, liefern wir zum Wunschtermin." : "Sobald das Briefing steht, gehen wir in Produktion – ich melde mich mit einem Zeitplan."}`;
    }
  } else {
    machbarkeit = "nicht_machbar";
    confidence = "niedrig";
    zusammenfassung = "Die Anfrage konnte keinem bekannten Skill oder Partner zugeordnet werden. Hier braucht es ein klärendes Gespräch, um den Scope zu verstehen.";
    aufwand = "Nicht einschätzbar";
    timeline = "Nicht einschätzbar";
    risiken = ["Anfrage ist zu vage für eine Machbarkeitsbewertung", "Möglicherweise Erwartungen, die weder inhouse noch extern abbildbar sind"];
    alternativen = [{ label: "Empfehlung: Klärendes Gespräch", beschreibung: "Einen kurzen Call ansetzen, um den genauen Scope, das gewünschte Ergebnis und die Timeline zu klären. Danach kann eine fundierte Einschätzung erfolgen.", aufwand: "15-30 Min Call", timeline: "Heute/Morgen" }];
    antwort = `Hi [Name],\n\ndanke für die Idee – klingt spannend! Damit ich dir eine realistische Einschätzung geben kann, was möglich ist und in welchem Zeitrahmen, würde ich gerne kurz telefonieren. So kann ich den Scope sauber einordnen und dir direkt konkrete Optionen vorschlagen.\n\nHast du heute oder morgen 15 Minuten Zeit für einen kurzen Call?`;
  }

  return { machbarkeit, confidence, zusammenfassung, aufwand_inhouse: aufwand, timeline_einschaetzung: timeline, risiken, alternativen, antwort_entwurf: antwort, matched_inhouse: inhouseMatches.map(s => s.name), matched_external: externalMatches.map(s => s.name), detected_quantity: quantity > 1 ? quantity : null, is_urgent: isUrgent };
}

const EXAMPLE_REQUESTS = [
  "Spontane Idee gehabt! Wir haben Budget für eine Flash-Sale-Aktion freigegeben. Können wir bis Montag morgen 12 Static Ads und 3 kurze Videos bekommen?",
  "Wir wollen unser Produkt in einer 3D-Animation wie bei Apple – schwebend, mit Licht-Reflexionen und Partikel-Effekten. Könnt ihr das bis nächste Woche?",
  "Die 8 Stil Ads von letzter Woche müssen nochmal überarbeitet werden. Unser CMO will andere Farben und einen neuen Claim. Brauchen wir bis morgen früh.",
  "Könnt ihr ein komplettes Produktvideo mit Schauspielern drehen? Budget haben wir, aber es muss schnell gehen.",
  "Wir hätten gerne ein animiertes Erklärvideo mit Voiceover. So 30-60 Sekunden für unsere neue Produktlinie.",
  "Können wir für unseren Relaunch so eine Art interaktives Ding machen? Vielleicht ein AR-Filter oder sowas?",
  "Die 4 Carousel Ads von letzter Woche – könnt ihr die nochmal in anderen Farben machen? Bis morgen?",
  "Wir brauchen bis Freitag 6 neue Static Ads für unsere Meta-Kampagne. Gleiches Branding, nur neue Headlines.",
];

function StatusBadge({ status }) {
  const config = {
    inhouse: { label: "✅ Inhouse machbar", bg: "#1a2e1a", color: "#6fcf6f", border: "#2d4a2d" },
    teilweise_inhouse: { label: "⚡ Teilweise inhouse", bg: "#2e2a1a", color: "#cfb86f", border: "#4a432d" },
    extern: { label: "🔄 Externer Partner nötig", bg: "#2e1a1a", color: "#cf6f6f", border: "#4a2d2d" },
    nicht_machbar: { label: "❓ Klärung nötig", bg: "#2e1a2e", color: "#b06fb0", border: "#4a2d4a" },
  };
  const c = config[status] || config.nicht_machbar;
  return <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{c.label}</span>;
}

function ConfidenceDots({ level }) {
  const n = { hoch: 3, mittel: 2, niedrig: 1 }[level] || 1;
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= n ? "#B8A48E" : "rgba(184,164,142,0.2)", transition: "background 0.3s" }} />)}
      <span style={{ fontSize: "11px", color: "#8A7E72", marginLeft: "6px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>Confidence: {level}</span>
    </div>
  );
}

function DetectedTags({ result }) {
  const tags = [];
  result.matched_inhouse.forEach(s => tags.push({ label: s, type: "inhouse" }));
  result.matched_external.forEach(s => tags.push({ label: s, type: "external" }));
  if (result.detected_quantity) tags.push({ label: `Menge: ${result.detected_quantity}`, type: "meta" });
  if (result.is_urgent) tags.push({ label: "⏰ Zeitdruck", type: "urgent" });
  if (!tags.length) return null;
  const colors = { inhouse: { bg: "rgba(111,207,111,0.08)", color: "#6fcf6f", border: "rgba(111,207,111,0.15)" }, external: { bg: "rgba(207,111,111,0.08)", color: "#cf6f6f", border: "rgba(207,111,111,0.15)" }, meta: { bg: "rgba(184,164,142,0.08)", color: "#B8A48E", border: "rgba(184,164,142,0.15)" }, urgent: { bg: "rgba(207,180,111,0.08)", color: "#cfb86f", border: "rgba(207,180,111,0.15)" } };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
      {tags.map((t, i) => { const c = colors[t.type]; return <span key={i} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.5px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{t.label}</span>; })}
    </div>
  );
}

export default function MachbarkeitsAgent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => { if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, [result]);

  const analyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => { setResult(analyzeRequest(input)); setIsAnalyzing(false); }, 700);
  };

  const copyDraft = () => {
    if (result?.antwort_entwurf) { navigator.clipboard.writeText(result.antwort_entwurf); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A09", color: "#F5F0EB", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <div style={{ padding: "28px 40px", borderBottom: "1px solid rgba(245,240,235,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#8A7E72", marginBottom: "4px", fontFamily: "monospace" }}>Interner Agent · Prototyp</div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.5px", margin: 0 }}>Machbarkeits-Check</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#8A7E72", fontFamily: "monospace" }}>
          <span style={{ background: "rgba(111,207,111,0.06)", border: "1px solid rgba(111,207,111,0.1)", borderRadius: "6px", padding: "4px 10px" }}>{SKILL_MAP.inhouse.length} Inhouse</span>
          <span style={{ background: "rgba(207,111,111,0.06)", border: "1px solid rgba(207,111,111,0.1)", borderRadius: "6px", padding: "4px 10px" }}>{SKILL_MAP.external.length} Extern</span>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "36px 24px 80px" }}>
        <label style={{ display: "block", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", marginBottom: "10px", fontFamily: "monospace" }}>Slack-Nachricht des Kunden</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze(); }}
          placeholder="Kopiere hier die Nachricht des Kunden rein …" rows={4}
          style={{ width: "100%", background: "#111110", border: "1px solid rgba(245,240,235,0.08)", borderRadius: "12px", padding: "18px", color: "#F5F0EB", fontSize: "15px", lineHeight: "1.7", fontFamily: "inherit", resize: "vertical", outline: "none", transition: "border-color 0.2s" }}
          onFocus={(e) => e.target.style.borderColor = "rgba(184,164,142,0.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(245,240,235,0.08)"}
        />

        <div style={{ margin: "12px 0 20px" }}>
          <div style={{ fontSize: "10px", color: "#8A7E72", marginBottom: "8px", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>Beispiel-Anfragen</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {EXAMPLE_REQUESTS.map((ex, i) => (
              <button key={i} onClick={() => { setInput(ex); setResult(null); }}
                style={{ background: "rgba(184,164,142,0.05)", border: "1px solid rgba(184,164,142,0.1)", borderRadius: "100px", padding: "6px 14px", color: "#B8A48E", fontSize: "11px", cursor: "pointer", transition: "all 0.2s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}
                onMouseOver={(e) => e.target.style.background = "rgba(184,164,142,0.12)"} onMouseOut={(e) => e.target.style.background = "rgba(184,164,142,0.05)"}
              >{ex.substring(0, 55)}…</button>
            ))}
          </div>
        </div>

        <button onClick={analyze} disabled={isAnalyzing || !input.trim()}
          style={{ width: "100%", padding: "14px", background: isAnalyzing ? "#1A1714" : "#B8A48E", color: isAnalyzing ? "#8A7E72" : "#0A0A09", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: isAnalyzing || !input.trim() ? "not-allowed" : "pointer", transition: "all 0.3s", opacity: !input.trim() ? 0.4 : 1 }}>
          {isAnalyzing ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span style={{ width: 14, height: 14, border: "2px solid rgba(138,126,114,0.3)", borderTopColor: "#8A7E72", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analysiere …</span> : "🔍  Machbarkeit prüfen"}
        </button>

        {result && (
          <div ref={resultRef} style={{ marginTop: "36px", animation: "fadeIn 0.5s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(245,240,235,0.06)" }} />
              <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", fontFamily: "monospace" }}>Bewertung</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(245,240,235,0.06)" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <StatusBadge status={result.machbarkeit} />
              <ConfidenceDots level={result.confidence} />
            </div>
            <DetectedTags result={result} />

            <div style={{ background: "#111110", border: "1px solid rgba(245,240,235,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "12px", fontSize: "15px", lineHeight: "1.7", color: "#E0D9D0" }}>{result.zusammenfassung}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {[["Aufwand", result.aufwand_inhouse], ["Timeline", result.timeline_einschaetzung]].map(([label, val], i) => (
                <div key={i} style={{ background: "#111110", border: "1px solid rgba(245,240,235,0.06)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", fontFamily: "monospace", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "17px", fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>

            {result.risiken.length > 0 && (
              <div style={{ background: "#111110", border: "1px solid rgba(245,240,235,0.06)", borderRadius: "12px", padding: "18px", marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", fontFamily: "monospace", marginBottom: "10px" }}>⚠️ Risiken</div>
                {result.risiken.map((r, i) => <div key={i} style={{ fontSize: "13px", color: "#B8A48E", padding: "5px 0", borderBottom: i < result.risiken.length - 1 ? "1px solid rgba(245,240,235,0.03)" : "none" }}>{r}</div>)}
              </div>
            )}

            {result.alternativen.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", fontFamily: "monospace", marginBottom: "10px", paddingLeft: "4px" }}>Alternativen</div>
                {result.alternativen.map((alt, i) => (
                  <div key={i} style={{ background: "#111110", border: "1px solid rgba(184,164,142,0.1)", borderRadius: "12px", padding: "18px", marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#B8A48E", marginBottom: "6px" }}>{alt.label}</div>
                    <div style={{ fontSize: "13px", lineHeight: "1.6", color: "#E0D9D0", marginBottom: "10px" }}>{alt.beschreibung}</div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#8A7E72", fontFamily: "monospace" }}>
                      <span>Aufwand: {alt.aufwand}</span><span>Timeline: {alt.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.antwort_entwurf && (
              <div style={{ background: "#0F1210", border: "1px solid rgba(184,164,142,0.15)", borderRadius: "12px", padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#B8A48E", fontFamily: "monospace" }}>📝 Antwort-Entwurf für Slack</div>
                  <button onClick={copyDraft} style={{ background: copied ? "rgba(111,207,111,0.1)" : "rgba(184,164,142,0.1)", border: `1px solid ${copied ? "rgba(111,207,111,0.2)" : "rgba(184,164,142,0.2)"}`, borderRadius: "8px", padding: "5px 12px", color: copied ? "#6fcf6f" : "#B8A48E", fontSize: "11px", cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s" }}>
                    {copied ? "✓ Kopiert" : "Kopieren"}
                  </button>
                </div>
                <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#E0D9D0", whiteSpace: "pre-wrap" }}>{result.antwort_entwurf}</div>
              </div>
            )}
          </div>
        )}

        {!result && !isAnalyzing && (
          <div style={{ marginTop: "50px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(245,240,235,0.06)" }} />
              <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A7E72", fontFamily: "monospace" }}>Wissensbasis</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(245,240,235,0.06)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#111110", border: "1px solid rgba(245,240,235,0.06)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#6fcf6f", fontFamily: "monospace", marginBottom: "14px" }}>✅ Inhouse Skills</div>
                {SKILL_MAP.inhouse.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < SKILL_MAP.inhouse.length - 1 ? "1px solid rgba(245,240,235,0.03)" : "none", fontSize: "12px" }}>
                    <span style={{ color: "#E0D9D0" }}>{s.name}</span>
                    <span style={{ color: "#8A7E72", fontFamily: "monospace", fontSize: "11px" }}>~{s.avgHours}h</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#111110", border: "1px solid rgba(245,240,235,0.06)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#cf6f6f", fontFamily: "monospace", marginBottom: "14px" }}>🔄 Externe Partner</div>
                {SKILL_MAP.external.map((s, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < SKILL_MAP.external.length - 1 ? "1px solid rgba(245,240,235,0.03)" : "none" }}>
                    <div style={{ fontSize: "12px", color: "#E0D9D0", marginBottom: "3px" }}>{s.name}</div>
                    <div style={{ fontSize: "10px", color: "#8A7E72", fontFamily: "monospace" }}>{s.partner} · {s.priceRange} · {s.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        textarea::placeholder { color: rgba(138,126,114,0.5); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
