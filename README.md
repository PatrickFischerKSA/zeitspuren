# Zeitspuren

Interaktive Lerneinheit zu Zeitstrahl, Epochen, historischem Denken und Erinnerung. Für die gymnasiale Sekundarstufe mit offenen, anspruchsvollen Denkaufträgen; Begriffe werden in den Popups erklärt. Keine Modulfolge.

## Start

Die veröffentlichte Lerneinheit: https://patrickfischerksa.github.io/zeitspuren/

GitHub Pages veröffentlicht `docs/` vom Branch `main`. Alle für die Ausführung nötigen Texte, Skripte, Stile und Bilder liegen hier. Keine Laufzeitabhängigkeit von ChatGPT Sites; Quellenlinks dienen ausschliesslich als Nachweise. Die Original-PDFs und private Moodle-Dateien sind nicht enthalten.

## Umzug und Sicherung

Vor dem Wechsel auf einer bisherigen Fassung «Arbeitsstand sichern» wählen. Die JSON-Datei enthält eigene Einträge, Materialien, Notizen und Beziehungen. Auf der GitHub-Seite über «Importieren» einlesen und kontrollieren. Browserspeicher wird zwischen unterschiedlichen Webadressen nicht automatisch übertragen.

Nach Prüfung der neuen Website und Sicherung bisheriger Arbeitsstände kann das zugehörige Sites-Projekt unabhängig entfernt werden. Das Löschen wurde bei der Veröffentlichung nicht ausgeführt.

## Didaktischer Gebrauch

- Mit «Was ist Geschichte?» eine erste Definition formulieren, nach der Arbeit an mehreren Quellen überarbeiten.
- Einträge öffnen, Material und Herstellungskontext unterscheiden, zunächst selbst deuten, danach die Denkhilfe nutzen.
- Je nach Gegenstand eine Bildlegende redigieren, einen Datierungsschluss prüfen, ein Argument untersuchen oder verschiedene Zeitordnungen erproben.
- Zwei Spuren mit Behauptung, Beleg und Gegenargument verbinden. Zeitliche Nachbarschaft ist ausdrücklich kein automatischer Kausalzusammenhang.
- Epochenentwürfe mit Kriterium, Raum, Gruppe und Gegenbeispiel begründen. Frühere Entwürfe bleiben im Denkprotokoll.
- Proportionale Achse und Leseraster vergleichen: Der Zeitstrahl wird selbst zum Erkenntnisgegenstand.
- Eigene Ereignisse oder Zeiträume, Quellen, Datierungen, Unsicherheiten und Materialien ergänzen.

44 Ausgangsspuren, zusätzliche Begriffsfenster, individuell ausgearbeitete Arbeitsaufträge an den datierten Spuren, Denkhilfen und Quellenangaben. Enthalten: Augustinus, Hegel, Nietzsche, Bloch, Braudel, Halbwachs, Jan und Aleida Assmann sowie Koselleck. Eigene Beiträge werden nicht automatisch inhaltlich benotet.

## Materialien

Die beiden vom Auftraggeber bereitgestellten PDFs wurden gelesen und kritisch verarbeitet, nicht als unbearbeitete Downloads eingebunden. Quellenbilder daraus dienen als Analysegegenstände. Der sachfremde zweite NZZ-Artikel blieb unberücksichtigt.

Im angemeldeten Moodle-Kurs «Geschichte HuI, Materialien alle Klassen» (Kurs 15) wurde die Ressource «Zeittafeln» vollständig ausgewertet: Christoph Pallaske, zeittafelgeschichte, Version 3.4, 2006–2010. Sie wird in einer eigenen Spur quellenkritisch untersucht. Andere bloss gesichtete Kurstitel sind nicht als ausgewertete Inhalte ausgegeben. Es werden keine Moodle-Ressourcen direkt verlinkt und keine Zugangsdaten verarbeitet.

Weitere Fachquellen und Bildnachweise sind in der App unter «Quellen & Hinweise» und in den jeweiligen Popups dokumentiert. Alle erklärenden Texte sind didaktische Paraphrasen; Zitate sind nicht vorgetäuscht. Bildentstehung, Ereignisdatum und moderne Reproduktion werden auseinandergehalten.

