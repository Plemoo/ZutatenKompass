# ADR-0001: Local-first ohne Backend

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Kernfunktionen müssen offline verfügbar sein. Konten, Synchronisation und zentrale APIs sind
nicht gefordert.

## Entscheidung

Rezeptkatalog und Suchwissen werden gebündelt ausgeliefert. Expo SQLite persistiert lokale
Nutzereinstellungen und Favoriten hinter Repository-Schnittstellen. Es gibt in V1 kein Backend,
keine Anmeldung und keine Telemetrie.

## Konsequenzen

- Die App funktioniert unabhängig von Verfügbarkeit und Betrieb eines Servers.
- Datenschutz und Betrieb werden einfacher.
- Katalogupdates benötigen eine neue App-/Content-Version und Migration.
- Geräteübergreifende Synchronisation ist nicht enthalten.
- Der Katalog erhöht die Paketgröße; Assets müssen bewusst budgetiert werden.
