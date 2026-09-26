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

Startansicht ist ein nach Fragen gegliederter Denkraum. Acht Ansichten sind umschaltbar: Denkraum, Ereigniszeitstrahl, räumlicher Zeittunnel, Augustinus’ erlebte Zeit, Braudels Zeitschichten, Richtung/offene Wege, historischer Materialismus und Kreis/Spirale. Die Theoriekonzepte stehen nicht mehr als vermeintliche Fortschrittsstationen auf der Ereignisachse. Daten ihrer Texte bleiben in den Popups erhalten.

Die Wiederholungsfrage unterscheidet Rhythmus, historischen Vergleich und Nietzsches Wiederkunftsgedanken aus § 341 der Fröhlichen Wissenschaft. Der von der Lehrperson bereitgestellte Podcast ist als MP3 eingebunden; es wurde kein Transkript oder eine vermeintliche Zusammenfassung erzeugt. Der Player lädt Audio erst auf Anforderung. Zeitmarken und Hörnotizen können in den Arbeitsstand übernommen werden. Die rund 80-minütige Originaldatei wurde ohne inhaltlichen Schnitt auf 64 kbit/s Mono verkleinert; eingebettete Bearbeitungsmetadaten wurden entfernt. Die Webdatei umfasst ca. 37 MB.

Notizen zu den Darstellungsmodellen und zum Podcast werden lokal gespeichert, im Denkprotokoll angezeigt und mit exportiert. Die eigenständige Offline-HTML enthält auch den Podcast und ist daher rund 54 MB gross. Keine Laufzeitabhängigkeit von der ZDF-Referenz oder einem Sites-Projekt.

## Historischer Materialismus

Eigenständiges Wirkungsgefüge mit Einführung zu Marx und Engels, zwei Fällen (Fabrikarbeit und Saint-Domingue), wechselbaren Untersuchungen zu Produktivkräften, Produktionsverhältnissen und politischem Handeln. Hypothetische Folgen werden von historischen Befunden getrennt. Marx’ Entwicklungsannahmen von 1859 und Engels’ Wechselwirkungen von 1890 werden mit Primärtextnachweisen kritisch erschlossen; keine weltweite Epochenpflichtfolge. Fallbezogene Notizen und eigene Materialien im Begriffsfenster sind möglich.
