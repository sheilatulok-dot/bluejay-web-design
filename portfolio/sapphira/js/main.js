document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const navigation = document.querySelector("#primaryNavigation");
  const navigationLinks = document.querySelectorAll("#primaryNavigation a[href^='#']");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navigation?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navigation).hide();
      }
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
});
