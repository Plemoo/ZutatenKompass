# Datenschutz, Lizenzen, Offlinebetrieb und Sharing

## Datenschutzprofil V1

ZutatenKompass arbeitet ohne Konto und ohne Backend. Suchbegriffe, Filter, Sprache und Favoriten
werden lokal verarbeitet. V1 enthält keine Analytics-, Werbe-, Crash-Upload- oder
Tracking-SDKs. Eine spätere Ergänzung eines solchen Dienstes ist eine neue Produkt- und
Datenschutzentscheidung und nicht durch dieses Dokument freigegeben.

### Dateninventar

| Daten                      | Zweck                    | Ort                                       | Übertragung                            | Löschung                             |
| -------------------------- | ------------------------ | ----------------------------------------- | -------------------------------------- | ------------------------------------ |
| Zutaten- und Filterauswahl | Rezeptsuche              | Arbeitsspeicher, optional lokaler Zustand | keine                                  | Zurücksetzen/App-Daten löschen       |
| Favoriten-IDs              | Schnellzugriff           | lokale SQLite-Datenbank                   | keine                                  | Favorit entfernen/App-Daten löschen  |
| Sprachwahl                 | UX                       | lokale SQLite-Datenbank                   | keine                                  | Einstellung ändern/App-Daten löschen |
| Rezeptkatalog              | Produktfunktion          | gebündelte App-Daten                      | keine                                  | nur durch App-Deinstallation/-Update |
| Share Payload              | nutzerinitiiertes Teilen | OS Share Sheet                            | erst nach Nutzeraktion an gewählte App | durch Ziel-App bestimmt              |

Die App darf nicht behaupten, die Datenverarbeitung anderer Apps im Share Sheet zu kontrollieren.

## Ausschlüsse und Gesundheit

Unerwünschte Zutaten sind ausschließlich Komfortfilter. Der Katalog garantiert weder
Allergenfreiheit noch Freiheit von Spuren oder Kreuzkontamination. Generische Hierarchien helfen
bei der Suche, ersetzen aber keine medizinische oder lebensmittelrechtliche Prüfung. Dieser
Hinweis muss an einer sinnvollen Stelle in der App zugänglich und bei Ausschlüssen sichtbar sein.

## Rezepttexte und Datenlizenzen

- Alle V1-Rezepttexte werden originär für das Projekt formuliert.
- Externe Rezepttexte werden nicht kopiert oder geringfügig umgeschrieben.
- Fakten wie übliche Mengen können fachlich recherchiert werden; konkrete Ausdrucksformen,
  Auswahl und Schritttexte bleiben eigenständig.
- Ein Katalogmanifest sollte Erstellungsart, Version, Reviewstatus und verwendete kontrollierte
  Vokabulare dokumentieren.
- Eine Open-Source-Code-Lizenz deckt nicht automatisch Rezepttexte, Übersetzungen oder Bilder ab;
  deren Rechte müssen separat ausgewiesen werden.

## Medien

V1 verwendet nur gebündelte, originäre oder eindeutig projektberechtigte Assets. Wo kein
individuelles Rezeptbild vorhanden ist, erscheint das lokale App-Icon. Dadurch gibt es:

- keine Hotlinks,
- keine unkontrollierte Übertragung der IP-Adresse an Bildanbieter,
- keine Laufzeitabhängigkeit von fremden URLs,
- einen garantierten Offline-Fallback.

Remote-Bilder sind ein späteres Epic. Vor Aktivierung benötigt jedes Asset ein Manifest mit:

- Quelle und dauerhafter Referenz
- Urheber/Rechteinhaber
- exakter Lizenz und Versionsstand
- erlaubter kommerzieller beziehungsweise App-Einsatz
- Bearbeitungs- und Attributionspflicht
- Abrufdatum und lokale Prüfnachweise
- Datenschutzbewertung des Hosts

„Im Internet auffindbar“ oder „kostenlos“ ist kein Lizenznachweis.

## Offline-Vertrag

Nach abgeschlossener Installation funktionieren ohne Netz:

- App-Start
- Sprachwahl
- Zutatenerkennung und Vorschläge
- Include-/Exclude-Suche
- Facetten und Ranking
- Ergebnisliste und Details
- Favoriten
- Erzeugung des Share Textes

Das eigentliche Senden über WhatsApp oder E-Mail kann naturgemäß Netzwerkzugang der Ziel-App
erfordern und gehört nicht zum Offline-Vertrag von ZutatenKompass.

### Offline-Abnahmetest

1. App installieren und einmal starten.
2. App vollständig beenden.
3. Flugmodus aktivieren und WLAN deaktivieren.
4. App kalt starten.
5. Sprache wechseln, Zutaten mit Tippfehler eingeben, Vorschlag übernehmen.
6. Include, Exclude und mindestens zwei Facettengruppen kombinieren.
7. Ergebnis öffnen, Hervorhebung prüfen und Favorit speichern.
8. App neu starten und Favorit öffnen.
9. Share Sheet öffnen; Senden muss nicht abgeschlossen werden.
10. Sicherstellen, dass kein kaputtes Bild und kein endloser Ladezustand erscheint.

## Sharing-Vertrag V1

Die App übergibt dem nativen Share Sheet:

- lokalisierten Rezepttitel,
- einen kurzen lokalisierten Hinweis,
- `zutatenkompass://recipe/<stabile-rezept-id>`.

Der Nutzer entscheidet, ob und mit welcher App geteilt wird. ZutatenKompass adressiert WhatsApp
oder E-Mail nicht direkt und prüft nicht, welche Apps installiert sind.

### Bewusste Einschränkung

Custom-Scheme-Links funktionieren nur, wenn eine kompatible App installiert und das Scheme
registriert ist. Ohne installierte App führt der Link ins Leere. Es gibt in V1 keine Website,
keinen Store-Fallback und keine Garantie, dass alte Katalogversionen jede geteilte ID kennen.
Unbekannte IDs führen in der App zu einem sicheren Fehlerzustand.

Universal Links beziehungsweise Android App Links erfordern später eine kontrollierte
HTTPS-Domain, Hosting, Store-IDs und Plattformkonfiguration.

## Release-Check

- Paket enthält keine nicht inventarisierten Remote-Endpunkte oder Tracking-SDKs.
- Alle Assets haben nachvollziehbare Rechte.
- Datenschutztext beschreibt das tatsächliche Verhalten.
- Flugmodus-Abnahmetest ist bestanden.
- Allergiehinweis ist in DE und EN vorhanden.
- Share Payload enthält keine Suchhistorie, Favoritenliste oder sonstige lokale Zustände.
