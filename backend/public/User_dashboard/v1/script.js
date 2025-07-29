// LocalVoice Dashboard JavaScript

  // Check authentication
     const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
    }

    fetch('/api/community-members/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then(data => {
        first_name = data.first_name || 'User';
        last_name = data.last_name || '';
        email = data.email || 'G12@gmail.com';
        currentUser = data;
        signup_date = new Date(data.createdAt).toLocaleDateString();
      document.getElementById('fullName').textContent = data.first_name + ' ' + data.last_name;
      document.getElementById('email').textContent = data.email;
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Session expired or unauthorized. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
);











// Global variables
let currentUser = null;
let currentSection = 'dashboard';
let uploadedFiles = [];

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const reportForm = document.getElementById('reportForm');
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFiles');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadUserData();
    loadReports();
    setupFileUpload();
});

// Initialize dashboard functionality
function initializeDashboard() {
    console.log('LocalVoice Dashboard initialized');
    
    // Check authentication
     const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
    }

    fetch('/api/community-members/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then(data => {
        first_name = data.first_name || 'User';
        last_name = data.last_name || '';
        currentUser = data;
      document.getElementById('fullName').textContent = data.first_name + ' ' + data.last_name;
      document.getElementById('email').textContent = data.email;
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Session expired or unauthorized. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
);


    
    // Show dashboard section by default
    showSection('dashboard');
    
    // Animate stats on load
    animateStats();
    
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            showSection('new-report');
            if (action) {
                document.getElementById('reportCategory').value = action;
            }
        });
    });
    
    // Report form
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }
    
    // Get current location button
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    // Save draft button
    const saveDraftBtn = document.getElementById('saveDraft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }
    
    // Quick report button
    const quickReportBtn = document.querySelector('.quick-report-btn');
    if (quickReportBtn) {
        quickReportBtn.addEventListener('click', function() {
            showSection('new-report');
        });
    }
    
    // Mark all as read button
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // Filter controls
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReports);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterReports);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Handle resize
    window.addEventListener('resize', handleResize);
}

// Navigation handling
function handleNavigation(event) {
    event.preventDefault();
    
    // Handle logout
    if (this.classList.contains('logout')) {
        handleLogout();
        return;
    }
    
    const section = this.dataset.section;
    if (section) {
        showSection(section);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');
        
        // Close mobile menu
        sidebar.classList.remove('active');
        
        // Update page title
        updatePageTitle(section);
    }
}

// Show specific section
function showSection(sectionId) {
    currentSection = sectionId;
    
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update page title based on section
function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Community Dashboard',
        'new-report': 'Submit New Report',
        'my-reports': 'My Reports',
        'community-map': 'Community Map',
        'notifications': 'Updates & Notifications',
        'profile': 'User Profile'
    };
    
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Dashboard';
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    sidebar.classList.toggle('active');
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
    }
}

// Logout functionality
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        showMessage('Logged out successfully', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
}

