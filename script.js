const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('.site-nav');
const navLinks = siteNav ? [...siteNav.querySelectorAll('a')] : [];
const yearNode = document.getElementById('year');

if (yearNode) yearNode.textContent = new Date().getFullYear();

if (navToggle && siteNav) {
  const closeNav = (restoreFocus = false) => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach(link => link.addEventListener('click', () => closeNav()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) closeNav(true);
  });
  document.addEventListener('click', event => {
    if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });
  const mobileQuery = window.matchMedia('(max-width: 650px)');
  mobileQuery.addEventListener('change', () => closeNav());
  document.documentElement.classList.add('nav-enhanced');
}

// Compare section starts, so long sections can still become the current location.
const linkedSections = navLinks.map(link => ({
  link,
  section: document.querySelector(link.getAttribute('href')),
})).filter(item => item.section);
let navFramePending = false;
const updateCurrentSection = () => {
  const marker = window.innerHeight * 0.3;
  let current = null;
  for (const item of linkedSections) {
    if (item.section.getBoundingClientRect().top <= marker) current = item;
  }
  for (const item of linkedSections) {
    if (item === current) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  }
  navFramePending = false;
};
const queueNavUpdate = () => {
  if (navFramePending) return;
  navFramePending = true;
  requestAnimationFrame(updateCurrentSection);
};
window.addEventListener('scroll', queueNavUpdate, { passive: true });
window.addEventListener('resize', queueNavUpdate);
window.addEventListener('load', queueNavUpdate);
updateCurrentSection();

// Load external video players only after the visitor opens the demo section.
document.querySelectorAll('.demo-details').forEach(details => {
  details.addEventListener('toggle', () => {
    details.querySelectorAll('iframe').forEach(frame => {
      if (details.open && frame.dataset.src) {
        frame.src = frame.dataset.src;
      } else if (!details.open) {
        frame.removeAttribute('src');
      }
    });
  });
});
