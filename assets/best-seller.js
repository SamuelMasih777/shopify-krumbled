/* best-sellers.js - lightweight carousel */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-bs-carousel]').forEach(function (carouselEl) {
    const wrapper = carouselEl.closest('.bs-carousel-wrapper');
    const prevBtn = wrapper.querySelector('.bs-prev');
    const nextBtn = wrapper.querySelector('.bs-next');
    const carousel = carouselEl;
    const slides = Array.from(carousel.children);
    const autoplay = wrapper.dataset.bsAutoplay === 'true' || wrapper.getAttribute('data-bs-autoplay') === 'true';
    const speed = parseInt(wrapper.dataset.bsSpeed, 10) || 4000;

    let index = 0;

    function getSlidesPerView() {
      const columns = parseInt(wrapper.getAttribute('data-bs-columns') || 4, 10);
      if (window.innerWidth < 480) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1024 && columns >= 3) return Math.min(3, columns);
      return columns;
    }

    function update() {
      const spv = getSlidesPerView();
      const cardWidth = slides[0].getBoundingClientRect().width;
      const move = Math.round(index * cardWidth);
      carousel.style.transform = `translateX(-${move}px)`;
    }

    function prev() {
      const spv = getSlidesPerView();
      index = Math.max(0, index - 1);
      update();
    }
    function next() {
      const spv = getSlidesPerView();
      const maxIndex = Math.max(0, slides.length - spv);
      index = Math.min(maxIndex, index + 1);
      update();
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    window.addEventListener('resize', function () { index = Math.min(index, Math.max(0, slides.length - getSlidesPerView())); update(); });

    // keyboard
    wrapper.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') prev();
      if (ev.key === 'ArrowRight') next();
    });

    // autoplay
    let interval;
    if (autoplay) {
      interval = setInterval(function () {
        const spv = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - spv);
        if (index >= maxIndex) index = 0; else index++;
        update();
      }, speed);
      wrapper.addEventListener('mouseenter', () => clearInterval(interval));
      wrapper.addEventListener('mouseleave', () => {
        if (autoplay) interval = setInterval(function () {
          const spv = getSlidesPerView();
          const maxIndex = Math.max(0, slides.length - spv);
          if (index >= maxIndex) index = 0; else index++;
          update();
        }, speed);
      });
    }

    // initial layout
    // set `carousel` to use transform, and ensure slides display inline-block/flex handled by CSS
    carousel.style.transition = 'transform 450ms ease';
    update();
  });
});
