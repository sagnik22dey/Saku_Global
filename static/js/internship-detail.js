(function () {
  "use strict";

  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  function bullets(n) {
    return (
      '<ul class="bullets">' +
      Array.from({ length: n }, () => `<li>${LOREM}</li>`).join("") +
      "</ul>"
    );
  }

  function init() {
    if (!window.SAKU_GET_INTERNSHIP) return;
    const i = window.SAKU_GET_INTERNSHIP(param("id"));
    document.title = i.title + " \u2014 SAKU Global Tech Labs";

    document.getElementById("internHead").innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/internships">Internship</a> <span>/</span> <span>${i.title}</span></nav>
      <span class="badge badge--ghost">${i.mode} \u00b7 ${i.duration}</span>
      <h1 class="h1">${i.title}</h1>
      <p class="lead">${i.excerpt}</p>`;

    document.getElementById("internBody").innerHTML = `
      <div class="course-detail__media"><img src="https://picsum.photos/seed/${i.seed}/960/540" alt="${i.title} workspace" loading="eager" /></div>
      <div class="detail-section">
        <h3>Eligibility</h3>
        <div class="elig-grid">
          <span class="chip">Engineering Students</span>
          <span class="chip">Postgraduate</span>
          <span class="chip">Undergraduate</span>
          <span class="chip">Management</span>
          <span class="chip">Arts, Commerce, Sciences &amp; Others</span>
        </div>
      </div>
      <div class="prose detail-section">
        <h3>Responsibilities</h3>${bullets(3)}
        <h3>Requirements</h3>${bullets(2)}
        <h3>Perks &amp; Benefits</h3>${bullets(2)}
      </div>`;

    document.getElementById("internApply").innerHTML = `
      <div class="enroll-card">
        <span class="enroll-card__price">Apply Now</span>
        <p class="text-muted">${i.mode} \u00b7 ${i.duration}</p>
        <form data-form="apply">
          <div class="field"><label for="an">Full Name *</label><input id="an" name="name" type="text" required /></div>
          <div class="field"><label for="ae">Email *</label><input id="ae" name="email" type="email" required /></div>
          <button class="btn btn--primary" type="submit" style="width:100%;margin-top:14px">Apply for Internship</button>
        </form>
      </div>`;

    if (window.SAKU_REVEAL) window.SAKU_REVEAL();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
