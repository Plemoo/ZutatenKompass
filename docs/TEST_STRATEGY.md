# Teststrategie

## Ziel

Tests sichern die fachliche Korrektheit der local-first Suche, die Integrität von mindestens
500 zweisprachigen Rezepten und die wichtigsten Android-Nutzerpfade. Die Strategie priorisiert
deterministische Tests nahe an der Domäne und ergänzt sie durch Komponenten-, Integrations- und
wenige End-to-End-Tests.

## Testpyramide

| Ebene              | Schwerpunkt                                                | Ausführung                                    |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------- |
| Datenvalidierung   | Schema, IDs, Übersetzung, Taxonomie, Mindestumfang, Regeln | bei jeder Katalogänderung und in `pnpm check` |
| Unit               | Normalisierung, Resolver, Filter, Ranking, Migrationen     | bei jeder Codeänderung                        |
| Komponenten        | Eingabe, Chips, Facetten, Karten, Detail, Accessibility    | bei UI-Änderungen                             |
| Integration        | Screen-Flows mit Repositories und Navigation               | bei Featureänderungen                         |
| E2E/Smoke          | zentraler Android- und Offlinepfad                         | vor Release Candidate                         |
| Manuell/explorativ | visuelle Qualität, große Schrift, echte Share-Ziele        | vor Release Candidate                         |

## Pflichtmatrizen

### Suche

- kein Include, kein Exclude, keine Facette
- ein Include direkt, per Alias und per generischem Elternbegriff
- mehrere Includes mit AND
- Rezept mit zusätzlichen Zutaten
- konkretes und generisches Exclude
- Include-/Exclude-Konflikt
- Unicode, Groß-/Kleinschreibung und Whitespace
- unbekannter Begriff mit keinem, einem und mehreren Vorschlägen
- stabiler Gleichstand im Ranking

### Facetten

Für jede Gruppe werden leer, ein Wert und mehrere Werte geprüft. Zusätzlich:

- OR innerhalb derselben Gruppe
- AND zwischen zwei und mehreren Gruppen
- Kombination mit Include und Exclude
- hierarchischer Eltern-/Kindwert
- vollständiges und gruppenweises Rücksetzen

### Internationalisierung

- Erststart mit `de-*`, `en-*` und nicht unterstützter Locale
- In-App-Wechsel DE ↔ EN ohne Neustart
- aktive Chips behalten IDs und wechseln Labels
- Rezept, Facetten, Fehler- und Accessibility-Texte sind vollständig
- deutsche Umlaute und englische Sortierung/Normalisierung

### Persistenz und Migration

- Favorit hinzufügen, idempotent hinzufügen, entfernen
- Neustart und erneutes Laden
- Speicherfehler
- bekannte und unbekannte alte Katalogversion
- entfernte Rezept-ID
- wiederholte Migration ist idempotent

### Deep Links und Sharing

- gültige stabile ID
- unbekannte, leere und manipulierte ID
- Kaltstart über Link und Link bei laufender App
- Share Payload in DE und EN
- dokumentierter Zustand ohne installierte Ziel-App

## Datenqualitätsgate

Die Validierung muss mit Fehlercode fehlschlagen bei:

- weniger als 500 Rezepten
- doppelter oder ungültiger stabiler ID
- fehlendem DE-/EN-Feld
- unbekannter Zutaten- oder Facettenreferenz
- Taxonomiezyklus, verwaistem Elternknoten oder Alias-Kollision
- fehlenden/ungültigen Mengen, Portionen, Zeiten oder Schwierigkeitswerten
- weniger als drei Nicht-Basiszutaten oder drei echten Schritten
- nicht inventarisierter Bildreferenz

Der Erfolgsreport enthält Anzahl Rezepte, Sprachen, Küchen, Ernährungsformen,
Facettenabdeckung und Warnungen. Zufallsgenerierung muss mit festem Seed laufen oder vermieden
werden, damit Unterschiede reviewbar bleiben.

## Coverage- und Qualitätsziele

- Such-, Taxonomie-, Ranking- und Migrationsdomäne: mindestens 90 % Branch Coverage.
- Sonstige Anwendungsschicht: mindestens 80 % Branch Coverage.
- UI-Coverage ist ein Diagnosewert, kein Ersatz für Verhaltensassertionen.
- Snapshot-Tests werden sparsam eingesetzt; semantische Queries und sichtbares Verhalten sind
  vorzuziehen.
- Jeder behobene Produktionsdefekt erhält einen Regressionstest auf der niedrigsten sinnvollen Ebene.

## Accessibility

Komponententests prüfen zugängliche Namen, Rollen, Zustände und Fokusverhalten. Manuell werden
Android TalkBack, große Schrift, Kontrast, Touch-Ziele, Tastatur und reduzierte Animation
stichprobenartig geprüft. Match-Hervorhebung darf nie allein über Farbe kommunizieren.

## Performance

Ein repräsentativer Katalog mit mindestens 500 Rezepten ist Teil der Performancetests. Gemessen
werden Resolver, Filter plus Ranking und erstes Rendern einer Ergebnisliste. Für reine
Domänenlogik gilt 100 ms auf CI-Hardware als Warnbudget; reale Android-Messungen entscheiden
über UX-Freigabe. Performanceprüfungen verwenden mehrere Queryformen statt eines Idealpfads.

## Release-Ablauf

1. Datenvalidierung
2. Typecheck und Lint
3. Unit-, Komponenten- und Integrationstests
4. Android-Entwicklungsbuild und Kaltstart
5. vollständiger Flugmodus-Test aus der Offline-Dokumentation
6. Deep-Link-/Share-Test
7. DE-/EN- und Accessibility-Stichprobe
8. Defekttriage und dokumentierte Freigabe

Ein Release Candidate ist blockiert bei fehlerhafter Datenvalidierung, rotem Pflichtcheck,
offenem P0-Defekt, fehlender Übersetzung, gebrochenem Offline-Kernpfad oder nicht inventarisiertem
externem Netzwerkzugriff.
