# Produktbacklog ZutatenKompass

Stand: 25. Juli 2026. Das Backlog ist nach `P0` (V1 zwingend), `P1` (V1 wichtig) und
`P2` (später) priorisiert. Statuswerte sind `Geplant`, `In Umsetzung`, `Blockiert` und
`Erledigt`. Eine technische Implementierung allein ändert den Status nicht: Es gelten
die Akzeptanzkriterien und die projektweite Definition of Done.

## Produktweite Qualitätsregeln

- Alle nutzerrelevanten Texte und Rezeptdaten sind in Deutsch und Englisch vorhanden.
- Kernfunktionen funktionieren nach Installation ohne Netzwerkzugriff.
- Jede Rezept-ID ist stabil, eindeutig und unabhängig von Sprache und Katalogversion.
- Ausschlüsse sind Komfortfilter, keine Allergie- oder Gesundheitsschutzfunktion.
- Interaktive Oberflächen besitzen zugängliche Namen, ausreichenden Kontrast,
  angemessene Touch-Ziele und funktionieren mit großer Schrift.
- Fehler-, Leer-, Lade- und Offlinezustände sind bewusst gestaltet.
- Katalog, Suche und Persistenz sind deterministisch und automatisiert testbar.

## E0 – Produktfundament und Delivery

### ZK-001 – Expo-Projektbasis (`P0`, Erledigt)

**Story:** Als Entwickler möchte ich eine reproduzierbare Expo-/TypeScript-Basis, damit
Android lokal gebaut und iOS später ergänzt werden kann.

**Akzeptanzkriterien**

- Expo SDK 57, TypeScript, React Native und pnpm sind versioniert konfiguriert.
- `pnpm check` bündelt Datenvalidierung, Typecheck, Lint und Tests.
- Android startet lokal; plattformspezifische Abhängigkeiten werden vermieden oder gekapselt.
- Node- und pnpm-Versionen sind dokumentiert.

**Abhängigkeiten:** keine.

### ZK-002 – Privates Quellrepository (`P1`, Blockiert)

**Story:** Als Entwickler möchte ich das Projekt in `Plemoo/ZutatenKompass` privat
versionieren, damit Änderungen nachvollziehbar und sicher gespeichert sind.

**Akzeptanzkriterien**

- Das Repository ist privat und enthält keine Secrets oder lokale Build-Artefakte.
- Der Standardbranch ist geschützt; Qualitätsprüfungen sind für Integrationen vorgesehen.
- README, Lizenz und Beitragshinweise sind enthalten.

**Abhängigkeiten:** ZK-001; GitHub-Zugriff und ausdrückliche Freigabe für externe Änderungen.

### ZK-003 – EAS-/Store-Bereitstellung (`P2`, Blockiert)

**Story:** Als Product Owner möchte ich reproduzierbare Android-Builds und später iOS-Builds.

**Akzeptanzkriterien**

- EAS-Owner, App-Identitäten, Signierung und Build-Profile sind entschieden.
- Preview- und Production-Builds sind getrennt.
- Store-Metadaten und Datenschutzangaben sind geprüft.

**Abhängigkeiten:** ZK-002; EAS-Owner und Store-Zugänge fehlen.

## E1 – Marke und zugängliches Design

### ZK-010 – Sprechender Produktname (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich am Namen die Funktion der App erkennen.

**Akzeptanzkriterien**

- Anzeigename und technischer Slug lauten konsistent `ZutatenKompass` beziehungsweise
  `zutatenkompass`.
- Paketkennung und URL-Scheme sind eindeutig dokumentiert.

**Abhängigkeiten:** keine.

### ZK-011 – Food-orientiertes Designsystem (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich eine moderne, eigenständige und appetitliche Oberfläche.

**Akzeptanzkriterien**

