# Story-to-Product Multi-Agent Framework

Dieses Framework startet Softwareprojekte aus einer oder mehreren Story-Dateien. Es trennt
Refinement, fachliche Entscheidungen, Architektur, Implementierung, Qualität und Dokumentation,
damit Agenten parallel arbeiten können, ohne Annahmen als Anforderungen auszugeben.

## Grundprinzipien

1. Anforderungen werden vollständig gelesen, bevor implementiert wird.
2. Fehlende fachliche Entscheidungen werden als Fragen sichtbar gemacht, nicht erfunden.
3. Reversible technische Defaults sind erlaubt, müssen aber dokumentiert werden.
4. Ein koordinierender Agent besitzt Backlog, Reihenfolge, Dateigrenzen und Integrationsgates.
5. Fachagenten arbeiten nur in zugewiesenen Pfaden und melden Vertragsänderungen vorab.
6. Tests und Dokumentation entstehen mit dem Feature, nicht erst am Projektende.
7. Fertig bedeutet nachgewiesen: Akzeptanzkriterien, Qualitätsgates und Handoff sind erfüllt.

## Eingabe

Minimal erforderlich:

- eine Story-/Anforderungsdatei,
- gewünschte Plattform beziehungsweise Laufzeit,
- Arbeitsverzeichnis.

Falls angegeben, zusätzlich berücksichtigen:

- Zielgruppen und Nutzungskontext,
- verbindliche Technologie,
- Datenschutz-/Rechtsanforderungen,
- externe Dienste und Zugänge,
- Releaseziel und Prioritäten,
- Designreferenzen oder bestehende Assets.

## Ablauf

### Phase 0 – Workspace sichern

Der Koordinator:

1. liest alle `AGENTS.md` und projektspezifischen Anweisungen,
2. inventarisiert Dateien, Versionierung, Package Manager und Arbeitsbaum,
3. identifiziert bestehende Nutzeränderungen,
4. führt ausschließlich lesende Checks aus,
5. legt noch keine Architektur oder Dateien an.

**Gate:** Anweisungen und vorhandener Zustand sind verstanden; fremde Änderungen werden nicht
überschrieben.

### Phase 1 – Anforderungen ingestieren

Der Refinement-Agent:

1. liest jede Eingabedatei vollständig in korrekter Zeichenkodierung,
2. extrahiert Epics, Stories, Constraints und Qualitätsattribute,
3. normalisiert Form, ohne Bedeutung zu verändern,
4. erkennt Widersprüche, Duplikate und implizite Abhängigkeiten,
5. trennt Produktwunsch von Lösungsvorschlag.

Ergebnis ist ein [Intake Report](templates/INTAKE_REPORT.md), noch kein implementiertes Produkt.

### Phase 2 – Fragen- und Entscheidungs-Gate

Unklarheiten werden klassifiziert:

- **Blockierend:** Unterschiedliche Antworten ändern Datenmodell, Sicherheitsniveau,
  Außenwirkung, Lizenzlage, Kernsemantik oder irreversiblen Projektaufbau.
- **Nicht blockierend:** Reversible Implementierungswahl innerhalb bestätigter Anforderungen.
- **Später:** Benötigt externe Zugänge oder gehört nicht zum bestätigten Releaseumfang.

Der Koordinator stellt wenige gebündelte, konkrete Fragen mit sichtbaren Konsequenzen. Keine
Implementierung beginnt, solange ein echter Blocker offen ist.

### Phase 3 – Backlog und Verträge

Nach Antworten:

1. Epics und Stories erhalten IDs, Priorität, Status, Akzeptanzkriterien und Abhängigkeiten.
2. Produktweite Invarianten werden festgeschrieben.
3. Definition of Ready und Definition of Done werden instanziiert.
4. Architekturgrenzen und fachliche Schnittstellen werden skizziert.
5. Bedeutende Entscheidungen erhalten ADRs.
6. Der Koordinator weist Rollen und exklusive Dateigrenzen zu.

**Gate:** Der erste vertikale Slice ist `Ready`; parallele Agenten können ohne konkurrierende
Dateiänderungen arbeiten.

### Phase 4 – Vertikaler Slice

Zuerst wird der kleinste vollständige Nutzerpfad umgesetzt, nicht jede Schicht separat. Beispiel:

```text
gültige Beispieldaten → Domänenlogik → ein Screen → Persistenz/Adapter → Tests → Dokumentation
```

Der Slice beweist Architektur, Toolchain und Qualitätsgates. Erst danach wird in weitere
Backlogpakete parallelisiert.

### Phase 5 – Parallele Umsetzung

Empfohlene Workstreams:

| Workstream    | Besitz                                       | Liefert                             |
| ------------- | -------------------------------------------- | ----------------------------------- |
| Frontend      | Screens, Komponenten, Design Tokens          | zugängliche Nutzerpfade             |
| Domain/Data   | Modelle, Regeln, Katalog, Persistenzverträge | deterministische Fachlogik          |
| Quality       | Tests, Fixtures, Testhelfer, CI-Prüfung      | unabhängige Verifikation            |
| Documentation | Backlog, ADR, README, Betrieb, Framework     | nachvollziehbare Entscheidungen     |
| Coordination  | keine Fachdateien ohne Not                   | Integration, Konfliktlösung, Status |

