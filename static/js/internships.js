(function () {
  "use strict";

  function card(i) {
    return `
    <article class="intern-card reveal">
      <div class="intern-card__top">
        <h3>${i.title}</h3>
        <span class="badge badge--soft">${i.mode}</span>
      </div>
      <p>${i.excerpt}</p>
      <div class="card__meta"><span>${i.duration}</span></div>
      <a class="btn btn--primary" href="/internship?id=${i.id}">Apply for Internship</a>
    </article>`;
  }

  function init() {
    const grid = document.getElementById("internGrid");
    if (!grid || !window.SAKU_INTERNSHIPS) return;
    grid.innerHTML = window.SAKU_INTERNSHIPS.map(card).join("");
    if (window.SAKU_REVEAL) window.SAKU_REVEAL();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