- Farb-, Typografie-, Abstands-, Radius- und Zustands-Tokens sind zentral definiert.
- Das Design ist eigenständig und kopiert weder HelloFresh-Markenfarben noch Gestaltung.
- Text- und Statuskontraste sind barrierearm; Bedeutung wird nicht nur durch Farbe vermittelt.
- Android-Safe-Areas, Tastatur und große Schrift werden berücksichtigt.

**Abhängigkeiten:** ZK-010.

### ZK-012 – Erkennbares App-Icon (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich das App-Prinzip am Icon wiedererkennen.

**Akzeptanzkriterien**

- Icon, Android Adaptive Icon, Monochrom-Icon und Splash-Asset sind vorhanden.
- Das Motiv bleibt in kleinen Größen verständlich und enthält keinen fremden Markenbestandteil.
- Das Icon dient als lokaler Bildfallback.

**Abhängigkeiten:** ZK-010, ZK-011.

## E2 – Rezeptkatalog und Zutatenwissen

### ZK-020 – Versioniertes Rezept-Domänenmodell (`P0`, Erledigt)

**Story:** Als Entwickler möchte ich ein validierbares Datenmodell, damit Katalog,
Suche, Übersetzung und Persistenz dieselben Begriffe verwenden.

**Akzeptanzkriterien**

- Ein Rezept besitzt stabile ID, DE-/EN-Titel, Portionen, Zeiten, Schwierigkeit,
  Mengen/Einheiten, geordnete Schritte, Facetten und Bildreferenz.
- Zutaten referenzieren kanonische IDs statt lokalisierter Freitexte.
- Schema- und Katalogversion sind explizit.
- Ungültige Referenzen, doppelte IDs und fehlende Übersetzungen stoppen die Validierung.

**Abhängigkeiten:** ZK-001.

### ZK-021 – Zutaten-Taxonomie und Synonyme (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich konkrete und generische Zutatenbegriffe verwenden.

**Akzeptanzkriterien**

- Zutaten haben stabile IDs, DE-/EN-Namen, lokalisierte Aliase und höchstens einen
  wohldefinierten Hierarchiepfad je Klassifikationsdimension.
- `Käse` findet Rezepte mit Cheddar; eine konkrete Auswahl wird kanonisch aufgelöst.
- Include und Exclude berücksichtigen Eltern- und Kindbeziehungen konsistent.
- Zyklen, verwaiste Eltern und Alias-Kollisionen werden automatisiert abgelehnt.

**Abhängigkeiten:** ZK-020.

### ZK-022 – Mindestens 500 originäre zweisprachige Rezepte (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich eine breite internationale und abwechslungsreiche
Rezeptauswahl.

**Akzeptanzkriterien**

- Der validierte Katalog enthält mindestens 500 fachlich unterschiedliche Rezepte.
- Jedes Rezept ist vollständig und originär auf Deutsch und Englisch formuliert.
- Enthalten sind gemischte internationale Küchen sowie vegetarische und vegane Optionen.
- Jedes Rezept enthält Mengen, Einheiten, Portionen, Gesamt-/Vorbereitungs-/Garzeit,
  Schwierigkeit und mindestens drei echte Zubereitungsschritte.
- Katalogtexte werden nicht aus externen Rezeptseiten kopiert.
- Ein automatisierter Report zählt Rezepte, Übersetzungen, Facettenabdeckung und Fehler.

**Abhängigkeiten:** ZK-020, ZK-021, ZK-023.

### ZK-023 – Redaktionelle Trivialitätsregel (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich keine bloßen Selbstverständlichkeiten als Rezept sehen.

**Akzeptanzkriterien**

- Ein aufgenommenes Rezept hat mindestens drei Nicht-Basiszutaten und drei echte Schritte.
- Eine dokumentierte Basiszutatenliste verhindert Zufallsentscheidungen.
- Redaktionelle Prüfung kann ein technisch gültiges, aber kulinarisch triviales Rezept ablehnen.
- Ausnahmen sind begründet und im Katalog nachvollziehbar.

