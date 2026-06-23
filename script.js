/* ══════════════════════════════════════════════════════════════
   SARATH BIJUKUMAR — PORTFOLIO JAVASCRIPT v2.0
   ══════════════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ─── PRELOADER ───────────────────────────────────────────────
    const loader = document.getElementById("loader");
    const loaderText = loader.querySelector(".loader-text");

    const loaderMessages = [
        "Connecting to systems...",
        "Loading inventory data...",
        "Applying FIFO protocols...",
        "Initializing portfolio...",
        "Welcome."
    ];
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < loaderMessages.length) {
            loaderText.style.opacity = "0";
            setTimeout(() => {
                loaderText.textContent = loaderMessages[msgIndex];
                loaderText.style.transition = "opacity 0.3s ease";
                loaderText.style.opacity = "1";
            }, 300);
        }
    }, 480);

    setTimeout(() => {
        clearInterval(msgInterval);
        loader.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        loader.style.opacity = "0";
        loader.style.transform = "scale(1.03)";
        setTimeout(() => {
            loader.style.display = "none";
        }, 700);
    }, 2600);


    // ─── SVG GRADIENT DEFINITION for Language Rings ──────────────
    // Inject a <defs> into the first SVG for the gradient
    document.querySelectorAll('.lang-ring').forEach((svg, i) => {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const gradId = `lang-grad-${i}`;
        defs.innerHTML = `
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00e5ff"/>
                <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
        const fill = svg.querySelector('.ring-fill');
        if (fill) fill.setAttribute('stroke', `url(#${gradId})`);
    });


    // ─── PARTICLE CANVAS ─────────────────────────────────────────
    const canvas = document.getElementById("hero-canvas") || document.getElementById("particle-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;

    let mouse = { x: null, y: null };
    let W = 0, H = 0;
    let particles = [];
    const MAX_PARTICLES = 55;
    const MAX_DIST = 130;
    const homeSection = document.getElementById("home");

    function resize() {
        if (!canvas) return;
        if (canvas.id === "hero-canvas" && homeSection) {
            W = canvas.width = homeSection.offsetWidth;
            H = canvas.height = homeSection.offsetHeight;
        } else {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
    }
    resize();
    window.addEventListener("resize", () => { resize(); initParticles(); });

    window.addEventListener("mousemove", e => {
        if (canvas && canvas.id === "hero-canvas" && homeSection) {
            const rect = homeSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        } else {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    });
    window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.r = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.35 + 0.05;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset();
        }
        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle());
    }
    initParticles();

    function drawConnections() {
        if (!ctx) return;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(loop);
    }
    loop();



    // ─── SCROLL PROGRESS BAR ─────────────────────────────────────
    const progressBar = document.getElementById("scroll-progress-bar");
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
        progressBar.style.width = pct + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });


    // ─── HEADER SCROLL BEHAVIOR ───────────────────────────────────
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });


    // ─── MOBILE NAV TOGGLE ───────────────────────────────────────
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("open");
        navMenu.classList.toggle("open");
    });
    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("open");
            navMenu.classList.remove("open");
        });
    });


    // ─── SCROLLSPY (nav active states) ───────────────────────────
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateScrollSpy() {
        let current = "";
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    }
    window.addEventListener("scroll", updateScrollSpy, { passive: true });


    // ─── ROTATING HERO ROLES ─────────────────────────────────────
    const roleItems = document.querySelectorAll(".role-item");
    let riIndex = 0;

    function rotateRole() {
        if (roleItems.length === 0) return;
        const current = roleItems[riIndex];
        current.classList.add("ri-exit");
        current.classList.remove("ri-active");
        setTimeout(() => {
            current.classList.remove("ri-exit");
            riIndex = (riIndex + 1) % roleItems.length;
            roleItems[riIndex].classList.add("ri-active");
        }, 500);
    }
    if (roleItems.length > 0) {
        setInterval(rotateRole, 3200);
    }


    // ─── SECTION REVEAL (Intersection Observer) ──────────────────
    const revealSections = document.querySelectorAll(".reveal-section");
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    revealSections.forEach(sec => revealObs.observe(sec));


    // ─── SKILL BAR FILLS ─────────────────────────────────────────
    const skillBars = document.querySelectorAll(".skill-bar-fill");
    let skillsFired = false;
    const skillsSection = document.getElementById("skills");

    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsFired) {
                skillsFired = true;
                skillBars.forEach(bar => {
                    const pct = bar.getAttribute("data-progress");
                    setTimeout(() => { bar.style.width = pct + "%"; }, 200);
                });
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    if (skillsSection) skillObs.observe(skillsSection);


    // ─── LANGUAGE RING ANIMATIONS ────────────────────────────────
    const langCards = document.querySelectorAll(".lang-card");
    const CIRCUMFERENCE = 2 * Math.PI * 50; // r=50

    const langObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const pct = parseInt(card.getAttribute("data-pct")) || 0;
                const fill = card.querySelector(".ring-fill");
                if (fill) {
                    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
                    fill.style.strokeDasharray = CIRCUMFERENCE;
                    fill.style.strokeDashoffset = CIRCUMFERENCE;
                    setTimeout(() => {
                        fill.style.strokeDashoffset = offset;
                    }, 300);
                }
                langObs.unobserve(card);
            }
        });
    }, { threshold: 0.4 });
    langCards.forEach(card => langObs.observe(card));


    // ─── GSAP SCROLL ANIMATIONS ──────────────────────────────────
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Section headers stagger
        gsap.utils.toArray(".section-label, .section-title, .section-sub").forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 88%" },
                opacity: 0, y: 30, duration: 0.7, ease: "power2.out"
            });
        });

        // About grid
        gsap.from(".about-text-block", {
            scrollTrigger: { trigger: "#about", start: "top 75%" },
            opacity: 0, x: -40, duration: 0.8, ease: "power2.out"
        });
        gsap.from(".about-cards-grid .mini-card", {
            scrollTrigger: { trigger: "#about", start: "top 70%" },
            opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: "power2.out"
        });

        // Experience card
        gsap.from(".exp-card", {
            scrollTrigger: { trigger: "#experience", start: "top 75%" },
            opacity: 0, y: 40, duration: 0.9, ease: "power2.out"
        });
        gsap.from(".resp-item", {
            scrollTrigger: { trigger: ".exp-responsibilities", start: "top 80%" },
            opacity: 0, x: -20, stagger: 0.08, duration: 0.5, ease: "power2.out"
        });

        // Education cards
        gsap.from(".edu-item", {
            scrollTrigger: { trigger: "#education", start: "top 75%" },
            opacity: 0, y: 50, stagger: 0.25, duration: 0.8, ease: "power2.out"
        });

        // Skill cards
        gsap.from(".skill-card", {
            scrollTrigger: { trigger: "#skills", start: "top 75%" },
            opacity: 0, y: 25, stagger: 0.07, duration: 0.6, ease: "power2.out"
        });

        // Portfolio cards
        gsap.from(".pf-card", {
            scrollTrigger: { trigger: "#portfolio", start: "top 75%" },
            opacity: 0, y: 40, stagger: 0.1, duration: 0.6, ease: "power2.out"
        });

        // Contact section
        gsap.from(".cinfo-card, .contact-quote", {
            scrollTrigger: { trigger: "#contact", start: "top 75%" },
            opacity: 0, x: -30, stagger: 0.15, duration: 0.7, ease: "power2.out"
        });
        gsap.from(".contact-form-card", {
            scrollTrigger: { trigger: "#contact", start: "top 75%" },
            opacity: 0, x: 30, duration: 0.8, ease: "power2.out"
        });
    }



    // ─── BACK TO TOP ─────────────────────────────────────────────
    const bttBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        bttBtn.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    bttBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // ─── CONTACT FORM SUBMISSION ─────────────────────────────────
    const form = document.getElementById("contact-form");
    const successModal = document.getElementById("success-modal");
    const closeSuccessBtn = document.getElementById("close-success-modal");

    form.addEventListener("submit", e => {
        e.preventDefault();
        const btn = form.querySelector("button[type=submit]");
        const btnSpan = btn.querySelector("span");
        const btnIcon = btn.querySelector("i");

        // Loading state
        btn.disabled = true;
        btnSpan.textContent = "Sending...";
        btnIcon.className = "fa-solid fa-spinner fa-spin";

        // Simulate send
        setTimeout(() => {
            btn.disabled = false;
            btnSpan.textContent = "Send Message";
            btnIcon.className = "fa-solid fa-paper-plane";
            form.reset();
            successModal.classList.add("open");
            document.body.style.overflow = "hidden";
        }, 1600);
    });

    function closeModal() {
        successModal.classList.remove("open");
        document.body.style.overflow = "";
    }

    closeSuccessBtn?.addEventListener("click", closeModal);
    successModal?.addEventListener("click", e => {
        if (e.target === successModal) closeModal();
    });


    // ─── SMOOTH NAV LINK SCROLL ──────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const targetId = anchor.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

});
