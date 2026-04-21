const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector(".site-nav");
const navLinks = siteNav ? [...siteNav.querySelectorAll("a")] : [];
const revealItems = [...document.querySelectorAll(".reveal")];
const sections = [...document.querySelectorAll("main section[id]")];
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -48px 0px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) {
      return;
    }

    const activeId = visibleSection.target.id;

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isMatch);
    });
  },
  {
    threshold: 0.35,
    rootMargin: "-20% 0px -45% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));
