const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const newFooterHtml = `<div class="footer-links">
                <div class="link-col">
                    <h4>Unternehmen</h4>
                    <a href="ueber-uns.html">Über uns</a>
                    <a href="fuer-berater.html">Für Berater</a>
                    <a href="faq.html">FAQ</a>
                    <a href="rechner.html">Baufi-Rechner</a>
                    <a href="bauzinsen-aktuell.html">Bauzinsen aktuell</a>
                    <a href="foerdermittel.html">Fördermittel</a>
                </div>
                <div class="link-col">
                    <h4>Ratgeber Wissen</h4>
                    <a href="ratgeber-eigenkapital.html">Eigenkapital</a>
                    <a href="ratgeber-nebenkosten.html">Nebenkosten</a>
                    <a href="ratgeber-wieviel-haus.html">Wie viel Haus?</a>
                    <a href="ratgeber-ohne-eigenkapital.html">Ohne Eigenkapital</a>
                    <a href="ratgeber-selbststaendige.html">Für Selbstständige</a>
                </div>
                <div class="link-col">
                    <h4>Tipps & Specials</h4>
                    <a href="ratgeber-zinsen-tipps.html">Zinsen Tipps</a>
                    <a href="ratgeber-direktbank-vs-vermittler.html">Bank vs Vermittler</a>
                    <a href="ratgeber-zinsbindung.html">Zinsbindung</a>
                    <a href="ratgeber-tilgungsplan.html">Tilgungsplan</a>
                    <a href="checkliste-hauskauf.html">Checkliste (PDF)</a>
                    <a href="zinsen-sichern-anleitung.html">Zins-Guide (PDF)</a>
                </div>
                <div class="link-col">
                    <h4>Rechtliches</h4>
                    <a href="impressum.html">Impressum</a>
                    <a href="datenschutz.html">Datenschutz</a>
                    <a href="agb.html">AGB</a>
                </div>
            </div>`;

let count = 0;
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Regex to match '<div class="footer-links">' until the first '<div class="global-disclaimer">'
    const regex = /<div class="footer-links">[\s\S]*?<div class="global-disclaimer">/;
    
    if (regex.test(content)) {
        content = content.replace(regex, newFooterHtml + '\n        </div>\n        \n        <div class="global-disclaimer">');
        
        // Add favicon
        if (content.includes('</title>') && !content.includes('favicon.svg')) {
            content = content.replace('</title>', '</title>\n    <link rel="icon" href="favicon.svg" type="image/svg+xml">');
        }

        fs.writeFileSync(file, content);
        count++;
    }
}
console.log('Updated HTML files: ' + count);
fs.writeFileSync('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>`);
