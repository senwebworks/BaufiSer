const fs = require('fs');
const files = ['index.html', 'rechner.html', 'foerdermittel-abfrage.html', 'checkliste-hauskauf.html', 'zinsen-sichern-anleitung.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        if(content.includes('ca. 3,5% – 4,5%')) {
            content = content.replace('ca. 3,5% – 4,5%', 'ca. 3,5% – 4,2%');
            fs.writeFileSync(f, content);
            console.log('Fixed ' + f);
        }
    } catch (e) {
        console.error('Error on ' + f, e);
    }
});
