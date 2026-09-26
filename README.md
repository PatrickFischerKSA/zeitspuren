# Zeitspuren

Interaktive Lerneinheit zu Zeitstrahl, Epochen, historischem Denken und Erinnerung. Für die gymnasiale Sekundarstufe mit offenen, anspruchsvollen Denkaufträgen; Begriffe werden in den Popups erklärt. Keine Modulfolge.

## Start

`output/Zeitspuren.html` ist eine eigenständige HTML-Datei mit eingebetteten Bildern. Im aktuellen Browser öffnen; kein Server und keine Installation nötig. Falls ein Browser bei lokal geöffneten Dateien dauerhafte Speicherung einschränkt, den Arbeitsstand über den Export sichern oder die Webfassung verwenden.

`output/Zeitspuren-Webpaket.zip` enthält die Webfassung. Entpacken und `index.html` über einen statischen Webserver anbieten; ebenso als HTML-Dateipaket in einer geeigneten Moodle-Dateiaktivität einsetzbar (index.html als Hauptdatei, Darstellung in neuem Fenster). Das Paket ist kein SCORM-Kurs und hat keine LMS-Notenübertragung.

GitHub Pages: https://patrickfischerksa.github.io/zeitspuren/

Die Website wird aus `docs/` auf dem Branch `main` veröffentlicht. Alle für die Ausführung nötigen Skripte, Stile und Bilder liegen im Repository. Keine Laufzeitabhängigkeit von ChatGPT Sites; Quellenlinks dienen ausschliesslich als Nachweise. Die genannten Offline-Pakete gehören zur lokalen Arbeitsfassung.

## Didaktischer Gebrauch

- Mit «Was ist Geschichte?» eine erste Definition formulieren, nach der Arbeit an mehreren Quellen überarbeiten.
- Einträge öffnen, Material und Herstellungskontext unterscheiden, zunächst selbst deuten, danach die Denkhilfe nutzen.
- Dieselbe Spur aus politischer, sozialer, geschlechtergeschichtlicher, globaler oder umwelthistorischer Perspektive befragen.
- Zwei Spuren mit Behauptung, Beleg und Gegenargument verbinden. Zeitliche Nachbarschaft ist ausdrücklich kein automatischer Kausalzusammenhang.
- Epochenentwürfe mit Kriterium, Raum, Gruppe und Gegenbeispiel begründen. Frühere Entwürfe bleiben im Denkprotokoll.
- Proportionale Achse und Leseraster vergleichen: Der Zeitstrahl wird selbst zum Erkenntnisgegenstand.
- Eigene Ereignisse oder Zeiträume, Quellen, Datierungen, Unsicherheiten und Materialien ergänzen.

44 Ausgangsspuren, zusätzliche Begriffsfenster, 132 offene Denkaufträge an den datierten Spuren, Denkhilfen und Quellenangaben. Enthalten: Augustinus, Hegel, Nietzsche, Bloch, Braudel, Halbwachs, Jan und Aleida Assmann sowie Koselleck. Eigene Beiträge werden nicht automatisch inhaltlich benotet.

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

Die verlinkte Lernseite wurde in 13 zusätzliche Zeitstrahlfenster und Verbindungen zu bestehenden Spuren umgearbeitet: Neolithisierung, Göbekli Tepe, Çatalhöyük, alpine Seeufersiedlungen, Athen, Helvetier, römische Infrastruktur, Münzfund Ueken, mittelalterlicher Alltag, Quellenkritik am «Kinderkreuzzug», Amerika 1491, Harari versus Graeber/Wengrow sowie Umweltgeschichte. Zwölf eigene schematische Denkbilder ergänzen die historischen Bildquellen; sie sind ausdrücklich keine Rekonstruktionen. Die dort genannten Videos und Dossiers wurden nicht pauschal als eigenständig ausgewertet ausgegeben. Keine Modulschranken oder automatische Benotung wurden übernommen.

## Direkte Harari-Lektüre

Das bereitgestellte PDF von Hararis deutscher Ausgabe (DVA 2013, 540 PDF-Seiten) wurde anhand ausgewählter Passagen thematisch ausgewertet: Geschichtsdefinition und Revolutionen (Kap. 1), Kooperation und Institutionen (Kap. 2), Landwirtschaft (Kap. 5), intersubjektive Ordnung (Kap. 6), globale Verflechtung (Kap. 9), Geld (Kap. 10), Kontingenz (Kap. 13) und Fortschritt/Glück (Kap. 19). Acht bestehende Popups enthalten eine aufklappbare kritische Lektüre mit genauen PDF-Fundstellen; zwei zusätzliche Theorie-Spuren behandeln geteilte Ordnungen und historische Möglichkeiten. Darstellungsaussagen, didaktische Gegenfragen und Befunde sind getrennt. Das Buch und die Arbeitsextraktion werden nicht mit ausgeliefert.