## Arbeitsstände

- Eigene Einträge, Notizen, Beziehungen, Epochengrenzen und Materialien: IndexedDB, auf dem jeweiligen Gerät und im jeweiligen Browser.
- Kein Serverupload von Schülerdaten, keine Konten, kein gemeinsamer Klassenspeicher.
- Export als JSON enthält auch Dateianhänge. Browserdaten zu löschen kann den lokalen Arbeitsstand entfernen.
- Import auf leerem Arbeitsstand stellt auch den Epochenentwurf wieder her. Bei vorhandenen Daten wird zusammengeführt; abweichende Ereignisfassungen bleiben separat, abweichende Notizen werden angehängt und importierte Epochenentwürfe im Verlauf abgelegt.
- Anhänge: JPEG, PNG, WebP, PDF, TXT, MP3 bis 8 MB je Datei. Importierte Sicherungen bis 70 MB.
- Der lokale Browserbestand ist nicht Bestandteil des auszuliefernden HTML- oder ZIP-Pakets.

## Prüfung

JavaScript-Syntax sowie Daten-, Quellen-, Bild- und Beziehungsreferenzen geprüft. Tests für Jahresabstand ohne Jahr null, Sicherungs-Rundlauf mit Material, Notiz und Relation, ungültige Daten und sichere Textausgabe: `node tests/check.cjs`.

Im Browser geprüft: eigenen Eintrag anlegen, Notiz, Verbindung, Textanhang, Persistenz nach Neuladen, Testeintrag entfernen, Epochenschieber und Popupdarstellung. Testinhalte wurden wieder entfernt.

## Ergänzung: Geschichte bis 1500

Die verlinkte Lernseite wurde in 13 zusätzliche Zeitstrahlfenster und Verbindungen zu bestehenden Spuren umgearbeitet: Neolithisierung, Göbekli Tepe, Çatalhöyük, alpine Seeufersiedlungen, Athen, Helvetier, römische Infrastruktur, Münzfund Ueken, mittelalterlicher Alltag, Quellenkritik am «Kinderkreuzzug», Amerika 1491, Harari versus Graeber/Wengrow sowie Umweltgeschichte. Die historischen Bildquellen werden durch fallbezogene Materialkarten ergänzt. Erfundene Übungsfälle sind ausdrücklich gekennzeichnet. Die dort genannten Videos und Dossiers wurden nicht pauschal als eigenständig ausgewertet ausgegeben. Keine Modulschranken oder automatische Benotung wurden übernommen.

## Direkte Harari-Lektüre

Das bereitgestellte PDF von Hararis deutscher Ausgabe (DVA 2013, 540 PDF-Seiten) wurde anhand ausgewählter Passagen thematisch ausgewertet: Geschichtsdefinition und Revolutionen (Kap. 1), Kooperation und Institutionen (Kap. 2), Landwirtschaft (Kap. 5), intersubjektive Ordnung (Kap. 6), globale Verflechtung (Kap. 9), Geld (Kap. 10), Kontingenz (Kap. 13) und Fortschritt/Glück (Kap. 19). Acht bestehende Popups enthalten eine aufklappbare kritische Lektüre mit genauen PDF-Fundstellen; zwei zusätzliche Theorie-Spuren behandeln geteilte Ordnungen und historische Möglichkeiten. Darstellungsaussagen, didaktische Gegenfragen und Befunde sind getrennt. Das Buch und die Arbeitsextraktion werden nicht mit ausgeliefert.

## Redaktionelle Überarbeitung

Alle 44 Zeitstrahlfenster und beide Begriffsfenster erhalten je einen eigens ausgearbeiteten Fall, unmittelbar verfügbare Arbeitsgrundlagen, zwei oder drei inhaltlich passende Tätigkeiten, ein konkretes Ergebnis und einen fallbezogenen Hinweis. Fehlende Originalauszüge werden nicht vorgetäuscht; modellhafte Beispiele sind ausdrücklich als erfunden markiert. Harari wird vor den Lektürevergleichen mit Biographie, Leitfrage, Alltagsbeispiel, Begriffserklärung und den Grenzen seines Ansatzes eingeführt. Die Inhalte dieser Überarbeitung liegen in `editorial.js`.

