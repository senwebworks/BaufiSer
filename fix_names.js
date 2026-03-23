const fs = require('fs');

// Add name attributes to checklist
let cl = fs.readFileSync('checkliste-hauskauf.html', 'utf8');
cl = cl.replace('id="name" required', 'id="name" name="Name" required');
cl = cl.replace('id="email" required', 'id="email" name="Email" required');
cl = cl.replace('id="telefon" required', 'id="telefon" name="Telefon" required');
fs.writeFileSync('checkliste-hauskauf.html', cl);

// Add name attributes to zins-guide
let zg = fs.readFileSync('zinsen-sichern-anleitung.html', 'utf8');
zg = zg.replace('id="name" required', 'id="name" name="Name" required');
zg = zg.replace('id="email" required', 'id="email" name="Email" required');
zg = zg.replace('id="telefon" required', 'id="telefon" name="Telefon" required');
fs.writeFileSync('zinsen-sichern-anleitung.html', zg);

// Add name attributes to FAQ
let faq = fs.readFileSync('faq.html', 'utf8');
faq = faq.replace('id="contact-name" required', 'id="contact-name" name="Name" required');
faq = faq.replace('id="contact-email" required', 'id="contact-email" name="Email" required');
faq = faq.replace('id="contact-phone"', 'id="contact-phone" name="Telefon"');
faq = faq.replace('id="contact-message" rows="4" required', 'id="contact-message" name="Nachricht" rows="4" required');
fs.writeFileSync('faq.html', faq);
console.log('Fixed names');
