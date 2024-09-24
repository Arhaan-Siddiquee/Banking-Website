'use strict';

const nav = document.querySelector('.nav');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

showModal();
learnMoreBtn();
tabbedComponent();
animateNavbar();
stickyNavbar();
fluidSections();
lazyImgs();
slider();

function showModal() {
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}


function learnMoreBtn() {
  document
    .querySelector('.btn--scroll-to')
    .addEventListener('click', function () {
      const target = this.getAttribute('data-scroll-to');
      document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    });
}


function tabbedComponent() {
  document
    .querySelector('.operations__tab-container')
    .addEventListener('click', function (e) {
      const tab = e.target.closest('.operations__tab');

      if (!tab) return;

      const activeTab = 'operations__tab--active';
      const activeContent = 'operations__content--active';

      document.querySelector(`.${activeTab}`).classList.remove(activeTab);
      document
        .querySelector(`.${activeContent}`)
        .classList.remove(activeContent);

      const id = tab.getAttribute('data-tab');

      document
        .querySelector(`.operations__tab--${id}`)
        .classList.add(activeTab);

      document
        .querySelector(`.operations__content--${id}`)
        .classList.add(activeContent);
    });
}



function animateNavbar() {
  const hoverNav = function (e) {
    const link = e.target;

    if (link.classList.contains('nav__link')) {

      nav.querySelector('.nav__logo').style.opacity = this;

      nav.querySelectorAll('.nav__link').forEach(l => (l.style.opacity = this));

      link.style.opacity = '1';
    }
  };

  nav.addEventListener('mouseover', hoverNav.bind(0.5));
  nav.addEventListener('mouseout', hoverNav.bind(1));

  nav.addEventListener('mouseover', (e) => hoverNav(e, '.5'));
  nav.addEventListener('mouseout', (e) => hoverNav(e, '1'));
}

function stickyNavbar() {
  const header = document.querySelector('.header');

  const stickyNav = enteries => {
    const [entry] = enteries;

    if (entry.isIntersecting) {
      nav.classList.remove('sticky');
    } else {
      nav.classList.add('sticky');
    }
  };

  const observer = new IntersectionObserver(stickyNav, {
    root: null, // viewport
    rootMargin: `-${nav.clientHeight}px`,
    threshold: 0, 
  });

  observer.observe(header);
}


function fluidSections() {
  const revealSection = enteries => {
    const [entry] = enteries;

    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
    } else {
      entry.target.classList.add('section--hidden');
    }
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.2,
  });

  const allSections = document.querySelectorAll('.section');

  allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
}


function lazyImgs() {
  const loadImg = enteries => {
    const [entry] = enteries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.getAttribute('data-src');

    entry.target.addEventListener('load', function () {
      this.classList.remove('lazy-img');
    });

    imgObserver.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0.5,
  });

  const secImgs = document.querySelectorAll('img[data-src]');
  secImgs.forEach(img => imgObserver.observe(img));
}

function slider() {
  const slides = document.querySelectorAll('.slide ');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const totalSlides = slides.length - 1;
  let currentSlide = 0;

  (function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  })();

  const activateDot = slide => {
    const active = 'dots__dot--active';
    const dots = document.querySelectorAll('.dots__dot');

    dots.forEach(dot => dot.classList.remove(active));
    dots[slide].classList.add(active);
  };

  const gotoSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    activateDot(slide);
  };
  gotoSlide(currentSlide);

  const nextSlide = () => {
    if (currentSlide === totalSlides) currentSlide = 0;
    else currentSlide++;
    gotoSlide(currentSlide);
  };

  const prevSlide = () => {
    if (currentSlide === 0) currentSlide = totalSlides;
    else currentSlide--;
    gotoSlide(currentSlide);
  };

  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowLeft' && prevSlide(currentSlide);
    e.key === 'ArrowRight' && nextSlide(currentSlide);
  });

  dotContainer.addEventListener('click', e => {
    const dot = e.target;
    if (!dot.classList.contains('dots__dot')) return;
    gotoSlide(dot.dataset.slide);
  });

  setInterval(nextSlide, 5000);
}