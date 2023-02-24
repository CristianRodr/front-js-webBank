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

    console.log('current scroll (X/Y)', window
        .pageXOffset, window.pageYOffset);

    console.log(
        'height/width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth,
    )

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
    section1.scrollIntoView({behavior: 'smooth'});
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

document.querySelector('.nav__links').addEventListener('click'
    , function (evt) {
        evt.preventDefault();

        //estrategia para emparejamiento, verificando si el elemento de destino
        //contiene la clase que nos interesa
        if (evt.target.classList.contains('nav__link')) {
            const id = evt.target.getAttribute('href');
            console.log(id);
            document.querySelector(id).scrollIntoView({behavior: 'smooth'});
        }
    })

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
    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
})

//Menu se desvanece de la animacion
const handleHover = function (evt) {
    //console.log(this);
    if (evt.target.classList.contains('nav__link')) {
        const link = evt.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(elem => {
            if (elem !== link) elem.style.opacity = this;
        })
        logo.style.opacity = this
    }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
const navHeight = nav.getBoundingClientRect().height; //calcular altura dinamicamente de la ventana
//puesto que si el sitio es responsivo puede variar
//console.log(navHeight);
const stickyNav = function (entries) { //funcion de llamada
    const [entry] = entries;
    //console.log(entry)

    if (!entry.isIntersecting) nav.classList.add('sticky'); //si es falso isIntersecting add
    else nav.classList.remove('sticky'); //verdadero remove
}

//creamos nuestro observador
const headerObserver = new IntersectionObserver(stickyNav
    , {
        root: null, //raiz nula, por que estamos interesados en toda la ventana
        threshold: 0, //umbral intersectionRatio, Ratio de intersección
        rootMargin: `-${navHeight}px`, //margen de raiz donde se detiene
    });//necesitaremos una funcion devolucion de llamada

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

const sectionObserver = new IntersectionObserver(revealSection
    , {
        root: null,
        threshold: 0.15,
    });

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    //section.classList.add('section--hidden');
})

