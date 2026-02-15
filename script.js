// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = window.innerWidth < 768 ? 50 : 150; // Trigger earlier on mobile

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

// Animate Skills on Scroll
const animateSkills = () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection && skillsSection.getBoundingClientRect().top < window.innerHeight - 150) {
        const bars = document.querySelectorAll('.skill-fill');
        bars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }
};

window.addEventListener('scroll', () => {
    revealOnScroll();
    animateSkills();
});

// Matrix Rain Background
const initMatrixBackground = () => {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the matrix rain
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>[]{}";
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Y-position for each column
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Glow and mouse interaction variables
    let mouseX = -100;
    let mouseY = -100;
    const glowRadius = 150; // Radius of the interactive glow
    const baseGlowRadius = 50; // Smaller radius for the character glow

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = -100;
        mouseY = -100;
    });

    function draw() {
        // Semi-transparent black background for the fading effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Loop through each column
        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const text = charArray[Math.floor(Math.random() * charArray.length)];

            const distanceToMouse = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));

            // Default state
            let primaryColor = '#00ff41'; // Hacker Green
            let secondaryColor = '#00802B'; // Darker Green
            let currentFontSize = fontSize;

            // Interactive state
            if (distanceToMouse < glowRadius) {
                const proximity = 1 - (distanceToMouse / glowRadius);
                primaryColor = `rgba(0, 255, 234, ${0.6 + proximity * 0.4})`; // Accent (Cyber Cyan) with opacity
                secondaryColor = `rgba(214, 0, 255, ${0.4 + proximity * 0.6})`; // Secondary (Neon Purple) with opacity
                currentFontSize = fontSize + (proximity * 8); // Make text bigger near the mouse
                
                // Draw the main glow effect around the mouse
                const gradient = ctx.createRadialGradient(mouseX, mouseY, baseGlowRadius, mouseX, mouseY, glowRadius);
                gradient.addColorStop(0, `rgba(0, 234, 255, ${proximity * 0.2})`);
                gradient.addColorStop(1, 'rgba(0, 234, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw the character
            ctx.font = `${currentFontSize}px 'Orbitron', monospace`;
            
            // First character in column is brighter (the "drop")
            if (drops[i] * fontSize > canvas.height * Math.random() && Math.random() > 0.975) {
                ctx.fillStyle = primaryColor;
                ctx.shadowColor = primaryColor;
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = secondaryColor;
                ctx.shadowBlur = 0;
            }
            
            ctx.fillText(text, x, y);

            // Reset column or move it down
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const interval = setInterval(draw, 40);

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalculate columns, but don't reset drops to avoid a jarring refresh
        const newColumns = Math.floor(canvas.width / fontSize);
        while (drops.length < newColumns) {
            drops.push(1);
        }
        while (drops.length > newColumns) {
            drops.pop();
        }
    });
};

initMatrixBackground();

// Cyber Matrix Background Animation
const initCyberMatrix = () => {
    const container = document.getElementById('cyber-matrix-bg');
    if (!container) return;

    const rows = 18;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>[]{}";
    
    // Generate Matrix Rows
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        let text = "";
        for (let j = 0; j < 45; j++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        }
        row.textContent = text;
        // Random animation delay for natural feel
        row.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(row);
    }

    // Parallax Depth Effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15; // Subtle movement
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        container.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
};

initCyberMatrix();

// Typing Effect
const typingText = document.querySelector('.typing-text');
const cursor = document.querySelector('.cursor');
const phrases = ["CYBER SECURITY ENGINEER", "NETWORK SPECIALIST", "SYSTEM ADMINISTRATOR"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSound = new Audio('keypress.mp3');
typeSound.volume = 0.2; // Set volume to 20% (subtle)

const typeEffect = () => {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        // Play sound effect
        typeSound.currentTime = 0;
        typeSound.play().catch(e => {}); // Catch errors if user hasn't interacted with page yet
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
        if (cursor) cursor.classList.remove('typing');
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
        if (cursor) cursor.classList.remove('typing');
    } else {
        if (cursor) cursor.classList.add('typing');
    }

    setTimeout(typeEffect, typeSpeed);
};

// Live Time Update
const updateLiveTime = () => {
    const timeElement = document.querySelector('.live-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        timeElement.textContent = `[UPDATED: ${timeString}]`;
    }
};
setInterval(updateLiveTime, 1000);
updateLiveTime();

// News Headlines Typing Effect
const typeNewsHeadlines = () => {
    const headlines = document.querySelectorAll('.news-item h4');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const headline = entry.target;
                const text = headline.getAttribute('data-text');
                
                headline.textContent = '';
                let i = 0;
                
                const typeChar = () => {
                    if (i < text.length) {
                        headline.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeChar, 50); 
                    } else {
                        headline.style.borderRight = 'none'; // Remove cursor
                    }
                };
                typeChar();
                observer.unobserve(headline);
            }
        });
    }, { threshold: 0.5 });

    headlines.forEach(headline => {
        headline.setAttribute('data-text', headline.textContent);
        headline.textContent = ''; 
        observer.observe(headline);
    });
};

