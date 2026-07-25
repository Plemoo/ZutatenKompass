# ADR-0002: Stabile IDs und versionierter Katalog

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Übersetzungen, Favoriten, generische Zutaten, Deep Links und Katalogupdates dürfen Identitäten
nicht aus Anzeigenamen ableiten.

## Entscheidung

Rezepte, Zutaten und Facetten erhalten sprachunabhängige stabile IDs. Katalog und Schema werden
versioniert und vor Build beziehungsweise Test streng validiert. Varianten besitzen eine
stabile Rezept-ID und referenzieren zusätzlich eine sprachunabhängige `baseRecipeId`.
Mindestens 100 Grundrezepte und 1.290 vollständig kochbare Varianten sind in DE und EN
enthalten. Die Suche gibt je `baseRecipeId` höchstens einen Treffer zurück.

## Konsequenzen

- Sprachwechsel verändert keine Referenzen.
- Favoriten und Links bleiben über kompatible Katalogupdates stabil.
- Entfernen oder Zusammenführen von IDs benötigt Migration beziehungsweise Alias-Mapping.
- Ein ungültiger Katalog blockiert die Auslieferung.
