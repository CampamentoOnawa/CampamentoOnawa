/* =============================================
   GALLERY MODAL — Lightbox for Experience Cards
   ============================================= */
(function () {
    'use strict';

    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDesc = document.getElementById('galleryModalDesc');
    const closeBtn = document.getElementById('galleryModalClose');
    const prevBtn = document.getElementById('galleryModalPrev');
    const nextBtn = document.getElementById('galleryModalNext');
    const counter = document.getElementById('galleryModalCounter');

    if (!modal) return;

    const cards = Array.from(document.querySelectorAll('.experiences__card'));
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function getCardData(card) {
        const img = card.querySelector('img');
        const h3 = card.querySelector('.experiences__card-overlay h3');
        const p = card.querySelector('.experiences__card-overlay p');
        return {
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            title: h3 ? h3.textContent : '',
            desc: p ? p.textContent : ''
        };
    }

    function showImage(index) {
        currentIndex = index;
        const data = getCardData(cards[index]);

        // Fade out then swap
        modalImg.classList.add('gallery-modal__img--loading');
        
        setTimeout(() => {
            modalImg.src = data.src;
            modalImg.alt = data.alt;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            counter.textContent = `${index + 1} / ${cards.length}`;
        }, 150);
    }

    // When image loads, fade back in
    modalImg.addEventListener('load', () => {
        modalImg.classList.remove('gallery-modal__img--loading');
    });

    function openModal(index) {
        showImage(index);
        modal.classList.add('gallery-modal--active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('gallery-modal--active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        const newIndex = (currentIndex - 1 + cards.length) % cards.length;
        showImage(newIndex);
    }

    function showNext() {
        const newIndex = (currentIndex + 1) % cards.length;
        showImage(newIndex);
    }

    // Click on cards to open
    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(i);
        });
    });

    // Controls
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('gallery-modal__backdrop')) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('gallery-modal--active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch/swipe support
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showNext();
            else showPrev();
        }
    }, { passive: true });
})();