**Abhängigkeiten:** ZK-020.

### ZK-024 – Datenqualität und Lebensmittelsicherheit (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich plausible und verständliche Rezeptangaben.

**Akzeptanzkriterien**

- Mengen, Portionen und Zeiten liegen in plausiblen, validierten Bereichen.
- Kritische Lebensmittel enthalten eindeutige Gar-/Hygienehinweise, soweit erforderlich.
- Keine Rezeptangabe behauptet medizinische, diätetische oder allergologische Sicherheit.
- Stichproben und automatisierte Regeln sind dokumentiert.

**Abhängigkeiten:** ZK-022.

### ZK-025 – Katalogmigration (`P1`, Geplant)

**Story:** Als Nutzer möchte ich nach Katalogupdates weiterhin gültige Favoriten besitzen.

**Akzeptanzkriterien**

- Katalog- und Persistenzversionen werden beim Start verglichen.
- Entfernte oder umbenannte IDs werden migriert oder kontrolliert verworfen.
- Ein fehlender Favorit führt weder zu Absturz noch zu falschem Rezept.

**Abhängigkeiten:** ZK-020, ZK-060.

## E3 – Eingabe, Suche und Ranking

### ZK-030 – Zutaten als Include-Chips erfassen (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich beliebig viele vorhandene Zutaten intuitiv eingeben.

**Akzeptanzkriterien**

- Bestätigte Eingaben erscheinen als entfernbare Chips.
- Normalisierung ignoriert Groß-/Kleinschreibung und überflüssige Leerzeichen.
- Doppelte kanonische Zutaten werden nicht erneut angelegt.
- `Beliebig viele` bedeutet keine fachliche Obergrenze; die UI bleibt mit mindestens
  50 Chips bedienbar und die Suche mit realistischer Eingabelast reaktionsfähig.

**Abhängigkeiten:** ZK-021, ZK-011.

### ZK-031 – Validierung und „Meinten Sie?“ (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich nach Verlassen des Feldes wissen, ob eine Zutat erkannt wurde.

**Akzeptanzkriterien**

- Ein kanonischer Treffer oder eindeutiger Alias wird bestätigt.
- Unbekannte Eingaben erzeugen deterministisch sortierte, lokalisierte Vorschläge.
- Vorschläge können übernommen, die Eingabe kann korrigiert oder verworfen werden.
- Unbekannte Begriffe gelangen nicht still in die Suche.

**Abhängigkeiten:** ZK-021, ZK-030.

### ZK-032 – Unerwünschte Zutaten erfassen (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Zutaten ausschließen können.

**Akzeptanzkriterien**

- Excludes sind optisch und semantisch von Includes getrennt.
- Dieselbe kanonische Zutat kann nicht gleichzeitig Include und Exclude sein.
- Generische Excludes schließen passende Unterarten aus und umgekehrt, soweit die
  Taxonomie eine semantische Überschneidung feststellt.
- Ein sichtbarer Hinweis erklärt den Komfortfilter und die fehlende Allergiegarantie.

**Abhängigkeiten:** ZK-021, ZK-030.

### ZK-033 – Deterministische lokale Suche (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich alle Rezepte finden, die meine gewünschten Zutaten enthalten.

**Akzeptanzkriterien**

- Alle Includes sind per AND verknüpft; ein Rezept darf weitere Zutaten enthalten.
- Ein Treffer mit einem Exclude oder semantischem Nachfahren/Vorfahren wird entfernt.
- Dieselbe Eingabe und Katalogversion erzeugen offline dieselben Ergebnisse.
- Leere Include-Liste ist definiert: Facetten dürfen allein suchen, ohne Auswahl wird
  eine kuratierte beziehungsweise deterministisch sortierte Gesamtliste angezeigt.

**Abhängigkeiten:** ZK-020, ZK-021, ZK-032.

