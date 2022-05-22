'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
    btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', (e) => {
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);
});

const nav = document.querySelector('.nav');

function handleHover(e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// sticky
const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', (e) => {
//     if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//     else nav.classList.remove('sticky');
// });
// const obsCallback = (entries, observer) => {
//     entries.forEach((entry) => {
//         console.log(entry);
//     });
// };
// const obsOptions = {
//     root: null,
//     threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHight}px`,
});
headerObserver.observe(header);

// reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });
allSections.forEach((sec) => {
    sectionObserver.observe(sec);
    // sec.classList.add('section--hidden');
});

// lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0, rootMargin: '20px' });
imgTarget.forEach((img) => {
    imgObserver.observe(img);
});

// slider
function slider() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    let curSlide = 0;
    const maxSlide = slides.length - 1;

    // create dots
    const createDot = () => {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    //active dot
    const activeDot = (slide) => {
        document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    // go to next slide
    function goToSlide(slide) {
        slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    }

    const nextSlide = () => {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activeDot(curSlide);
    };

    const prevSlide = () => {
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activeDot(curSlide);
    };

    function init() {
        goToSlide(0);
        createDot();
        activeDot(0);
    }
    init();

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    // left and right arrow handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    // dots event handler
    dotContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dots__dot')) {
            const slide = e.target.dataset.slide;
            console.log(slide);
            goToSlide(slide);
            activeDot(slide);
        }
    });
}
slider();
//*****slider END*****/

document.addEventListener('DOMContentLoaded', (e) => {
    console.log(e);
});


////////////////This section is not fully completed////////////////////
