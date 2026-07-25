# ADR-0002: Stabile IDs und versionierter Katalog

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Übersetzungen, Favoriten, generische Zutaten, Deep Links und Katalogupdates dürfen Identitäten
nicht aus Anzeigenamen ableiten.

## Entscheidung

Rezepte, Zutaten und Facetten erhalten sprachunabhängige stabile IDs. Katalog und Schema werden
versioniert und vor Build beziehungsweise Test streng validiert. Mindestens 1.200 originäre
Rezepte sind vollständig in DE und EN enthalten.

## Konsequenzen

- Sprachwechsel verändert keine Referenzen.
- Favoriten und Links bleiben über kompatible Katalogupdates stabil.
- Entfernen oder Zusammenführen von IDs benötigt Migration beziehungsweise Alias-Mapping.
- Ein ungültiger Katalog blockiert die Auslieferung.