// Load user data
async function loadUserData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Check if user data is cached
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
            currentUser = JSON.parse(cachedUserData);
            updateUserDisplay();
            return;
        }
        
        // Fetch from API
        const response = await fetch('/api/community-members/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem('userData', JSON.stringify(currentUser));
            updateUserDisplay();
        } else {
            console.error('Failed to load user data');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update user display elements
function updateUserDisplay() {
    if (!currentUser) return;
    
    const userNameElements = document.querySelectorAll('.user-name');
    const userAvatarElements = document.querySelectorAll('.user-avatar, .profile-avatar-large');
    const userLocationElements = document.querySelectorAll('.user-location');
    const userEmailElements = document.querySelectorAll('.profile-email');
     const signup_date = document.querySelectorAll('.profile-joined');
    
    userNameElements.forEach(el => {
        el.textContent =  first_name || 'User';
    });
    
    userAvatarElements.forEach(el => {
        el.textContent =  first_name ?  first_name.charAt(0).toUpperCase() : 'U';
    });
    
    userLocationElements.forEach(el => {
        el.textContent = currentUser.location || 'Location';
    });
    
    userEmailElements.forEach(el => {
        el.textContent = currentUser.email || 'user@email.com';
    });

    signup_date.forEach(el => {
        el.textContent = signup_date || 'N/A';
    }
    );
}

// File upload functionality
function setupFileUpload() {
    if (!fileUpload || !fileInput) return;
    
    // Click to upload
    fileUpload.addEventListener('click', function(e) {
        if (!e.target.closest('.remove-file')) {
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    fileUpload.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    });
}

// Handle file selection
function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// Process uploaded files
function processFiles(files) {
    files.forEach(file => {
        if (uploadedFiles.length >= 5) {
            showMessage('Maximum 5 files allowed', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showMessage(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }
        
        const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const fileObj = {
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type
        };
        
        uploadedFiles.push(fileObj);
        displayUploadedFile(fileObj);
    });
    
    // Clear file input
    fileInput.value = '';
}

// Display uploaded file
function displayUploadedFile(fileObj) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    fileDiv.dataset.fileId = fileObj.id;
    
    if (fileObj.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(fileObj.file);
        fileDiv.appendChild(img);
    } else {
        fileDiv.innerHTML = `<div class="file-icon"><i class="fas fa-file"></i><span>${fileObj.name}</span></div>`;
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeUploadedFile(fileObj.id);
    });
    
    fileDiv.appendChild(removeBtn);
    uploadedFilesContainer.appendChild(fileDiv);
}

// Remove uploaded file
function removeUploadedFile(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileElement) {
        fileElement.remove();
    }
}

// Get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showMessage('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    const locationInput = document.getElementById('reportLocation');
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    
    getCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
    getCurrentLocationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Use reverse geocoding service (you'll need to implement this)
            reverseGeocode(lat, lng)
                .then(address => {
                    locationInput.value = address;
                    showMessage('Location updated successfully', 'success');
                })
                .catch(error => {
                    locationInput.value = `${lat}, ${lng}`;
                    showMessage('Got coordinates, but could not get address', 'warning');
                })
                .finally(() => {
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                    getCurrentLocationBtn.disabled = false;
                });
        },
        function(error) {
            showMessage('Error getting location: ' + error.message, 'error');
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
            getCurrentLocationBtn.disabled = false;
        }
    );
}

// Reverse geocoding (placeholder - implement with actual service)
async function reverseGeocode(lat, lng) {
    // This is a placeholder. You should implement actual reverse geocoding
    // using services like Google Maps, Mapbox, or OpenStreetMap
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
}

// Handle report submission
async function handleReportSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData();
    
    // Get form data
    const title = document.getElementById('reportTitle').value;
    const category = document.getElementById('reportCategory').value;
    const description = document.getElementById('reportDescription').value;
    const location = document.getElementById('reportLocation').value;
    const urgency = document.getElementById('urgencyLevel').value;
    
    // Validate required fields
    if (!title || !category || !description || !location || !urgency) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Add text data
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('urgency', urgency);
    
    // Add files
    uploadedFiles.forEach((fileObj, index) => {
        formData.append(`files`, fileObj.file);
    });
    
    try {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        const token = localStorage.getItem('token');
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            showMessage('Report submitted successfully!', 'success');
            resetReportForm();
            
            // Refresh reports and stats
            loadReports();
            updateStats();
            
            // Switch to my reports section
            showSection('my-reports');
        } else {
            const error = await response.json();
            showMessage(error.message || 'Failed to submit report', 'error');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        showMessage('Error submitting report. Please try again.', 'error');
    } finally {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Report';
    }
}

