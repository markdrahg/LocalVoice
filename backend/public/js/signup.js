// public/js/signup.js
document.querySelector('#signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.querySelector('#firstName').value.trim();
  const lastName = document.querySelector('#lastName').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const res = await fetch('/api/community-members/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful! You can now log in.');
      window.location.href = '/login.html';
    } else {
      console.error('Signup failed:', data.message);
      alert('Signup failed: ' + data.message);
    }
  } catch (err) {
    console.error('Error during signup:', err);
    alert('An error occurred during signup. Please try again.');
  }
});
