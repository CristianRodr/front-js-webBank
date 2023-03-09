'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
///////////////////////////////////////
// Modal window
const openModal = function (event) {
  event.preventDefault();
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
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////
//--------- utilizando desplazamiento Button scrolling
//agregando detector de eventos
btnScrollTo.addEventListener('click', function (e) {
  //obtener coordenada
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  //obtener el rectangular para el boton
  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  // window.scrollTo(
  //     s1coords.left + window.pageXOffset,
  //     s1coords.top + window.pageYOffset);

  //si queremos que el scroll sea de una manera fluida y agradable
  //vieja escuela usando coordenadas/
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top:  s1coords.top + window.pageYOffset,
  //   behavior: 'smooth', //comportamiento
  // });

  //forma moderna
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////
// Page navigation
/*document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  });
});*/
//en la tecnica delegacion de eventos necesitamos dos pasos
//1. agregamos el detector de eventos a un elemento principal comun
//2. determinar que elemento origino el evento para poder trabajar con el

document.querySelector('.nav__links').addEventListener('click', function (evt) {
  evt.preventDefault();

  //estrategia para emparejamiento, verificando si el elemento de destino
  //contiene la clase que nos interesa
  if (evt.target.classList.contains('nav__link')) {
    const id = evt.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//todo lo que hacemos es agregar y ocultar clases
// Tabbed component
tabsContainer.addEventListener('click', function (evt) {
  const clicked = evt.target.closest('.operations__tab'); //encuentra el padre cercano

  //cláusula de proteccion
  if (!clicked) return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //activador de tab
  clicked.classList.add('operations__tab--active');

  //activador de contenido, data-tab="1" -> operation__content--1
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu se desvanece de la animacion
const handleHover = function (evt) {
  //console.log(this);
  if (evt.target.classList.contains('nav__link')) {
    const link = evt.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(elem => {
      if (elem !== link) elem.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
const navHeight = nav.getBoundingClientRect().height; //calcular altura dinamicamente de la ventana
//puesto que si el sitio es responsivo puede variar
//console.log(navHeight);
const stickyNav = function (entries) {
  //funcion de llamada
  const [entry] = entries;
  //console.log(entry)

  if (!entry.isIntersecting)
    nav.classList.add('sticky'); //si es falso isIntersecting add
  else nav.classList.remove('sticky'); //verdadero remove
};

//creamos nuestro observador
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //raiz nula, por que estamos interesados en toda la ventana
  threshold: 0, //umbral intersectionRatio, Ratio de intersección
  rootMargin: `-${navHeight}px`, //margen de raiz donde se detiene
}); //necesitaremos una funcion devolucion de llamada

headerObserver.observe(header); //observador

//revelando secciones
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  //usamos el target "objetivo" para saber con que se cruzo la ventana grafica
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //dejar de observar al finalizar
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

//rendimiento carga de imagenes
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  //hacemos algo si se esta cruzando
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    //evento de carga permite que se muestre
    entry.target.classList.remove('lazy-img'); //la imagen solo cuando este cargada completa
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //rootMargin: '200px', //-> con rooMargin genera efecto que ya se encuentra cargada al llegar
  //al margen
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  /*const slider = document.querySelector('.slider');
    slider.style.transform = 'scale(0.4)  translateX(-800PX)';
    slider.style.overflow = 'visible';*/

  //agregando botones inferiores
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  //Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //teclado
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowLeft') prevSlide();
    ev.key === 'ArrowRight' && nextSlide();
  });

  //funcion botones parte inferior evento
  dotContainer.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('dots__dot')) {
      const { slide } = ev.target.dataset;
      console.log(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/*const initialCoords = section1.getBoundingClientRect(); //obteniendo cordenada
console.log(initialCoords);
window.addEventListener('scroll', function () {
    //console.log(window.scrollY);

    if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
})*/

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