## Darstellungsformen und Podcast

Der Denkraum erschliesst die Begriffe nach Fragen. Die Startansicht zeigt den gesamten Bestand im historischen Materialismus. Zehn Ansichten sind umschaltbar: Denkraum, Ereigniszeitstrahl, räumlicher Zeittunnel, Augustinus’ erlebte Zeit, Braudels Zeitschichten, Richtung/offene Wege, mittelalterliche Geschichtsbilder, altägyptische Geschichtsbilder, historischer Materialismus und Kreis/Spirale. Die Theoriekonzepte stehen nicht mehr als vermeintliche Fortschrittsstationen auf der Ereignisachse. Daten ihrer Texte bleiben in den Popups erhalten.

Die Wiederholungsfrage unterscheidet Rhythmus, historischen Vergleich und Nietzsches Wiederkunftsgedanken aus § 341 der Fröhlichen Wissenschaft. Der von der Lehrperson bereitgestellte Podcast ist als MP3 eingebunden; es wurde kein Transkript oder eine vermeintliche Zusammenfassung erzeugt. Der Player lädt Audio erst auf Anforderung. Zeitmarken und Hörnotizen können in den Arbeitsstand übernommen werden. Die rund 80-minütige Originaldatei wurde ohne inhaltlichen Schnitt auf 64 kbit/s Mono verkleinert; eingebettete Bearbeitungsmetadaten wurden entfernt. Die Webdatei umfasst ca. 37 MB.

Notizen zu den Darstellungsmodellen und zum Podcast werden lokal gespeichert, im Denkprotokoll angezeigt und mit exportiert. Die eigenständige Offline-HTML enthält auch den Podcast und ist daher rund 65 MB gross. Keine Laufzeitabhängigkeit von der ZDF-Referenz oder einem Sites-Projekt.

## Historischer Materialismus

Eigenständiges Wirkungsgefüge mit Einführung zu Marx und Engels, zwei Fällen (Fabrikarbeit und Saint-Domingue), wechselbaren Untersuchungen zu Produktivkräften, Produktionsverhältnissen und politischem Handeln. Hypothetische Folgen werden von historischen Befunden getrennt. Marx’ Entwicklungsannahmen von 1859 und Engels’ Wechselwirkungen von 1890 werden mit Primärtextnachweisen kritisch erschlossen; keine weltweite Epochenpflichtfolge. Fallbezogene Notizen und eigene Materialien im Begriffsfenster sind möglich.

## Mittelalterliche und altägyptische Geschichtsbilder

Zwei eigenständige Modi mit je drei Zugängen: Sechs-Weltalter-Schema, Kirchenjahr und Weltchronik/Herrschaft; solare Erneuerung, Regierungsjahre/selektive Königslisten und Maʿat. Die Darstellung unterscheidet historische Perspektiven von heutigen Epochenbegriffen und vermeidet die pauschale Gleichsetzung «Mittelalter = linear, Ägypten = zyklisch». Eine Getty-Buchmalerei und zwei Ansichten eines Met-Skarabäus liegen mit CC0/Public-Domain-Nachweisen lokal vor. Ein Schalter macht die Wirkung einer Auslassung in einer erfundenen Königsliste sichtbar. Alle sechs Zugänge haben eigene Aufgaben und gespeicherte Notizen; die Begriffsfenster ermöglichen eigene Materialien.

## Perspektiven auf den gesamten Bestand

Die acht Konzeptansichten erschliessen nun denselben vollständigen Bestand aus Ereignissen, Begriffen und eigenen Einträgen. Suche und Eigenfilter gelten übergreifend. Die ausgewählte Spur bleibt beim Wechsel erhalten; eine zweite Umschaltung steht direkt bei der ausgewählten Spur. Individuelle Schwerpunkte ordnen Einträge in das jeweilige Modell ein. Zuordnungen sowie ereignis- und konzeptbezogene Begründungen werden lokal gespeichert und exportiert; alte Sicherungen bleiben lesbar. Importierte abweichende Zuordnungen werden als Alternativen in der Deutungsnotiz erhalten. Die bisherigen kuratierten Fallstudien sind über «Einführung & ausgearbeitete Beispiele» weiterhin zugänglich, aber nicht mehr die Hauptansicht eines Konzepts. Keine automatische Deutung eines beliebigen Ereignisses wird als Quellenbefund ausgegeben.

