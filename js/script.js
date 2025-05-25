document.addEventListener('DOMContentLoaded', function() {
    // Referenties naar Firebase database
    const activitiesRef = database.ref('activities');
    const likesRef = database.ref('likes');
    const participantsRef = database.ref('participants');
    
    // DOM elementen
    const dayButtons = document.querySelectorAll('.day-button');
    const daySections = document.querySelectorAll('.day-section');
    const likeButtons = document.querySelectorAll('.like-button');
    const nameInputs = document.querySelectorAll('.name-input');
    const joinButtons = document.querySelectorAll('.join-button');
    const topActivitiesContainer = document.querySelector('.progress-container');
    
    // Dag navigatie
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetDay = button.getAttribute('data-day');
            
            // Update actieve knop
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update zichtbare sectie
            daySections.forEach(section => {
                if (section.id === targetDay) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
    
    // Swipe functionaliteit voor mobiel
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe naar links - volgende dag
            navigateToNextDay();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe naar rechts - vorige dag
            navigateToPreviousDay();
        }
    }
    
    function navigateToNextDay() {
        const activeButton = document.querySelector('.day-button.active');
        const nextButton = activeButton.nextElementSibling;
        
        if (nextButton && nextButton.classList.contains('day-button')) {
            nextButton.click();
        }
    }
    
    function navigateToPreviousDay() {
        const activeButton = document.querySelector('.day-button.active');
        const prevButton = activeButton.previousElementSibling;
        
        if (prevButton && prevButton.classList.contains('day-button')) {
            prevButton.click();
        }
    }
    
    // Like functionaliteit
    likeButtons.forEach(button => {
        const activityId = button.getAttribute('data-activity');
        const likeCountElement = button.querySelector('.like-count');
        
        // Initialiseer likes uit Firebase
        likesRef.child(activityId).on('value', snapshot => {
            const likeCount = snapshot.val() || 0;
            likeCountElement.textContent = likeCount;
            updateTopActivities();
        });
        
        button.addEventListener('click', () => {
            // Toggle like status
            button.classList.toggle('liked');
            
            if (button.classList.contains('liked')) {
                // Increment like count
                likesRef.child(activityId).transaction(currentLikes => {
                    return (currentLikes || 0) + 1;
                });
            } else {
                // Decrement like count
                likesRef.child(activityId).transaction(currentLikes => {
                    return Math.max((currentLikes || 0) - 1, 0);
                });
            }
        });
    });
    
    // Deelnemers toevoegen
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentSection = button.closest('.participants-section');
            const nameInput = parentSection.querySelector('.name-input');
            const activityId = nameInput.getAttribute('data-activity');
            const name = nameInput.value.trim();
            
            if (name) {
                // Voeg deelnemer toe aan Firebase
                const newParticipantRef = participantsRef.child(activityId).push();
                newParticipantRef.set({
                    name: name,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                
                // Reset input veld
                nameInput.value = '';
            }
        });
    });
    
    // Deelnemers weergeven
    const participantLists = document.querySelectorAll('.participants-list');
    
    participantLists.forEach(list => {
        const activityId = list.getAttribute('data-activity');
        
        // Luister naar wijzigingen in deelnemers
        participantsRef.child(activityId).on('value', snapshot => {
            list.innerHTML = '';
            
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const participant = childSnapshot.val();
                    const participantElement = document.createElement('span');
                    participantElement.classList.add('participant');
                    participantElement.textContent = participant.name;
                    list.appendChild(participantElement);
                });
            }
        });
    });
    
    // Top 5 populairste activiteiten bijwerken
    function updateTopActivities() {
        likesRef.once('value', snapshot => {
            const activities = [];
            
            snapshot.forEach(childSnapshot => {
                const activityId = childSnapshot.key;
                const likes = childSnapshot.val() || 0;
                
                // Vind de activiteitstitel
                const activityElement = document.querySelector(`[data-activity="${activityId}"]`).closest('.activity-content');
                const titleElement = activityElement.querySelector('.activity-title');
                const iconElement = activityElement.querySelector('.activity-icon');
                
                activities.push({
                    id: activityId,
                    title: titleElement.textContent,
                    icon: iconElement.textContent,
                    likes: likes
                });
            });
            
            // Sorteer op aantal likes (aflopend)
            activities.sort((a, b) => b.likes - a.likes);
            
            // Toon top 5
            const topActivities = activities.slice(0, 5);
            
            // Bereken het maximum aantal likes voor de progress bar
            const maxLikes = topActivities.length > 0 ? topActivities[0].likes : 1;
            
            // Update de UI
            topActivitiesContainer.innerHTML = '';
            
            topActivities.forEach(activity => {
                const progressPercentage = (activity.likes / maxLikes) * 100;
                
                const progressItem = document.createElement('div');
                progressItem.classList.add('progress-item');
                progressItem.innerHTML = `
                    <div class="progress-info">
                        <div class="progress-title">
                            <span>${activity.icon}</span>
                            <span>${activity.title}</span>
                        </div>
                        <div class="progress-count">${activity.likes} ❤️</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                `;
                
                topActivitiesContainer.appendChild(progressItem);
            });
        });
    }
    
    // Initiële update van top activiteiten
    updateTopActivities();
});