// Save report as draft
function saveDraft() {
    const reportData = {
        title: document.getElementById('reportTitle').value,
        category: document.getElementById('reportCategory').value,
        description: document.getElementById('reportDescription').value,
        location: document.getElementById('reportLocation').value,
        urgency: document.getElementById('urgencyLevel').value,
        files: uploadedFiles.map(f => f.name),
        savedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const drafts = JSON.parse(localStorage.getItem('reportDrafts') || '[]');
    drafts.push(reportData);
    localStorage.setItem('reportDrafts', JSON.stringify(drafts));
    
    showMessage('Draft saved successfully!', 'success');
}

// Reset report form
function resetReportForm() {
    if (reportForm) {
        reportForm.reset();
    }
    
    uploadedFiles = [];
    uploadedFilesContainer.innerHTML = '';
}

// Load reports
async function loadReports() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/reports/my-reports', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const reports = await response.json();
            displayReports(reports);
            updateReportsStats(reports);
        } else {
            console.error('Failed to load reports');
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Display reports in the grid
function displayReports(reports) {
    const reportsGrid = document.getElementById('reportsGrid');
    if (!reportsGrid) return;
    
    if (reports.length === 0) {
        reportsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No reports yet</h3>
                <p>Submit your first report to help improve your community</p>
                <button class="btn-primary" onclick="showSection('new-report')">Create Report</button>
            </div>
        `;
        return;
    }
    
    reportsGrid.innerHTML = reports.map(report => `
        <div class="report-card" data-report-id="${report.id}">
            <div class="report-card-header">
                <h4>${report.title}</h4>
                <span class="status-badge ${report.status}">${formatStatus(report.status)}</span>
            </div>
            <div class="report-card-body">
                <p class="report-category">
                    <i class="fas ${getCategoryIcon(report.category)}"></i>
                    ${report.category}
                </p>
                <p class="report-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${report.location}
                </p>
                <p class="report-date">
                    Submitted ${formatDate(report.createdAt)}
                </p>
                ${report.images && report.images.length > 0 ? `
                    <div class="report-images">
                        ${report.images.slice(0, 3).map(img => `
                            <img src="${img}" alt="Report image" />
                        `).join('')}
                        ${report.images.length > 3 ? `<span class="more-images">+${report.images.length - 3}</span>` : ''}
                    </div>
                ` : ''}
            </div>
            <div class="report-card-actions">
                <button class="action-btn view-report" data-report-id="${report.id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit-report" data-report-id="${report.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to report cards
    reportsGrid.querySelectorAll('.view-report').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportId = this.dataset.reportId;
            viewReportDetails(reportId);
        });
    });
}

// Filter reports
function filterReports() {
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        const status = card.querySelector('.status-badge').className.includes(statusFilter) || statusFilter === 'all';
        const category = card.querySelector('.report-category').textContent.toLowerCase().includes(categoryFilter) || categoryFilter === 'all';
        
        if (status && category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// View report details
function viewReportDetails(reportId) {
    // This would typically open a modal or navigate to a details page
    console.log('Viewing report:', reportId);
    showMessage('Report details view would open here', 'info');
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    
    // Update notification badge
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
    }
    
    showMessage('All notifications marked as read', 'success');
}

// Animate stats on page load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 30;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 50);
    });
}

// Update stats
function updateReportsStats(reports) {
    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const pendingReports = reports.filter(r => r.status === 'under-review').length;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) {
        statCards[0].querySelector('.stat-number').textContent = totalReports;
    }
    if (statCards[1]) {
        statCards[1].querySelector('.stat-number').textContent = resolvedReports;
    }
    if (statCards[2]) {
        statCards[2].querySelector('.stat-number').textContent = pendingReports;
    }
}

// Utility functions
function formatStatus(status) {
    const statusMap = {
        'submitted': 'Submitted',
        'under-review': 'Under Review',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

function getCategoryIcon(category) {
    const iconMap = {
        'infrastructure': 'fa-road',
        'health': 'fa-heartbeat',
        'environmental': 'fa-leaf'
    };
    return iconMap[category] || 'fa-file-alt';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
    }
    
    // Ctrl/Cmd + N for new report
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showSection('new-report');
    }
    
    // Ctrl/Cmd + D for dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        showSection('dashboard');
    }
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Export functions for potential testing
window.LocalVoiceDashboard = {
    showSection,
    loadReports,
    showMessage,
    getCurrentLocation
};
