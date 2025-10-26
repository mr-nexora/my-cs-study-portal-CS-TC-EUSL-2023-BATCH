// Form submission handling
        document.getElementById('feedback-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            // For this example, we'll just show a confirmation message
            alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} as soon as possible.`);
            
            // Reset the form
            this.reset();
        });