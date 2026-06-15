(function () {
  "use strict";

  var currentIndex = 0;
  var autoTimer = null;
  var tracks = window.SAKU_TRACKS || [];

  function renderCard(track, direction) {
    var animDir = direction === "left" ? "translateX(-40px)" : "translateX(40px)";
    var topicsHtml = track.topics
      .map(function (t) { return '<li class="track-card__topic"><span class="track-card__check">&#10003;</span> ' + t + "</li>"; })
      .join("");

    return (
      '<div class="track-card" style="animation:trackCardIn 0.45s ' + (direction === "left" ? "0.35s" : "0s") + ' var(--ease) forwards;opacity:0;transform:' + animDir + '">' +
        '<div class="track-card__media">' +
          '<img src="' + track.image + '" alt="' + track.name + ' course track" loading="lazy" />' +
        "</div>" +
        '<div class="track-card__body">' +
          '<div class="track-card__badge">' + track.courseCount + ' Courses &middot; ' + track.duration + '</div>' +
          '<h3 class="track-card__name">' + track.name + "</h3>" +
          '<p class="track-card__desc">' + track.description + "</p>" +
          '<ul class="track-card__topics">' + topicsHtml + "</ul>" +
          '<div class="track-card__actions">' +
            '<a class="track-card__cta" href="' + track.link + '">Know More</a>' +
            '<a class="track-card__link" href="/courses">View all courses &rarr;</a>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function showTrack(index, direction) {
    var card = document.getElementById("courseSliderCard");
    if (!card || !tracks.length) return;

    var dir = direction || (index > currentIndex ? "right" : "left");
    currentIndex = index;

    card.innerHTML = renderCard(tracks[index], dir);

    // Activate the correct tab
    var btns = document.querySelectorAll(".course-tab-btn");
    btns.forEach(function (b, i) {
      b.classList.toggle("is-active", i === index);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      showTrack((currentIndex + 1) % tracks.length, "right");
    }, 5000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function init() {
    if (!tracks.length) return;

    // Render initial card
    showTrack(0, "right");

    // Tab click handler
    var tabBar = document.getElementById("courseTabBar");
    if (tabBar) {
      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".course-tab-btn");
        if (!btn) return;
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        if (idx === currentIndex) return;
        showTrack(idx, idx > currentIndex ? "right" : "left");
        startAuto();
      });
    }

    // Touch / swipe support
    var slider = document.getElementById("courseSlider");
    if (slider) {
      var startX = 0;
      slider.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
        stopAuto();
      }, { passive: true });
      slider.addEventListener("touchend", function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < tracks.length - 1) {
            showTrack(currentIndex + 1, "right");
          } else if (diff < 0 && currentIndex > 0) {
            showTrack(currentIndex - 1, "left");
          }
        }
        startAuto();
      }, { passive: true });
    }

    startAuto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