### ZK-034 – Ranking nach zusätzlichen Zutaten (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich zuerst Rezepte sehen, für die mir möglichst wenig fehlt.

**Akzeptanzkriterien**

- Primärschlüssel ist die Anzahl zusätzlicher Nicht-Basiszutaten, aufsteigend.
- Gleichstände werden stabil und dokumentiert aufgelöst, etwa nach lokalisiertem Titel und ID.
- Basiszutatenregel und generische Matches beeinflussen den Score reproduzierbar.
- Rankingtests decken Gleichstand, generische Begriffe und Excludes ab.

**Abhängigkeiten:** ZK-023, ZK-033.

### ZK-035 – Suchzustand zwischen Screens erhalten (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich auf der Ergebnisseite dieselben Eingaben und Filter ändern können.

**Akzeptanzkriterien**

- Start- und Ergebnisseite verwenden denselben kanonischen Suchzustand.
- Änderungen aktualisieren Ergebnisse ohne Verlust anderer Auswahlwerte.
- Zurücknavigation erzeugt keine duplizierten oder veralteten Chips.

**Abhängigkeiten:** ZK-030 bis ZK-034, ZK-050.

### ZK-036 – Leere Ergebnisse verständlich erklären (`P1`, Erledigt)

**Story:** Als Nutzer möchte ich eine erfolglose Suche sinnvoll korrigieren können.

**Akzeptanzkriterien**

- Der Leerzustand benennt mögliche Ursachen ohne falsche Behauptung.
- Nutzer können Excludes, Facetten oder Includes direkt entfernen beziehungsweise zurücksetzen.
- Die App zeigt keine nicht passenden Rezepte als Treffer.

**Abhängigkeiten:** ZK-033, ZK-040.

## E4 – Hierarchische Facetten

### ZK-040 – Facettenmodell (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Ergebnisse nach sinnvollen Rubriken eingrenzen.

**Akzeptanzkriterien**

- Gruppen: Ernährung, Mahlzeit/Gang, Küche/Region, Zeit, Schwierigkeit, Zubereitungsart.
- Werte innerhalb einer Gruppe sind per OR, belegte Gruppen untereinander per AND verknüpft.
- Hierarchische Werte können Eltern und Unterrubriken darstellen.
- Facettenwerte sind DE/EN lokalisiert und ausschließlich aus gültigen Katalogwerten wählbar.

**Abhängigkeiten:** ZK-020.

### ZK-041 – Facettenbedienung und Rücksetzen (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Filter mit wenigen Aktionen auswählen und zurücksetzen.

**Akzeptanzkriterien**

- Aktive Gruppen und Werte sind jederzeit erkennbar.
- Einzelwerte, Gruppen und alle Filter können zurückgesetzt werden.
- Auswahl und Ergebniszahl sind mit Screenreader verständlich.
- Kleine Displays und große Schrift bleiben bedienbar.

**Abhängigkeiten:** ZK-011, ZK-040.

### ZK-042 – Facetten mit Suchranking kombinieren (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich nur Resultate sehen, die Zutaten- und Facettenauswahl erfüllen.

**Akzeptanzkriterien**

- Facetten werden vor dem finalen Ranking als harte Filter angewendet.
- OR-/AND-Logik ist durch Matrix-Tests belegt.
- Aktive Facetten bleiben auf Start-, Ergebnis- und Detailkontext konsistent.

**Abhängigkeiten:** ZK-034, ZK-040.

## E5 – Navigation und Rezeptdarstellung

### ZK-050 – Minimalistische Startseite (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich nach einer sehr kurzen Erklärung sofort Zutaten eingeben.

**Akzeptanzkriterien**

- Eine kurze lokalisierte Erklärung oder selbsterklärende Illustration erläutert den Ablauf.
- Include-Eingabe ist der visuell primäre Einstieg; Excludes und Facetten sind optional erreichbar.
- Sprache und Favoriten sind ohne versteckte Gesten zugänglich.