Die Modellgrafiken enthalten sämtliche gefilterten Spuren als anklickbare, nummerierte Punkte. Spirale, Kreis, Gegenwartsordnung, Schichten, Wirkungsgefüge und heilsgeschichtlicher Bogen sind ausdrücklich gekennzeichnete Denkfiguren; Positionen werden nicht als automatisch erschlossene historische Deutungen ausgegeben. Nummern verbinden Grafik und Bildkarten.

## Vollständiger Bestand in allen elf Modi

Zeitstrahl, Zeittunnel und Denkraum verwenden nun denselben vollständigen Bestand wie die acht Konzeptansichten: 48 datierte Ausgangsspuren und sechs undatierte Begriffsfenster, ergänzt um eigene Einträge. Im Zeitstrahl stehen undatierte Begriffe neben der Jahresachse; datierte Theorieeinträge werden in einer ausdrücklich als Text-/Bezugsdaten gekennzeichneten Spur gezeigt. Im Zeittunnel folgen undatierte Begriffe als gesonderter Begriffsraum, ohne behauptete zeitliche Nachordnung. Der Denkraum zeigt zusätzlich zu den Fragegruppen sämtliche Spuren mit ihren Beziehungen. Suche und Eigenfilter gelten in jedem Modus. Automatisierte Prüfungen vergleichen die vollständigen Eintragsmengen aller elf Ansichten einschliesslich eigener Theorieeinträge und leerer Suchergebnisse.


## Bilder, kurze Filme und Originaltöne

17 zusätzliche Bildquellen mit Urheberschaft, Lizenz, Bilddatum und eigener Beobachtungsfrage. Rekonstruktionen und spätere Geschichtsbilder sind ausdrücklich eingeordnet. Grössere Bildkarten und ein bildlicher Einstieg führen zu denselben Einträgen in allen elf Modi.

Vier neue Spuren: Apollo 11 (1969), Berliner Grenzöffnung (1989), Pariser Klimaabkommen (2015) und technisch vermittelte Marsaufnahmen (2021). Sie ergänzen den Originalton Emilie Lieberherrs beim bestehenden Frauenstimmrecht-Eintrag. Insgesamt sieben Film-/Tonangebote: drei Audios, ein direkt eingebundenes Archivvideo und drei offizielle YouTube-Videos. Für längere Videos ist ein zweiminütiger Arbeitsabschnitt eingestellt.

Die Player verbinden sich erst nach «Video laden» / «Ton laden» mit dem jeweiligen Anbieter und starten nicht automatisch. Der Quellenlink bleibt immer sichtbar. Beim Schliessen oder Wechseln eines Popups stoppt die Wiedergabe. Beobachtungen lassen sich mit aktuellem Zeitcode bei nativen Playern bzw. einem Platzhalter beim YouTube-Player in die bestehenden, exportierbaren Notizen übernehmen. Zu jedem Medium gibt es Einordnung, eine eigene Untersuchungsfrage und eine textliche Alternative. Kein ungeprüftes Volltranskript.

Externe Filme und Töne benötigen Internet und bleiben bei ihren Anbietern (NASA, SRF, Bundesregierung/Bundesarchiv, UN/YouTube); sie sind nicht in der Offline-HTML enthalten. Die lokal gespeicherten Bilder und der bereits bereitgestellte Podcast bleiben offline verfügbar. Anbieter können Einbettung und regionale Verfügbarkeit ändern.

Eigene MP3-Dateien und Kurzvideos (MP4/WebM, jeweils bis 8 MB) können als Material ergänzt und direkt im Popup abgespielt werden. Sie bleiben lokal und werden im Arbeitsstand exportiert.


## Navigation und Memoria

