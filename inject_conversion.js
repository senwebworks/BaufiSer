const fs = require('fs');
const path = require('path');

const conversionFunc = `
    <script>
    function gtag_report_conversion(url) {
      var callback = function () {
        if (typeof(url) != 'undefined') {
          window.location = url;
        }
      };
      if(typeof gtag === 'function') {
          gtag('event', 'conversion', {
              'send_to': 'AW-18035977310/xYryCL7Yno4cEN7YnJhD',
              'value': 1.0,
              'currency': 'EUR',
              'event_callback': callback
          });
      }
      return false;
    }
    </script>
</head>`;

const dir = './';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (path.extname(file) === '.html') {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Inject gtag_report_conversion before </head>
        if (!content.includes('gtag_report_conversion')) {
            content = content.replace('</head>', conversionFunc);
            fs.writeFileSync(filePath, content);
            console.log(`Injected gtag_report_conversion into ${file}`);
        }
    }
});

// Update script.js
let scriptJs = fs.readFileSync('script.js', 'utf8');
const oldJsGtag = `            // Google Ads Conversion Tracking
            if(typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-18035977310/xYryCL7Yno4cEN7YnJhD',
                    'value': 1.0,
                    'currency': 'EUR'
                });
            }`;
if(scriptJs.includes(oldJsGtag)) {
    scriptJs = scriptJs.replace(oldJsGtag, '            if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();');
    fs.writeFileSync('script.js', scriptJs);
    console.log('Updated script.js');
}

// Update specific HTML files with inline replacements
function replaceInlineGtag(filename) {
    let html = fs.readFileSync(filename, 'utf8');
    if(html.includes(oldJsGtag)) {
        html = html.replace(oldJsGtag, '                if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();');
        fs.writeFileSync(filename, html);
        console.log(`Updated ${filename} tracking`);
    }
}
replaceInlineGtag('checkliste-hauskauf.html');
replaceInlineGtag('zinsen-sichern-anleitung.html');
replaceInlineGtag('faq.html');

// Fix quiz-haus-leisten.html -> Add FormSubmit fetch + track
let quizHtml = fs.readFileSync('quiz-haus-leisten.html', 'utf8');
quizHtml = quizHtml.replace('<input type="text" required placeholder="Max Mustermann"', '<input type="text" name="Name" required placeholder="Max Mustermann"');
quizHtml = quizHtml.replace('<input type="email" required placeholder="max@beispiel.de"', '<input type="email" name="Email" required placeholder="max@beispiel.de"');
quizHtml = quizHtml.replace('<input type="tel" required placeholder="Nur für wichtige', '<input type="tel" name="Telefon" required placeholder="Nur für wichtige');
quizHtml = quizHtml.replace('<form onsubmit="submitQuiz(event)">', '<form id="quiz-form" onsubmit="submitQuiz(event)">');

const oldQuizSubmit = `            setTimeout(() => {
                nextStep(6);
            }, 1500);`;
const newQuizSubmit = `            const fd = new FormData(document.getElementById('quiz-form'));
            fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ _subject: 'Lead: Hausleisten Quiz', ...Object.fromEntries(fd) })
            })
            .then(() => {
                if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();
                nextStep(6);
            })
            .catch(() => {
                if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();
                nextStep(6);
            });`;
if(quizHtml.includes(oldQuizSubmit)) {
    quizHtml = quizHtml.replace(oldQuizSubmit, newQuizSubmit);
    fs.writeFileSync('quiz-haus-leisten.html', quizHtml);
    console.log('Fixed quiz-haus-leisten.html FormSubmit & Tracking');
}

