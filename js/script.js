// 1. Core Logic (Menu, Theme, Nav) - Runs Immediately
// This ensures the site functions even if animations are waiting to load

// Menu Toggle
const menu = document.getElementById("menu");
const actions = document.getElementById("actions");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

// Mobile Menu Toggle
if (menu) {
  menu.addEventListener("click", () => {
    handleMenu();
  });
}

function handleMenu() {
  menu.classList.toggle("is-active");
  actions.classList.toggle("is-active");
}

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (actions.classList.contains("is-active")) {
      handleMenu();
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
  // Start typing slightly later to allow hero animation to start
  setTimeout(type, 2000);
}

// 3. Animation Logic - Runs on Window Load to ensure Layout
window.addEventListener("load", () => {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded. Animations disabled.");
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- HERO SECTION TIMELINE ---
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  // Use fromTo for better reliability
  tl.fromTo(
    ".home .content_text h4",
    { y: 50, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, delay: 0.2 },
  )
    .fromTo(
      ".home .content_text h1",
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1 },
      "-=0.8",
    )
    .fromTo(
      ".home .content_text h3",
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      "-=0.7",
    )
    .fromTo(
      ".home .content_text .btn",
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      "-=0.6",
    )
    .fromTo(
      ".home .social a",
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
      "-=0.6",
    )
    .fromTo(
      ".home .container-image",
      { x: 50, autoAlpha: 0, scale: 0.9 },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.75)",
        onComplete: () => ScrollTrigger.refresh(),
      },
      "-=1.2",
    );

  // --- SCROLL ANIMATIONS ---

  // Helper to setup scroll triggers
  const setupScrollAnim = (selector, formVars, toVars) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      gsap.fromTo(elements, formVars, {
        ...toVars,
        scrollTrigger: {
          trigger: elements, // Trigger when elements themselves enter
          start: "top 85%", // Trigger earlier (85% down viewport)
          toggleActions: "play none none reverse",
        },
      });
    }
  };

  // About Section
  if (document.querySelector(".about")) {
    gsap.fromTo(
      ".about .container-image",
      { x: -50, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 1.2,
        scrollTrigger: { trigger: ".about", start: "top 75%" },
      },
    );
    gsap.fromTo(
      ".about .content_text > *",
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: { trigger: ".about", start: "top 75%" },
      },
    );
  }

  // Projects Section - FIXING VISIBILITY
  // Using fromTo ensures start and end states are explicit
  // clearProps: "transform" ensures VanillaTilt can take over after animation
  const projects = document.querySelectorAll(".card-project");
  if (projects.length > 0) {
    gsap.fromTo(
      projects,
      { y: 50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "transform", // CRITICAL: Release transform control for VanillaTilt
        scrollTrigger: {
          trigger: ".projects", // Setup trigger on the section
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
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        clearProps: "transform", // CRITICAL for VanillaTilt
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
        duration: 0.6,
        stagger: {
          each: 0.05,
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

  // Vanilla Tilt Init - Safely
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

  // Refresh ScrollTrigger calculations
  ScrollTrigger.refresh();
});
