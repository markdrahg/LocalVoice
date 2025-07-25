// dashboard.js

// document.addEventListener('DOMContentLoaded', function () {
//   const navLinks = document.querySelectorAll('.sidebar nav ul li a');
//   const sections = document.querySelectorAll('.section');

//   navLinks.forEach(link => {
//     link.addEventListener('click', function (e) {
//       e.preventDefault();

//       // Remove active class from all links
//       navLinks.forEach(l => l.classList.remove('active'));
//       // Add active class to clicked link
//       this.classList.add('active');

//       // Hide all sections
//       sections.forEach(section => section.classList.add('hidden'));

//       // Show the targeted section
//       const targetId = this.getAttribute('href').substring(1);
//       const targetSection = document.getElementById(targetId);
//       if (targetSection) {
//         targetSection.classList.remove('hidden');
//       }
//     });
//   });

//   // Optional: Show overview by default
//   document.querySelector('#overview').classList.remove('hidden');
// });


//2
// dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".sidebar nav a");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove 'active' from all links
      navLinks.forEach(l => l.classList.remove("active"));
      // Add 'active' to the clicked link
      this.classList.add("active");

      // Hide all sections
      sections.forEach(section => section.classList.add("hidden"));

      // Show the selected section
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });

  // Load default section (Dashboard)
  document.querySelector(".sidebar nav a[href='#dashboard']").click();
});
