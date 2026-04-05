const fs = require('fs');

const files = ['index.html', 'rechner.html', 'foerdermittel-abfrage.html', 'checkliste-hauskauf.html', 'zinsen-sichern-anleitung.html'];

const cleanStep12Html = `                        <div class="form-step" id="step-12">
                            <h3 style="margin-bottom: 0.5rem;">Prüfung starten</h3>
                            
                            <div class="live-calc-result" style="background: rgba(15, 23, 42, 0.05); padding: 1.5rem; border-radius: var(--radius-md); margin: 1.5rem 0; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                                <div style="text-align: center; margin-bottom: 1.25rem;">
                                    <p style="font-weight: 700; font-size: 0.875rem; color: var(--primary-color); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px;">🔥 Ihre Berechnung ist fertig</p>
                                    <p style="font-size: 0.9rem; color: var(--text-color);">Mögliche monatliche Rate:</p>
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
                                
                                <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 0; font-style: italic; line-height: 1.4; text-align: center;">Dies ist eine unverbindliche Beispielrechnung und stellt kein verbindliches Finanzierungsangebot dar.</p>

                                <input type="hidden" name="darlehensbedarf" id="hdn-darlehen">
                                <input type="hidden" name="monatliche_rate" id="hdn-rate">
                            </div>

                            <label class="checkbox-container" style="margin-bottom: 1.5rem;">
                                <input type="checkbox" name="consent" checked required>
                                <span class="checkmark"></span>
                                <span class="checkbox-text">Ich bin einverstanden, dass meine Daten zur Erstellung von Angeboten verarbeitet werden.</span>
                            </label>

                            <button type="submit" class="btn btn-primary" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 0.5rem; font-size: 1.1rem; padding: 1.1rem; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);">
                                👉 Jetzt kostenlose Beratung sichern
                            </button>
                            
                            <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.25rem; font-size: 0.75rem; color: var(--text-light); text-align: center; flex-wrap: wrap; font-weight: 500;">
                                <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Kostenlos & unverbindlich</span>
                                <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Angebote von über 400 Banken</span>
                                <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i> Schnelle Rückmeldung</span>
                            </div>
                            
                            <div class="form-actions" style="margin-top: 1rem; display: flex; justify-content: center;">
                                <button type="button" class="btn btn-text btn-prev" style="margin: 0;"><i data-lucide="arrow-left"></i> Zurück</button>
                            </div>
                        </div>\n\n                        <!-- Erfolgsmeldung -->\n                        `;

files.forEach(f => {
    try {
        if (!fs.existsSync(f)) return;
        let html = fs.readFileSync(f, 'utf8');
        
        const step12start = html.indexOf('<div class="form-step" id="step-12">');
        const stepSuccessStart = html.indexOf('<div class="form-step" id="step-success">');
        
        if (step12start !== -1 && stepSuccessStart !== -1 && step12start < stepSuccessStart) {
            // Check if there is an "Erfolgsmeldung" comment right before step-success
            let successMarkerStart = html.lastIndexOf('<!-- Erfolgsmeldung -->', stepSuccessStart);
            if(successMarkerStart === -1 || successMarkerStart < step12start) {
                // If comment not found or it's somewhere else, just replace up to step-success
                html = html.substring(0, step12start) + cleanStep12Html.replace('                        <!-- Erfolgsmeldung -->\n                        ', '') + html.substring(stepSuccessStart);
            } else {
                html = html.substring(0, step12start) + cleanStep12Html + html.substring(stepSuccessStart);
            }
            fs.writeFileSync(f, html);
            console.log('Fixed ' + f);
        } else {
            console.log('Tags not found in ' + f);
        }
    } catch (e) {
        console.error('Error on ' + f, e);
    }
});
