document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to submit a report');
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('reportTitle').value);
    formData.append('category', document.getElementById('reportCategory').value);
    formData.append('description', document.getElementById('reportDescription').value);
    formData.append('location', document.getElementById('reportLocation').value);
    formData.append('urgency', document.getElementById('urgencyLevel').value);

    const files = document.getElementById('fileInput').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const res = await fetch('http://localhost:5000/api/community-members/community-problems', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();
    if (res.ok) {
        alert('Report submitted successfully');
    } else {
        alert('Error: ' + data.message);
    }
});
