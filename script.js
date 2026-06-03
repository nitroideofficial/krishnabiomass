document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. DYNAMIC STUDIO INJECTIONS (NO HTML EDITS REQUIRED)
    // ==========================================
    
    // Inject the 3D Grid Floor into the Opportunity Section
    const oppSection = document.getElementById('opportunity');
    if (oppSection) {
        const gridFloor = document.createElement('div');
        gridFloor.className = 'kbm-grid-floor';
        oppSection.insertBefore(gridFloor, oppSection.firstChild);
    }

    // Wrap the Founder image for Parallax Scaling
    const imgPlaceholder = document.querySelector('.image-placeholder');
    if (imgPlaceholder) {
        const innerText = imgPlaceholder.innerHTML;
        imgPlaceholder.innerHTML = `<div class="image-inner">${innerText}</div>`;
        imgPlaceholder.classList.add('trigger-fade'); 
    }

    // Inject the Infinite Kinetic Marquee right before the footer
    const footer = document.querySelector('footer');
    if (footer) {
        const marqueeHTML = `
            <div class="kbm-marquee-container">
                <div class="kbm-marquee-track">
                    <span class="kbm-marquee-text">SUSTAINABLE INDUSTRIAL ENERGY • RENEWABLE BIOMASS • ZERO WASTE • </span>
                    <span class="kbm-marquee-text">SUSTAINABLE INDUSTRIAL ENERGY • RENEWABLE BIOMASS • ZERO WASTE • </span>
                </div>
            </div>
        `;
        footer.insertAdjacentHTML('beforebegin', marqueeHTML);
    }

    // ==========================================
    // 1. THE INVERSION CURSOR 
    // ==========================================
    if (window.innerWidth > 992) {
        const dot = document.createElement('div');
        dot.className = 'kbm-cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'kbm-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            document.body.style.setProperty('--x', `${mouseX}px`);
            document.body.style.setProperty('--y', `${mouseY}px`);
        });

        function renderCursor() {
            ringX += (mouseX - ringX) * 0.25;
            ringY += (mouseY - ringY) * 0.25;
            document.body.style.setProperty('--rx', `${ringX}px`);
            document.body.style.setProperty('--ry', `${ringY}px`);
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        setTimeout(() => {
            const interactables = document.querySelectorAll('a, button, input, textarea, select, .stat-card, .image-placeholder');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => { ring.classList.add('hover-state'); dot.style.opacity = '0'; });
                el.addEventListener('mouseleave', () => { ring.classList.remove('hover-state'); dot.style.opacity = '1'; });
            });
        }, 500);
    }

    // ==========================================
    // 2. CINEMATIC CLIP-PATH REVEALS
    // ==========================================
    const massiveTitles = document.querySelectorAll('.massive-title, .section-header h2');
    massiveTitles.forEach(title => {
        const text = title.innerHTML;
        title.innerHTML = `<span class="mask-wrap"><span class="mask-text">${text}</span></span>`;
    });

    const revealElements = document.querySelectorAll('.trigger-fade, .mask-text');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));
    setTimeout(() => { document.querySelectorAll('.hero .trigger-fade, .hero .mask-text').forEach(el => el.classList.add('active')); }, 100);

    // ==========================================
    // 3. SMART HEADER
    // ==========================================
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100 && currentScroll > lastScroll) {
            header.classList.add('hide-up'); 
        } else {
            header.classList.remove('hide-up'); 
        }
        lastScroll = currentScroll;
    });

    // ==========================================
    // 4. THE 3D HOLOGRAPHIC TILT CARDS & MAGNETIC WA
    // ==========================================
    if (window.innerWidth > 992) {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = ((y - centerY) / centerY) * -20; 
                const tiltY = ((x - centerX) / centerX) * 20;

                card.style.setProperty('--tilt-x', `${tiltX}deg`);
                card.style.setProperty('--tilt-y', `${tiltY}deg`);
                card.style.setProperty('--glare-x', `${x}px`);
                card.style.setProperty('--glare-y', `${y}px`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--tilt-x', `0deg`);
                card.style.setProperty('--tilt-y', `0deg`);
            });
        });

        const waBtn = document.querySelector('.whatsapp-btn');
        if (waBtn) {
            waBtn.addEventListener('mousemove', (e) => {
                const rect = waBtn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
                waBtn.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
            });
            waBtn.addEventListener('mouseleave', () => {
                waBtn.style.transform = `translate(0px, 0px) scale(1)`;
            });
        }
    }

    // ==========================================
    // 5. LIVE CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('b2b-form');
    const successMsg = document.getElementById('form-success');
    if (successMsg) { successMsg.style.display = 'none'; successMsg.style.opacity = '0'; }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = "ESTABLISHING SECURE LINK...";
                btn.style.opacity = "0.6"; btn.style.pointerEvents = "none";
            }
            const formData = new FormData(this);
            try {
                const response = await fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }});
                if (response.ok) {
                    this.style.display = 'none';
                    successMsg.style.display = 'flex'; 
                    setTimeout(() => { successMsg.style.opacity = '1'; successMsg.style.transform = 'translateY(0)'; }, 50);
                } else {
                    if(btn) { btn.innerHTML = "ERROR. RETRY."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
                }
            } catch (error) {
                if(btn) { btn.innerHTML = "NETWORK FAILURE."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
            }
        });
    }

    // ==========================================
    // 6. THE "GRAVITY FORGE" CANVAS PHYSICS
    // ==========================================
    const canvas = document.getElementById('core-reactor');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr; canvas.height = height * dpr;
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize(); 

    const particles = [];
    const OUTER_COUNT = 220; 
    const INNER_COUNT = 90; 
    const OUTER_RADIUS = 300; 
    const INNER_RADIUS = 190; 
    const PERSPECTIVE = 800;

    class GlobeParticle {
        constructor(isInner) {
            this.isInner = isInner;
            this.originRadius = isInner ? INNER_RADIUS : OUTER_RADIUS + (Math.random() * 80 - 40); 
            this.currentRadius = this.originRadius;
            this.theta = Math.random() * Math.PI * 2;
            this.phi = Math.acos((Math.random() * 2) - 1);
            this.spinSpeed = isInner ? 0 : (Math.random() * 0.008) - 0.004;
        }

        update(gravityPull) {
            this.theta += this.spinSpeed;
            if (!this.isInner) {
                this.currentRadius = this.originRadius - ((this.originRadius - INNER_RADIUS) * gravityPull);
            }
            this.x = this.currentRadius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = this.currentRadius * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = this.currentRadius * Math.cos(this.phi);

            let r, g, b, size;
            if (!this.isInner) {
                r = 139 - ((139 - 94) * gravityPull);
                g = 107 + ((166 - 107) * gravityPull);
                b = 74 - ((74 - 71) * gravityPull);
                size = 1.8 + Math.random() * 2; 
            } else {
                r = 94; g = 166; b = 71; 
                size = 4; 
            }
            return { x: this.x, y: this.y, z: this.z, color: `${r},${g},${b}`, size, isInner: this.isInner };
        }
    }

    for (let i = 0; i < OUTER_COUNT; i++) particles.push(new GlobeParticle(false));
    for (let i = 0; i < INNER_COUNT; i++) particles.push(new GlobeParticle(true));

    let globalRotationX = 0.2, globalRotationY = 0;

    function animateAll() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'screen'; 

        const scrollGravity = Math.min(Math.max(window.pageYOffset / 350, 0), 1);
        globalRotationY += 0.004 + (scrollGravity * 0.005); 

        const projected = [];
        const mobileScale = width < 768 ? 0.55 : 1.15; 

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i].update(scrollGravity); 
            let cosY = Math.cos(globalRotationY), sinY = Math.sin(globalRotationY);
            let x1 = p.x * cosY - p.z * sinY;
            let z1 = p.z * cosY + p.x * sinY;
            let cosX = Math.cos(globalRotationX), sinX = Math.sin(globalRotationX);
            let y2 = p.y * cosX - z1 * sinX;
            let z2 = z1 * cosX + p.y * sinX;
            z2 += PERSPECTIVE;
            
            const scale = (PERSPECTIVE / z2) * mobileScale;
            const screenX = (width / 2) + (x1 * scale);
            const screenY = (height / 2) + (y2 * scale);
            
            const alpha = Math.max(0.1, 1 - (z2 - PERSPECTIVE + OUTER_RADIUS) / (OUTER_RADIUS * 2));

            projected.push({ x: screenX, y: screenY, size: p.size * scale, color: p.color, alpha: alpha, z: z2, isInner: p.isInner });
        }

        projected.sort((a, b) => b.z - a.z);
        
        ctx.lineWidth = 1.5; 
        for (let i = 0; i < projected.length; i++) {
            const p1 = projected[i];
            if((p1.isInner || scrollGravity > 0.8) && p1.alpha > 0.4) {
                for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
                    const p2 = projected[j];
                    if(p2.isInner || scrollGravity > 0.8) {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        if ((dx*dx + dy*dy) < (4500 * mobileScale)) {
                            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(94, 166, 71, ${p1.alpha * 0.35})`; 
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        projected.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`; ctx.fill();
        });

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animateAll);
    }

    animateAll(); 
});
