# ZutatenKompass

ZutatenKompass ist eine lokale, zweisprachige Rezeptsuche für Android, die später
ohne Architekturwechsel auf iOS bereitgestellt werden kann. Nutzer geben vorhandene
und unerwünschte Zutaten ein, verfeinern die Suche mit Facetten und erhalten passende
Rezepte aus einem vollständig mitgelieferten Katalog.

## Produktumfang V1

- 1.200 originär formulierte Rezepte, jeweils vollständig auf Deutsch und Englisch
- großer Koch- und Backschwerpunkt mit je 180 Aufläufen und Eintöpfen sowie je 160 Kuchen und Muffins
- lokale Suche ohne Backend und ohne Internetpflicht
- UND-Verknüpfung der gewünschten Zutaten; unerwünschte Zutaten werden ausgeschlossen
- generische Zutatenbegriffe, Synonyme und Tippfehlervorschläge
- Facetten für Ernährung, Mahlzeit/Gang, Küche/Region, Zeit, Schwierigkeit und Zubereitungsart
- Ergebnisranking nach möglichst wenigen zusätzlich benötigten Zutaten
- Favoriten, Sprachwahl per 🇩🇪-/🇬🇧-Flagge, Detailansicht und Teilen über das Betriebssystem
- ausschließlich lokale Bild-Assets in V1; das App-Icon ist der verlässliche Fallback

Wichtig: Zutaten-Ausschlüsse sind Komfortfilter und keine medizinisch belastbare
Allergieprüfung. Der Katalog enthält keine Garantie zu Allergenen oder Spuren.

## Technische Basis

- Expo SDK 57 und React Native mit TypeScript
- Expo Router für dateibasierte Navigation und Deep Links
- Expo SQLite für lokale Persistenz und Katalogabfragen
- Expo Localization für die initiale Gerätesprache
- pnpm und Node.js 22
- kein Backend, keine Konten, keine Telemetrie und keine Remote-Bilder in V1

## Lokal starten

Voraussetzungen sind Node.js gemäß `.nvmrc`, pnpm gemäß `package.json` und eine
Android-Entwicklungsumgebung oder Expo Go.

```bash
pnpm install
pnpm start
```

Danach kann die Android-App über die Expo-Oberfläche gestartet werden. Die gebündelten
Prüfungen laufen mit:

```bash
pnpm check
```

Einzelne Prüfungen:

```bash
pnpm validate:data
pnpm typecheck
pnpm lint
pnpm test
```

## Orientierung

- [Backlog](BACKLOG.md) – priorisierte Epics, Stories, Akzeptanzkriterien und Abhängigkeiten
- [Produktentscheidungen](docs/PRODUCT_DEFAULTS.md) – verbindliche Defaults und offene Punkte
- [Architektur](docs/ARCHITECTURE.md) – Komponenten, Datenfluss und technische Leitplanken
- [ADRs](docs/adr/README.md) – nachvollziehbare Architekturentscheidungen
- [Datenschutz, Lizenzen, Offline und Sharing](docs/PRIVACY_LICENSE_OFFLINE_SHARING.md)
- [Teststrategie](docs/TEST_STRATEGY.md)
- [Delivery-Framework](framework/README.md) – wiederverwendbarer Ablauf für neue Story-Dateien

## Arbeitsweise

Das Projekt wird backloggetrieben und rollenbasiert umgesetzt. Eine Story beginnt erst,
wenn sie die Definition of Ready erfüllt, und gilt erst nach Code-, Daten-, Test- und
Dokumentationsprüfung als abgeschlossen. Der koordinierende Agent besitzt Priorisierung,
Entscheidungslog und Integrationsgates; Fachagenten arbeiten innerhalb klarer Dateigrenzen.

Ein privates GitHub-Repository `Plemoo/ZutatenKompass` ist vorgesehen. Die lokale
Implementierung ist davon unabhängig; Repository-Erstellung, Push und EAS-Konfiguration
erfordern separate Zugangsdaten beziehungsweise Freigaben.
