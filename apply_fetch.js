const fs = require('fs');

// 1. Update script.js
let script = fs.readFileSync('script.js', 'utf8');
let oldMailto = `        // Trigger mailto Client 
        window.location.href = \`mailto:kontakt@baufinanz-service.de?subject=Neue%20Lead-Anfrage&body=\${dataStr}\`;

        // Proceed to success UI
        setTimeout(() => {
            // Hide progress form parts
            const progress = document.querySelector('.form-progress');
            if(progress) progress.style.display = 'none';
            
            // Show Success Step
            steps.forEach(step => step.classList.remove('active'));
            const successStep = document.getElementById('step-success');
            if(successStep) successStep.classList.add('active');
            
        }, 1000);`;

let newFetch = `        // Send data in background using FormSubmit.co Ajax API
        fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: 'Neuer Lead: Baufinanz Service',
                ...Object.fromEntries(fd)
            })
        })
        .then(response => response.json())
        .then(data => {
            const progress = document.querySelector('.form-progress');
            if(progress) progress.style.display = 'none';
            steps.forEach(step => step.classList.remove('active'));
            const successStep = document.getElementById('step-success');
            if(successStep) successStep.classList.add('active');
        })
        .catch(error => {
            const progress = document.querySelector('.form-progress');
            if(progress) progress.style.display = 'none';
            steps.forEach(step => step.classList.remove('active'));
            const successStep = document.getElementById('step-success');
            if(successStep) successStep.classList.add('active');
        });`;

if(script.includes(oldMailto)) {
    script = script.replace(oldMailto, newFetch);
    fs.writeFileSync('script.js', script);
    console.log('Updated script.js');
}

// 2. Update PDF Lead Magnets
function updatePdfPage(filename, subject, pdfName) {
    let html = fs.readFileSync(filename, 'utf8');
    
    let oldJsRegex = /            window\.location\.href \= \`mailto\:kontakt\@baufinanz\-service\.de\?subject[\s\S]*?\}, 1200\);/;
    
    let newJs = `            fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ _subject: '${subject}', ...Object.fromEntries(fd) })
            })
            .then(res => res.json())
            .then(data => {
                btn.style.display = 'none';
                document.getElementById('success-msg').innerHTML = 'Vielen Dank! <br><br><a href="#" download="${pdfName}" class="btn btn-primary" style="color:white; text-decoration:none; display:inline-block; margin-top:10px;">PDF Herunterladen <i data-lucide="download"></i></a>';
                document.getElementById('success-msg').style.display = 'block';
                lucide.createIcons();
            })
            .catch(err => {
                btn.style.display = 'none';
                document.getElementById('success-msg').innerHTML = 'Vielen Dank! <br><br><a href="#" download="${pdfName}" class="btn btn-primary" style="color:white; text-decoration:none; display:inline-block; margin-top:10px;">PDF Herunterladen <i data-lucide="download"></i></a>';
                document.getElementById('success-msg').style.display = 'block';
                lucide.createIcons();
            });`;
            
    if(html.match(oldJsRegex)) {
        html = html.replace(oldJsRegex, newJs);
        fs.writeFileSync(filename, html);
        console.log('Updated ' + filename);
    }
}

updatePdfPage('checkliste-hauskauf.html', 'Lead: Checkliste Hauskauf', 'Checkliste-Hauskauf.pdf');
updatePdfPage('zinsen-sichern-anleitung.html', 'Lead: Zinsen Sichern', 'Zins-Guide-2026.pdf');

// 3. Update FAQ Form
let faq = fs.readFileSync('faq.html', 'utf8');
let faqFormRegex = /<form action="mailto:kontakt@baufinanz-service\.de" method="POST" enctype="text\/plain">/;
if(faq.match(faqFormRegex)) {
    faq = faq.replace(faqFormRegex, '<form id="faq-form" onsubmit="return false;">');
    // Add custom JS at bottom
    let oldScript = /    <\/script>\n<\/body>/;
    let newScript = `        document.getElementById('faq-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.innerHTML = 'Wird gesendet... <i data-lucide="loader-2" class="spin"></i>';
            lucide.createIcons();
            btn.disabled = true;

            const fd = new FormData(this);
            fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ _subject: 'Neue FAQ Anfrage', ...Object.fromEntries(fd) })
            })
            .then(() => {
                this.innerHTML = '<div style="text-align:center; padding:2rem; background:rgba(16,185,129,0.1); color:var(--success); border-radius:var(--radius-md);">Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze.</div>';
            })
            .catch(() => {
                this.innerHTML = '<div style="text-align:center; padding:2rem; background:rgba(16,185,129,0.1); color:var(--success); border-radius:var(--radius-md);">Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze.</div>';
            });
        });
    </script>
</body>`;
    faq = faq.replace(oldScript, newScript);
    fs.writeFileSync('faq.html', faq);
    console.log('Updated faq.html');
}
