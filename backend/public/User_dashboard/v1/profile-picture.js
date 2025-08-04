// js/profile-picture.js

const avatarDisplay = document.getElementById('avatarDisplay');
const avatarUpload = document.getElementById('avatarUpload');

// Load profile picture on page load
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('/api/community-members/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok && data.profile_pic) {
      avatarDisplay.innerHTML = `<img src="${data.profile_pic}" alt="Avatar" class="avatar-img">`;
    }
  } catch (err) {
    console.error('Failed to load profile picture:', err);
  }
});

// Upload new profile picture
avatarUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profilePic', file);

  const token = localStorage.getItem('token');

  try {
    const res = await fetch('/api/community-members/upload-profile-pic', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.imagePath) {
      avatarDisplay.innerHTML = `<img src="${data.imagePath}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
      alert('Upload failed: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('An error occurred while uploading.');
  }
});
