(() => {
  const root = document.body;
  const themeButton = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector("#theme-color-meta");
  const storedTheme = (() => { try { return localStorage.getItem("nashalj-theme"); } catch { return null; } })();
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = theme => {
    const dark = theme === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره");
      const icon = themeButton.querySelector(".theme-icon");
      const label = themeButton.querySelector(".theme-label");
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (label) label.textContent = dark ? "حالت روشن" : "حالت تیره";
    }
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#121a16" : "#172d24");
  };
  applyTheme(storedTheme || (systemDark ? "dark" : "light"));
  if (themeButton) themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("nashalj-theme", next); } catch {}
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "باز کردن فهرست");
    };
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "بستن فهرست" : "باز کردن فهرست");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealTargets = document.querySelectorAll(
    ".section-copy,.section-heading,.heritage-card,.heritage-footnote,.facts-grid>div,.culture-heading,.culture-list article,.craft-visual,.visit-notes>div,.archive-grid>div,.sources-wrap>div,.story-visual"
  );
  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    element.dataset.delay = String(index % 4);
  });
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".main-nav a")];
  if ("IntersectionObserver" in window && sections.length && links.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach(section => observer.observe(section));
  }
})();
