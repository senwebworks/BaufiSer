document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('.lead-form');
    if(!form) return; // safeguard if script loaded on pages without form
    
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    
    let currentStep = 1;
    const totalSteps = 4; // Total steps for the index form

    // Initialize logic
    setupStep(currentStep);

    // Navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
             // In a real app we would validate fields here before allowing progress
             // For now we just progress. The required fields are technically handled by the browser on submit.
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

    // Handle Option Selection auto-advance (for Step 1)
    const optionCardsRadios = document.querySelectorAll('.option-card input[type="radio"]');
    optionCardsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const step = e.target.closest('.form-step');
            const nextBtn = step.querySelector('.btn-next');
            if(nextBtn) nextBtn.disabled = false;
            
            setTimeout(() => {
                if (currentStep < totalSteps && nextBtn) {
                     nextBtn.click();
                }
            }, 300);
        });
    });

    function validateCurrentStep() {
        // Very basic validation - if required text inputs are empty, don't allow next.
        // Step 2 & 3 handles native input validity
        const inputs = document.querySelectorAll(`#step-${currentStep} input[required], #step-${currentStep} select[required]`);
        let isValid = true;
        inputs.forEach(input => {
            if(!input.value.trim()) {
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
        document.getElementById(`step-${currentStep}`).classList.add('active');

        // Update Progress bar (starts at 0, filled to 100 on last step)
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        setupStep(currentStep);
    }
    
    function setupStep(stepNum) {
        if(stepNum === 2) {
            setTimeout(() => document.getElementById('kaufpreis').focus(), 100);
        }
    }

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state to loading
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) {
            submitBtn.innerHTML = 'Übermittle Daten... <i data-lucide="loader-2" class="spin"></i>';
            submitBtn.disabled = true;
            lucide.createIcons();
        }

        // Gather all form data
        const fd = new FormData(form);
        const dataStr = Array.from(fd.entries()).map(e => `${e[0]}: ${e[1]}`).join('%0D%0A');

        // Send data in background using FormSubmit.co Ajax API
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
