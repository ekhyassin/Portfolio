// 1. Core Logic (Menu, Theme, Nav) - Runs Immediately
// This ensures the site functions even if animations are waiting to load

// Menu Toggle
const menu = document.getElementById("menu");
const actions = document.getElementById("actions");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

// Mobile Menu Toggle
function handleMenu() {
  const menuBtn = document.getElementById("menu");
  const actionsMenu = document.getElementById("actions");
  if (menuBtn && actionsMenu) {
    menuBtn.classList.toggle("is-active");
    actionsMenu.classList.toggle("is-active");
  }
}

if (menu) {
  menu.addEventListener("click", () => {
    handleMenu();
  });
}

// Close mobile menu and smooth scroll when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId.startsWith("#")) return; // Handle external links if any

    e.preventDefault();
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      if (actions.classList.contains("is-active")) {
        handleMenu();
      }

      gsap.to(window, {
        duration: 0.8, // Slightly faster for responsiveness
        scrollTo: {
          y: targetSection,
          offsetY: 70, // Slightly reduced for better alignment
        },
        ease: "power2.out",
      });
    }
  });
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");

  // Update icon
  const icon = themeToggle.querySelector("i");
  if (icon) {
    if (isDark) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }

  // Save preference
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    const icon = themeToggle ? themeToggle.querySelector("i") : null;
    if (icon) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  }
}

if (themeToggle) {
  loadTheme();
  themeToggle.addEventListener("click", toggleTheme);
}

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Update Active Link on Scroll
function updateActiveLink() {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}
window.addEventListener("scroll", updateActiveLink);

// 2. Typing Effect (Runs independently)
const typingText = document.querySelector(".typing-text");
function initTyping() {
  if (typingText) {
    const words = [
      "Computer Engineer",
      "Flutter Developer",
      "Mobile App Developer",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }
}

// 3. Animation Logic
// Pre-register plugins
if (typeof gsap !== "undefined") {
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== "undefined")
    gsap.registerPlugin(ScrollToPlugin);
}

// Start Preloader Earlier
function initPreloader() {
  const canvas = document.getElementById("preloader-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.life = Math.random() * 0.5 + 0.5;
        this.opacity = 0;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.opacity < this.life) this.opacity += 0.01;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
          this.reset();
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      window.particleAnimId = requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // PRELOADER TIMELINE
  const preloaderTl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove("no-scroll");
      revealSite();
      initTyping();
      initSiteAnimations(); // Trigger remaining animations immediately after preloader
    },
  });

  preloaderTl
    .to(".loader-image-container", {
      scale: 1,
      opacity: 1,
      duration: 0.4, // Faster entrance
      ease: "elastic.out(1, 0.75)",
    })
    .to(
      ".luxury-text .letter",
      {
        y: 0,
        opacity: 1,
        duration: 0.3, // Faster text
        stagger: 0.02, // Faster typing
        ease: "power3.out",
      },
      "-=0.2",
    )
    .to(
      ".loader-progress-luxury",
      {
        width: "100%",
        duration: 0.4, // Faster progress bar
        ease: "power2.inOut",
      },
      "-=0.1",
    )
    .to(
      ".loader-bar-luxury",
      {
        opacity: 0,
        duration: 0.1,
      },
      "<",
    )
    .to(".loader-content", {
      y: -20,
      opacity: 0,
      duration: 0.2, // Faster exit
      ease: "power2.in",
    })
    .to(
      ".preloader",
      {
        opacity: 0,
        duration: 0.4, // Faster fade out
        ease: "power2.inOut",
      },
      "-=0.1",
    )
    .set(".preloader", { display: "none" })
    .add(() => {
      if (window.particleAnimId) cancelAnimationFrame(window.particleAnimId);
    });
}

function prepareInitialStates() {
  if (typeof gsap === "undefined") return;

  // Immediately hide Home section elements to prevent them from being visible
  // during the preloader fade-out, ensuring a smooth entrance animation.
  gsap.set(
    ".home .content_text h4, .home .content_text h1, .home .content_text h3, .home .content_text .btn",
    {
      y: 30,
      autoAlpha: 0,
    },
  );

  gsap.set(".home .social a", {
    y: 20,
    autoAlpha: 0,
  });

  gsap.set(".home .container-image", {
    x: 30,
    autoAlpha: 0,
    scale: 0.95,
  });
}

// Hero Reveal function (called when preloader finished)
function revealSite() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.fromTo(
    ".home .content_text h4",
    { y: 30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5 },
  )
    .fromTo(
      ".home .content_text h1",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5 },
      "-=0.4",
    )
    .fromTo(
      ".home .content_text h3",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5 },
      "-=0.4",
    )
    .fromTo(
      ".home .content_text .btn",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5 },
      "-=0.4",
    )
    .fromTo(
      ".home .social a",
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05 },
      "-=0.4",
    )
    .fromTo(
      ".home .container-image",
      { x: 30, autoAlpha: 0, scale: 0.95 },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          // Animation complete
        },
      },
      "-=0.6",
    );
}

// 4. Initializing Site Animations (Previously in window.load)
function initSiteAnimations() {
  if (typeof gsap === "undefined") return;

  // Scroll triggering logic
  // --- SCROLL ANIMATIONS ---

  // Text Reveal Logic
  const textRevealElements = document.querySelectorAll(".text-reveal-anim");
  textRevealElements.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 50, autoAlpha: 0, rotationX: -20 },
      {
        y: 0,
        autoAlpha: 1,
        rotationX: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // About Section
  if (document.querySelector(".about")) {
    gsap.fromTo(
      ".about .container-image",
      { x: -50, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.8,
        scrollTrigger: { trigger: ".about", start: "top 75%" },
      },
    );
    gsap.fromTo(
      ".about .content_text > *",
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: ".about", start: "top 75%" },
      },
    );
  }

  // Projects Section
  const projects = document.querySelectorAll(".card-project");
  if (projects.length > 0) {
    gsap.fromTo(
      projects,
      { y: 50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".projects",
          start: "top 85%",
        },
      },
    );
  }

  // Services Section
  const serviceCards = document.querySelectorAll(".services .card");
  if (serviceCards.length > 0) {
    gsap.fromTo(
      serviceCards,
      { scale: 0.8, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".services",
          start: "top 85%",
        },
      },
    );
  }

  // Skills Section
  const skills = document.querySelectorAll(".skill");
  if (skills.length > 0) {
    gsap.fromTo(
      skills,
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.4,
        stagger: {
          each: 0.03,
          grid: "auto",
          from: "center",
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 85%",
        },
      },
    );
  }

  // --- INTERACTION ---

  // Vanilla Tilt Init
  if (typeof VanillaTilt !== "undefined") {
    const tiltElements = document.querySelectorAll(
      ".card-project, .services .card",
    );
    Array.from(tiltElements).forEach((el) => {
      VanillaTilt.init(el, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.02,
      });
    });
  }

  // Parallax Effect
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    document.body.style.setProperty("--mouse-x", mouseX + "px");
    document.body.style.setProperty("--mouse-y", mouseY + "px");
  });

  // Magnetic Hover
  const magneticElements = document.querySelectorAll(".btn, .social a");
  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });

  // Final Refresh to ensure positioning is correct
  ScrollTrigger.refresh();
}

// Run preloader immediately
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("no-scroll");
  prepareInitialStates();
  initPreloader();
});

// Initial Load Handling
window.addEventListener("load", () => {
  // We keep some interactions that don't depend on ScrollTrigger logic if needed
  // However, most site logic is now moved to initSiteAnimations() triggered by preloader
  ScrollTrigger.refresh();
});
