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

// Close Mobile Menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
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

// Global Three.js Background
const initGlobalThreeJS = () => {
    const container = document.getElementById('three-bg');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles (Stars)
    const particlesCount = 450; // Increased for full background effect
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50; // Spread particles
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00ff41, // Hacker Green
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Constellation Lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff41, // Hacker Green
        transparent: true,
        opacity: 0.2
    });
    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = 5000; // Increased limit for denser connections
    const linePositions = new Float32Array(maxLines * 2 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    camera.position.z = 10;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetSpeed = 0.05;
    let speed = 0.05;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Warp Speed on Click
    window.addEventListener('mousedown', () => { targetSpeed = 0.8; });
    window.addEventListener('mouseup', () => { targetSpeed = 0.05; });

    const animate = () => {
        requestAnimationFrame(animate);

        // Hacker Pulse Effect
        const time = Date.now() * 0.003;
        lineMaterial.opacity = 0.2 + Math.sin(time) * 0.1;
        lineMaterial.color.setHSL(0.33, 1, 0.5 + Math.sin(time * 3) * 0.2); // Pulse brightness

        // Smooth speed transition
        speed += (targetSpeed - speed) * 0.1;

        const positions = particlesMesh.geometry.attributes.position.array;
        
        // Move particles
        for(let i = 0; i < particlesCount; i++) {
            // Z movement (Warp)
            positions[i * 3 + 2] += speed;
            
            // Reset if passed camera
            if(positions[i * 3 + 2] > 10) {
                positions[i * 3 + 2] = -40;
                positions[i * 3] = (Math.random() - 0.5) * 50;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            }
            
            // Mouse parallax
            positions[i * 3] += -mouseX * 0.05;
            positions[i * 3 + 1] += mouseY * 0.05;
        }
        
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        // Update Lines (Constellation)
        let lineIndex = 0;
        const connectDistance = 7;

        for (let i = 0; i < particlesCount; i++) {
            for (let j = i + 1; j < particlesCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectDistance) {
                    if (lineIndex < maxLines) {
                        // Point 1
                        linePositions[lineIndex * 6] = positions[i * 3];
                        linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                        linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];
                        // Point 2
                        linePositions[lineIndex * 6 + 3] = positions[j * 3];
                        linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                        linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];
                        lineIndex++;
                    }
                }
            }
        }
        
        linesMesh.geometry.setDrawRange(0, lineIndex * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initGlobalThreeJS();

// Cyber Matrix Background Animation
const initCyberMatrix = () => {
    const container = document.getElementById('cyber-matrix-bg');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    container.appendChild(canvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>[]{}";
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    const draw = () => {
        // Fade out to transparent to reveal the underlying Three.js background
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#0F0'; // Hacker Green
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    setInterval(draw, 33);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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