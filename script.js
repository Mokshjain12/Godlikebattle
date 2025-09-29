document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const joinFormModal = document.getElementById('join-form-modal');
    const rulesModal = document.getElementById('rules-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const joinButtons = document.querySelectorAll('.join-btn');
    const matchRulesBtn = document.querySelector('.match-rules-btn');
    const form = document.getElementById('join-form');
    const modalTitle = document.getElementById('modal-title');
    const paymentAmount = document.getElementById('payment-amount');
    const langBtns = document.querySelectorAll('.lang-btn');
    const rulesTexts = document.querySelectorAll('.rules-text');
    const showQrBtn = document.getElementById('show-qr-btn');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    const splashScreen = document.querySelector('.splash-screen');
    const bodyElements = document.querySelectorAll('body > *:not(.splash-screen)');
    
  
    const SERVER_URL = 'http://localhost:3000/upload'; 

    // --- Helper Functions ---
    const closeAllModals = () => {
        joinFormModal.style.display = 'none';
        rulesModal.style.display = 'none';
        form.reset();
    };

    // --- Event Listeners ---
    
    // Close modals using all close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target == joinFormModal || e.target == rulesModal) {
            closeAllModals();
        }
    });

    // Open rules modal
    matchRulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'block';
    });

    // Language toggle for rules
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rulesTexts.forEach(textBlock => {
                textBlock.classList.remove('active');
            });
            const targetLang = btn.getAttribute('data-lang');
            document.getElementById(`rules-${targetLang}`).classList.add('active');
            
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Join button logic
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('click-effect');
       
            const tournamentName = button.getAttribute('data-tournament');
            // '₹' symbol hata kar fee nikalne ke liye
            const entryFeeText = button.previousElementSibling.previousElementSibling.innerText;
            const entryFee = entryFeeText.split('₹')[1];
            
            modalTitle.innerText = `${tournamentName} Registration`;
            paymentAmount.innerText = entryFee;
            joinFormModal.style.display = 'block';

            setTimeout(() => {
                button.classList.remove('click-effect');
            }, 500); 
        });
    });

    // Toggle QR code display
    showQrBtn.addEventListener('click', () => {
        if (qrCodeDisplay.classList.contains('show')) {
            qrCodeDisplay.classList.remove('show');
            showQrBtn.innerText = 'Show QR Code';
        } else {
            qrCodeDisplay.classList.add('show');
            showQrBtn.innerText = 'Hide QR Code';
        }
    });

    // --- Splash Screen Logic ---
    // Once the splash screen animation finishes, fade in the main content
    splashScreen.addEventListener('animationend', (event) => {
        if (event.animationName === 'fadeOutSplash') {
            splashScreen.style.display = 'none';
            bodyElements.forEach(element => {
                element.style.opacity = '1';
            });
        }
    });

    // --- Form Submission Logic (Mukhya Badlav) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;

        // Loading state
        submitBtn.innerText = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Data ko custom Node.js server par bhejna
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                // FormData use karne par 'Content-Type' header ki zaroorat nahi hoti, browser khud set kar deta hai
                body: formData 
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Safaltapoorvak registration
                alert("Registration saved successfully! Aapko jaldi hi WhatsApp par confirm kiya jayega.");
                form.reset();
                closeAllModals(); // Modal band karen
            } else {

                const errorMsg = result.error || "An unknown error occurred on the server.";
                alert(`Error: ${errorMsg}`);
                console.error('Server error:', result);
            }
        } catch (error) {

            alert("Network Error: Registration failed. Please check your server connection or try again.");
            console.error('Fetch error:', error);
        } finally {

            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
});
