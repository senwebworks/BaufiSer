document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('.lead-form');
    if(!form) return;
    
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    
    let currentStep = 1;
    const totalSteps = 8; // 8 qualification steps

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

    // Handle Option Selection auto-advance (for Steps 1, 2, 3, 5)
    const autoAdvanceSteps = [1, 2, 3, 5];
    const optionCardsRadios = document.querySelectorAll('.option-card input[type="radio"]');
    optionCardsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const step = e.target.closest('.form-step');
            const stepId = parseInt(step.id.replace('step-', ''));
            const nextBtn = step.querySelector('.btn-next');
            if(nextBtn) nextBtn.disabled = false;
            
            if (autoAdvanceSteps.includes(stepId)) {
                setTimeout(() => {
                    if (currentStep <= totalSteps && nextBtn) {
                         nextBtn.click();
                    }
                }, 300);
            }
        });
    });

    // Step 6: Live Calculator Logic
    const calcInputs = ['kaufpreis', 'modernisierung', 'eigenkapital'];
    const maklerRadios = document.querySelectorAll('input[name="makler"]');
    
    function calculateLive() {
        const kp = parseFloat(document.getElementById('kaufpreis')?.value) || 0;
        const mod = parseFloat(document.getElementById('modernisierung')?.value) || 0;
        const ek = parseFloat(document.getElementById('eigenkapital')?.value) || 0;
        const makler = document.querySelector('input[name="makler"]:checked')?.value;
        
        let maklerFee = 0;
        if(makler === 'Ja') {
            maklerFee = kp * 0.0357; // 3.57% standard estimation
        }
        
        const total = kp + maklerFee + mod - ek;
        const display = document.getElementById('live-darlehen');
        const hiddenField = document.getElementById('hdn-darlehen');

        const formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, total));
        
        if(display) display.innerText = formatted;
        if(hiddenField) hiddenField.value = formatted;
    }

    calcInputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', calculateLive);
    });
    maklerRadios.forEach(radio => {
        radio.addEventListener('change', calculateLive);
    });

    function validateCurrentStep() {
        // Step 4 (PLZ) needs specifically 5 digits
        if(currentStep === 4) {
            const zipInput = document.getElementById('zipcode');
            if(zipInput && !/^[0-9]{5}$/.test(zipInput.value)) {
                zipInput.style.borderColor = 'red';
                return false;
            }
        }

        const inputs = document.querySelectorAll(`#step-${currentStep} input[required], #step-${currentStep} select[required]`);
        let isValid = true;
        inputs.forEach(input => {
            if(input.id === 'zipcode' && currentStep === 4) return;
            
            if(input.type === 'radio') {
                const name = input.name;
                const checked = document.querySelector(`input[name="${name}"]:checked`);
                if(!checked) isValid = false;
            } else if(!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
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
        if(stepNum === 6) {
            calculateLive();
        }
        const firstInput = document.querySelector(`#step-${stepNum} input:not([type="hidden"]), #step-${stepNum} select`);
        if(firstInput && firstInput.type !== 'radio') {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) {
            submitBtn.innerHTML = 'Übermittle Daten... <i data-lucide="loader-2" class="spin"></i>';
            submitBtn.disabled = true;
            if(window.lucide) lucide.createIcons();
        }

        const fd = new FormData(form);
        
        fetch('https://formsubmit.co/ajax/kontakt@baufinanz-service.de', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: 'Angebotsanfrage: Baufinanz Service',
                ...Object.fromEntries(fd)
            })
        })
        .then(response => response.json())
        .then(data => {
            if(typeof window.gtag_report_conversion === "function") window.gtag_report_conversion();

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
        });
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
