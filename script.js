// Hardcoded users database
const users = {
    'JohnMiguel': {
        password: 'Hello!123',
        email: 'john.miguel@email.com'
    },
    'JuanDelaCruz': {
        password: 'Pilipinas',
        email: 'juan.delacruz@email.com'
    },
    'SophiaCruz': {
        password: '12345',
        email: 'sophia.cruz@email.com'
    },
    'JoseRizal': {
        password: '54321',
        email: 'jose.rizal@email.com'
    },
    'MannyPacman': {
        password: 'labanlang',
        email: 'manny.pacman@email.com'
    }
};

// Get current logged in user from localStorage
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Set current logged in user
function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// Get user data
function getUserData(username) {
    return users[username];
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to get today's date
function getTodayDate() {
    return formatDate(new Date());
}

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in on protected pages
    const protectedPages = ['home.html', 'sessions.html', 'goals.html', 'mood.html', 'insights.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            // Not logged in, redirect to login
            window.location.href = 'index.html';
            return;
        }
        
        // Update user name on pages that show it
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = currentUser;
        }
        
        // Update profile information if on profile page
        const profileName = document.getElementById('profileName');
        if (profileName) {
            const userData = getUserData(currentUser);
            profileName.textContent = currentUser;
            document.querySelector('.profile-email').textContent = userData.email;
            document.getElementById('updateUsername').value = currentUser;
            document.getElementById('updateEmail').value = userData.email;
        }
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Check if username exists and password matches
            if (users[username] && users[username].password === password) {
                setCurrentUser(username);
                alert('Login successful! Welcome ' + username);
                window.location.href = 'home.html';
            } else {
                alert('Invalid username or password. Please try again.');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Registration is currently disabled. Please use one of the existing accounts:\n\nJohnMiguel: Hello!123\nJuanDelaCruz: Pilipinas\nSophiaCruz: 12345\nJoseRizal: 54321\nMannyPacman: labanlang');
        });
    }
    
    // Timer controls
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const categorySelect = document.getElementById('categorySelect');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!categorySelect.value) {
                alert('Please select a category first');
                return;
            }
            
            isTimerRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            timerInterval = setInterval(function() {
                timerSeconds++;
                updateTimerDisplay();
            }, 1000);
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (isTimerRunning) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                pauseBtn.textContent = 'Resume';
                pauseBtn.classList.remove('btn-warning');
                pauseBtn.classList.add('btn-success');
            } else {
                timerInterval = setInterval(function() {
                    timerSeconds++;
                    updateTimerDisplay();
                }, 1000);
                isTimerRunning = true;
                pauseBtn.textContent = 'Pause';
                pauseBtn.classList.remove('btn-success');
                pauseBtn.classList.add('btn-warning');
            }
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            clearInterval(timerInterval);
            const hours = Math.floor(timerSeconds / 3600);
            const minutes = Math.floor((timerSeconds % 3600) / 60);
            const category = categorySelect.value;
            const totalMinutes = Math.floor(timerSeconds / 60);
            
            // Create new session and add to list
            if (totalMinutes > 0) {
                addSessionToList(category, hours, minutes);
                alert('Session saved!\nCategory: ' + category + '\nDuration: ' + hours + 'h ' + minutes + 'm');
            } else {
                alert('Session too short to save (less than 1 minute)');
            }
            
            timerSeconds = 0;
            isTimerRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            pauseBtn.textContent = 'Pause';
            pauseBtn.classList.remove('btn-success');
            pauseBtn.classList.add('btn-warning');
            updateTimerDisplay();
            categorySelect.value = '';
        });
    }
    
    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        if (timerDisplay) {
            timerDisplay.textContent = 
                String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        }
    }
    
    // Add session to the list
    function addSessionToList(category, hours, minutes) {
        const sessionsList = document.querySelector('.sessions-list');
        if (!sessionsList) return;
        
        const duration = hours + 'h ' + minutes + 'm';
        const date = getTodayDate();
        
        // Get category class
        let categoryClass = 'other';
        if (category === 'Social Media') categoryClass = 'social-media';
        else if (category === 'Work-related' || category === 'Work') categoryClass = 'work';
        else if (category === 'Gaming') categoryClass = 'gaming';
        else if (category === 'Movies & Entertainment' || category === 'Movies') categoryClass = 'movies';
        else if (category === 'Study & Learning' || category === 'Study') categoryClass = 'study';
        
        const sessionHTML = `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-category ${categoryClass}">${category}</div>
                    <div class="session-details">
                        <div class="session-date">${date}</div>
                        <div class="session-duration">${duration}</div>
                    </div>
                </div>
                <div class="session-actions">
                    <button class="btn-icon delete-session" title="Delete">
                        <span class="icon-delete"></span>
                    </button>
                </div>
            </div>
        `;
        
        // Insert at the beginning of the list (after h3)
        const h3 = sessionsList.querySelector('h3');
        h3.insertAdjacentHTML('afterend', sessionHTML);
        
        // Add delete functionality to the new button
        const newDeleteBtn = h3.nextElementSibling.querySelector('.delete-session');
        newDeleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this session?')) {
                this.closest('.session-item').remove();
                alert('Session deleted successfully!');
            }
        });
    }
    
    // Session delete
    const deleteSessionBtns = document.querySelectorAll('.delete-session');
    
    deleteSessionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this session?')) {
                btn.closest('.session-item').remove();
                alert('Session deleted successfully!');
            }
        });
    });
    
    // Session search
    const sessionSearch = document.getElementById('sessionSearch');
    if (sessionSearch) {
        sessionSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const sessionItems = document.querySelectorAll('.session-item');
            
            sessionItems.forEach(function(item) {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Goals functionality - CREATE NEW GOAL via modal
    const newGoalBtn = document.getElementById('newGoalBtn');
    const goalModal = document.getElementById('goalModal');
    const goalForm = document.getElementById('goalForm');
    const cancelGoalBtns = document.querySelectorAll('.cancel-goal');
    
    if (newGoalBtn && goalModal) {
        newGoalBtn.addEventListener('click', function() {
            goalModal.classList.add('active');
        });
    }
    
    if (cancelGoalBtns) {
        cancelGoalBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                goalModal.classList.remove('active');
                goalForm.reset();
            });
        });
    }
    
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const goalName = document.getElementById('goalName').value;
            const goalCategory = document.getElementById('goalCategory').value;
            const goalDescription = document.getElementById('goalDescription').value;
            const goalLimit = parseFloat(document.getElementById('goalLimit').value);
            
            addGoalToList(goalName, goalCategory, goalDescription, goalLimit);
            
            alert('Goal created successfully!');
            goalModal.classList.remove('active');
            goalForm.reset();
        });
    }
    
    // Add goal to the list
    function addGoalToList(name, category, description, limit) {
        const goalsSection = document.querySelector('.goals-section');
        if (!goalsSection) return;
        
        // Get category class
        let categoryClass = 'other';
        if (category === 'Social Media') categoryClass = 'social-media';
        else if (category === 'Work' || category === 'Work-related') categoryClass = 'work';
        else if (category === 'Gaming') categoryClass = 'gaming';
        else if (category === 'Movies' || category === 'Movies & Entertainment') categoryClass = 'movies';
        else if (category === 'Study' || category === 'Study & Learning') categoryClass = 'study';
        
        const goalHTML = `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-title">
                        <h4>${name}</h4>
                        <span class="goal-category ${categoryClass}">${category}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn-icon delete-goal" title="Delete">
                            <span class="icon-delete"></span>
                        </button>
                    </div>
                </div>
                <div class="goal-description">${description}</div>
                <div class="goal-progress">
                    <div class="progress-info">
                        <span>Today: 0h 00m / ${limit}h 00m</span>
                        <span class="progress-percentage">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="goal-footer">
                    <span class="goal-streak">🔥 0 day streak</span>
                    <span class="goal-status status-active">Starting</span>
                </div>
            </div>
        `;
        
        // Insert at the beginning (after h3)
        const h3 = goalsSection.querySelector('h3');
        h3.insertAdjacentHTML('afterend', goalHTML);
        
        // Add delete functionality to the new button
        const newDeleteBtn = h3.nextElementSibling.querySelector('.delete-goal');
        newDeleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this goal?')) {
                this.closest('.goal-card').remove();
                alert('Goal deleted successfully!');
            }
        });
    }
    
    // Goals delete
    const deleteGoalBtns = document.querySelectorAll('.delete-goal');
    
    deleteGoalBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this goal?')) {
                btn.closest('.goal-card').remove();
                alert('Goal deleted successfully!');
            }
        });
    });
    
    // Goal search
    const goalSearch = document.getElementById('goalSearch');
    if (goalSearch) {
        goalSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const goalCards = document.querySelectorAll('.goal-card');
            
            goalCards.forEach(function(card) {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Mood selector and CREATE
    const moodBtns = document.querySelectorAll('.mood-btn');
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    let selectedMood = null;
    let selectedMoodEmoji = null;
    let selectedMoodLabel = null;
    
    moodBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            moodBtns.forEach(function(b) {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
            selectedMoodEmoji = this.querySelector('.mood-emoji').textContent;
            selectedMoodLabel = this.querySelector('span').textContent;
        });
    });
    
    if (saveMoodBtn) {
        saveMoodBtn.addEventListener('click', function() {
            const moodNote = document.getElementById('moodNote').value;
            
            if (!selectedMood) {
                alert('Please select a mood first');
                return;
            }
            
            // Add mood to history
            addMoodToHistory(selectedMoodEmoji, selectedMoodLabel, moodNote);
            
            alert('Mood saved successfully!');
            moodBtns.forEach(function(b) {
                b.classList.remove('selected');
            });
            document.getElementById('moodNote').value = '';
            selectedMood = null;
            selectedMoodEmoji = null;
            selectedMoodLabel = null;
        });
    }
    
    // Add mood to history
    function addMoodToHistory(emoji, label, note) {
        const moodHistory = document.querySelector('.mood-history');
        if (!moodHistory) return;
        
        const date = getTodayDate();
        const noteText = note || 'No note added.';
        
        const moodHTML = `
            <div class="mood-entry">
                <div class="mood-entry-header">
                    <div class="mood-info">
                        <div class="mood-emoji-large">${emoji}</div>
                        <div class="mood-details">
                            <span class="mood-label">${label}</span>
                            <span class="mood-date">${date}</span>
                        </div>
                    </div>
                    <div class="mood-actions">
                        <button class="btn-icon delete-mood" title="Delete">
                            <span class="icon-delete"></span>
                        </button>
                    </div>
                </div>
                <div class="mood-note">${noteText}</div>
                <div class="mood-stats">
                    <span class="stat-item">📱 0h 0m total screen time today</span>
                    <span class="stat-item">✓ New entry</span>
                </div>
            </div>
        `;
        
        // Insert at the beginning (after h3)
        const h3 = moodHistory.querySelector('h3');
        h3.insertAdjacentHTML('afterend', moodHTML);
        
        // Add delete functionality to the new button
        const newDeleteBtn = h3.nextElementSibling.querySelector('.delete-mood');
        newDeleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this mood entry?')) {
                this.closest('.mood-entry').remove();
                alert('Mood entry deleted successfully!');
            }
        });
    }
    
    // Mood delete
    const deleteMoodBtns = document.querySelectorAll('.delete-mood');
    
    deleteMoodBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this mood entry?')) {
                btn.closest('.mood-entry').remove();
                alert('Mood entry deleted successfully!');
            }
        });
    });
    
    // Profile functionality
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profile updated successfully!');
        });
    }
    
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPasswordProfile').value;
            const confirmPassword = document.getElementById('confirmPasswordProfile').value;
            
            const currentUser = getCurrentUser();
            const userData = getUserData(currentUser);
            
            if (currentPassword !== userData.password) {
                alert('Current password is incorrect!');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            if (newPassword.length < 5) {
                alert('Password must be at least 5 characters long!');
                return;
            }
            
            alert('Password changed successfully!');
            changePasswordForm.reset();
        });
    }
    
    // Delete account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            deleteModal.classList.add('active');
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.classList.remove('active');
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            clearCurrentUser();
            alert('Account deleted successfully. Redirecting to login...');
            window.location.href = 'index.html';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Time range filter for insights
    const timeRangeFilter = document.getElementById('timeRangeFilter');
    if (timeRangeFilter) {
        timeRangeFilter.addEventListener('change', function() {
            alert('Filter changed to: ' + this.options[this.selectedIndex].text);
        });
    }
});