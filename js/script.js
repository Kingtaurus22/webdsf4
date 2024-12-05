function calculateHeight(img, originalWidth, originalHeight) {
    const minHeight = 400;
    let imgHeight = img.width() * originalHeight / originalWidth;
    imgHeight = imgHeight < minHeight ? minHeight : imgHeight;
    return imgHeight;
}

function resizeParallaxes() {
    const parallax1 = $('#parallax-1');
    const parallax2 = $('#parallax-2');
    const newHeight1 = calculateHeight(parallax1, 1800, 690);
    const newHeight2 = calculateHeight(parallax2, 1800, 590);
    parallax1.css('min-height', newHeight1 + 'px');
    parallax2.css('min-height', newHeight2 + 'px');
}

$(document).ready(function () {
    resizeParallaxes();

    $(window).resize(function () {
        resizeParallaxes();
    });
});

$(document).ready(function() {
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
});(jQuery);


// marqeuu
const carouselElements = document.querySelectorAll(".splide");

  // Iterate through each carousel element
  carouselElements.forEach((carouselElement) => {
    // Initialize a new Splide instance for each carousel
    const splide = new Splide(carouselElement, {
      type: "loop",
      drag: true,
      autoWidth: true,
      gap: 30,
      pagination: false,
      arrows: false,
      autoScroll: {
        speed: 1,
        pauseOnHover: true,
      },
    });

    // Mount the Splide instance
    splide.mount(window.splide.Extensions);
  });


//   custom cursor

const cursor = document.getElementById('cursor');
const cursorBorder = document.getElementById('cursor-border');

let cursorX = 0,
  cursorY = 0,
  borderX = 0,
  borderY = 0;
let deviceType = '';
//check if it is a touch device
const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  } catch (e) {
    deviceType = 'mouse';
    return false;
  }
};
//move
const move = (e) => {

  cursorX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
  cursorY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
};

document.addEventListener('mousemove', (e) => {
  move(e);
});
document.addEventListener('touchmove', (e) => {
  move(e);
});
document.addEventListener('touchend', (e) => {
  e.preventDefault();
});

//animate border
const borderAnimation = () => {
  const gapValue = 5;
  borderX += (cursorX - borderX) / gapValue;
  borderY += (cursorY - borderY) / gapValue;
  cursorBorder.style.left = `${borderX}px`;
  cursorBorder.style.top = `${borderY}px`;
  requestAnimationFrame(borderAnimation);
};

requestAnimationFrame(borderAnimation);


// pagetransition


const loadingScreen = document.querySelector('.loading-screen')
const mainNavigation = document.querySelector('.main-navigation')

// Function to add and remove the page transition screen
function pageTransitionIn() {
  // GSAP methods can be chained and return directly a promise
  // but here, a simple tween is enough
  return gsap
    // .timeline()
    // .set(loadingScreen, { transformOrigin: 'bottom left'})
    // .to(loadingScreen, { duration: .5, scaleY: 1 })
    .to(loadingScreen, { duration: .5, scaleY: 1, transformOrigin: 'bottom left'})
}
// Function to add and remove the page transition screen
function pageTransitionOut(container) {
  // GSAP methods can be chained and return directly a promise
  return gsap
    .timeline({ delay: 1 }) // More readable to put it here
    .add('start') // Use a label to sync screen and content animation
    .to(loadingScreen, {
      duration: 0.5,
      scaleY: 0,
      skewX: 0,
      transformOrigin: 'top left',
      ease: 'power1.out'
    }, 'start')
    .call(contentAnimation, [container], 'start')
}

// Function to animate the content of each page
function contentAnimation(container) {
  // Query from container
  $(container.querySelector('.green-heading-bg')).addClass('show')
  // GSAP methods can be chained and return directly a promise
  return gsap
    .timeline()
    .from(container.querySelector('.is-animated'), {
      duration: 0.5,
      translateY: 10,
      opacity: 0,
      stagger: 0.4
    })
    .from(mainNavigation, { duration: .5, translateY: -10, opacity: 0})
}

$(function() {
  barba.init({
    // We don't want "synced transition"
    // because both content are not visible at the same time
    // and we don't need next content is available to start the page transition
    // sync: true,
    transitions: [{
      // NB: `data` was not used.
      // But usually, it's safer (and more efficient)
      // to pass the right container as a paramater to the function
      // and get DOM elements directly from it
      async leave(data) {
        // Not needed with async/await or promises
        // const done = this.async();

        await pageTransitionIn()
        // No more needed as we "await" for pageTransition
        // And i we change the transition duration, no need to update the delay…
        // await delay(1000)

        // Not needed with async/await or promises
        // done()

        // Loading screen is hiding everything, time to remove old content!
        data.current.container.remove()
      },

      async enter(data) {
        await pageTransitionOut(data.next.container)
                // Initialize or refresh the parallax effect for the new page
                $('#parallax-1').parallax({ imageSrc: 'img/biz-oriented-header.jpg' });
                $('#parallax-3').parallax({ imageSrc: 'img/biz-oriented-footer-2.jpg' });
                await pageTransitionOut(data.next.container);
      },
      // Variations for didactical purpose…
      // Better browser support than async/await
      // enter({ next }) {
      //   return pageTransitionOut(next.container);
      // },
      // More concise way
      // enter: ({ next }) => pageTransitionOut(next.container),

      
      async once(data) {
        await contentAnimation(data.next.container);
      }
    }]
  });

});
