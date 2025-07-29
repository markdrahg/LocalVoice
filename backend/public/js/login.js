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
      // window.location.href = '/dashboard.html';
      window.location.href = '/User_dashboard/v1/index.html';
    } else {
      console.error('Login failed:', data.message);
      alert('Login failed: ' + data.message);
    }
  } catch (err) {
    console.error('Error during login:', err);
    alert('An error occurred during login. Please try again.');
  }
});
