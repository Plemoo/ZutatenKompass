# ADR-0005: Custom-Scheme-Sharing

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Rezepte sollen über installierte Ziel-Apps geteilt werden. Es gibt weder Backend noch Domain,
Landingpage oder Store-Konfiguration.

## Entscheidung

Das Betriebssystem-Share-Sheet erhält Titel, Text und
`zutatenkompass://recipe/<stabile-id>`. Expo Router löst die Route auf. Direkte WhatsApp- oder
E-Mail-Integrationen werden nicht eingesetzt.

## Konsequenzen

- Nutzer können jede kompatible installierte Share-App wählen.
- Ohne installierte ZutatenKompass-App führt der Link ins Leere.
- Unbekannte IDs brauchen einen sicheren Fehlerzustand.
- Ein Web-/Store-Fallback benötigt später Domain, Hosting, Store-IDs und ein neues ADR.
