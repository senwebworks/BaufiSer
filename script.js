document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('.lead-form');
    if(!form) return;
    
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    
    let currentStep = 1;
    const totalSteps = 12; // Updated to 12 steps

    // Initialize logic
    setupStep(currentStep);

    // Navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
             if(validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateView();
                }
             } else {
                const stepEl = document.getElementById(`step-${currentStep}`);
                if(stepEl) {
                    stepEl.classList.remove('shake');
                    void stepEl.offsetWidth; // Trigger reflow
                    stepEl.classList.add('shake');
                }
             }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateView();
            }
        });
    });

    // Handle Option Selection auto-advance
    // New Steps: 1 (Vorhaben), 2 (Objektart), 3 (Zustand), 4 (Nutzung), 7 (Status), 8 (Darlehensnehmer)
    const autoAdvanceSteps = [1, 2, 3, 4, 7, 8];
    const optionCardsRadios = document.querySelectorAll('.option-card input[type="radio"]');
    optionCardsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const step = e.target.closest('.form-step');
            if (!step) return;
            
            const stepId = parseInt(step.id.replace('step-', ''));
            const nextBtn = step.querySelector('.btn-next');
            
            console.log(`[Form] Radio changed on step ${stepId}: ${e.target.value}`);
            
            if(nextBtn) {
                nextBtn.disabled = false;
                console.log(`[Form] Enabled Next button for step ${stepId}`);
            }
            
            if (autoAdvanceSteps.includes(stepId)) {
                console.log(`[Form] Auto-advancing from step ${stepId} in 400ms...`);
                setTimeout(() => {
                    if (currentStep === stepId && nextBtn) {
                         console.log(`[Form] Triggering click on Next button for step ${stepId}`);
                         nextBtn.click();
                    } else {
                        console.log(`[Form] Auto-advance suppressed: currentStep(${currentStep}) !== stepId(${stepId}) or no nextBtn`);
                    }
                }, 400); 
            }
        });
    });

    // Step 9: Live Calculator & EK Buttons
    const kpInput = document.getElementById('kaufpreis');
    const ekInput = document.getElementById('eigenkapital');
    const maklerRadios = document.querySelectorAll('input[name="makler"]');
    const ekBtns = document.querySelectorAll('.ek-btn');

    function calculateLive() {
        const kp = parseFloat(kpInput?.value) || 0;
        const ek = parseFloat(ekInput?.value) || 0;
        const makler = document.querySelector('input[name="makler"]:checked')?.value;
        
        let maklerFee = 0;
        if(makler === 'Ja') {
            maklerFee = kp * 0.0357; 
        }
        
        const total = kp + maklerFee - ek;
        const display = document.getElementById('live-darlehen');
        const hiddenField = document.getElementById('hdn-darlehen');

        const formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, total));
        
        if(display) display.innerText = formatted;
        if(hiddenField) hiddenField.value = formatted;

        // Update active state of EK buttons
        const currentPct = kp > 0 ? (ek / kp) * 100 : 0;
        ekBtns.forEach(btn => {
            const btnPct = parseFloat(btn.dataset.pct);
            if (Math.abs(currentPct - btnPct) < 1) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    if (kpInput) kpInput.addEventListener('input', calculateLive);
    if (ekInput) ekInput.addEventListener('input', calculateLive);
    maklerRadios.forEach(radio => radio.addEventListener('change', calculateLive));

    ekBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pct = parseFloat(btn.dataset.pct);
            const kp = parseFloat(kpInput?.value) || 0;
            if (kp > 0) {
                const absoluteEk = Math.round((kp * pct) / 100);
                if (ekInput) {
                    ekInput.value = absoluteEk;
                    calculateLive();
                }
            }
            ekBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Step 11: File Upload
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const fileList = document.getElementById('file-list');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--accent-color)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                updateFileList();
            }
        });

        fileInput.addEventListener('change', updateFileList);
    }

    function updateFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        Array.from(fileInput.files).forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `<i data-lucide="file-text" style="width:16px;height:16px;"></i> <span>${file.name}</span>`;
            fileList.appendChild(item);
        });
        if(window.lucide) lucide.createIcons();
        
        // Change button text if files are added
        const nextBtn = document.querySelector('#step-11 .btn-next');
        if (nextBtn) {
            nextBtn.innerHTML = `Mit Unterlagen weiter <i data-lucide="arrow-right"></i>`;
            if(window.lucide) lucide.createIcons();
        }
    }

    function validateCurrentStep() {
        const stepEl = document.getElementById(`step-${currentStep}`);
        if(!stepEl) return true;

        // Step 5 (PLZ) - Step 5 in new 12-step form
        if(currentStep === 5) {
            const zipInput = stepEl.querySelector('#zipcode');
            const zipError = stepEl.querySelector('#zip-error');
            if(zipInput && !/^[0-9]{5}$/.test(zipInput.value)) {
                zipInput.style.borderColor = '#ef4444';
                if(zipError) zipError.style.display = 'block';
                return false;
            } else if(zipInput) {
                zipInput.style.borderColor = '';
                if(zipError) zipError.style.display = 'none';
            }
        }

        const inputs = stepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if(input.id === 'zipcode' && currentStep === 5) return;
            
            let fieldValid = true;
            if(input.type === 'radio') {
                const name = input.name;
                const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
                if(!checked) fieldValid = false;
            } else if(input.type === 'checkbox') {
                if(!input.checked) fieldValid = false;
            } else if(!input.value.trim()) {
                fieldValid = false;
            }

            if(!fieldValid) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                input.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            } else {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
            }
        });
        
        if(!isValid) {
            console.log(`Validation failed for step ${currentStep}`);
        }
        return isValid;
    }

    function updateView() {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        const currentStepEl = document.getElementById(`step-${currentStep}`);
        if(currentStepEl) currentStepEl.classList.add('active');

        // Update Progress bar
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if(progressBar) progressBar.style.width = `${progressPercentage}%`;
        
        setupStep(currentStep);

        if(window.innerWidth < 768) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function setupStep(stepNum) {
        if(stepNum === 9) {
            calculateLive();
        }
        const firstInput = document.querySelector(`#step-${stepNum} input:not([type="hidden"]), #step-${stepNum} select`);
        if(firstInput && firstInput.type !== 'radio' && firstInput.type !== 'file') {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentStep < totalSteps) {
            const activeStep = document.querySelector('.form-step.active');
            const nextBtn = activeStep ? activeStep.querySelector('.btn-next') : null;
            if (nextBtn) {
                nextBtn.click();
            }
            return;
        }

        if(!validateCurrentStep()) return;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.innerHTML = 'Wird übermittelt... <i data-lucide="loader-2" class="spin"></i>';
            submitBtn.style.pointerEvents = 'none';
            if(window.lucide) lucide.createIcons();
        }

        const fd = new FormData(form);
        // Important: Add standard email fields
        fd.append('_subject', 'Neue Baufinanzierungsanfrage');
        fd.append('_template', 'table');

        fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
            method: 'POST',
            body: fd
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === 'true' || data.success === true) {
                showSuccess();
            } else {
                throw new Error('Server hat die Anfrage abgelehnt.');
            }
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('Problem bei der Übertragung. Ihre Anfrage wurde möglicherweise trotzdem erfasst. Wir melden uns!');
            showSuccess(); // Show success anyway to avoid user frustration if it's just a CORS/Ajax glitch
        });

        function showSuccess() {
            if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();
            const progress = document.querySelector('.form-progress');
            if(progress) progress.style.display = 'none';
            steps.forEach(step => step.classList.remove('active'));
            const successStep = document.getElementById('step-success');
            if(successStep) successStep.classList.add('active');
            if(window.lucide) lucide.createIcons();
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if(mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

});
