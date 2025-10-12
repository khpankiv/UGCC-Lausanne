// Кастомний перемикач мов
document.addEventListener('DOMContentLoaded', function() {
  var langBtn = document.querySelector('.lang-btn');
  var langList = document.querySelector('.lang-list');
  if (!langBtn || !langList) return;
  langBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var expanded = langBtn.getAttribute('aria-expanded') === 'true';
    langBtn.setAttribute('aria-expanded', !expanded);
    langList.hidden = expanded;
  });
  langList.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      langList.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', function(e) {
    if (!langList.hidden) {
      langList.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
function qs(s,el=document){return el.querySelector(s)}
function qsa(s,el=document){return [...el.querySelectorAll(s)]}

document.addEventListener('DOMContentLoaded',()=>{
  heroSlider();
  carousels();
});

function heroSlider(){
  const root=qs('.hero'); if(!root) return;
  const slides=qsa('.slide',root); let i=0, timer=null;
  const show=idx=>{
    slides.forEach((s,j)=>s.style.display=j===idx?'grid':'none');
    qsa('.dots button',root).forEach((b,k)=>b.classList.toggle('active',k===idx));
    i=idx;
  };
  const prev=()=>show((i-1+slides.length)%slides.length);
  const next=()=>show((i+1)%slides.length);
  qs('.controls .prev',root).addEventListener('click',prev);
  qs('.controls .next',root).addEventListener('click',next);
  qsa('.dots button',root).forEach((b,k)=>b.addEventListener('click',()=>show(k)));
  const auto=()=>{ timer=setInterval(next,5000) };
  root.addEventListener('mouseenter',()=>clearInterval(timer));
  root.addEventListener('mouseleave',auto);
  show(0); auto();
}

function carousels(){
  qsa('.carousel').forEach(c=>{
    const track=qs('.carousel-track',c);
    const prev=qs('.carousel .nav .prev',c);
    const next=qs('.carousel .nav .next',c);
    prev.addEventListener('click',()=>track.scrollBy({left:-340,behavior:'smooth'}));
    next.addEventListener('click',()=>track.scrollBy({left: 340,behavior:'smooth'}));
  });
}
