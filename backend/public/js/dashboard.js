// public/js/dashboard.js
const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcomeMessage');

if (!token) {
  window.location.href = '/login.html';
} else {
  fetch('/api/community-members/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((user) => {
      if (user && user.first_name) {
        welcomeMessage.textContent = `Hello, ${user.first_name} ${user.last_name}!`;
      } else {
        welcomeMessage.textContent = 'User not found';
      }
    })
    .catch(() => {
      welcomeMessage.textContent = 'Error loading user data';
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
}

// Logout
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});
