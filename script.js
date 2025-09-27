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
    window.addEventListener('click', (event) => {
        if (event.target === joinFormModal || event.target === rulesModal) {
            closeAllModals();
        }
    });

    // Open Match Rules Modal
    matchRulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'block';
    });

    // Language Selector for Rules
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            
            // Update active button
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show selected language content
            rulesTexts.forEach(text => {
                text.classList.remove('active');
                if (text.classList.contains(`lang-${lang}`)) {
                    text.classList.add('active');
                }
            });
        });
    });

    // Handle Join Button clicks to open the form modal
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('click-effect');
       
            const tournamentName = button.getAttribute('data-tournament');
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
});
