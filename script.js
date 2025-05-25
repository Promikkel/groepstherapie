// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.day-nav a');
    const sections = document.querySelectorAll('.day-section');
    
    // Like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    
    // Signup toggles
    const signupToggles = document.querySelectorAll('.signup-toggle');
    
    // Initialize data from localStorage
    initializeData();
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to target section
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Like button functionality
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.getAttribute('data-activity');
            const likeCount = this.querySelector('.like-count');
            
            // Toggle like status
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                decreaseLikeCount(activityId);
                likeCount.textContent = getLikeCount(activityId);
            } else {
                this.classList.add('active');
                increaseLikeCount(activityId);
                likeCount.textContent = getLikeCount(activityId);
            }
        });
    });
    
    // Signup toggle functionality
    signupToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const signupForm = this.nextElementSibling;
            
            // Toggle signup form
            if (signupForm.classList.contains('active')) {
                signupForm.classList.remove('active');
                this.innerHTML = 'Aanmelden <i class="fas fa-chevron-down"></i>';
            } else {
                signupForm.classList.add('active');
                this.innerHTML = 'Verbergen <i class="fas fa-chevron-up"></i>';
            }
        });
    });
    
    // Signup button functionality
    const signupButtons = document.querySelectorAll('.signup-btn');
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const signupForm = this.closest('.signup-form');
            const activityCard = this.closest('.activity-card');
            const activityTitle = activityCard.querySelector('.activity-title').textContent.trim();
            const inputField = signupForm.querySelector('.signup-input');
            const participantsContainer = signupForm.querySelector('.participants');
            
            const name = inputField.value.trim();
            
            if (name) {
                // Add participant
                addParticipant(activityTitle, name);
                
                // Clear input field
                inputField.value = '';
                
                // Update participants display
                updateParticipantsDisplay(activityTitle, participantsContainer);
            }
        });
    });
    
    // Initialize participants display
    const participantsContainers = document.querySelectorAll('.participants');
    participantsContainers.forEach(container => {
        const activityCard = container.closest('.activity-card');
        const activityTitle = activityCard.querySelector('.activity-title').textContent.trim();
        
        updateParticipantsDisplay(activityTitle, container);
    });
});

// Data management functions
function initializeData() {
    // Initialize likes data
    if (!localStorage.getItem('likes')) {
        localStorage.setItem('likes', JSON.stringify({}));
    }
    
    // Initialize participants data
    if (!localStorage.getItem('participants')) {
        localStorage.setItem('participants', JSON.stringify({}));
    }
    
    // Update like counts display
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        const activityId = button.getAttribute('data-activity');
        const likeCount = button.querySelector('.like-count');
        
        likeCount.textContent = getLikeCount(activityId);
        
        // Set active class if liked
        if (isLiked(activityId)) {
            button.classList.add('active');
        }
    });
}

function getLikeCount(activityId) {
    const likes = JSON.parse(localStorage.getItem('likes'));
    return likes[activityId] || 0;
}

function increaseLikeCount(activityId) {
    const likes = JSON.parse(localStorage.getItem('likes'));
    likes[activityId] = (likes[activityId] || 0) + 1;
    localStorage.setItem('likes', JSON.stringify(likes));
}

function decreaseLikeCount(activityId) {
    const likes = JSON.parse(localStorage.getItem('likes'));
    if (likes[activityId] && likes[activityId] > 0) {
        likes[activityId]--;
    }
    localStorage.setItem('likes', JSON.stringify(likes));
}

function isLiked(activityId) {
    const likes = JSON.parse(localStorage.getItem('likes'));
    return likes[activityId] && likes[activityId] > 0;
}

function addParticipant(activityTitle, name) {
    const participants = JSON.parse(localStorage.getItem('participants'));
    
    if (!participants[activityTitle]) {
        participants[activityTitle] = [];
    }
    
    // Check if name already exists
    if (!participants[activityTitle].includes(name)) {
        participants[activityTitle].push(name);
        localStorage.setItem('participants', JSON.stringify(participants));
    }
}

function removeParticipant(activityTitle, name) {
    const participants = JSON.parse(localStorage.getItem('participants'));
    
    if (participants[activityTitle]) {
        const index = participants[activityTitle].indexOf(name);
        if (index !== -1) {
            participants[activityTitle].splice(index, 1);
            localStorage.setItem('participants', JSON.stringify(participants));
        }
    }
}

function getParticipants(activityTitle) {
    const participants = JSON.parse(localStorage.getItem('participants'));
    return participants[activityTitle] || [];
}

function updateParticipantsDisplay(activityTitle, container) {
    const participants = getParticipants(activityTitle);
    
    // Clear container
    container.innerHTML = '';
    
    // Add participants
    participants.forEach(name => {
        const participantElement = document.createElement('div');
        participantElement.classList.add('participant');
        
        const nameElement = document.createElement('span');
        nameElement.textContent = name;
        
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-participant');
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.addEventListener('click', function() {
            removeParticipant(activityTitle, name);
            updateParticipantsDisplay(activityTitle, container);
        });
        
        participantElement.appendChild(nameElement);
        participantElement.appendChild(removeButton);
        
        container.appendChild(participantElement);
    });
}

// Scroll event for sticky navigation
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const nav = document.querySelector('.day-nav');
    const navHeight = nav.offsetHeight;
    const headerHeight = header.offsetHeight;
    
    if (window.scrollY > headerHeight) {
        nav.classList.add('sticky');
        document.body.style.paddingTop = navHeight + 'px';
    } else {
        nav.classList.remove('sticky');
        document.body.style.paddingTop = 0;
    }
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('.day-section');
    const navLinks = document.querySelectorAll('.day-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 10;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});

// Add some visual effects for festival atmosphere
function addFestivalEffects() {
    // Random confetti effect on page load
    const confettiColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        const size = Math.random() * 10 + 5;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = color;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 8000);
    }
}

// Call festival effects on page load
window.addEventListener('load', addFestivalEffects);

// Add CSS for confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .confetti {
        position: fixed;
        top: 0;
        z-index: 1000;
        border-radius: 50%;
        animation: confettiFall linear forwards;
    }
`;
document.head.appendChild(confettiStyle);
