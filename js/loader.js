  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Delay before fade-slide animation starts
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1500);
  });