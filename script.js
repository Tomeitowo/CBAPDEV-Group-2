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

// Get category class
function getCategoryClass(category) {
    if (category === 'Social Media') return 'social-media';
    else if (category === 'Work-related' || category === 'Work') return 'work';
    else if (category === 'Gaming') return 'gaming';
    else if (category === 'Movies & Entertainment' || category === 'Movies') return 'movies';
    else if (category === 'Study & Learning' || category === 'Study') return 'study';
    else return 'other';
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
    
    // Add session to the list using DOM manipulation
    function addSessionToList(category, hours, minutes) {
        const sessionsList = document.querySelector('.sessions-list');
        if (!sessionsList) return;
        
        const duration = hours + 'h ' + minutes + 'm';
        const date = getTodayDate();
        const categoryClass = getCategoryClass(category);
        
        // Create session item
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        
        // Create session info
        const sessionInfo = document.createElement('div');
        sessionInfo.className = 'session-info';
        
        const sessionCategory = document.createElement('div');
        sessionCategory.className = 'session-category ' + categoryClass;
        sessionCategory.textContent = category;
        
        const sessionDetails = document.createElement('div');
        sessionDetails.className = 'session-details';
        
        const sessionDate = document.createElement('div');
        sessionDate.className = 'session-date';
        sessionDate.textContent = date;
        
        const sessionDuration = document.createElement('div');
        sessionDuration.className = 'session-duration';
        sessionDuration.textContent = duration;
        
        // Build session details
        sessionDetails.appendChild(sessionDate);
        sessionDetails.appendChild(sessionDuration);
        
        // Build session info
        sessionInfo.appendChild(sessionCategory);
        sessionInfo.appendChild(sessionDetails);
        
        // Create session actions
        const sessionActions = document.createElement('div');
        sessionActions.className = 'session-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete-session';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '<span class="icon-delete"></span>';
        
        // Build session actions
        sessionActions.appendChild(deleteBtn);
        
        // Build session item
        sessionItem.appendChild(sessionInfo);
        sessionItem.appendChild(sessionActions);
        
        // Insert at the beginning of the list (after h3)
        const h3 = sessionsList.querySelector('h3');
        sessionsList.insertBefore(sessionItem, h3.nextSibling);
        
        // Add delete functionality
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this session?')) {
                sessionItem.remove();
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
    
    // Add goal to the list using DOM manipulation
    function addGoalToList(name, category, description, limit) {
        const goalsSection = document.querySelector('.goals-section');
        if (!goalsSection) return;
        
        const categoryClass = getCategoryClass(category);
        const displayDescription = description.trim() || 'No description provided';
        
        // Create goal card
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        
        // Create goal header
        const goalHeader = document.createElement('div');
        goalHeader.className = 'goal-header';
        
        const goalTitle = document.createElement('div');
        goalTitle.className = 'goal-title';
        
        const titleH4 = document.createElement('h4');
        titleH4.textContent = name;
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'goal-category ' + categoryClass;
        categorySpan.textContent = category;
        
        // Build goal title
        goalTitle.appendChild(titleH4);
        goalTitle.appendChild(categorySpan);
        
        // Create goal actions
        const goalActions = document.createElement('div');
        goalActions.className = 'goal-actions';
        
        // Create complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-icon complete-goal';
        completeBtn.title = 'Mark as Completed';
        completeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon edit-goal';
        editBtn.title = 'Edit';
        editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete-goal';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
        
        // Build goal actions
        goalActions.appendChild(completeBtn);
        goalActions.appendChild(editBtn);
        goalActions.appendChild(deleteBtn);
        
        // Build goal header
        goalHeader.appendChild(goalTitle);
        goalHeader.appendChild(goalActions);
        
        // Create goal description
        const goalDescriptionElem = document.createElement('div');
        goalDescriptionElem.className = 'goal-description';
        goalDescriptionElem.textContent = displayDescription;
        
        // Create goal progress
        const goalProgress = document.createElement('div');
        goalProgress.className = 'goal-progress';
        
        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info';
        
        const progressText = document.createElement('span');
        progressText.textContent = 'Today: 0h 00m / ' + limit + 'h 00m';
        
        const progressPercentage = document.createElement('span');
        progressPercentage.className = 'progress-percentage';
        progressPercentage.textContent = '0%';
        
        // Build progress info
        progressInfo.appendChild(progressText);
        progressInfo.appendChild(progressPercentage);
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        
        // Build progress bar
        progressBar.appendChild(progressFill);
        
        // Build goal progress
        goalProgress.appendChild(progressInfo);
        goalProgress.appendChild(progressBar);
        
        // Create goal footer
        const goalFooter = document.createElement('div');
        goalFooter.className = 'goal-footer';
        
        const goalStreak = document.createElement('span');
        goalStreak.className = 'goal-streak';
        goalStreak.textContent = '🔥 0 day streak';
        
        const goalStatus = document.createElement('span');
        goalStatus.className = 'goal-status status-active';
        goalStatus.textContent = 'Starting';
        
        // Build goal footer
        goalFooter.appendChild(goalStreak);
        goalFooter.appendChild(goalStatus);
        
        // Build goal card
        goalCard.appendChild(goalHeader);
        goalCard.appendChild(goalDescriptionElem);
        goalCard.appendChild(goalProgress);
        goalCard.appendChild(goalFooter);
        
        // Insert at the beginning (after h3)
        const h3 = goalsSection.querySelector('h3');
        goalsSection.insertBefore(goalCard, h3.nextSibling);
        
        // Add event listeners directly to the buttons
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this goal?')) {
                goalCard.remove();
                alert('Goal deleted successfully!');
            }
        });
        
        editBtn.addEventListener('click', function() {
            editGoal(goalCard);
        });
        
        completeBtn.addEventListener('click', function() {
            completeGoal(goalCard);
        });
    }
    
    // Update existing goal card
    function updateGoalCard(goalCard, name, category, description, limit) {
        const categoryClass = getCategoryClass(category);
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
            goalActions.innerHTML = '';
            
            const reactivateBtn = document.createElement('button');
            reactivateBtn.className = 'btn-icon reactivate-goal';
            reactivateBtn.title = 'Reactivate Goal';
            reactivateBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>';
            
            goalActions.appendChild(reactivateBtn);
            
            // Update status and streak
            const statusElement = goalCard.querySelector('.goal-status');
            statusElement.textContent = 'Completed';
            statusElement.className = 'goal-status status-completed';
            
            const streakElement = goalCard.querySelector('.goal-streak');
            streakElement.textContent = '✓ Completed on ' + getTodayDate();
            
            // Move to completed goals section
            const goalsSections = document.querySelectorAll('.goals-section');
            const completedGoalsSection = goalsSections[1];
            
            goalCard.remove();
            completedGoalsSection.appendChild(goalCard);
            
            // Add event listener to reactivate button
            reactivateBtn.addEventListener('click', function() {
                reactivateGoal(goalCard);
            });
            
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
            goalActions.innerHTML = '';
            
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-icon complete-goal';
            completeBtn.title = 'Mark as Completed';
            completeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon edit-goal';
            editBtn.title = 'Edit';
            editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon delete-goal';
            deleteBtn.title = 'Delete';
            deleteBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
            
            goalActions.appendChild(completeBtn);
            goalActions.appendChild(editBtn);
            goalActions.appendChild(deleteBtn);
            
            // Add basic progress section if it doesn't exist
            if (!goalCard.querySelector('.goal-progress')) {
                const goalDescription = goalCard.querySelector('.goal-description');
                const goalFooter = goalCard.querySelector('.goal-footer');
                
                const goalProgress = document.createElement('div');
                goalProgress.className = 'goal-progress';
                
                const progressInfo = document.createElement('div');
                progressInfo.className = 'progress-info';
                
                const progressText = document.createElement('span');
                progressText.textContent = 'Today: 0h 00m / 2h 00m';
                
                const progressPercentage = document.createElement('span');
                progressPercentage.className = 'progress-percentage';
                progressPercentage.textContent = '0%';
                
                progressInfo.appendChild(progressText);
                progressInfo.appendChild(progressPercentage);
                
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                
                const progressFill = document.createElement('div');
                progressFill.className = 'progress-fill';
                progressFill.style.width = '0%';
                
                progressBar.appendChild(progressFill);
                goalProgress.appendChild(progressInfo);
                goalProgress.appendChild(progressBar);
                
                goalDescription.parentNode.insertBefore(goalProgress, goalFooter);
            }
            
            // Update status
            const statusElement = goalCard.querySelector('.goal-status');
            statusElement.textContent = 'Starting';
            statusElement.className = 'goal-status status-active';
            
            // Update streak
            const streakElement = goalCard.querySelector('.goal-streak');
            streakElement.textContent = '🔥 0 day streak';
            
            // Move to active goals section
            const goalsSections = document.querySelectorAll('.goals-section');
            const activeGoalsSection = goalsSections[0];
            
            goalCard.remove();
            const h3 = activeGoalsSection.querySelector('h3');
            activeGoalsSection.insertBefore(goalCard, h3.nextSibling);
            
            // Add event listeners to the new buttons
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this goal?')) {
                    goalCard.remove();
                    alert('Goal deleted successfully!');
                }
            });
            
            editBtn.addEventListener('click', function() {
                editGoal(goalCard);
            });
            
            completeBtn.addEventListener('click', function() {
                completeGoal(goalCard);
            });
            
            alert('Goal moved to active goals!');
        }
    }
    
    // Initialize existing goal cards
    const goalCards = document.querySelectorAll('.goal-card');
    goalCards.forEach(function(goalCard) {
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
    
    // Add mood to history using DOM manipulation
    function addMoodToHistory(emoji, label, note) {
        const moodHistory = document.querySelector('.mood-history');
        if (!moodHistory) return;
        
        const date = getTodayDate();
        const noteText = note || 'No note added.';
        
        // Create mood entry
        const moodEntry = document.createElement('div');
        moodEntry.className = 'mood-entry';
        
        // Create mood entry header
        const moodEntryHeader = document.createElement('div');
        moodEntryHeader.className = 'mood-entry-header';
        
        const moodInfo = document.createElement('div');
        moodInfo.className = 'mood-info';
        
        const moodEmojiLarge = document.createElement('div');
        moodEmojiLarge.className = 'mood-emoji-large';
        moodEmojiLarge.textContent = emoji;
        
        const moodDetails = document.createElement('div');
        moodDetails.className = 'mood-details';
        
        const moodLabel = document.createElement('span');
        moodLabel.className = 'mood-label';
        moodLabel.textContent = label;
        
        const moodDate = document.createElement('span');
        moodDate.className = 'mood-date';
        moodDate.textContent = date;
        
        // Build mood details
        moodDetails.appendChild(moodLabel);
        moodDetails.appendChild(moodDate);
        
        // Build mood info
        moodInfo.appendChild(moodEmojiLarge);
        moodInfo.appendChild(moodDetails);
        
        // Create mood actions
        const moodActions = document.createElement('div');
        moodActions.className = 'mood-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete-mood';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '<span class="icon-delete"></span>';
        
        // Build mood actions
        moodActions.appendChild(deleteBtn);
        
        // Build mood entry header
        moodEntryHeader.appendChild(moodInfo);
        moodEntryHeader.appendChild(moodActions);
        
        // Create mood note
        const moodNote = document.createElement('div');
        moodNote.className = 'mood-note';
        moodNote.textContent = noteText;
        
        // Create mood stats
        const moodStats = document.createElement('div');
        moodStats.className = 'mood-stats';
        
        const statItem1 = document.createElement('span');
        statItem1.className = 'stat-item';
        statItem1.textContent = '📱 0h 0m total screen time today';
        
        const statItem2 = document.createElement('span');
        statItem2.className = 'stat-item';
        statItem2.textContent = '✓ New entry';
        
        // Build mood stats
        moodStats.appendChild(statItem1);
        moodStats.appendChild(statItem2);
        
        // Build mood entry
        moodEntry.appendChild(moodEntryHeader);
        moodEntry.appendChild(moodNote);
        moodEntry.appendChild(moodStats);
        
        // Insert at the beginning (after h3)
        const h3 = moodHistory.querySelector('h3');
        moodHistory.insertBefore(moodEntry, h3.nextSibling);
        
        // Add delete functionality
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this mood entry?')) {
                moodEntry.remove();
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
