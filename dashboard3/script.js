// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');

mobileMenuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
});

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Handle logout
        if (this.classList.contains('logout')) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Add logout logic here
                localStorage.removeItem('token');
                window.location.href = '../login.html';
            }
            return;
        }
        
        // Handle other navigation
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.parentElement.classList.add('active');
        
        // Close mobile menu after navigation
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Upload button functionality
const uploadBtn = document.querySelector('.upload-btn');
uploadBtn.addEventListener('click', function() {
    // Add upload report logic here
    alert('Upload New Report functionality will be implemented here');
});

// Animate stats on page load
window.addEventListener('load', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 30; // Animation duration
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 50);
    });
});

// Activity item click functionality
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('.activity-title').textContent;
        alert(`Opening report: ${title}`);
        // Add navigation to report details here
    });
    
    // Add hover effect cursor
    item.style.cursor = 'pointer';
});

// Responsive handling
function handleResize() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Notification functionality (simulate real-time updates)
function updateNotifications() {
    const notificationElement = document.querySelector('.new-notifications').parentElement.querySelector('.stat-number');
    let currentCount = parseInt(notificationElement.textContent);
    
    // Simulate random notification updates
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every interval
            currentCount++;
            notificationElement.textContent = currentCount;
            
            // Add notification animation
            notificationElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                notificationElement.style.transform = 'scale(1)';
            }, 200);
        }
    }, 5000); // Check every 5 seconds
}

// Initialize notifications after page load
setTimeout(updateNotifications, 2000);

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
    }
    
    // Space or Enter to trigger button clicks
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('nav-link')) {
        e.preventDefault();
        e.target.click();
    }
});

// Add loading states for async operations
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Error handling for failed operations
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 3000);
}

// Success message function
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('LocalVoice Dashboard initialized');
    
    // Check for user authentication
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found');
        // Uncomment to redirect to login if needed
        // window.location.href = '../login.html';
    }
    
    // Load user data
    loadUserData();
});

// Function to load user data
async function loadUserData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Simulate API call to get user data
        // Replace with actual API endpoint
        const response = await fetch('/api/community-members/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            document.querySelector('.user-name').textContent = userData.name || 'John Doe';
            document.querySelector('.user-avatar').textContent = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}
