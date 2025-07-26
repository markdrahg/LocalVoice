// public/js/login.js
document.querySelector('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const res = await fetch('/api/community-members/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      document.getElementById('error').textContent = data.message;
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Something went wrong';
  }
});