**Abhängigkeiten:** ZK-011, ZK-030, ZK-040, ZK-070.

### ZK-051 – Ergebnisliste (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Rezepttitel und ein repräsentatives, verlässliches Bild sehen.

**Akzeptanzkriterien**

- Jede Karte zeigt Titel und lokales Bild beziehungsweise App-Icon-Fallback.
- Kein Remote-Ladevorgang und kein kaputter Bildzustand ist für V1 erforderlich.
- Karten öffnen eindeutig die stabile Rezept-ID.
- Listen sind performant und zugänglich.

**Abhängigkeiten:** ZK-012, ZK-022, ZK-034.

### ZK-052 – Rezeptdetail (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Zutaten und danach die Zubereitung lesen.

**Akzeptanzkriterien**

- Titel, Metadaten, Portionen, Zeiten, Schwierigkeit und Bild werden dargestellt.
- Zutaten mit Mengen stehen vor nummerierten Zubereitungsschritten.
- Fehlende oder unbekannte ID zeigt einen sicheren Fehlerzustand.
- Darstellung funktioniert auf Android und nutzt plattformübergreifende APIs.

**Abhängigkeiten:** ZK-020, ZK-051.

### ZK-053 – Auswahl auf Detailseite hervorheben (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich die Relevanz meiner Suche im Rezept erkennen.

**Akzeptanzkriterien**

- Direkt und generisch gematchte Includes werden unterscheidbar, aber nicht allein farblich markiert.
- Aktive Facetten werden in einem kompakten Kontextbereich erklärt.
- Excludes erscheinen bei korrekter Suche niemals als enthaltene Rezeptzutat.
- Ohne Suchkontext bleibt die Detailansicht ruhig und vollständig.

**Abhängigkeiten:** ZK-035, ZK-042, ZK-052.

## E6 – Favoriten und lokale Persistenz

### ZK-060 – Favoriten speichern (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Lieblingsrezepte offline und über Neustarts hinweg speichern.

**Akzeptanzkriterien**

- Hinzufügen und Entfernen ist auf Liste und Detail konsistent.
- Gespeichert werden stabile IDs, nicht duplizierte Rezeptkopien.
- Schreib-/Lesefehler führen zu verständlichem Zustand statt Datenverlust ohne Hinweis.

**Abhängigkeiten:** ZK-020.

### ZK-061 – Kompakte Favoritenansicht (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Favoriten schnell finden und bei Bedarf aufklappen.

**Akzeptanzkriterien**

- Standardmäßig werden nur Rezeptnamen angezeigt.
- Ein Favorit kann zugänglich aufgeklappt oder zur vollständigen Detailseite geöffnet werden.
- Leerer Zustand führt zurück zur Suche.

**Abhängigkeiten:** ZK-052, ZK-060.

### ZK-062 – Einstellungen und letzter Zustand (`P1`, Erledigt)

**Story:** Als Nutzer möchte ich Sprache und sinnvolle lokale Einstellungen behalten.

**Akzeptanzkriterien**

- Gewählte Sprache bleibt über Neustarts erhalten.
- Suchzustand wird nur gespeichert, wenn dies als UX-Vorteil umgesetzt wird, und ist zurücksetzbar.
- Persistenz enthält keine unnötigen personenbezogenen Daten.

**Abhängigkeiten:** ZK-060, ZK-070.

## E7 – Internationalisierung

### ZK-070 – Deutsch und Englisch (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich Oberfläche und Rezeptdaten auf Deutsch oder Englisch nutzen.

**Akzeptanzkriterien**

- Beim Erststart wird Deutsch oder Englisch aus der Gerätesprache gewählt; andere Sprachen
  fallen auf Englisch zurück.
