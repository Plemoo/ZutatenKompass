# ADR-0006: Expo Router und Expo SQLite

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Die App soll mit Expo/React Native/TypeScript Android zuerst und später iOS unterstützen.
Navigation und lokale Persistenz sollen ohne Backend plattformübergreifend funktionieren.

## Entscheidung

Expo Router übernimmt die dateibasierte Navigation und Deep-Link-Auflösung. Expo SQLite
beziehungsweise dessen lokaler Key-Value-Adapter speichert Favoriten, Sprachwahl und
Versionsmetadaten. Domänenlogik bleibt frei von Router- und SQLite-Abhängigkeiten.

## Konsequenzen

- Screens sind anhand ihrer Route deep-link-fähig.
- Persistenz verwendet eine von Expo SDK 57 unterstützte native Basis.
- Plattformdetails müssen hinter Adaptern beziehungsweise Providern bleiben.
- Expo-SDK-Upgrades erfordern Prüfung der exakt versionierten Router-, Linking- und
  SQLite-Dokumentation sowie Migrations-/Deep-Link-Regressionstests.
