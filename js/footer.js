        // Theme toggle functionality (for demonstration)
        const themeToggle = document.createElement('button');
        themeToggle.textContent = 'Toggle Dark Mode';
        themeToggle.style.position = 'fixed';
        themeToggle.style.top = '20px';
        themeToggle.style.right = '20px';
        themeToggle.style.padding = '10px 15px';
        themeToggle.style.backgroundColor = '#4361ee';
        themeToggle.style.color = 'white';
        themeToggle.style.border = 'none';
        themeToggle.style.borderRadius = '5px';
        themeToggle.style.cursor = 'pointer';
        themeToggle.style.zIndex = '1000';
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });

        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input input');
        const newsletterBtn = document.querySelector('.newsletter-btn');

        newsletterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (newsletterInput.value && newsletterInput.value.includes('@')) {
                alert('Thank you for subscribing to our newsletter!');
                newsletterInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });

        // Add enter key support for newsletter input
        newsletterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });