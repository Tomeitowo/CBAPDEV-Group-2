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

// Get current logged in user from sessionStorage
function getCurrentUser() {
    return sessionStorage.getItem('currentUser');
}

// Set current logged in user
function setCurrentUser(username) {
    sessionStorage.setItem('currentUser', username);
}

// Clear current user (logout)
function clearCurrentUser() {
    sessionStorage.removeItem('currentUser');
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
            alert('Phase 1 does not have any database implementation yet, thus your created account is not added yet. To access the prototype, please use one of the existing accounts:\n\nJohnMiguel: Hello!123\nJuanDelaCruz: Pilipinas\nSophiaCruz: 12345\nJoseRizal: 54321\nMannyPacman: labanlang');
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
    
    // Goals functionality
    const newGoalBtn = document.getElementById('newGoalBtn');
    const goalModal = document.getElementById('goalModal');
    const goalForm = document.getElementById('goalForm');
    const cancelGoalBtns = document.querySelectorAll('.cancel-goal');
    let editingGoalCard = null;
    
    if (newGoalBtn && goalModal) {
        newGoalBtn.addEventListener('click', function() {
            editingGoalCard = null;
            document.getElementById('goalModalTitle').textContent = 'Create New Goal';
            goalForm.reset();
            goalModal.classList.add('active');
        });
    }
    
    if (cancelGoalBtns) {
        cancelGoalBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                goalModal.classList.remove('active');
                goalForm.reset();
                editingGoalCard = null;
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
            
            if (editingGoalCard) {
                updateGoalCard(editingGoalCard, goalName, goalCategory, goalDescription, goalLimit);
                alert('Goal updated successfully!');
            } else {
                addGoalToList(goalName, goalCategory, goalDescription, goalLimit);
                alert('Goal created successfully!');
            }
            
            goalModal.classList.remove('active');
            goalForm.reset();
            editingGoalCard = null;
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
        
        // Use description if provided, otherwise use a default message
        const displayDescription = description.trim() || 'No description provided';
        
        const goalHTML = `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-title">
                        <h4>${name}</h4>
                        <span class="goal-category ${categoryClass}">${category}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn-icon complete-goal" title="Mark as Completed">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                        </button>
                        <button class="btn-icon edit-goal" title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon delete-goal" title="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="goal-description">${displayDescription}</div>
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
        
        // Add event listeners to the new buttons
        const newGoalCard = h3.nextElementSibling;
        setupGoalCardEventListeners(newGoalCard);
    }
    
    // Update existing goal card
    function updateGoalCard(goalCard, name, category, description, limit) {
        // Get category class
        let categoryClass = 'other';
        if (category === 'Social Media') categoryClass = 'social-media';
        else if (category === 'Work' || category === 'Work-related') categoryClass = 'work';
        else if (category === 'Gaming') categoryClass = 'gaming';
        else if (category === 'Movies' || category === 'Movies & Entertainment') categoryClass = 'movies';
        else if (category === 'Study' || category === 'Study & Learning') categoryClass = 'study';
        
        const displayDescription = description.trim() || 'No description provided';
        
        // Update title and category
        goalCard.querySelector('.goal-title h4').textContent = name;
        const categorySpan = goalCard.querySelector('.goal-category');
        categorySpan.className = 'goal-category ' + categoryClass;
        categorySpan.textContent = category;
        
        // Update description
        goalCard.querySelector('.goal-description').textContent = displayDescription;
        
        // Update limit in progress info
        const progressInfo = goalCard.querySelector('.progress-info span');
        const currentProgress = progressInfo.textContent.split(' / ')[0];
        progressInfo.textContent = currentProgress + ' / ' + limit + 'h 00m';
    }
    
    // Edit goal function
    function editGoal(goalCard) {
        editingGoalCard = goalCard;
        
        const name = goalCard.querySelector('.goal-title h4').textContent;
        const category = goalCard.querySelector('.goal-category').textContent;
        const description = goalCard.querySelector('.goal-description').textContent;
        const limitText = goalCard.querySelector('.progress-info span').textContent;
        const limit = parseFloat(limitText.split(' / ')[1]);
        
        document.getElementById('goalModalTitle').textContent = 'Edit Goal';
        document.getElementById('goalName').value = name;
        document.getElementById('goalCategory').value = category;
        document.getElementById('goalDescription').value = description === 'No description provided' ? '' : description;
        document.getElementById('goalLimit').value = limit;
        
        goalModal.classList.add('active');
    }
    
    // Setup event listeners for a goal card
    function setupGoalCardEventListeners(goalCard) {
        const deleteBtn = goalCard.querySelector('.delete-goal');
        const editBtn = goalCard.querySelector('.edit-goal');
        const completeBtn = goalCard.querySelector('.complete-goal');
        const reactivateBtn = goalCard.querySelector('.reactivate-goal');
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this goal?')) {
                    goalCard.remove();
                    alert('Goal deleted successfully!');
                }
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                editGoal(goalCard);
            });
        }
        
        if (completeBtn) {
            completeBtn.addEventListener('click', function() {
                completeGoal(goalCard);
            });
        }
        
        if (reactivateBtn) {
            reactivateBtn.addEventListener('click', function() {
                reactivateGoal(goalCard);
            });
        }
    }
    
    // Complete goal function
    function completeGoal(goalCard) {
        if (confirm('Mark this goal as completed?')) {
            // Add completed class
            goalCard.classList.add('completed');
            
            // Remove progress section
            const progressSection = goalCard.querySelector('.goal-progress');
            if (progressSection) {
                progressSection.remove();
            }
            
            // Change buttons to reactivate only
            const goalActions = goalCard.querySelector('.goal-actions');
            goalActions.innerHTML = `
                <button class="btn-icon reactivate-goal" title="Reactivate Goal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                    </svg>
                </button>
            `;
            
            // Update status and streak
            const statusElement = goalCard.querySelector('.goal-status');
            statusElement.textContent = 'Completed';
            statusElement.className = 'goal-status status-completed';
            
            const streakElement = goalCard.querySelector('.goal-streak');
            streakElement.textContent = '✓ Completed on ' + getTodayDate();
            
            // Move to completed goals section
            const completedGoalsSection = document.querySelectorAll('.goals-section')[1];
            const completedGoalsList = completedGoalsSection.querySelector('.goal-card:last-child');
            
            if (completedGoalsList) {
                completedGoalsList.after(goalCard);
            } else {
                completedGoalsSection.appendChild(goalCard);
            }
            
            // Re-attach event listeners
            setupGoalCardEventListeners(goalCard);
            
            alert('Goal marked as completed!');
        }
    }
    
        // Reactivate goal function
    function reactivateGoal(goalCard) {
        if (confirm('Move this goal back to active goals?')) {
            // Remove completed class
            goalCard.classList.remove('completed');
            
            // Change buttons back to complete/edit/delete
            const goalActions = goalCard.querySelector('.goal-actions');
            goalActions.innerHTML = `
                <button class="btn-icon complete-goal" title="Mark as Completed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                </button>
                <button class="btn-icon edit-goal" title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-icon delete-goal" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            
            // Add basic progress section
            const goalDescription = goalCard.querySelector('.goal-description');
            const goalFooter = goalCard.querySelector('.goal-footer');
            
            // Check if progress section already exists
            if (!goalCard.querySelector('.goal-progress')) {
                const progressHTML = `
                    <div class="goal-progress">
                        <div class="progress-info">
                            <span>Today: 0h 00m / 2h 00m</span>
                            <span class="progress-percentage">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                    </div>
                `;
                
                // Insert progress after description and before footer
                goalDescription.insertAdjacentHTML('afterend', progressHTML);
            }
            
            // Update status
            const statusElement = goalCard.querySelector('.goal-status');
            statusElement.textContent = 'Starting';
            statusElement.className = 'goal-status status-active';
            
            // Update streak
            const streakElement = goalCard.querySelector('.goal-streak');
            streakElement.textContent = '🔥 0 day streak';
            
            // Move to active goals section - FIXED SELECTION
            const goalsSections = document.querySelectorAll('.goals-section');
            const activeGoalsSection = goalsSections[0]; // First section is active goals
            
            // Remove from current parent
            goalCard.remove();
            
            // Add to active goals section (after the h3)
            const activeH3 = activeGoalsSection.querySelector('h3');
            activeH3.insertAdjacentHTML('afterend', goalCard.outerHTML);
            
            // Get the newly added card and set up event listeners
            const newGoalCard = activeH3.nextElementSibling;
            setupGoalCardEventListeners(newGoalCard);
            
            alert('Goal moved to active goals!');
        }
    }
    
    // Initialize existing goal cards
    const goalCards = document.querySelectorAll('.goal-card');
    goalCards.forEach(function(goalCard) {
        setupGoalCardEventListeners(goalCard);
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
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                clearCurrentUser();
                alert('Account deleted successfully. Redirecting to login...');
                window.location.href = 'index.html';
            }
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