//rendimiento carga de imagenes
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
    const [entry] = entries;
    //console.log(entry);
    //hacemos algo si se esta cruzando
    if (!entry.isIntersecting) return;
    //replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () { //evento de carga permite que se muestre
        entry.target.classList.remove('lazy-img'); //la imagen solo cuando este cargada completa
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg
    , {
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
            dotContainer.insertAdjacentHTML('beforeend'
                , `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };


    const activateDot = function (slide) {
        document.querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    }

    const goToSlide = function (slide) {
        slides.forEach((s, i) =>
            (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };
//Next Slide
    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++
        }

        goToSlide(curSlide)
        activateDot(curSlide)
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide)
        activateDot(curSlide)
    }
    const init = function () {
        goToSlide(0);
        createDots();

        activateDot(0);
    }
    init()

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

//teclado
    document.addEventListener("keydown", function (ev) {
        if (ev.key === 'ArrowLeft') prevSlide();
        ev.key === 'ArrowRight' && nextSlide();
    });

//funcion botones parte inferior evento
    dotContainer.addEventListener('click', function (ev) {
        if (ev.target.classList.contains('dots__dot')) {
            const {slide} = ev.target.dataset;
            console.log(slide)
            goToSlide(slide);
            activateDot(slide)
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

// SELECCION DE ELEMENTOS ---------------
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
const header = document.querySelector('.header'); //seleccion

const allSections = document.querySelectorAll('.section'); //multiples selecciones
console.log(allSections); //devolvera la lista de nodos

document.getElementById('section--1') //Obtener elementos por ID

const allButtons = document.getElementsByTagName('button');//todos los element con el nombre boton
console.log(allButtons); //getElementsByTagName devuelve una coleccion, se actualiza automaticamente

console.log(document.getElementsByClassName('btn')); //devulve coleccion se actualiza automaticamente

// CREAR E INSERTAR ELEMENTOS -----------
//.insertAdjacentHTML --> Insertar elemento en HTML

const message = document.createElement('div') //creará un elemento DOM que podemos guardar en ->
//en message y si lo queremos utilizar debemos hacerlo manualmente, y luego podemos agregar una clase
message.classList.add('cookie-message');
//message.textContent = 'We use cookied for improved functionality and analytics' //agregando texto
message.innerHTML = 'We use cookied for improved functionality and analytics. ' +
    '<button class="btn btn--close-cookie">Go it!</button>'; //agregando HTML mostrara un formato agradable
//header.prepend(message); //prepend -> agrega elemento como el primer hijo del elemento padre
header.append(message); //append -> como ultimo hijo
//como elemento unico si queremos varias copias del elemento
//header.append(message.cloneNode(true));
//header.before(message); // antes del elemento encabezado como hermano
//header.after(message); // después del elemento encabezado como hermano

//DELETE ELEMENTS
document.querySelector('.btn--close-cookie')
.addEventListener('click', function () {
  //message.remove(); // remove()
  message.parentElement.removeChild(message); //forma antigua de eliminar
}) //message como .btn--close-cookie ya se encuentra en memoria lo que hace la funcion es ->
//al presionar el boton se elimina el nodo.

//Styles
message.style.backgroundColor = '#37384d'; //se utiliza camel
message.style.width = '120%'; // recuerde que estos estilos se configuran ->
//directamente en el DOM, esto se llama estilos en linea osea que se configuran ->
//manualmente y no se pueden leer de la pagina podemos utilizar getComputedStyle
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height); ////podemos observar los estilos ->
//como aparece en la pagina y podemos acceder el valor
//Queremos aumentar la altura del baner unos 40px
message.style.height = Number.parseFloat(getComputedStyle(message)
        .height, 10) + 30 + 'px'; //lo parseamos ya que si no se imprimiría
// como string

//VARIABLES CSS DESDE JS
document.documentElement.style.setProperty('--color-primary',
    'orangered'); //podemos cambiar el estilo de nuestra pagina simplemente
//configurando una propiedad

//ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); //esto funciona porque las images tiene atributos que si
//las especificamos en HTML, JavaScript creará estas propiedades en el objeto
//deben ser por piedades standard
console.log(logo.className); //Estandar
console.log(logo.designer); //no estandar
//forma de acceder al atributo no estandar para ser leido
console.log(logo.getAttribute('designer'))

//También se puede establecer los atributos
logo.alt = 'Beautiful minimalist logo';

//forma de escribir atributo en JS para insertarlo el html
logo.setAttribute('company', 'Bankist');

//conceptos ruta relativa, ruta absoluta
//formas de acceder
console.log(logo.src); //ruta absoluta
console.log(logo.getAttribute('src')); //ruta relativa
//También funcion en los href
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//DATA ATTRIBUTE
//tipo especial de atributos que comienza con la palabra datos
console.log(logo.dataset.versionNumber)//se almacena en el objeto conjunto datos
//obteniendo 3.0

//CLASES
logo.classList.add('c', 'j'); // puede agregar clases pasando multiples valores
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

//no usar clasName para escribir clases.
//logo.clasName = 'jonas' -> nos puede permitir tanto leer como escribir una ->
//clase, pero no la utilicemos para escribir porque anula las otras clases y
//solo permite insertar una clase*/

//EVENTOS

//Evento mouseenter
//Se dispara cada vez que un mouse ingresa a un determinado elemento
//y de hecho cuando pasamos por encima inmediatamente se activa.

//Eliminar oyente de ventos
/*const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  h1.removeEventListener('mouseenter', alertH1); //se activa el oyente
  //una sola vez
}

h1.addEventListener('mouseenter', alertH1)*/

//PROPAGATION THE EVENT
//generar color aleatorio
//rgb (255,255,255)
// const randonmInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1) + min);
//
// const randomColor = () =>
//     `rgb(${randonmInt(0, 255)},${randonmInt(0, 255)},${randonmInt(0, 255)})`;
//
// document.querySelector('.nav__link').addEventListener('click'
//     , function (e) {
//       this.style.backgroundColor = randomColor();
//         console.log('link', e.target, e.currentTarget);
//
//         //detener propagation
//         //e.stopPropagation()
//     });
//
// document.querySelector('.nav__links').addEventListener('click'
//     , function (e) {
//         this.style.backgroundColor = randomColor();
//         console.log('container', e.target, e.currentTarget);
//     });
//
// document.querySelector('.nav').addEventListener('click'
//     , function (e) {
//         this.style.backgroundColor = randomColor();
//         console.log('nav', e.target, e.currentTarget);
//     });
/*
const h1 = document.querySelector('h1');
// BAJANDO niño
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //nos proporciona la lista de nods hijos, nos muestra ->
//hasta los comentarios
console.log(h1.children); //HTMcollection y nos muestra  los tres elementos reales ->
//que estan dentro de h1, solo funciona para ninos directos
h1.firstElementChild.style.color = 'white'; //primer elemento hijo
h1.lastElementChild.style.color = 'red';// ultimo elemento

//Subiendo: niño: Seleccionar padres
console.log(h1.parentNode); //selecciona el padre del elemento h1
console.log(h1.parentElement); //selecciona el elemento padre de h1

//elemento padre más cercano closest() lo opuesto a querySelector ya que este
//encuentra los hijos, closest() encuentra los padres
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

//seleccion de lado: HERMANOS
//En JS solo podemos seleccionar a los hermanos directos, solo el anterior ->
//y el siguiente
console.log(h1.previousElementSibling); //Elemento hermano anterior
console.log(h1.nextElementSibling); //siguiente elemento hermano

//los mismos metodos para nodos
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//si queremos todos sus hermanos podemos seleccionar al padre y todos sus hijos
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (elem) {
  if (elem != h1) elem.style.transform = 'scale(0.5)';
})*/

//para usar el API de observador de interacciones debemos de comenzar creando un nuevo observador
//de interacciones

/*
const obsCallback = function (entries, observer) {
    entries.forEach(entry => {
        console.log(entry);
    });
}; //esta funcion de devolucion se llamara cada vez que el elemento observado se cruza con el elemento
//raiz en el umbral que definimos

const obsOptions = {
    root: null,
    threshold: 0.1, //umbral de raiz cuando ingrese porcentaje de ingreso, porcentaje que queremos
    //tener visible
}

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); //elemento observado

//cuando se cruza con la ventana al 10% entonces, por que es el umbral llamara a la funcion*/

//DOM CARGADO






