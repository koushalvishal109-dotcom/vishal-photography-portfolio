(() => {
  'use strict';
  const photos = window.PORTFOLIO_PHOTOS || [];
  const collections = window.PORTFOLIO_COLLECTIONS || [];
  const collectionGrid = document.getElementById('collection-grid');
  const photoGrid = document.getElementById('photo-grid');
  const filters = document.getElementById('filters');
  const photoCount = document.getElementById('photo-count');
  const emptyState = document.getElementById('empty-state');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  let activeFilter = 'all';
  let visiblePhotos = photos.slice();
  let currentIndex = 0;
  let lastFocused = null;

  document.getElementById('current-year').textContent = String(new Date().getFullYear());
  photoCount.textContent = `${photos.length} photographs`;

  function renderCollections() {
    collectionGrid.innerHTML = collections.map((collection, index) => `
      <a class="collection-card" href="#archive" data-collection="${collection.key}" aria-label="View ${collection.name} photographs">
        <div class="collection-image"><img src="${collection.cover}" alt="${collection.name} collection, ${collection.subtitle}" loading="lazy" decoding="async"></div>
        <div class="collection-meta"><span>${String(index + 1).padStart(2, '0')} / ${collection.type}</span><span>${collection.count} frames</span></div>
        <h3 class="collection-title">${collection.name}</h3>
        <p class="collection-description">${collection.description}</p>
      </a>`).join('');

    collectionGrid.querySelectorAll('[data-collection]').forEach(card => {
      card.addEventListener('click', () => setFilter(card.dataset.collection));
    });
  }

  function renderFilters() {
    const buttons = collections.map(collection => `<button class="filter-button" type="button" data-filter="${collection.key}" aria-pressed="false">${collection.name}</button>`).join('');
    filters.insertAdjacentHTML('beforeend', buttons);
    filters.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => setFilter(button.dataset.filter));
    });
  }

  function sizePhotoCard(card) {
    if (!card) return;
    const image = card.querySelector('img');
    const caption = card.querySelector('figcaption');
    if (!image || !caption || !image.complete || !image.naturalHeight) return;
    const gridStyle = getComputedStyle(photoGrid);
    const rowHeight = Number.parseFloat(gridStyle.gridAutoRows) || 8;
    const rowGap = Number.parseFloat(gridStyle.rowGap) || 12;
    const contentHeight = image.getBoundingClientRect().height + caption.getBoundingClientRect().height;
    const rowSpan = Math.max(1, Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap)));
    card.style.gridRowEnd = `span ${rowSpan}`;
  }

  const photoResizeObserver = 'ResizeObserver' in window
    ? new ResizeObserver(entries => {
        entries.forEach(entry => sizePhotoCard(entry.target.closest('.photo-card')));
      })
    : null;

  function renderPhotos() {
    visiblePhotos = activeFilter === 'all' ? photos.slice() : photos.filter(photo => photo.key === activeFilter);
    photoGrid.innerHTML = visiblePhotos.map((photo, index) => `
      <figure class="photo-card" data-index="${index}" tabindex="0" role="button" aria-label="Open ${photo.title}">
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">
        <figcaption><strong>${photo.title}</strong><span>${photo.collection}</span></figcaption>
      </figure>`).join('');
    photoCount.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? 'photograph' : 'photographs'}`;
    emptyState.hidden = visiblePhotos.length !== 0;

    photoGrid.querySelectorAll('.photo-card').forEach(card => {
      const image = card.querySelector('img');
      const caption = card.querySelector('figcaption');
      [image, caption].forEach(target => {
        if (photoResizeObserver) photoResizeObserver.observe(target);
      });
      image.addEventListener('load', () => sizePhotoCard(card), { once: true });
      if (image.complete) sizePhotoCard(card);

      const open = () => openLightbox(Number(card.dataset.index));
      card.addEventListener('click', open);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });
  }

  function setFilter(filter) {
    activeFilter = filter;
    filters.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderPhotos();
  }

  function updateLightbox() {
    const photo = visiblePhotos[currentIndex];
    if (!photo) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxTitle.textContent = `${photo.title} · ${photo.collection}`;
    lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visiblePhotos.length).padStart(2, '0')}`;
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    updateLightbox();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    document.getElementById('lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    lightboxImage.src = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function moveLightbox(direction) {
    if (!visiblePhotos.length) return;
    currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    updateLightbox();
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => moveLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => moveLightbox(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));

  renderCollections();
  renderFilters();
  renderPhotos();
})();
