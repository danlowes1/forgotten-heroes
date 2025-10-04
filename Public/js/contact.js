// contact.js

document.addEventListener('DOMContentLoaded', () => {
    // Select the form within the footer-right div
    const contactForm = document.querySelector('.footer-right form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            // Prevent the default form submission (which would cause a page reload)
            event.preventDefault();

            // Get the data from the form
            const formData = {
                name: contactForm.elements['name'].value,
                email: contactForm.elements['email'].value,
                comments: contactForm.elements['comments'].value,
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Optional: Disable button and change text while submitting
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                // Send the form data to the new Express route
                const response = await fetch('/submit-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    // Success!
                    const result = await response.json();
                    alert('Thank you for your submission! We will be in touch.');
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Server returned a non-200 status code
                    const error = await response.json();
                    alert(`Failed to send message: ${error.message || 'An unknown error occurred.'}`);
                }
            } catch (error) {
                // Network or other critical error
                console.error('Submission Error:', error);
                alert('An error occurred while submitting the form. Please try again later.');
            } finally {
                // Re-enable the button regardless of success or failure
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        });
    }
});