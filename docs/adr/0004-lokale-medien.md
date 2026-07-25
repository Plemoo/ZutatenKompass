# ADR-0004: Lokale Medien in V1

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Remote-Bilder gefährden Offlinegarantie, Verfügbarkeit, Datenschutz und Lizenznachweis.

## Entscheidung

V1 verwendet ausschließlich originäre oder zweifelsfrei berechtigte gebündelte Assets.
Fehlt ein individuelles Bild, wird das App-Icon angezeigt. Remote-Bilder bleiben deaktiviert,
bis Lizenzmanifest und Datenschutzprüfung vorliegen.

## Konsequenzen

- Kein Hotlinking und kein unbemerkter Drittanbieterabruf.
- Verlässlicher Offlinezustand.
- App-Paketgröße muss überwacht werden.
- Bildvielfalt kann in V1 geringer sein.
