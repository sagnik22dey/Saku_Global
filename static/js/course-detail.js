(function () {
  "use strict";

  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function init() {
    if (!window.SAKU_GET_COURSE) return;
    const c = window.SAKU_GET_COURSE(param("id"));
    document.title = c.title + " \u2014 SAKU Global Tech Labs";

    document.getElementById("courseHead").innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/courses">Courses</a> <span>/</span> <span>${c.title}</span></nav>
      <span class="eyebrow">${c.track}</span>
      <h1 class="h1">${c.title}</h1>
      <div class="course-meta-row" style="margin-top:8px">
        <span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Last updated: this month</span>
        <span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${c.duration}</span>
        <span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14M5 12h14M5 16h10"/></svg>Language: English</span>
      </div>`;

    document.getElementById("courseBody").innerHTML = `
      <div class="course-detail__media"><img src="https://picsum.photos/seed/${c.seed}/960/540" alt="${c.title} course banner" loading="eager" /></div>
      <div class="rating">
        <span class="rating__score">${c.rating.toFixed(1)}</span>
        <span class="stars" aria-label="${c.rating} out of 5">${window.SAKU_STARS(c.rating)}</span>
        <span class="text-muted">${c.reviews} Ratings \u00b7 ${c.learners} Learners</span>
      </div>
      <div class="prose">
        <h3>Course specification</h3>
        <p>${c.long}</p>
        <p class="text-muted">User review: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
        <h3>What you'll learn</h3>
        <ul class="bullets">${c.syllabus.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h3>Syllabus</h3>
        <div class="syllabus">${c.syllabus
          .map(
            (s, i) =>
              `<div class="syllabus__item"><span class="syllabus__num">0${
                i + 1
              }</span><div><strong>${s}</strong><p class="text-muted" style="margin:4px 0 0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div></div>`
          )
          .join("")}</div>
      </div>`;

    document.getElementById("enroll").innerHTML = `
      <div class="enroll-card">
        <span class="enroll-card__price">Enroll Today</span>
        <p class="text-muted">${c.level} \u00b7 ${c.duration} \u00b7 Certificate on completion</p>
        <form data-form="apply">
          <button class="btn btn--primary" type="submit" style="width:100%">Enroll Now</button>
        </form>
        <a class="btn btn--outline" href="#" style="width:100%">Download PDF</a>
        <ul class="spotlight__list" style="margin-top:6px">
          <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Live mentor support</li>
          <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Hands-on projects</li>
          <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Placement assistance</li>
        </ul>
      </div>`;

    if (window.SAKU_REVEAL) window.SAKU_REVEAL();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