- Die Sprache ist in der App ohne Neustart umschaltbar.
- UI, Zutaten, Facetten und alle Rezeptfelder wechseln gemeinsam.
- Fehlende Schlüssel oder Übersetzungen werden in Validierung und Tests erkannt.

**Abhängigkeiten:** ZK-020.

### ZK-071 – Lokalisierte Suche (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich in der aktiven Sprache suchen und Vorschläge erhalten.

**Akzeptanzkriterien**

- Namen, Aliase und Tippfehlervorschläge verwenden die aktive Sprache.
- Ein Sprachwechsel kanonisiert vorhandene Chips ohne ID-Verlust.
- Sortierung und Textnormalisierung sind für DE/EN deterministisch getestet.

**Abhängigkeiten:** ZK-021, ZK-031, ZK-070.

## E8 – Offlinebetrieb, Datenschutz, Medien und Sharing

### ZK-080 – Vollständiger Offlinebetrieb (`P0`, In Umsetzung)

**Story:** Als Nutzer möchte ich die App ohne Internet bedienen.

**Akzeptanzkriterien**

- Suche, Facetten, Rezeptdetail, Favoriten und Sprachwechsel benötigen kein Netzwerk.
- Katalog und V1-Bilder werden mit der App ausgeliefert.
- Ein Offline-Test startet die App nach geleertem Netzwerkcache im Flugmodus.
- Keine Kernoberfläche wartet auf eine Remote-Anfrage.

**Abhängigkeiten:** ZK-022, ZK-051, ZK-060, ZK-070.

### ZK-081 – Datenschutzarme V1 (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich die Rezeptsuche ohne Konto, Tracking oder Datenabfluss nutzen.

**Akzeptanzkriterien**

- V1 hat kein Backend, keine Anmeldung, keine Analytics und keine Werbung.
- Lokale Eingaben und Favoriten verlassen das Gerät nicht automatisch.
- Teilen wird nur nach expliziter Nutzeraktion ausgelöst.
- Datenschutzangaben stimmen mit dem tatsächlichen Netzwerkverhalten überein.

**Abhängigkeiten:** ZK-080, ZK-082.

### ZK-082 – Teilen über das Betriebssystem (`P0`, Erledigt)

**Story:** Als Nutzer möchte ich ein Rezept über WhatsApp, E-Mail oder andere installierte
Apps teilen.

**Akzeptanzkriterien**

- Das OS Share Sheet erhält lokalisierten Titel, kurzen Text und
  `zutatenkompass://recipe/<stabile-id>`.
- Die App verarbeitet gültige Rezeptlinks und zeigt unbekannte IDs sicher an.
- Es wird klar dokumentiert: Ohne installierte App führt der Custom-Scheme-Link ins Leere;
  V1 besitzt keinen Web- oder Store-Fallback.
- Es gibt keine direkte WhatsApp- oder E-Mail-SDK-Abhängigkeit.

**Abhängigkeiten:** ZK-010, ZK-020, ZK-052.

### ZK-083 – Remote-Bildoption mit Lizenzmanifest (`P2`, Geplant)

**Story:** Als Product Owner möchte ich später optionale externe Rezeptbilder rechtssicher nutzen.

**Akzeptanzkriterien**

- Jede Datei hat Quelle, Urheber, Lizenz, erlaubte Nutzung, Abrufdatum und Attributionsregel.
- Datenschutzprüfung bewertet Drittanbieterabrufe; kein Hotlinking ohne ausdrückliche Erlaubnis.
- App-Icon oder gebündeltes Bild bleibt Offline-Fallback.
- Remote-Medien werden erst nach juristischer/produktseitiger Freigabe aktiviert.

**Abhängigkeiten:** ZK-081; Rechts- und Datenschutzprüfung.

### ZK-084 – Universal/App Links (`P2`, Blockiert)

**Story:** Als Empfänger ohne installierte App möchte ich einen sinnvollen Store- oder Web-Fallback.

**Akzeptanzkriterien**

