const fs = require('fs');
const PDFDocument = require('pdfkit');

function createPDF(title, contentLines, outputFilename) {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(outputFilename));

    // Simple Logo / Branding
    doc.fillColor('#f97316')
       .fontSize(30)
       .text('%', { continued: true })
       .fillColor('#0f172a')
       .fontSize(24)
       .text(' Baufinanz Service', { align: 'left' });
       
    doc.moveDown(2);

    // Title
    doc.fontSize(20)
       .fillColor('#0f172a')
       .text(title, { underline: true });
       
    doc.moveDown(1.5);

    // Content
    doc.fontSize(12)
       .fillColor('#334155');
       
    contentLines.forEach(line => {
        if(line.startsWith('##')) {
            doc.moveDown();
            doc.fontSize(16).fillColor('#0f172a').text(line.replace('##', '').trim());
            doc.fontSize(12).fillColor('#334155');
        } else if(line.startsWith('-')) {
            doc.text('  • ' + line.replace('-', '').trim(), { indent: 20 });
        } else {
            doc.text(line);
        }
        doc.moveDown(0.5);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('#94a3b8').text('© 2026 Baufinanz Service - Unverbindliche Informationen. www.baufinanz-service.de', { align: 'center', bottom: 30 });

    doc.end();
    console.log(`Created ${outputFilename}`);
}

const checkliste = [
    "Ihre Begleiter auf dem Weg ins Eigenheim.",
    "Nutzen Sie diese Checkliste, um beim Notar, der Bank oder der Hausbesichtigung an alles zu denken.",
    "## 1. Finanzielle Vorbereitung",
    "- Haushaltsrechnung aufstellen (Einnahmen vs. Ausgaben)",
    "- Vorhandenes Eigenkapital strukturiert erfassen",
    "- Maximale monatliche Rate definieren",
    "- Baufinanz Service einschalten für den ersten Machbarkeits-Check",
    "## 2. Die Hausbesichtigung",
    "- Grundriss prüfen: Passen Ihre Möbel rein?",
    "- Substanz prüfen: Heizungsanlage, Dach, Fenster, Keller (Feuchtigkeit?)",
    "- Energieausweis vorlegen lassen",
    "- Laufende Nebenkosten (Grundsteuer, Müllabfuhr) erfragen",
    "## 3. Unterlagen für die Bank",
    "- Gehaltsnachweise der letzten 3 Monate",
    "- Letzter Einkommensteuerbescheid",
    "- Eigenkapitalnachweis (Kontoauszüge)",
    "- Exposé der Immobilie",
    "- Grundbuchauszug (nicht älter als 3 Monate)",
    "- Flurkarte und Wohnflächenberechnung",
    "## 4. Der Kaufabschluss",
    "- Kaufvertragsentwurf vom Notar prüfen",
    "- Finanzierung verbindlich zusagen lassen VOR Notartermin",
    "- Notartermin wahrnehmen und Kaufvertrag unterschreiben",
    "- Nach Aufforderung Kaufpreis zahlen und Grundbucheintrag abwarten"
];

const zinsGuide = [
    "Schritt-für-Schritt Anleitung zu den besten Zinsen am Markt",
    "## 1. Vergleichen ist Pflicht",
    "- Die Hausbank bietet nur ihre eigenen Produkte. Ein freier Vermittler wie",
    "- Baufinanz Service vergleicht über 400 regionale und überregionale Banken.",
    "## 2. Eigenkapital strategisch einsetzen",
    "- Die Zinsen fallen in Stufen (z.B. bei 80% oder 60% Beleihung).",
    "- Setzen Sie so viel Eigenkapital wie möglich ein, um die Kaufnebenkosten",
    "- und idealerweise 10-20% des Kaufpreises zu decken.",
    "## 3. Zinsbindung weise wählen",
    "- In Niedrigzinsphasen: Lange Zinsbindung (15-20 Jahre) sichern.",
    "- Bei ohnehin hoher monatlicher Belastung schafft eine lange Bindung Sicherheit.",
    "## 4. Tilgung anpassen",
    "- Eine höhere anfängliche Tilgung (z.B. 3% statt 2%) reduziert die",
    "- Zinslast über die gesamte Laufzeit massiv.",
    "- Nutzen Sie das Recht auf Sondertilgungen (meist 5% p.a. kostenlos).",
    "## 5. Fördermittel nicht vergessen",
    "- Prüfen Sie KfW-Programme (z.B. klimafreundlicher Neubau, Wohneigentum",
    "- für Familien) auf zinsvergünstigte Kredite oder Zuschüsse.",
    "Unsere Experten stehen Ihnen jederzeit kostenfrei zur Verfügung."
];

createPDF('Die ultimative Checkliste für Ihren Hauskauf', checkliste, 'Checkliste-Hauskauf.pdf');
createPDF('Der Zins-Sichern Guide 2026', zinsGuide, 'Zins-Guide-2026.pdf');
