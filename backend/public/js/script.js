// Mobile Menu Toggle - Fixed Version
document.querySelector('.hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.mobile-menu').classList.toggle('show');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.hamburger').classList.remove('active');
        document.querySelector('.mobile-menu').classList.remove('show');
    });
});


// View More Animation
document.querySelector('.view-more').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Loading more stories...'); // Replace with real logic later
  });


  //Hero Header Image Animation
  document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Start slideshow
    setInterval(nextSlide, 5000); // Change image every 5 seconds
    
    // Initialize first slide
    slides[0].classList.add('active');
});



//Sections fade in animation

  const fadeElements = document.querySelectorAll('.fade-in-element');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElements.forEach(el => observer.observe(el));



// Dark Mode Toggle
// function myLightFunction() {
//   console.log("Dark mode toggled");
//    var element = document.body;
//    const bulb = document.getElementById('buildIcon');
//    const navbar = document.querySelector('.navbar');
//    const hero = document.querySelector('.hero');

//    element.classList.toggle("dark-mode");
//    bulb.classList.toggle("fa-lightbulb_active");
//    navbar.classList.toggle("dark-navbar");
//    hero.classList.toggle("dark-hero");
// };



function myLightFunction() {
  const link = document.getElementById('theme-style');
  const currentHref = link.getAttribute('href');

  if (currentHref.includes('styles.css')) {
    link.setAttribute('href', 'styles/dark.css');
  } else {
    link.setAttribute('href', 'styles/styles.css');
  }
}

