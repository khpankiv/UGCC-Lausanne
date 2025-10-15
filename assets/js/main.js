// Кастомний перемикач мов
document.addEventListener('DOMContentLoaded', function () {
  var langBtn = document.querySelector('.lang-btn');
  var langList = document.querySelector('.lang-list');
  if (!langBtn || !langList) return;
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var expanded = langBtn.getAttribute('aria-expanded') === 'true';
    langBtn.setAttribute('aria-expanded', !expanded);
    langList.hidden = expanded;
  });
  langList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      langList.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', function (e) {
    if (!langList.hidden) {
      langList.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  heroSlider();
  carousels();
});

function heroSlider() {
  const root = qs('.hero');
  if (!root) return;
  // Support both the existing .slides/.slide and generic .flex-row/.card
  const track = qs('.slides', root) || qs('.flex-row', root);
  const slides = qsa('.slide', track).length ? qsa('.slide', track) : qsa('.card', track);
  const dots = qsa('.dots button', root);

  const updateActive = () => {
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((b, k) => b.classList.toggle('active', k === idx));
  };

  // Dots jump to slide (mobile primarily)
  dots.forEach((b, k) =>
    b.addEventListener('click', () => track.scrollTo({ left: k * track.clientWidth, behavior: 'smooth' }))
  );

  // Desktop drag-to-scroll
  const isDesktop = window.matchMedia('(min-width: 901px)').matches;
  if (isDesktop) {
    let isDown = false,
      startX = 0,
      startLeft = 0;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      startLeft = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      track.scrollLeft = startLeft - dx;
    });
  }

  track.addEventListener('scroll', updateActive);
  updateActive();
}

function carousels() {
  qsa('.carousel').forEach((c) => {
    const track = qs('.carousel-track', c);
    const prev = qs('.carousel .nav .prev', c);
    const next = qs('.carousel .nav .next', c);
    prev.addEventListener('click', () => track.scrollBy({ left: -340, behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: 340, behavior: 'smooth' }));
  });
}

