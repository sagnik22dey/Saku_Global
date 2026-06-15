(function () {
  "use strict";

  const BRAND_SVG = `<svg class="nav__brand-icon" viewBox="0 0 120 120" width="52" height="52" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="60" rx="50" ry="22" stroke="#19352d" stroke-width="1.8" transform="rotate(0 60 60)"/>
    <ellipse cx="60" cy="60" rx="50" ry="22" stroke="#19352d" stroke-width="1.8" transform="rotate(60 60 60)"/>
    <ellipse cx="60" cy="60" rx="50" ry="22" stroke="#19352d" stroke-width="1.8" transform="rotate(-60 60 60)"/>
    <circle cx="60" cy="60" r="3.5" fill="#19352d"/>
    <circle cx="110" cy="60" r="2.8" fill="#19352d"/>
    <circle cx="85" cy="16.7" r="2.8" fill="#19352d"/>
    <circle cx="35" cy="16.7" r="2.8" fill="#19352d"/>
    <circle cx="10" cy="60" r="2.8" fill="#19352d"/>
    <circle cx="35" cy="103.3" r="2.8" fill="#19352d"/>
    <circle cx="85" cy="103.3" r="2.8" fill="#19352d"/>
  </svg>`;

  const BRAND = `
    ${BRAND_SVG}
    <span class="nav__brand-text">
      <span class="nav__brand-name">SAKU GLOBAL</span>
      <span class="nav__brand-sub">TECH LABS</span>
    </span>`;

  const NAV_LINKS = [
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses", caret: true },
    { label: "Internship", href: "/internships", caret: true },
    { label: "International Education", href: "/what-we-offer" },
    { label: "Contacts Us", href: "/contact" },
  ];

  const CARET = `<svg class="nav__caret" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function buildHeader(current) {
    const links = NAV_LINKS.map((l) => {
      const active = l.href === current ? ' aria-current="page"' : "";
      return `<a class="nav__link" href="${l.href}"${active}>${l.label}${
        l.caret ? CARET : ""
      }</a>`;
    }).join("");

    return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container">
        <nav class="nav" aria-label="Primary">
          <a class="nav__brand" href="/" aria-label="SAKU Global home">${BRAND}</a>
          <div class="nav__menu" id="navMenu">${links}</div>
          <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navMenu">
              <svg class="icon-open" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <svg class="icon-close" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </nav>
      </div>
    </header>`;
  }

  const SOCIALS = [
    { label: "LinkedIn", path: "M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.8 2.5 4.8 5.75V21h-4v-4.99c0-1.19-.02-2.72-1.7-2.72-1.7 0-1.96 1.3-1.96 2.64V21h-4V9.75Z" },
    { label: "Twitter", path: "M21 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.8.4-1.6.8-2.5 1A3.9 3.9 0 0 0 11.5 9c0 .3 0 .6.1.9-3.3-.2-6.2-1.7-8.2-4.1-.3.6-.5 1.2-.5 2 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.8-.6.2-1.2.2-1.7.1.5 1.5 1.9 2.7 3.6 2.7A7.9 7.9 0 0 1 2 19.5 11 11 0 0 0 8 21.3c7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.3 1.9-2.1Z" },
    { label: "Instagram", path: "M12 8.6A3.4 3.4 0 1 0 12 15.4 3.4 3.4 0 0 0 12 8.6Zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Zm4.3-5.7a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM19 8.1c-.1-1.1-.3-2-1.1-2.8C17.1 4.5 16.2 4.3 15.1 4.2 14 4.1 10 4.1 8.9 4.2c-1.1.1-2 .3-2.8 1.1S5.1 7 5 8.1C4.9 9.2 4.9 13.2 5 14.3c.1 1.1.3 2 1.1 2.8.8.8 1.7 1 2.8 1.1 1.1.1 5.1.1 6.2 0 1.1-.1 2-.3 2.8-1.1.8-.8 1-1.7 1.1-2.8.1-1.1.1-5.1 0-6.2Zm-1.5 7.4c-.2.6-.7 1.1-1.3 1.3-.9.4-3.1.3-4.2.3s-3.3.1-4.2-.3c-.6-.2-1.1-.7-1.3-1.3-.4-.9-.3-3.1-.3-4.2s-.1-3.3.3-4.2c.2-.6.7-1.1 1.3-1.3.9-.4 3.1-.3 4.2-.3s3.3-.1 4.2.3c.6.2 1.1.7 1.3 1.3.4.9.3 3.1.3 4.2s.1 3.3-.3 4.2Z" },
    { label: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.7-1.8C18.3 5 12 5 12 5s-6.3 0-7.9.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.7 1.8C5.7 19 12 19 12 19s6.3 0 7.9-.4a2.5 2.5 0 0 0 1.7-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
  ];

  function socialLinks() {
    return SOCIALS.map(
      (s) =>
        `<a href="#" aria-label="${s.label}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${s.path}"/></svg></a>`
    ).join("");
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__col">
            <a class="footer__brand-mark" href="/">${BRAND}</a>
            <p class="footer__brand-text">Saku Global Tech Labs — where deep tech education meets industry demand. Shaping the engineers of tomorrow, today.</p>
            <div class="footer__social">${socialLinks()}</div>
          </div>
          <div class="footer__col">
            <h3>Program</h3>
            <ul>
              <li><a href="/courses">Artificial Intelligence</a></li>
              <li><a href="/semiconductor">Semiconductor</a></li>
              <li><a href="/courses">Cloud Computing</a></li>
              <li><a href="/courses">VLSI Design</a></li>
              <li><a href="/career-readiness">Pre-Placement</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/about">Advisory Board</a></li>
              <li><a href="/internships">Internships</a></li>
              <li><a href="/what-we-offer">International</a></li>
              <li><a href="/career-readiness">Careers</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h3>Explore</h3>
            <ul>
              <li><a href="/why-choose">Why Choose SAKU</a></li>
              <li><a href="/ai-training">AI Training</a></li>
              <li><a href="/higher-education">Higher Education</a></li>
              <li><a href="/industry-academia">Industry-Academia</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bar">
          <p>© ${year} | All Rights Reserved · <a href="/">www.SAKUGLOBAL.com</a></p>
          <div class="footer__bar-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  function wireMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  function wireScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function wireReveal() {
    const items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  window.SAKU_REVEAL = wireReveal;

  function init() {
    const current = window.location.pathname.replace(/\/$/, "") || "/";
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");
    if (headerSlot) headerSlot.innerHTML = buildHeader(current);
    if (footerSlot) footerSlot.innerHTML = buildFooter();
    wireMenu();
    wireScroll();
    wireReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
