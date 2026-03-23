const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const newFooterHtml = `<div class="footer-links">
                <div class="link-col">
                    <h4>Unternehmen</h4>
                    <a href="ueber-uns.html">Über uns</a>
                    <a href="qualitaetsanspruch.html">Qualitätsanspruch</a>
                    <a href="fuer-berater.html">Für Berater</a>
                    <a href="faq.html">FAQ</a>
                </div>
                <div class="link-col">
                    <h4>Service & Rechner</h4>
                    <a href="rechner.html">Baufinanzierungsrechner</a>
                    <a href="bauzinsen-aktuell.html">Bauzinsen aktuell</a>
                    <a href="foerdermittel.html">Fördermittel-Check</a>
                    <a href="foerdermittel-abfrage.html">Fördermittel Abfrage</a>
                    <a href="quiz-haus-leisten.html">Haus-Leisten Quiz</a>
                </div>
                <div class="link-col">
                    <h4>Wissen & Ratgeber</h4>
                    <a href="ratgeber-eigenkapital.html">Ratgeber: Eigenkapital</a>
                    <a href="ratgeber-nebenkosten.html">Kaufnebenkosten Rechner</a>
                    <a href="ratgeber-wieviel-haus.html">Wie viel Haus kann ich mir leisten?</a>
                    <a href="ratgeber-ohne-eigenkapital.html">Ohne Eigenkapital finanzieren</a>
                    <a href="ratgeber-selbststaendige.html">Finanzierung für Selbstständige</a>
                </div>
                <div class="link-col">
                    <h4>Tipps & Rechtliches</h4>
                    <a href="ratgeber-zinsen-tipps.html">Tipps für günstigere Zinsen</a>
                    <a href="checkliste-hauskauf.html">Checkliste Hauskauf (PDF)</a>
                    <a href="zinsen-sichern-anleitung.html">Zins-Sichern Guide (PDF)</a>
                    <a href="impressum.html" style="margin-top: 1rem;">Impressum</a>
                    <a href="datenschutz.html">Datenschutz</a>
                    <a href="agb.html">AGB</a>
                </div>
            </div>`;

let count = 0;
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Regex to match '<div class="footer-links">' up to the closing tags right before '<div class="global-disclaimer">'
    const regex = /<div class="footer-links"[\s\S]*?<div class="global-disclaimer">/;
    
    if (regex.test(content)) {
        content = content.replace(regex, newFooterHtml + '\n        </div>\n        \n        <div class="global-disclaimer">');
        fs.writeFileSync(file, content);
        count++;
    }
}
console.log('Updated Footers in files: ' + count);
