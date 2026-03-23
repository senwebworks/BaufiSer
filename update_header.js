const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const newHeader = `<header class="main-header">
        <div class="container header-container">
            <a href="index.html" class="logo">
                <i data-lucide="percent"></i>
                <span>Baufinanz Service</span>
            </a>
            <nav class="main-nav" id="main-nav">
                <a href="index.html#so-funktionierts">So funktioniert's</a>
                <a href="bauzinsen-aktuell.html">Aktuelle Zinsen</a>
                <a href="foerdermittel.html">Fördermittel</a>
                <a href="rechner.html">Rechner</a>
            </nav>
            <div class="header-cta" id="header-cta">
                <a href="index.html#hero-form" class="btn btn-outline" style="border-width: 2px;">Angebot einholen</a>
            </div>
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu Toggle">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </header>`;

let count = 0;
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace existing <header class="main-header"> ... </header>
    const regex = /<header class="main-header">[\s\S]*?<\/header>/;
    
    if (regex.test(content)) {
        content = content.replace(regex, newHeader);
        fs.writeFileSync(file, content);
        count++;
    }
}
console.log('Updated Headers in files: ' + count);

// Also append to style.css for 5-star fill
let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('.stars svg {')) {
    css += '\n\n/* Fill Stars */\n.stars svg {\n    fill: var(--accent-color);\n    color: var(--accent-color);\n}\n';
    
    // Also adjust footer link text size if requested "falls alles zu eng wird"
    // Let's make .footer-links a smaller
    if(css.includes('.link-col a {') && !css.includes('font-size: 0.9rem;')) {
        css = css.replace('.link-col a {\n    display: block;', '.link-col a {\n    display: block;\n    font-size: 0.9rem;');
    } else if (!css.includes('.link-col a {')) {
        css += '\n.link-col a { font-size: 0.85rem; }\n';
    }
    
    fs.writeFileSync('style.css', css);
}