Die Seite startet im Zeitstrahl. Drei kompakte Ansichten (Zeitstrahl, Zeittunnel, Denkraum) stehen neben einer Auswahl von acht Geschichtsbildern. Jeder Ansatz hat eine eigene grafische Darstellung und eine Erklärung ihrer Aussage und Grenzen. Die Grundfragen «Was ist Geschichte?» und «Epochen sind Vorschläge» sowie der Memoria-Zugang beginnen die obere Bildstrecke. Der bisherige grosse Block undatierter Begriffe entfällt; ein standardmässig geschlossenes Nachschlagefeld unterhalb der Achse erhält den vollständigen Zugriff auf den Bestand.

Memoria ist ein eigener elfter Darstellungsmodus für alle Spuren, einschliesslich neuer eigener Einträge. Überlappende Erinnerungsräume zeigen soziale Beziehungen und kulturelle Vermittlung. Die vier frei begründbaren Untersuchungsschwerpunkte sind soziale Rahmen, alltägliche Weitergabe, kulturelle Formen sowie Auswahl/Auslassung. Halbwachs und Jan Assmann werden direkt eingeführt und in einem gemeinsamen Erklärfenster unterschieden; ausführliche bestehende Untersuchungsaufträge bleiben erreichbar. Keine automatische Gleichsetzung eines Ereignisses mit seiner späteren Erinnerung. Zuordnungen und Notizen nutzen denselben Export-/Importmechanismus wie die übrigen Geschichtsbilder.

## Lokalgeschichte Zürichsee bis Chur
Zwölf Quellenfenster von Zürich-Parkhaus Opéra bis zum Welterbe 2011: Chur-Welschdörfli, Rapperswil–Hurden, Zürcher Reformation, Käpfnach, Linthkorrektion, Spinnerei Murg (Gründung und Schliessung), Ragaz, Eisenbahn und Heidi. Sechs zusätzliche lizenzierte Quellenbilder mit Nachweisen. Der Raumfilter gilt in allen Darstellungsmodi; eigene Einträge können derselben Spur zugeordnet werden. Moderne Ansichten und Vergleichsbilder sind ausdrücklich von historischen Ereignissen unterschieden.

Kategorien lassen sich einzeln über Checkboxen kombinieren. «Alle einschalten» und «Alle ausschalten» erleichtern die Auswahl. Sie gilt bis zum Neuladen über alle Ansichten hinweg; undatierte Begriffe gehören zu «Zeit, Wissen & Erinnerung».

Der Zeittunnel ist ein perspektivischer Zeitkorridor mit getrennten Kategorienachsen und gemeinsamen Zeitebenen. Stufenlose Jahresnavigation per Regler, Jahrfeld, Scrollen, Pfeiltasten und Touch-Geste; automatische Zeitfahrt in beide Richtungen; drehbarer Blick und einstellbarer Jahresmassstab. Quellen bleiben im sichtbaren Zeitraum sowie in einem vollständigen Register erreichbar. Undatierte Begriffe liegen ausserhalb der Zeitachse.

## Weltgeschehen durch Geschichtsbilder betrachten
Der Hauptzugang «Weltbilder» öffnet acht eigenständige Ansichten desselben Weltgeschehens. Standjahr, Zeitfenster und Kategorien bleiben beim Perspektivwechsel erhalten. Gegenwärtige Ereignisse können unter einem Heilshorizont, als Erneuerung, in materiellen Beziehungen, Wiederholungszyklen, Fortschrittsannahmen, Zeitschichten, Erwartungshorizonten oder Erinnerungsselektionen betrachtet werden. Ein Schalter nimmt die jeweilige Bildannahme zurück; individuell erläuterte Potenziale, Grenzen und Gegenprüfungen begleiten die Quellenarbeit. Eigene Deutungen werden weiterhin im Arbeitsstand gesichert. Alle Einträge bleiben im Register erreichbar; «Gesamte Zeit» zeigt sämtliche datierten Spuren der Auswahl.

Die teleologischen Ansichten beginnen mit einer offenen Zielfrage. Zielvorstellung, Standpunkt, Begründung einer behaupteten Notwendigkeit und möglicher Gegenbefund werden im Denkprotokoll gespeichert. Ein formuliertes Ziel erscheint als Vorschlag in der Grafik; das begründete Offenlassen ist ausdrücklich möglich.
