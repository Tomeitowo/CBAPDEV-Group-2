// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation (in real app, would check against backend)
            if (username && password) {
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'home.html';
            } else {
                alert('Please enter both username and password');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('newUsername').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (username && email && password) {
                alert('Account created successfully! Redirecting to login...');
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields');
            }
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
            
            alert(`Session saved!\nCategory: ${category}\nDuration: ${hours}h ${minutes}m`);
            
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
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    
    // Session edit and delete
    const editSessionBtns = document.querySelectorAll('.edit-session');
    const deleteSessionBtns = document.querySelectorAll('.delete-session');
    const editSessionModal = document.getElementById('editSessionModal');
    const editSessionForm = document.getElementById('editSessionForm');
    const cancelEditBtns = document.querySelectorAll('.cancel-edit');
    
    editSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (editSessionModal) {
                editSessionModal.classList.add('active');
            }
        });
    });
    
    deleteSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this session?')) {
                btn.closest('.session-item').remove();
                alert('Session deleted successfully!');
            }
        });
    });
    
    cancelEditBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (editSessionModal) {
                editSessionModal.classList.remove('active');
            }
        });
    });
    
    if (editSessionForm) {
        editSessionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Session updated successfully!');
            editSessionModal.classList.remove('active');
        });
    }
    
    // Session search
    const sessionSearch = document.getElementById('sessionSearch');
    if (sessionSearch) {
        sessionSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const sessionItems = document.querySelectorAll('.session-item');
            
            sessionItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'flex';
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
    const editGoalBtns = document.querySelectorAll('.edit-goal');
    const deleteGoalBtns = document.querySelectorAll('.delete-goal');
    
    if (newGoalBtn) {
        newGoalBtn.addEventListener('click', function() {
            document.getElementById('goalModalTitle').textContent = 'Create New Goal';
            goalForm.reset();
            goalModal.classList.add('active');
        });
    }
    
    editGoalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (goalModal) {
                document.getElementById('goalModalTitle').textContent = 'Edit Goal';
                goalModal.classList.add('active');
            }
        });
    });
    
    deleteGoalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this goal?')) {
                btn.closest('.goal-card').remove();
                alert('Goal deleted successfully!');
            }
        });
    });
    
    cancelGoalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (goalModal) {
                goalModal.classList.remove('active');
            }
        });
    });
    
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Goal saved successfully!');
            goalModal.classList.remove('active');
        });
    }
    
    // Goal search
    const goalSearch = document.getElementById('goalSearch');
    if (goalSearch) {
        goalSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const goalCards = document.querySelectorAll('.goal-card');
            
            goalCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Mood selector
    const moodBtns = document.querySelectorAll('.mood-btn');
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    let selectedMood = null;
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            moodBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
        });
    });
    
    if (saveMoodBtn) {
        saveMoodBtn.addEventListener('click', function() {
            const moodNote = document.getElementById('moodNote').value;
            
            if (!selectedMood) {
                alert('Please select a mood first');
                return;
            }
            
            alert('Mood saved successfully!');
            moodBtns.forEach(b => b.classList.remove('selected'));
            document.getElementById('moodNote').value = '';
            selectedMood = null;
        });
    }
    
    // Mood edit and delete
    const editMoodBtns = document.querySelectorAll('.edit-mood');
    const deleteMoodBtns = document.querySelectorAll('.delete-mood');
    const editMoodModal = document.getElementById('editMoodModal');
    const editMoodForm = document.getElementById('editMoodForm');
    const cancelEditMoodBtns = document.querySelectorAll('.cancel-edit-mood');
    
    editMoodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (editMoodModal) {
                editMoodModal.classList.add('active');
            }
        });
    });
    
    deleteMoodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this mood entry?')) {
                btn.closest('.mood-entry').remove();
                alert('Mood entry deleted successfully!');
            }
        });
    });
    
    cancelEditMoodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (editMoodModal) {
                editMoodModal.classList.remove('active');
            }
        });
    });
    
    if (editMoodForm) {
        editMoodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mood entry updated successfully!');
            editMoodModal.classList.remove('active');
        });
    }
    
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
            const newPassword = document.getElementById('newPasswordProfile').value;
            const confirmPassword = document.getElementById('confirmPasswordProfile').value;
            
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
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
            alert(`Filter changed to: ${this.options[this.selectedIndex].text}`);
            // In a real app, this would reload the charts with new data
        });
    }
});
