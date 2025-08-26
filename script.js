
// script.js - JavaScript for AquaPulse Application

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDarkModeToggle();
    initTutorial();
    initDashboard();
    initModals();
    initForum();
    initAchievements();
    initMap();
    initReportSystem();
});

// Dark Mode Toggle
function initDarkModeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// Interactive Tutorial
function initTutorial() {
    const steps = document.querySelectorAll('.tutorial-steps .step');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const startTutorialBtn = document.getElementById('start-tutorial');
    let currentStep = 0;
    
    // Function to update tutorial steps
    function updateTutorialStep() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update button states
        prevBtn.disabled = currentStep === 0;
        nextBtn.disabled = currentStep === steps.length - 1;
    }
    
    // Event listeners for navigation
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateTutorialStep();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateTutorialStep();
        }
    });
    
    // Start tutorial button
    startTutorialBtn.addEventListener('click', () => {
        document.getElementById('tutorial').scrollIntoView({ behavior: 'smooth' });
        currentStep = 0;
        updateTutorialStep();
    });
    
    // Initialize tutorial state
    updateTutorialStep();
}

// Dashboard Functionality
function initDashboard() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // If switching to predictive analytics, render chart
            if (tabId === 'predictive-analytics') {
                renderRiskChart();
            }
        });
    });
    
    // Calendar functionality
    initCalendar();
    
    // Report filtering
    const timeFilter = document.getElementById('time-filter');
    const statusFilter = document.getElementById('status-filter');
    const exportBtn = document.getElementById('export-data');
    
    [timeFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', filterReports);
    });
    
    exportBtn.addEventListener('click', exportReportData);
    
    // Initial report load
    filterReports();
}

// Calendar Functionality
function initCalendar() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthEl = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    let currentDate = new Date();
    
    // Function to render calendar
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Create day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        });
        
        // Get first day of month and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = day;
            
            // Add water saving data (random for demo)
            const savedWater = Math.floor(Math.random() * 100);
            if (savedWater > 0) {
                dateCell.classList.add('saved');
                if (savedWater > 50) {
                    dateCell.classList.add('saved-high');
                }
                
                // Add tooltip with water saved
                dateCell.setAttribute('data-water', `${savedWater}L saved`);
            }
            
            calendarGrid.appendChild(dateCell);
        }
        
        // Update water summary
        updateWaterSummary();
    }
    
    // Function to update water summary
    function updateWaterSummary() {
        const savedDates = document.querySelectorAll('.calendar-date.saved');
        let totalSaved = 0;
        
        savedDates.forEach(date => {
            const waterText = date.getAttribute('data-water');
            const waterAmount = parseInt(waterText);
            if (!isNaN(waterAmount)) {
                totalSaved += waterAmount;
            }
        });
        
        // Update summary (for demo, we'll just show the calculated total)
        document.querySelector('.savings-amount').textContent = `${totalSaved} Liters`;
    }
    
    // Month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Initial calendar render
    renderCalendar();
}

