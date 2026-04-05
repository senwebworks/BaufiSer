const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'rechner.html',
    'foerdermittel-abfrage.html',
    'checkliste-hauskauf.html',
    'zinsen-sichern-anleitung.html',
    'bauzinsen-aktuell.html', // maybe? let's just check dynamically
    'quiz-haus-leisten.html',
];

const newHtmlBlock = `                            <div class="live-calc-result" style="background: rgba(15, 23, 42, 0.05); padding: 1.5rem; border-radius: var(--radius-md); margin: 1.5rem 0; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                                <div style="text-align: center; margin-bottom: 1.25rem;">
                                    <p style="font-weight: 700; font-size: 0.875rem; color: var(--primary-color); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px;">🔥 Sofort-Berechnung</p>
                                    <p style="font-size: 0.9rem; color: var(--text-color);">Ihre mögliche monatliche Rate:</p>
                                    <div style="background: var(--white); padding: 1rem; border-radius: var(--radius-md); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); margin-top: 0.5rem; border: 1px solid rgba(0,0,0,0.05);">
                                        <span id="live-rate" style="font-size: 2.25rem; font-weight: 800; color: var(--primary-color); display: block; line-height: 1.2;">ca. 0 €</span>
                                    </div>
                                </div>
                                
                                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.95rem; color: var(--text-color); background: var(--white); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.05);">
                                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.5rem;">
                                        <span style="color: var(--text-light);">Kreditbetrag:</span>
                                        <strong id="live-darlehen">0 €</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.5rem;">
                                        <span style="color: var(--text-light);">Zinsspanne:</span>
                                        <strong>ca. 3,5% – 4,5%</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: var(--text-light);">Tilgung (angenommen):</span>
                                        <strong>2,0%</strong>
                                    </div>
                                </div>
                                
                                <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 1.5rem; font-style: italic; line-height: 1.4; text-align: center;">Dies ist eine unverbindliche Beispielrechnung und stellt kein verbindliches Finanzierungsangebot dar.</p>
                                
                                <button type="button" class="btn btn-primary" onclick="const step=this.closest('.form-step'); if(step){const next=step.querySelector('.btn-next'); if(next) next.click()}" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 0.5rem; font-size: 1.1rem; padding: 1.1rem; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);">
                                    👉 Jetzt kostenlose Beratung sichern
                                </button>
                                
                                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.25rem; font-size: 0.75rem; color: var(--text-light); text-align: center; flex-wrap: wrap; font-weight: 500;">
                                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Kostenlos & unverbindlich</span>
                                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Angebote von über 400 Banken</span>
                                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Schnelle Rückmeldung</span>
                                </div>

                                <input type="hidden" name="darlehensbedarf" id="hdn-darlehen">
                                <input type="hidden" name="monatliche_rate" id="hdn-rate">
                            </div>`;

const searchRegex = /<div class="live-calc-result"[\s\S]*?<\/div>\s*<\/div>\s*<div class="form-actions">/;

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We will replace the existing <div class="live-calc-result"> completely.
    // It spans from <div class="live-calc-result"... to the matching closing tag.
    // Let's use a robust approach: replace between <div class="live-calc-result" and <div class="form-actions">
    const parts = content.split('<div class="live-calc-result"');
    if (parts.length > 1) {
        let beforeCalc = parts[0];
        let afterCalc = parts[1];
        let calcEndIndex = afterCalc.indexOf('<div class="form-actions">');
        
        if (calcEndIndex !== -1) {
            afterCalc = afterCalc.substring(calcEndIndex);
            
            // Reconstruct the file with the new block.
            // But wait, the user also said "Das bestehende Absenden-Element verstärken oder visuell hervorheben ... Direkt unter dem Ergebnis".
            // If we put the CTA in the calc result, the "Weiter" button in form-actions feels redundant.
            // But it's okay, maybe I can just hide the form actions 'Weiter' button for Step 9 by adding inline style, or we can leave it.
            // The safest is to leave form-actions intact so Next/Prev logic just works.
            
            content = beforeCalc + newHtmlBlock + '\n\n                            ' + afterCalc;
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`Could not find <div class="form-actions"> in ${file} after live-calc-result`);
        }
    }
});
