(function () {
  "use strict";

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => toast.classList.add("is-shown"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("is-shown"), 3600);
  }

  function validate(form) {
    let ok = true;
    form.querySelectorAll("[required]").forEach((el) => {
      const valid = el.value.trim() !== "" && el.checkValidity();
      el.style.borderColor = valid ? "" : "#c0392b";
      if (!valid) ok = false;
    });
    return ok;
  }

  function init() {
    document.querySelectorAll("form[data-form]").forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validate(form)) {
          showToast("Please fill in the required fields.");
          return;
        }
        const type = form.getAttribute("data-form");
        const msg =
          type === "apply"
            ? "Application received — our team will be in touch soon."
            : "Thank you! Your message has been sent.";
        showToast(msg);
        form.reset();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
