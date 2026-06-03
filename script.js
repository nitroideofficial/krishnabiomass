document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL REVEAL (Smooth Fade in)
    const revealElements = document.querySelectorAll('.trigger-fade');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Initialize Hero immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .trigger-fade').forEach(el => el.classList.add('active'));
    }, 100);

    // 2. LIVE CONTACT FORM (FormSubmit API)
    const contactForm = document.getElementById('b2b-form');
    const successMsg = document.getElementById('form-success');
    
    if (successMsg) {
        successMsg.style.display = 'none';
        successMsg.style.opacity = '0';
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = "SENDING...";
                btn.style.opacity = "0.6";
                btn.style.pointerEvents = "none";
            }

            const formData = new FormData(this);

            try {
                // Silently sends form data to FormSubmit
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.style.display = 'none';
                    successMsg.style.display = 'flex'; 
                    
                    setTimeout(() => {
                        successMsg.style.opacity = '1';
                        successMsg.style.transform = 'translateY(0)';
                    }, 50);
                    
                } else {
                    btn.innerHTML = "ERROR. TRY AGAIN.";
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                }
            } catch (error) {
                btn.innerHTML = "NETWORK ERROR.";
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto";
            }
        });
    }

    // 3. THE DUAL-LAYER ENERGY GLOBE (Meaningful & Visual)
    const canvas = document.getElementById('core-reactor');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const OUTER_COUNT = 180; 
    const INNER_COUNT = 100; 
    const OUTER_RADIUS = 220; 
    const INNER_RADIUS = 120; 
    const PERSPECTIVE = 800;

    class GlobeParticle {
        constructor(isInner) {
            this.isInner = isInner;
            this.radius = isInner ? INNER_RADIUS : OUTER_RADIUS;
            this.theta = Math.random() * Math.PI * 2;
            this.phi = Math.acos((Math.random() * 2) - 1);
            this.spinSpeed = isInner ? 0 : (Math.random() * 0.005) - 0.002;
        }

        update() {
            this.theta += this.spinSpeed;

            this.x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = this.radius * Math.cos(this.phi);

            let color, size;
            if (!this.isInner) {
                color = '139, 107, 74'; 
                size = 1.8 + Math.random() * 1.5; 
            } else {
                color = '94, 166, 71'; 
                size = 3.5; 
            }

            return { x: this.x, y: this.y, z: this.z, color, size, isInner: this.isInner };
        }
    }

    for (let i = 0; i < OUTER_COUNT; i++) particles.push(new GlobeParticle(false));
    for (let i = 0; i < INNER_COUNT; i++) particles.push(new GlobeParticle(true));

    let globalRotationX = 0.2; 
    let globalRotationY = 0;

    function animateGlobe() {
        ctx.clearRect(0, 0, width, height);

        globalRotationY += 0.003; 

        const projected = [];
        const mobileScale = width < 768 ? 0.6 : 1; 

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i].update();

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

            projected.push({
                x: screenX, y: screenY, 
                size: p.size * scale, 
                color: p.color, alpha: alpha, 
                z: z2, isInner: p.isInner
            });
        }

        projected.sort((a, b) => b.z - a.z);

        ctx.lineWidth = 1.2; 
        for (let i = 0; i < projected.length; i++) {
            const p1 = projected[i];
            
            if(p1.isInner && p1.alpha > 0.4) {
                for (let j = i + 1; j < Math.min(i + 15, projected.length); j++) {
                    const p2 = projected[j];
                    if(p2.isInner) {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        if ((dx*dx + dy*dy) < 3500 * mobileScale) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(94, 166, 71, ${p1.alpha * 0.4})`; 
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        projected.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animateGlobe);
    }

    animateGlobe();
});