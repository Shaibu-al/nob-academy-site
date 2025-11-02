
// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function(){
  const btn = document.querySelectorAll('.nav-toggle');
  btn.forEach(b => {
    b.addEventListener('click', ()=>{
      const nav = b.closest('.site').querySelector('.main-nav');
      const open = getComputedStyle(nav).display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      b.setAttribute('aria-expanded', String(!open));
    });
  });

  // IntersectionObserver for reveal animations
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('revealed');
      }
    });
  }, {threshold: 0.18});
  document.querySelectorAll('.feature-item, .section-fade, .stat').forEach(el => io.observe(el));

  // Testimonials carousel (simple)
  document.querySelectorAll('.testimonials').forEach(setupCarousel);
  function setupCarousel(wrapper){
    const slides = wrapper.querySelectorAll('.slide');
    if(!slides.length) return;
    let idx = 0;
    const show = (i) => {
      slides.forEach((s,si)=> s.style.transform = `translateX(${100*(si - i)}%)`);
    }
    show(0);
    // auto
    let timer = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4000);
    // pause on hover
    wrapper.addEventListener('mouseenter', ()=> clearInterval(timer));
    wrapper.addEventListener('mouseleave', ()=> timer = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4000));
    // controls
    const prev = wrapper.querySelector('.prev'), next = wrapper.querySelector('.next');
    if(prev && next){ prev.addEventListener('click', ()=> { idx = (idx-1+slides.length)%slides.length; show(idx); }); next.addEventListener('click', ()=> { idx = (idx+1)%slides.length; show(idx); }); }
  }

  // Counters (About page)
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.getAttribute('data-count');
    let started = false;
    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(e=>{
        if(e.isIntersecting && !started){
          started = true; let cur = 0; const step = Math.ceil(end / 60);
          const t = setInterval(()=>{ cur += step; if(cur >= end){ el.textContent = end; clearInterval(t);} else el.textContent = cur; }, 20);
          o.unobserve(el);
        }
      });
    }, {threshold: 0.5});
    obs.observe(el);
  });

  // FAQ accordion
  document.querySelectorAll('.faq .q').forEach(q => q.addEventListener('click', ()=>{
    const a = q.nextElementSibling;
    if(!a) return;
    const open = a.style.display === 'block';
    a.style.display = open ? 'none' : 'block';
  }));

  // Gallery lightbox (basic)
  document.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', ()=>{
    const src = img.src;
    const overlay = document.createElement('div');
    overlay.style.position='fixed';overlay.style.left=0;overlay.style.top=0;overlay.style.right=0;overlay.style.bottom=0;
    overlay.style.background='rgba(0,0,0,0.6)';overlay.style.display='flex';overlay.style.alignItems='center';overlay.style.justifyContent='center';overlay.style.zIndex=9999;
    const big = document.createElement('img'); big.src = src; big.style.maxWidth='90%'; big.style.maxHeight='90%'; big.style.borderRadius='8px';
    overlay.appendChild(big);
    overlay.addEventListener('click', ()=> document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  }));

  // Course filters (courses page)
  document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', ()=>{
    const cat = btn.getAttribute('data-cat');
    document.querySelectorAll('.course').forEach(c => {
      if(cat === 'all' || c.classList.contains(cat)) c.style.display = 'block'; else c.style.display = 'none';
    });
  }));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }));
});