Bei weniger verfügbaren Agenten werden Quality und Documentation kombiniert. Der Koordinator
bleibt frei genug, um Verträge und Blocker zu bearbeiten.

### Phase 6 – Integration

Für jedes Paket:

1. Agent liefert ein [Handoff](templates/HANDOFF.md).
2. Koordinator prüft geänderte Pfade und Vertragsabweichungen.
3. Relevante Tests laufen zuerst, danach das Gesamtgate.
4. Fehler werden dem besitzenden Agenten mit reproduzierbarem Befund zurückgegeben.
5. Backlogstatus wird erst nach erfolgreicher Abnahme aktualisiert.

### Phase 7 – Release Readiness

Der Koordinator gleicht ab:

- alle P0-Akzeptanzkriterien,
- bekannte Risiken und Restarbeiten,
- Build-/Test-/Daten-/Accessibility-/Security-Gates,
- Datenschutz- und Lizenzinventar,
- Offline-/Fehlerpfade,
- Betriebs- und Handoff-Dokumentation.

Externe Aktionen wie Repository-Erstellung, Deployment, Store-Upload oder Nachrichtenversand
brauchen eine eigene Autorisierung.

## Dateibesitz und Konfliktvermeidung

Vor dem Start erhält jeder Agent eine explizite Allowlist. Beispiel:

```text
Frontend: src/app/**, src/components/**, src/theme/**
Domain: src/domain/**, src/data/**, scripts/**
Quality: tests/**, e2e/**, test-config.*
Documentation: BACKLOG.md, README.md, docs/**, framework/**
Coordinator: Statuspflege und Integrationsentscheidungen
```

Regeln:

- Keine Datei außerhalb der Allowlist ändern.
- Gemeinsame Konfiguration hat genau einen Besitzer.
- Ein gewünschter Vertragswechsel wird zuerst an den Koordinator gemeldet.
- Bestehende fremde Änderungen werden nicht zurückgesetzt oder formatiert.
- Agenten committen nur auf ausdrücklichen Auftrag.

## Kommunikationsprotokoll

Ein Statusupdate enthält:

```text
Ziel:
Aktueller Stand:
Geänderte/beanspruchte Pfade:
Entscheidung oder Blocker:
Nächster überprüfbarer Schritt:
```

Ein Blocker ist konkret und nennt:

- fehlende Information oder Berechtigung,
- bereits geprüfte sichere Alternativen,
- Auswirkung jeder möglichen Entscheidung,
- kleinste nötige Antwort.

## Stop-Regeln

Ein Agent stoppt und eskaliert, wenn:

- eine fachliche Antwort Datenmodell oder Kernverhalten wesentlich ändert,
- rechtliche, Datenschutz-, Sicherheits- oder Gesundheitsbehauptungen ungeklärt sind,
- externe Mutation oder Zugangsdaten benötigt werden,
- ein fremder Agent dieselben Dateien verändert,
- bestehende Nutzeränderungen überschrieben werden müssten,
- Tests eine unerklärte Regression außerhalb des eigenen Bereichs zeigen.

Kein Stop ist nötig für eine reversible, übliche technische Wahl, sofern sie Anforderungen nicht
verändert und als Default dokumentiert wird.

## Qualitätsgates

Projektabhängig, mindestens:

- Daten-/Schema-Validierung
- Typecheck
- Lint/Formatprüfung
- Unit- und Integrationstests
- Build oder Start-Smoke
- Accessibility-Stichprobe
- Datenschutz-/Lizenzprüfung bei externen Ressourcen
- Dokumentations- und Backlogabgleich

## Ordnerinhalt

- `roles/` – wiederverwendbare Rollenprompts
- `templates/` – Intake, Epic, Story, ADR, DoR, DoD und Handoff
- `PROJECT_KICKOFF.md` – kopierbarer Startprompt für ein neues Projekt

## Anpassung an ein neues Projekt

1. Kopiere `framework/` in das neue Workspace-Root.
2. Lege Anforderungen unverändert unter `requirements/` ab.
3. Fülle `PROJECT_KICKOFF.md` aus.
4. Starte ausschließlich Koordination und Refinement.
5. Beantworte das Entscheidungs-Gate.
6. Lass Backlog, ADRs, DoR/DoD und Pfadbesitz erzeugen.
7. Starte Fachagenten mit den Rollenprompts.
8. Integriere zuerst einen vertikalen Slice.
9. Arbeite danach priorisiert bis zum Release-Gate.

Das Framework ersetzt keine fachliche Freigabe. Es sorgt dafür, dass fehlende Informationen früh
sichtbar werden und bestätigte Anforderungen reproduzierbar in Implementierung übergehen.
