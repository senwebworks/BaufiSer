const fs = require('fs');

function updatePdfPage(filename, subject, pdfName) {
    let html = fs.readFileSync(filename, 'utf8');
    
    // Replace success message HTML
    html = html.replace(/<div id="success-msg"[\s\S]*?<\/div>/, '<div id="success-msg" style="display: none; text-align: center; margin-top: 1.5rem; padding: 1rem; background: rgba(16,185,129,0.1); border-radius: var(--radius-sm); color: var(--success); font-weight: 500;"></div>');
    
    // Replace JS timeout logic
    let oldJs = `            setTimeout(() => {
                btn.style.display = 'none';
                document.getElementById('success-msg').style.display = 'block';
            }, 1200);`;
    
    let newJs = `            const fd = new FormData(this);
            const dataStr = Array.from(fd.entries()).map(x => \`\${x[0]}: \${x[1]}\`).join('%0D%0A');
            window.location.href = \`mailto:kontakt@baufinanz-service.de?subject=${subject}&body=\${dataStr}\`;
            
            setTimeout(() => {
                btn.style.display = 'none';
                document.getElementById('success-msg').innerHTML = 'Vielen Dank! <br><br><a href="#" download="${pdfName}" class="btn btn-primary" style="color:white; text-decoration:none; display:inline-block; margin-top:10px;">PDF Herunterladen <i data-lucide="download"></i></a>';
                document.getElementById('success-msg').style.display = 'block';
                lucide.createIcons();
            }, 1200);`;
            
    if(html.includes(oldJs)) {
        html = html.replace(oldJs, newJs);
        fs.writeFileSync(filename, html);
        console.log('Fixed PDF logic: ' + filename);
    }
}

updatePdfPage('checkliste-hauskauf.html', 'Lead: Checkliste Hauskauf', 'Checkliste-Hauskauf.pdf');
updatePdfPage('zinsen-sichern-anleitung.html', 'Lead: Zinsen Sichern', 'Zins-Guide-2026.pdf');

// Rechner HTML Form Injection
let index = fs.readFileSync('index.html', 'utf8');
let formRegex = /<form id="lead-form" class="lead-form">[\s\S]*?<\/form>/;
let match = index.match(formRegex);
if(match) {
    let formHtml = match[0];
    let rechner = fs.readFileSync('rechner.html', 'utf8');
    
    let boxRegex = /<div style="margin-top: 3rem; background: rgba\(255,255,255,0\.05\); padding: 2rem; border-radius: var\(--radius-sm\); border: 1px solid rgba\(255,255,255,0\.1\);">[\s\S]*?<\/div>/;
    
    if(rechner.match(boxRegex)) {
        rechner = rechner.replace(boxRegex, `<div style="margin-top: 3rem; color: var(--text-main); text-align: left;">
            <h3 style="color: var(--white); margin-bottom: 2rem;">Zinssatz jetzt konkret anfragen</h3>
            <div class="hero-form-wrapper" style="background: var(--white); border-radius: var(--radius-lg); overflow: hidden;">\n` + formHtml + `\n</div></div>`);
        fs.writeFileSync('rechner.html', rechner);
        console.log('Injected form into rechner.html');
    }
}