- Kontrollierte HTTPS-Domain, Android-App-Link und iOS-Universal-Link sind konfiguriert.
- Nicht installierte App führt auf eine sichere Landingpage beziehungsweise in den Store.
- Versions- und unbekannte Rezept-IDs haben definierte Fallbacks.

**Abhängigkeiten:** ZK-003; Domain, Hosting und Store-IDs fehlen.

## E9 – Qualität, Dokumentation und Wiederverwendung

### ZK-090 – Automatisierte Testpyramide (`P0`, In Umsetzung)

**Story:** Als Team möchte ich Regressionen schnell und reproduzierbar erkennen.

**Akzeptanzkriterien**

- Unit-Tests decken Normalisierung, Taxonomie, Suche, Ranking und Persistenzmigration ab.
- Komponenten-/Integrationstests decken Eingabe, Filter, Navigation, Favoriten, Sprache und Teilen ab.
- Ein Android-Smoke-Test deckt den wichtigsten Offline-Nutzerpfad ab.
- Kritische Logik besitzt Branch-Coverage-Ziele gemäß Teststrategie.

**Abhängigkeiten:** jeweilige Fachstory.

### ZK-091 – Datenqualitätsgate (`P0`, Erledigt)

**Story:** Als Team möchte ich fehlerhafte Katalogänderungen vor Auslieferung stoppen.

**Akzeptanzkriterien**

- Validierung prüft Schema, IDs, Referenzen, Hierarchie, Übersetzungen, Mindestumfang und
  Trivialitätsregeln.
- Der Prozess liefert menschenlesbaren Fehlerreport und non-zero Exitcode.
- `pnpm check` führt das Gate aus.

**Abhängigkeiten:** ZK-020 bis ZK-024.

### ZK-092 – Betriebs- und Architektur-Dokumentation (`P0`, Erledigt)

**Story:** Als Entwickler möchte ich Entscheidungen und Qualitätsregeln nachvollziehen.

**Akzeptanzkriterien**

- README, Architektur, ADRs, Datenschutz/Lizenz/Offline/Sharing und Teststrategie sind vorhanden.
- Defaults, Blocker und bewusst spätere Themen sind explizit.
- Dokumente verlinken aufeinander und widersprechen dem Backlog nicht.

**Abhängigkeiten:** Produktrefinement.

### ZK-093 – Wiederverwendbares Multi-Agenten-Framework (`P1`, Erledigt)

**Story:** Als Auftraggeber möchte ich künftige Projekte mit einer Story-Datei starten können.

**Akzeptanzkriterien**

- Ablauf von Ingestion bis Handoff, Rollen, Dateigrenzen, Gates und Eskalationsregeln sind erklärt.
- Vorlagen für Epic, Story, ADR, DoR, DoD und Handoff sind enthalten.
- Rollenprompts für Koordination, Refinement, Frontend, Domain, Qualität und Dokumentation
  sind direkt wiederverwendbar.
- Das Framework fordert Rückfragen statt erfundener fachlicher Entscheidungen.

**Abhängigkeiten:** ZK-092.

## Release-Gates

### V1 Feature Complete

- Alle `P0`-Stories sind `Erledigt`.
- Der Katalog enthält mindestens 500 validierte, vollständige DE-/EN-Rezepte.
- Kein `P0`-Defekt ist offen; `P1`-Defekte sind bewertet.
- `pnpm check` ist grün.

### V1 Release Candidate

- Android-Smoke-Test im Flugmodus ist bestanden.
- Datenschutz-/Lizenzinventar stimmt mit Binärdatei und Netzwerkverhalten überein.
- Deep-Link-Verhalten mit installierter und nicht installierter App ist dokumentiert getestet.
- Accessibility-, Locale- und große-Schrift-Stichprobe ist bestanden.
- EAS-/Store-Gate wird separat aktiviert; lokale Feature-Fertigstellung hängt nicht davon ab.