// Fetch Live News from Hacker News API
const fetchNews = async () => {
    const newsTrack = document.querySelector('.news-track');
    const refreshBtnIcon = document.querySelector('#refresh-news i');
    if (!newsTrack) return;

    if (refreshBtnIcon) refreshBtnIcon.classList.add('spinning');

    try {
        // Fetch top stories IDs
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = await response.json();
        const topIds = ids.slice(0, 10); // Get top 10 stories

        // Clear loading text
        newsTrack.innerHTML = '';

        // Fetch details for each story
        const items = await Promise.all(topIds.map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        ));

        const renderItem = (item) => {
            const el = document.createElement('div');
            el.className = 'news-item';
            el.style.cursor = 'pointer';
            el.onclick = () => window.open(item.url, '_blank'); // Interactive click

            const date = new Date(item.time * 1000);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Determine tag based on score
            let tagType = 'warning';
            let tagLabel = 'INFO';
            if (item.score > 100) {
                tagType = 'alert';
                tagLabel = 'HOT';
            }

            el.innerHTML = `
                <div class="news-time">${timeStr}</div>
                <div class="news-content">
                    <span class="news-tag ${tagType}">${tagLabel}</span>
                    <h4>${item.title}</h4>
                    <p>Score: ${item.score} | By: ${item.by}</p>
                </div>
            `;
            return el;
        };

        // Append items (Original Set)
        items.forEach(item => { if (item) newsTrack.appendChild(renderItem(item)); });

        // Append items (Duplicate Set for seamless scrolling)
        items.forEach(item => { if (item) newsTrack.appendChild(renderItem(item)); });

        // Initialize typing effect for new elements
        typeNewsHeadlines();

    } catch (error) {
        console.error('Failed to fetch news:', error);
        newsTrack.innerHTML = '<div class="news-item"><div class="news-content"><h4>Connection Failed. Retrying...</h4></div></div>';
    } finally {
        if (refreshBtnIcon) refreshBtnIcon.classList.remove('spinning');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    fetchNews(); // Fetch news and then trigger typing effect
    
    const refreshBtn = document.getElementById('refresh-news');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchNews);
    }

    // Skills Section Mouse Interaction (Spotlight Effect)
    const skillBoxes = document.querySelectorAll('.skill-box');
    skillBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            box.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 255, 65, 0.15), rgba(255, 255, 255, 0.02) 60%)`;
            box.style.borderColor = 'var(--primary)';
        });
        box.addEventListener('mouseleave', () => {
            box.style.background = 'rgba(255, 255, 255, 0.02)';
            box.style.borderColor = 'transparent';
        });
    });

    // Handle Contact Form Silently (AJAX)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const originalBtnText = submitBtn.innerText;

            // Check if Formspree ID is configured
            if (contactForm.action.includes('YOUR_FORM_ID')) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ffbd2e'; // Warning Yellow
                formStatus.innerText = '> SYSTEM WARNING: TARGET ID NOT CONFIGURED. (Update HTML)';
                submitBtn.innerText = 'CONFIG ERROR';
                return;
            }

            // Email Validation
            const email = formData.get('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ff0055';
                formStatus.innerText = '> ERROR: INVALID EMAIL SYNTAX. ABORTING.';
                return;
            }
            
            submitBtn.innerText = 'ESTABLISHING UPLINK...';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#00ff41';
                    formStatus.innerText = '> CONNECTION ESTABLISHED. PACKET SENT.';
                    contactForm.reset();
                    submitBtn.innerText = 'TRANSMISSION COMPLETE';
                    setTimeout(() => { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; }, 3000);
                } else {
                    throw new Error('Server rejected connection');
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ff0055';
                formStatus.innerText = '> ERROR: UPLINK FAILED. RETRY.';
                submitBtn.innerText = 'RETRY TRANSMISSION';
                submitBtn.disabled = false;
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Security Verification Simulation
    const securityOverlay = document.getElementById('security-overlay');
    const statusText = document.querySelector('.verification-status');
    
    if (securityOverlay) {
        const steps = [
            "Analyzing Traffic Patterns...",
            "Checking Browser Signature...",
            "Verifying Encryption Keys...",
            "Access Granted."
        ];
        
        let stepIndex = 0;
        
        const updateStatus = () => {
            if (stepIndex < steps.length) {
                statusText.textContent = steps[stepIndex];
                stepIndex++;
                setTimeout(updateStatus, 800);
            } else {
                securityOverlay.style.transition = "opacity 0.5s ease";
                securityOverlay.style.opacity = "0";
                setTimeout(() => {
                    securityOverlay.style.display = "none";
                }, 500);
            }
        };
        
        setTimeout(updateStatus, 500);
    }

    // Tech Objects Collision Detection (Auto-Glow)
    const techObjects = document.querySelectorAll('.tech-obj');
    const socialIcons = document.querySelectorAll('.social-icon');

    if (techObjects.length > 0 && socialIcons.length > 0) {
        const checkCollision = () => {
            socialIcons.forEach(icon => {
                const iconRect = icon.getBoundingClientRect();
                let isColliding = false;
                
                techObjects.forEach(obj => {
                    const objRect = obj.getBoundingClientRect();
                    if (
                        objRect.left < iconRect.right &&
                        objRect.right > iconRect.left &&
                        objRect.top < iconRect.bottom &&
                        objRect.bottom > iconRect.top
                    ) {
                        isColliding = true;
                    }
                });

                if (isColliding) {
                    icon.classList.add('active-glow');
                } else {
                    icon.classList.remove('active-glow');
                }
            });
            
            requestAnimationFrame(checkCollision);
        };
        
        checkCollision();
    }

    // Random Profile Photo Glitch Effect
    const profilePhoto = document.querySelector('.user-photo');
    if (profilePhoto) {
        const triggerGlitch = () => {
            const delay = Math.random() * 5000 + 3000; // Random delay between 3-8 seconds
            setTimeout(() => {
                profilePhoto.classList.add('glitch-active');
                setTimeout(() => {
                    profilePhoto.classList.remove('glitch-active');
                    triggerGlitch(); // Schedule next glitch
                }, 200 + Math.random() * 300); // Glitch duration 0.2-0.5s
            }, delay);
        };
        triggerGlitch();
    }
});