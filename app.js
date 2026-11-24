(() => {
  const data = window.PORTFOLIO, grid = document.querySelector('#project-grid');
  const projectDialog = document.querySelector('#project-dialog'), lightbox = document.querySelector('#lightbox');
  let activeFilter = 'all', currentImages = [], currentIndex = 0;
  document.addEventListener('contextmenu', e => { if (e.target.closest('img')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (e.target.closest('img')) e.preventDefault(); });
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-linkedin]').forEach(a => { if (data.linkedin) a.href = data.linkedin; else { a.href = '#contact'; a.removeAttribute('target'); } });
  function render() {
    const list = data.projects.filter(p => activeFilter === 'all' || (p.categories || [p.category]).includes(activeFilter));
    grid.innerHTML = list.map((p,i) => `<button class="project-card ${i===0?'featured-card':''}" data-project="${p.id}" style="--delay:${i*60}ms"><span class="project-image-wrap"><img loading="lazy" src="${p.cover}" alt="${p.title}"><span class="project-open">View project ↗</span></span><span class="project-meta"><span class="project-title">${p.title}</span><span class="project-category">${p.label}</span></span></button>`).join('');
    grid.querySelectorAll('[data-project]').forEach(el => el.addEventListener('click', () => openProject(data.projects.find(p=>p.id===el.dataset.project))));
    grid.querySelectorAll('.project-card').forEach(el => observer.observe(el));
  }
  function setFilter(filter) { activeFilter=filter; document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('selected',b.dataset.filter===filter)); render(); }
  document.querySelectorAll('.filter-chip,.category-card').forEach(b=>b.addEventListener('click',()=>{setFilter(b.dataset.filter);document.querySelector('#work').scrollIntoView({behavior:'smooth'});}));
  document.querySelector('#clear-filter').addEventListener('click',()=>setFilter('all'));
  function openProject(p) {
    const content=projectDialog.querySelector('.dialog-content');
    content.innerHTML=`<div class="dialog-heading"><p class="eyebrow">${p.label.toUpperCase()}</p><h2>${p.title}</h2><p>${p.description||''}</p></div><div class="dialog-gallery">${p.images.map((src,i)=>`<button class="dialog-image" data-image-index="${i}"><img loading="lazy" src="${src}" alt="${p.title} — view ${i+1}"><span>View image ↗</span></button>`).join('')}</div><div class="dialog-bottom"><span>${p.label}</span><button class="text-link dialog-next">Next project ↗</button></div>`;
    content.querySelectorAll('[data-image-index]').forEach(b=>b.addEventListener('click',()=>showLightbox(p.images,Number(b.dataset.imageIndex),p.title)));
    content.querySelector('.dialog-next').addEventListener('click',()=>{const i=data.projects.indexOf(p);openProject(data.projects[(i+1)%data.projects.length]);projectDialog.scrollTop=0;});
    projectDialog.showModal(); projectDialog.scrollTop=0;
  }
  function showLightbox(images,index,title){currentImages=images;currentIndex=index;lightbox.querySelector('img').alt=title;updateLightbox();lightbox.showModal();}
  function updateLightbox(){lightbox.querySelector('img').src=currentImages[currentIndex];lightbox.querySelector('.lightbox-count').textContent=`${String(currentIndex+1).padStart(2,'0')} / ${String(currentImages.length).padStart(2,'0')}`;}
  const step=d=>{currentIndex=(currentIndex+d+currentImages.length)%currentImages.length;updateLightbox();};
  lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));lightbox.querySelector('.lightbox-next').addEventListener('click',()=>step(1));
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
  document.querySelectorAll('.dialog-close,.lightbox-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  [projectDialog,lightbox].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('nav-open',!open);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');}));
  document.querySelector('.hero-next').addEventListener('click',()=>document.querySelector('.categories').scrollIntoView({behavior:'smooth'}));
  const heroVideo=document.querySelector('.hero-video');
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    heroVideo.classList.add('is-active');
    heroVideo.play().catch(()=>{});
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.08});
  render(); document.querySelectorAll('.category-card,.section-heading,.project-card,.contact-section').forEach(el=>observer.observe(el));
})();
