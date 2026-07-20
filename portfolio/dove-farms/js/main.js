document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const navigation = document.querySelector("#primaryNavigation");
  const links = navigation?.querySelectorAll("a[href^='#']") || [];

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navigation.classList.contains("show")) return;
      const collapse = bootstrap.Collapse.getOrCreateInstance(navigation);
      collapse.hide();
    });
  });
});
