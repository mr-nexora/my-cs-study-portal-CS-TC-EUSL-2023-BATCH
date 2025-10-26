        // Team member data
        const teamMembers = {
            owner: {
                name: "Alex Johnson",
                role: "Project Founder & Lead Developer",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Alex is the visionary behind CS Campus Helper. With over 5 years of experience in software development and a passion for education, he founded this project to help computer science students excel in their studies. Alex oversees all aspects of the project and ensures that our platform remains innovative and user-friendly. He holds a Master's degree in Computer Science and has previously worked at leading tech companies.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#",
                    youtube: "#"
                }
            },
            sarah: {
                name: "Sarah Williams",
                role: "Frontend Developer",
                img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Sarah specializes in creating beautiful and responsive user interfaces. With a keen eye for design and expertise in modern frontend technologies like React, Vue, and CSS frameworks, she ensures that CS Campus Helper provides an exceptional user experience across all devices. Sarah is passionate about accessibility and performance optimization.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#"
                }
            },
            michael: {
                name: "Michael Chen",
                role: "Backend Developer",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Michael is responsible for the server-side architecture of CS Campus Helper. His expertise in database design, API development, and cloud infrastructure ensures that our platform runs smoothly and efficiently, handling thousands of student requests daily. Michael is proficient in Node.js, Python, and various database technologies.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#",
                    youtube: "#"
                }
            },
            emily: {
                name: "Emily Rodriguez",
                role: "UI/UX Designer",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Emily focuses on creating intuitive and engaging user experiences. Her designs make complex computer science concepts accessible and enjoyable for students, helping them learn more effectively through our platform. With a background in both design and psychology, Emily ensures our interfaces are both beautiful and functional.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    pinterest: "#"
                }
            },
            david: {
                name: "David Kim",
                role: "Notes Specialist",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "David creates comprehensive and easy-to-understand study notes for various computer science subjects. His notes help students grasp complex topics quickly and prepare effectively for exams. With a degree in Computer Science and experience as a teaching assistant, David knows exactly what students need to succeed.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#"
                }
            },
            jessica: {
                name: "Jessica Lee",
                role: "Maths Helper",
                img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Jessica specializes in mathematical concepts relevant to computer science. She creates tutorials, practice problems, and solutions that help students master the mathematical foundations of computing, from discrete mathematics to calculus and linear algebra. Jessica holds a degree in Applied Mathematics.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#",
                    youtube: "#"
                }
            },
            ryan: {
                name: "Ryan Patel",
                role: "IT Helper",
                img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                description: "Ryan provides technical support and creates troubleshooting guides for common IT issues faced by computer science students. His expertise helps students overcome technical challenges and focus on learning. Ryan has extensive experience in system administration and technical support.",
                social: {
                    facebook: "#",
                    instagram: "#",
                    linkedin: "#",
                    github: "#",
                    twitter: "#"
                }
            }
        };

        // DOM Elements
        const modal = document.getElementById('memberModal');
        const closeBtn = document.getElementById('closeModal');
        const modalImg = document.getElementById('modalImg');
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalDescription = document.getElementById('modalDescription');
        const modalSocial = document.getElementById('modalSocial');
        const viewMoreBtns = document.querySelectorAll('.view-more-btn');

        // Social media icons mapping
        const socialIcons = {
            facebook: 'fab fa-facebook-f',
            instagram: 'fab fa-instagram',
            linkedin: 'fab fa-linkedin-in',
            github: 'fab fa-github',
            twitter: 'fab fa-twitter',
            youtube: 'fab fa-youtube',
            pinterest: 'fab fa-pinterest',
            telegram: 'fab fa-telegram'
        };

        // Open modal with team member details
        viewMoreBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const memberId = btn.getAttribute('data-member');
                const member = teamMembers[memberId];
                
                if (member) {
                    modalImg.src = member.img;
                    modalName.textContent = member.name;
                    modalRole.textContent = member.role;
                    modalDescription.textContent = member.description;
                    
                    // Clear previous social icons
                    modalSocial.innerHTML = '';
                    
                    // Add social icons
                    for (const [platform, url] of Object.entries(member.social)) {
                        const iconClass = socialIcons[platform];
                        if (iconClass) {
                            const socialLink = document.createElement('a');
                            socialLink.href = url;
                            socialLink.className = 'social-icon';
                            socialLink.target = '_blank';
                            socialLink.innerHTML = `<i class="${iconClass}"></i>`;
                            modalSocial.appendChild(socialLink);
                        }
                    }
                    
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Add scroll animation for team cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe all profile cards
        document.querySelectorAll('.profile-card').forEach(card => {
            observer.observe(card);
        });