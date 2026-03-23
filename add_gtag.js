const fs = require('fs');
const path = require('path');

const gTagCode = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18035977310"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'AW-18035977310');
    </script>
</head>`;

const dir = './';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (path.extname(file) === '.html') {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if already injected
        if (!content.includes('AW-18035977310')) {
            // Replace </head> with the gtag code followed by </head>
            content = content.replace('</head>', gTagCode);
            fs.writeFileSync(filePath, content);
            console.log(`Injected gtag into ${file}`);
        } else {
            console.log(`gtag already exists in ${file}`);
        }
    }
});