// Report Filtering and Export
function filterReports() {
    const timeFilter = document.getElementById('time-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const reportsList = document.querySelector('.reports-list');
    
    // In a real app, this would fetch from an API
    // For demo, we'll generate some sample reports
    reportsList.innerHTML = '';
    
    const sampleReports = [
        { id: 101, type: 'Pipe Burst', location: 'Main Street', date: '2 days ago', status: 'submitted' },
        { id: 102, type: 'Tap Leak', location: 'City Park', date: '5 days ago', status: 'verified' },
        { id: 103, type: 'Joint Leak', location: 'Residential Area', date: '1 week ago', status: 'resolved' },
        { id: 104, type: 'Other', location: 'Industrial Zone', date: '2 weeks ago', status: 'submitted' }
    ];
    
    // Filter reports based on selections
    const filteredReports = sampleReports.filter(report => {
        // Time filter simulation (in real app would use actual dates)
        let timeMatch = true;
        if (timeFilter === '7' && Math.random() > 0.5) timeMatch = false;
        if (timeFilter === '30' && Math.random() > 0.3) timeMatch = false;
        
        // Status filter
        const statusMatch = statusFilter === 'all' || report.status === statusFilter;
        
        return timeMatch && statusMatch;
    });
    
    // Display filtered reports
    filteredReports.forEach(report => {
        const reportEl = document.createElement('div');
        reportEl.className = 'report-item';
        reportEl.innerHTML = `
            <div class="report-info">
                <h4>${report.type} - ${report.location}</h4>
                <p>Reported ${report.date}</p>
            </div>
            <span class="report-status status-${report.status}">${report.status}</span>
        `;
        reportsList.appendChild(reportEl);
    });
    
    // Show message if no reports
    if (filteredReports.length === 0) {
        reportsList.innerHTML = '<p class="no-reports">No reports match your filters.</p>';
    }
}

function exportReportData() {
    // In a real app, this would generate a CSV or PDF
    alert('Export functionality would generate a report file in a real application.');
}

// Risk Chart using Chart.js
function renderRiskChart() {
    const ctx = document.getElementById('risk-chart').getContext('2d');
    
    // Sample data for the chart
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Leak Risk Level',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            borderColor: 'rgb(14, 165, 233)',
            tension: 0.4
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Water Leak Risk Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    };
    
    // Create or update chart
    if (window.riskChart) {
        window.riskChart.destroy();
    }
    window.riskChart = new Chart(ctx, config);
}

