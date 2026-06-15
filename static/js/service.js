(function () {
  "use strict";

  const CHECK =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function cardsBlock(cards) {
    return `<div class="grid grid--3">${cards
      .map(
        (c) => `
      <article class="card reveal">
        <div class="card__body">
          <h2 class="card__title h3">${c.title}</h2>
          <p class="text-muted">Course specification</p>
          <p class="card__text">${c.text}</p>
          <div class="card__actions">
            <a class="btn btn--outline" href="${c.href}">View Course</a>
            <a class="btn btn--primary" href="/contact">Enroll Now</a>
          </div>
        </div>
      </article>`
      )
      .join("")}</div>`;
  }

  function featuresBlock(features) {
    return `<div class="grid grid--3">${features
      .map(
        (f) => `
      <div class="feature reveal">
        <span class="feature__icon">${CHECK}</span>
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </div>`
      )
      .join("")}</div>`;
  }

  function groupsBlock(groups) {
    return groups
      .map(
        (g) => `
      <div class="detail-section reveal">
        <h2 class="h3" style="margin-bottom:18px">${g.heading}</h2>
        <ul class="bullets" style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          ${g.items
            .map(
              (it) =>
                `<li style="display:flex;gap:12px;align-items:flex-start;color:var(--color-text-soft)"><span style="color:var(--color-accent-deep);flex:none;width:20px;height:20px">${CHECK}</span>${it}</li>`
            )
            .join("")}
        </ul>
      </div>`
      )
      .join("");
  }

  function init() {
    const root = document.getElementById("service-root");
    if (!root || !window.SAKU_SERVICES) return;
    const key = root.getAttribute("data-service");
    const s = window.SAKU_SERVICES[key];
    if (!s) return;

    document.title = s.title + " \u2014 SAKU Global Tech Labs";

    let body = "";
    if (s.cards) body = cardsBlock(s.cards);
    else if (s.features) body = featuresBlock(s.features);
    else if (s.groups) body = groupsBlock(s.groups);

    root.innerHTML = `
      <section class="page-hero page-hero--split">
        <div class="container">
          <div class="page-hero__grid">
            <div class="page-hero__inner">
              <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <span>${s.title}</span></nav>
              <span class="eyebrow">${s.eyebrow}</span>
              <h1 class="h1">${s.title}</h1>
              <p class="lead">${s.lead}</p>
              <div class="hero__actions"><a class="btn btn--primary" href="/contact">Talk to Us</a><a class="btn btn--outline" href="/what-we-offer">All Services</a></div>
            </div>
            <div class="page-hero__media reveal"><img src="https://picsum.photos/seed/${s.seed}/640/440" alt="${s.title}" loading="eager" /></div>
          </div>
        </div>
      </section>
      <section class="section"><div class="container">${body}</div></section>
      <section class="section" style="padding-top:0"><div class="container">
        <div class="cta-band reveal">
          <div><h2 class="h2">Partner with SAKU Global</h2><p>Bring future-ready deep-tech education and consulting to your institution or team.</p></div>
          <a class="btn btn--primary" href="/contact">Get in Touch</a>
        </div>
      </div></section>`;

    if (window.SAKU_REVEAL) window.SAKU_REVEAL();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
