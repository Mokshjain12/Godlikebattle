document.addEventListener('DOMContentLoaded', () => {
    // Back4App Keys
    Parse.initialize('Ve5g09iUsDRQ6XxHvduwKg1p8LDmcomnLLFvNw', 'cuMOQUc5yAb5tSUAicgyxK06o8aNR6ruNhZf9rZQW');
    Parse.serverURL = 'https://parseapi.back4app.com/';

    // --- Original Modal and Button Logic ---
    const modal = document.getElementById('join-form-modal');
    const closeBtn = document.querySelector('.close-btn');
    const joinButtons = document.querySelectorAll('.join-btn');
    const form = document.getElementById('join-form');
    const modalTitle = document.getElementById('modal-title');
    const paymentAmount = document.getElementById('payment-amount');

    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add pulse effect on click
            button.classList.add('click-effect');

            // Get tournament details
            const tournamentName = button.getAttribute('data-tournament');
            const entryFeeText = button.previousElementSibling.previousElementSibling.innerText;
            const entryFee = entryFeeText.split('₹')[1];
            
            // Update modal content
            modalTitle.innerText = `${tournamentName} Registration`;
            paymentAmount.innerText = entryFee;
            modal.style.display = 'block';

            // Remove the pulse effect after the animation ends
            setTimeout(() => {
                button.classList.remove('click-effect');
            }, 500); // 500ms should match the animation duration
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const TournamentRegistration = Parse.Object.extend('TournamentRegistration');
        const registration = new TournamentRegistration();

        const tournamentName = modalTitle.innerText.replace(' Registration', '');
        const playerName = document.getElementById('playerName').value;
        const playerUID = document.getElementById('playerUID').value;
        const whatsappNo = document.getElementById('whatsappNo').value;
        const paymentFile = document.getElementById('payment-ss').files[0];

        // Set form data
        registration.set('tournamentName', tournamentName);
        registration.set('playerName', playerName);
        registration.set('playerUID', playerUID);
        registration.set('whatsappNo', whatsappNo);

        // Handle payment screenshot file
        if (paymentFile) {
            const parseFile = new Parse.File(paymentFile.name, paymentFile);
            registration.set('paymentScreenshot', parseFile);
        }

        // Save data to Back4App
        registration.save().then(() => {
            alert('Thank you for your registration! We have received your details. Please wait, our team will contact you soon on your WhatsApp number to confirm your spot.');
            modal.style.display = 'none';
            form.reset();
        }).catch((error) => {
            alert('Error: ' + error.message);
        });
    });

    // --- New Code for Text Animation and Splash Screen ---
    const splashScreen = document.querySelector('.splash-screen');
    const bodyElements = document.querySelectorAll('body > *:not(.splash-screen)');
    
    // Hide all other elements initially
    bodyElements.forEach(element => {
        element.style.opacity = '0';
    });

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
