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

// Slideshow functionality
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active-dot";
}

// Auto slide change
let slideInterval = setInterval(() => {
    plusSlides(1);
}, 5000);

// Pause slideshow when hovering
const slideshowContainer = document.querySelector('.slideshow-container');
slideshowContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

slideshowContainer.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
});