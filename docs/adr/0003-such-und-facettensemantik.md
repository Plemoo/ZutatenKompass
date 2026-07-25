# ADR-0003: Such- und Facettensemantik

- **Status:** Accepted
- **Datum:** 2026-07-25

## Kontext

Die Stories lassen mehrere plausible Interpretationen für Zutaten- und Filterlogik zu.
Deterministische Regeln sind für UX und Tests erforderlich.

## Entscheidung

- Includes sind per AND verknüpft; Rezepte dürfen weitere Zutaten enthalten.
- Excludes entfernen semantisch überlappende Rezepte, sind aber nur Komfortfilter.
- Zutatenhierarchie wirkt für Includes und Excludes.
- Facettenwerte innerhalb einer Gruppe sind OR-, belegte Gruppen untereinander AND-verknüpft.
- Primäres Rankingkriterium ist die Zahl zusätzlicher Nicht-Basiszutaten.
- Gleichstände werden stabil über lokalisierten Titel und ID aufgelöst.

## Konsequenzen

- Nutzer erhalten reproduzierbare Ergebnisse.
- Generische Oberbegriffe brauchen eine kuratierte, azyklische Taxonomie.
- Ein Include/Exclude-Konflikt muss bereits in der Eingabe verhindert werden.
- Die App darf keine Allergie- oder Spurenfreiheit versprechen.
