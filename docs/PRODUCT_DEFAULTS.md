# Verbindliche Produktentscheidungen

Diese Datei trennt beschlossene Defaults von offenen externen Voraussetzungen. Änderungen
an einem Default benötigen ein ADR oder eine dokumentierte Produktentscheidung.

## Beschlossen

| Thema              | Entscheidung                                                                     |
| ------------------ | -------------------------------------------------------------------------------- |
| Name               | ZutatenKompass                                                                   |
| Zielplattform      | Android V1; iOS-fähige Architektur                                               |
| Technik            | Expo SDK 57, React Native, TypeScript, pnpm, Node.js 22                          |
| Backend            | keines                                                                           |
| Katalog            | mindestens 1.200 originäre, vollständige Rezepte                                 |
| Sprachen           | Deutsch und Englisch für UI und sämtliche Rezeptdaten                            |
| Rezeptumfang       | Mengen, Einheiten, Portionen, Zeiten, Schwierigkeit, Zutaten, Schritte, Facetten |
| Abdeckung          | gemischte internationale Küche, inklusive vegetarisch und vegan                  |
| Include-Semantik   | AND; weitere Rezeptzutaten sind erlaubt                                          |
| Ranking            | möglichst wenige zusätzliche Nicht-Basiszutaten zuerst                           |
| Generische Zutaten | Hierarchie wirkt konsistent für Include und Exclude                              |
| Excludes           | Komfortfilter; ausdrücklich keine medizinische Allergiegarantie                  |
| Facetten           | Ernährung, Mahlzeit/Gang, Küche/Region, Zeit, Schwierigkeit, Zubereitungsart     |
| Facettenlogik      | OR innerhalb einer Gruppe, AND zwischen belegten Gruppen                         |
| Nicht trivial      | redaktionell geprüft, mindestens 3 Nicht-Basiszutaten und 3 echte Schritte       |
| Bilder V1          | originäre, gebündelte Assets; ansonsten lokales App-Icon                         |
| Remote-Bilder      | erst später und nur mit vollständigem Lizenzmanifest                             |
| Sharing V1         | OS Share Sheet mit Titel/Text und Custom-Scheme-Link über stabile Rezept-ID      |
| Link-Fallback      | ohne installierte App kein Web-/Store-Fallback in V1                             |
| Datenschutz        | keine Konten, Telemetrie, Werbung oder automatische Datenübertragung             |
| Repository         | privates GitHub-Repository `Plemoo/ZutatenKompass` vorgesehen                    |

## Technische Arbeitsdefaults

- Expo Router modelliert die Routen; Rezeptdetails verwenden stabile IDs.
- Expo SQLite hält lokale persistente Daten. Implementierungsdetails bleiben hinter
  Repository-Schnittstellen, damit Tests nicht an SQLite gekoppelt sind.
- Gerätesprache bestimmt beim Erststart DE oder EN; andere Sprachen fallen auf EN zurück.
- Eine bewusste In-App-Auswahl über die 🇩🇪-/🇬🇧-Flaggen überschreibt die Gerätesprache
  und bleibt lokal gespeichert.
- Resultate sind deterministisch. Gleichstände werden über lokalisierten Titel und stabile ID
  aufgelöst, sofern kein späteres ADR einen besseren Schlüssel festlegt.
- Ohne Suchauswahl darf die App eine deterministisch sortierte Gesamtliste anzeigen.
- Es gibt keine Annahme, dass ein Exclude allergenfrei, spurenfrei oder medizinisch sicher ist.

## Noch extern zu klären

- GitHub-Zugriff und Freigabe zur privaten Repository-Erstellung
- EAS-Owner, Signierung, Buildprofile und Store-Zugänge
- kontrollierte Domain, Hosting und Store-IDs für spätere Universal/App Links
- rechtliche Freigabe und Quelleninventar vor Aktivierung externer Medien