// Modal Windows
function initModals() {
    // Report leak modal
    const reportModal = document.getElementById('report-modal');
    const reportBtn = document.getElementById('report-leak-btn');
    const ctaReportBtn = document.getElementById('cta-report-btn');
    const closeModal = reportModal.querySelector('.close');
    
    // Verification modal
    const verificationModal = document.getElementById('verification-modal');
    const closeVerificationModal = verificationModal.querySelector('.close');
    
    // Function to open modal
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to close modal
    function closeModalFunc(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Event listeners for report modal
    [reportBtn, ctaReportBtn].forEach(btn => {
        btn.addEventListener('click', () => openModal(reportModal));
    });
    
    closeModal.addEventListener('click', () => closeModalFunc(reportModal));
    
    // Event listeners for verification modal
    // In a real app, this would open when a user clicks to verify a specific report
    closeVerificationModal.addEventListener('click', () => closeModalFunc(verificationModal));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === reportModal) closeModalFunc(reportModal);
        if (e.target === verificationModal) closeModalFunc(verificationModal);
    });
    
    // Report form submission
    const reportForm = document.getElementById('report-form');
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            type: document.getElementById('leak-type').value,
            description: document.getElementById('leak-description').value,
            location: document.getElementById('leak-location').value,
            image: document.getElementById('leak-image').files[0] ? true : false
        };
        
        // In a real app, this would send to an API
        console.log('Leak report submitted:', formData);
        
        // Show success message and close modal
        alert('Thank you for reporting the leak! Our team will review it shortly.');
        closeModalFunc(reportModal);
        reportForm.reset();
    });
    
    // Get location button
    const getLocationBtn = document.getElementById('get-location');
    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('leak-location').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                },
                (error) => {
                    alert('Unable to get your location. Please enter it manually.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
    
    // Report tabs
    const reportTabBtns = document.querySelectorAll('.report-tab-btn');
    const reportTabContents = document.querySelectorAll('.report-tab-content');
    
    reportTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            reportTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab content
            reportTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-tab') === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Voice recording functionality
    const startRecordingBtn = document.getElementById('start-recording');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const submitVoiceBtn = document.getElementById('submit-voice-report');
    const transcriptText = document.getElementById('transcript-text');
    
    // This would use the Web Speech API in a real implementation
    startRecordingBtn.addEventListener('click', () => {
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
        startRecordingBtn.classList.add('recording');
        
        // Simulate recording process
        transcriptText.textContent = 'Listening...';
        
        // In a real app, this would use the Speech Recognition API
        setTimeout(() => {
            transcriptText.textContent = 'Detected a major pipe burst near the intersection of Oak Street and Maple Avenue. Water is flowing heavily and creating a large puddle on the road. This appears to be a significant leak that needs immediate attention.';
            stopRecordingBtn.click();
        }, 3000);
    });
    
    stopRecordingBtn.addEventListener('click', () => {
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
        submitVoiceBtn.disabled = false;
        startRecordingBtn.classList.remove('recording');
    });
    
    submitVoiceBtn.addEventListener('click', () => {
        alert('Voice report submitted successfully!');
        closeModalFunc(reportModal);
    });
    
    // Verification buttons
    document.getElementById('confirm-leak').addEventListener('click', () => {
        handleVerification('confirmed');
    });
    
    document.getElementById('reject-leak').addEventListener('click', () => {
        handleVerification('rejected');
    });
    
    document.getElementById('not-sure').addEventListener('click', () => {
        handleVerification('unsure');
    });
    
    function handleVerification(status) {
        // In a real app, this would send the verification to an API
        console.log(`Verification status: ${status}`);
        alert(`Thank you for your verification! Status: ${status}`);
        closeModalFunc(verificationModal);
    }
}

// Forum Functionality
function initForum() {
    const newTopicBtn = document.getElementById('new-topic-btn');
    const forumCategories = document.querySelectorAll('.forum-categories li');
    
    // Sample forum data
    const forumTopics = [
        { 
            title: 'Major pipe burst on Main Street', 
            author: 'WaterWatcher23', 
            date: '2 hours ago', 
            category: 'Leak Reports',
            excerpt: 'There\'s a significant pipe burst near the intersection of Main Street and Park Avenue. Water is gushing out and flooding the road.',
            replies: 12,
            views: 85
        },
        { 
            title: 'How to detect hidden water leaks', 
            author: 'DIYPlumber', 
            date: '1 day ago', 
            category: 'Conservation Tips',
            excerpt: 'Here are some tips I\'ve learned over the years to detect hidden water leaks in your home before they become major problems.',
            replies: 24,
            views: 156
        },
        { 
            title: 'Upcoming maintenance schedule', 
            author: 'AquaAdmin', 
            date: '3 days ago', 
            category: 'News & Updates',
            excerpt: 'Please be advised that there will be scheduled maintenance in the downtown area next week. Expect temporary water shutdowns.',
            replies: 5,
            views: 73
        }
    ];
    
    // Load forum topics
    function loadForumTopics(category = 'all') {
        const topicsContainer = document.querySelector('.forum-topics');
        topicsContainer.innerHTML = '';
        
        const filteredTopics = category === 'all' 
            ? forumTopics 
            : forumTopics.filter(topic => topic.category === category);
        
        filteredTopics.forEach(topic => {
            const topicEl = document.createElement('div');
            topicEl.className = 'topic-item';
            topicEl.innerHTML = `
                <div class="topic-header">
                    <h4 class="topic-title">${topic.title}</h4>
                    <span class="topic-meta">By ${topic.author} • ${topic.date}</span>
                </div>
                <p class="topic-excerpt">${topic.excerpt}</p>
                <div class="topic-stats">
                    <span><i class="fas fa-comment"></i> ${topic.replies} replies</span>
                    <span><i class="fas fa-eye"></i> ${topic.views} views</span>
                </div>
            `;
            topicsContainer.appendChild(topicEl);
        });
        
        if (filteredTopics.length === 0) {
            topicsContainer.innerHTML = '<p class="no-topics">No topics found in this category.</p>';
        }
    }
    
    // Category selection
    forumCategories.forEach(category => {
        category.addEventListener('click', () => {
            forumCategories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryName = category.textContent.trim();
            loadForumTopics(categoryName);
        });
    });
    
    // New topic button
    newTopicBtn.addEventListener('click', () => {
        alert('In a real application, this would open a form to create a new forum topic.');
    });
    
    // Initial load
    loadForumTopics();
}

// Achievements System
function initAchievements() {
    // Sample badges data
    const badges = [
        { id: 1, name: 'First Report', icon: 'fa-flag', earned: true, date: '2023-08-15' },
        { id: 2, name: 'Conservationist', icon: 'fa-tint', earned: true, date: '2023-09-02' },
        { id: 3, name: 'Community Helper', icon: 'fa-hands-helping', earned: true, date: '2023-09-20' },
        { id: 4, name: 'Leak Detective', icon: 'fa-search', earned: false },
        { id: 5, name: 'Water Warrior', icon: 'fa-shield-alt', earned: false },
        { id: 6, name: 'Master Conserver', icon: 'fa-trophy', earned: false }
    ];
    
    // Sample leaderboard data
    const leaderboard = [
        { rank: 1, name: 'WaterWatcher42', points: 1250 },
        { rank: 2, name: 'AquaGuardian', points: 1120 },
        { rank: 3, name: 'LeakBuster', points: 980 },
        { rank: 4, name: 'DropSaver', points: 875 },
        { rank: 5, name: 'HydroHero', points: 760 }
    ];
    
    // Load badges
    const badgesGrid = document.querySelector('.badges-grid');
    badges.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge ${badge.earned ? '' : 'locked'}`;
        badgeEl.innerHTML = `
            <div class="badge-icon">
                <i class="fas ${badge.icon}"></i>
            </div>
            <div class="badge-name">${badge.name}</div>
            ${badge.earned ? `<div class="badge-date">Earned: ${badge.date}</div>` : ''}
        `;
        badgesGrid.appendChild(badgeEl);
    });
    
    // Load leaderboard
    const leaderboardList = document.querySelector('.leaderboard-list');
    leaderboard.forEach(user => {
        const userEl = document.createElement('div');
        userEl.className = 'leaderboard-item';
        userEl.innerHTML = `
            <div class="leaderboard-rank">${user.rank}</div>
            <div class="leaderboard-user">${user.name}</div>
            <div class="leaderboard-points">${user.points} pts</div>
        `;
        leaderboardList.appendChild(userEl);
    });
}

// Map Initialization (using Leaflet)
function initMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Initialize map (in a real app, you would use your actual map token)
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India
    
    // Add tile layer (using OpenStreetMap as default)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add sample leak markers
    const leakMarkers = [
        { lat: 19.0760, lng: 72.8777, type: 'Pipe Burst', severity: 'High' }, // Mumbai
        { lat: 28.6139, lng: 77.2090, type: 'Tap Leak', severity: 'Medium' }, // Delhi
        { lat: 13.0827, lng: 80.2707, type: 'Joint Leak', severity: 'Low' }, // Chennai
        { lat: 12.9716, lng: 77.5946, type: 'Pipe Burst', severity: 'High' }, // Bangalore
        { lat: 17.3850, lng: 78.4867, type: 'Other', severity: 'Medium' } // Hyderabad
    ];
    
    // Create custom icons based on leak severity
    const iconHigh = L.divIcon({
        className: 'leak-marker high',
        html: '<i class="fas fa-tint"></i>',
        iconSize: [30, 30]
    });
    
    const iconMedium = L.divIcon({
        className: 'leak-marker medium',
        html: '<i class="fas fa-tint"></i>',
        iconSize: [24, 24]
    });
    
    const iconLow = L.divIcon({
        className: 'leak-marker low',
        html: '<i class="fas fa-tint"></i>',
        iconSize: [18, 18]
    });
    
    // Add markers to map
    leakMarkers.forEach(leak => {
        let icon;
        switch(leak.severity) {
            case 'High': icon = iconHigh; break;
            case 'Medium': icon = iconMedium; break;
            case 'Low': icon = iconLow; break;
        }
        
        const marker = L.marker([leak.lat, leak.lng], { icon: icon }).addTo(map);
        marker.bindPopup(`
            <strong>${leak.type}</strong><br>
            Severity: ${leak.severity}<br>
            <button class="btn btn-primary" onclick="alert('In a real app, this would show details or verification options.')">View Details</button>
        `);
    });
}

// Report System Initialization
function initReportSystem() {
    // This would set up any additional report system functionality
    console.log('Report system initialized');
}

// Utility function to format dates
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Export functions for global access (if needed)
window.AquaPulse = {
    initDarkModeToggle,
    initTutorial,
    initDashboard,
    initModals,
    initForum,
    initAchievements,
    initMap,
    initReportSystem,
    formatDate
};
