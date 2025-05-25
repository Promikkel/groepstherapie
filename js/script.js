document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM geladen, script start");
    
    // Controleer of localStorage beschikbaar is
    let localStorageAvailable = false;
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        localStorageAvailable = true;
        console.log("LocalStorage is beschikbaar");
    } catch (e) {
        console.error("LocalStorage niet beschikbaar:", e);
    }
    
    // DOM elementen
    const dayButtons = document.querySelectorAll('.day-button');
    const daySections = document.querySelectorAll('.day-section');
    const likeButtons = document.querySelectorAll('.like-button');
    const nameInputs = document.querySelectorAll('.name-input');
    const joinButtons = document.querySelectorAll('.join-button');
    const topActivitiesContainer = document.querySelector('.progress-container');
    const participantLists = document.querySelectorAll('.participants-list');
    
    // Eenvoudige lokale opslag voor likes en deelnemers
    const storage = {
        getLikes: function() {
            if (!localStorageAvailable) return {};
            try {
                const likes = localStorage.getItem('festival_likes');
                console.log("Opgehaalde likes uit localStorage:", likes);
                return likes ? JSON.parse(likes) : {};
            } catch (e) {
                console.error("Fout bij ophalen likes:", e);
                return {};
            }
        },
        
        saveLikes: function(likesData) {
            if (!localStorageAvailable) return;
            try {
                localStorage.setItem('festival_likes', JSON.stringify(likesData));
                console.log("Likes opgeslagen in localStorage");
            } catch (e) {
                console.error("Fout bij opslaan likes:", e);
            }
        },
        
        getParticipants: function() {
            if (!localStorageAvailable) return {};
            try {
                const participants = localStorage.getItem('festival_participants');
                console.log("Opgehaalde deelnemers uit localStorage:", participants);
                return participants ? JSON.parse(participants) : {};
            } catch (e) {
                console.error("Fout bij ophalen deelnemers:", e);
                return {};
            }
        },
        
        saveParticipants: function(participantsData) {
            if (!localStorageAvailable) return;
            try {
                localStorage.setItem('festival_participants', JSON.stringify(participantsData));
                console.log("Deelnemers opgeslagen in localStorage:", JSON.stringify(participantsData));
            } catch (e) {
                console.error("Fout bij opslaan deelnemers:", e);
            }
        },
        
        addParticipant: function(activityId, name) {
            if (!localStorageAvailable) return;
            
            try {
                const allParticipants = this.getParticipants();
                
                if (!allParticipants[activityId]) {
                    allParticipants[activityId] = [];
                }
                
                allParticipants[activityId].push({
                    name: name,
                    timestamp: new Date().getTime()
                });
                
                this.saveParticipants(allParticipants);
                console.log(`Deelnemer ${name} toegevoegd aan ${activityId}`);
                console.log("Alle deelnemers na toevoegen:", JSON.stringify(allParticipants));
                return true;
            } catch (e) {
                console.error("Fout bij toevoegen deelnemer:", e);
                return false;
            }
        }
    };
    
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
    
    // Verbeterde swipe functionaliteit voor mobiel
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    
    // Alleen swipe detecteren in de navigatiebalk, niet op de hele pagina
    const navigationBar = document.querySelector('.day-navigation');
    
    if (navigationBar) {
        navigationBar.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            touchStartTime = new Date().getTime();
        }, false);
        
        navigationBar.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        // Verhoogde swipe threshold voor minder gevoeligheid
        const swipeThreshold = 80; // Verhoogd van 50 naar 80
        const swipeMaxTime = 300; // Maximale tijd in ms voor een geldige swipe
        const swipeTime = new Date().getTime() - touchStartTime;
        
        // Bereken horizontale en verticale afstand
        const horizontalDistance = Math.abs(touchEndX - touchStartX);
        const verticalDistance = Math.abs(touchEndY - touchStartY);
        
        // Alleen horizontale swipes detecteren als:
        // 1. De horizontale beweging groter is dan de threshold
        // 2. De horizontale beweging groter is dan de verticale (om scrollen te onderscheiden)
        // 3. De swipe snel genoeg was (om onderscheid te maken met langzaam scrollen)
        if (horizontalDistance > swipeThreshold && 
            horizontalDistance > verticalDistance * 1.5 && // Horizontale beweging moet duidelijk groter zijn
            swipeTime < swipeMaxTime) {
            
            if (touchEndX < touchStartX) {
                // Swipe naar links - volgende dag
                navigateToNextDay();
            } else if (touchEndX > touchStartX) {
                // Swipe naar rechts - vorige dag
                navigateToPreviousDay();
            }
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
    
    // Helper functie om deelnemer toe te voegen aan UI
    function addParticipantToUI(listElement, name) {
        if (!listElement) {
            console.error("Kan deelnemer niet toevoegen aan niet-bestaande lijst");
            return;
        }
        
        const participantElement = document.createElement('span');
        participantElement.classList.add('participant');
        participantElement.textContent = name;
        listElement.appendChild(participantElement);
        console.log(`Deelnemer ${name} toegevoegd aan UI`);
    }
    
    // Initialiseer alle deelnemerslijsten
    function initializeParticipantLists() {
        console.log("Initialiseren van deelnemerslijsten");
        
        // Haal alle deelnemers op uit localStorage
        const allParticipants = storage.getParticipants();
        console.log("Alle deelnemers uit localStorage:", JSON.stringify(allParticipants));
        
        // Update elke lijst met de bijbehorende deelnemers
        participantLists.forEach(list => {
            const activityId = list.getAttribute('data-activity');
            console.log(`Controleren op deelnemers voor activiteit: ${activityId}`);
            
            // Maak de lijst leeg
            list.innerHTML = '';
            
            // Voeg deelnemers toe als ze bestaan voor deze activiteit
            if (allParticipants[activityId] && allParticipants[activityId].length > 0) {
                console.log(`Gevonden deelnemers voor ${activityId}:`, allParticipants[activityId]);
                
                allParticipants[activityId].forEach(participant => {
                    addParticipantToUI(list, participant.name);
                });
            } else {
                console.log(`Geen deelnemers gevonden voor activiteit: ${activityId}`);
            }
        });
    }
    
    // Like functionaliteit
    likeButtons.forEach(button => {
        const activityId = button.getAttribute('data-activity');
        const likeCountElement = button.querySelector('.like-count');
        
        // Initialiseer likes uit lokale opslag
        const likes = storage.getLikes();
        const likeCount = likes[activityId] || 0;
        likeCountElement.textContent = likeCount;
        
        button.addEventListener('click', () => {
            // Toggle like status
            button.classList.toggle('liked');
            
            // Haal huidige likes op
            const currentLikes = storage.getLikes();
            
            if (button.classList.contains('liked')) {
                // Increment like count
                currentLikes[activityId] = (currentLikes[activityId] || 0) + 1;
            } else {
                // Decrement like count
                currentLikes[activityId] = Math.max((currentLikes[activityId] || 0) - 1, 0);
            }
            
            // Update UI
            likeCountElement.textContent = currentLikes[activityId];
            
            // Sla op in localStorage
            storage.saveLikes(currentLikes);
            
            // Update top activiteiten
            updateTopActivities();
        });
    });
    
    // Deelnemers toevoegen
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentSection = button.closest('.participants-section');
            const nameInput = parentSection.querySelector('.name-input');
            const activityId = nameInput.getAttribute('data-activity');
            const participantsList = parentSection.querySelector('.participants-list');
            const name = nameInput.value.trim();
            
            if (name) {
                console.log(`Poging om deelnemer toe te voegen: ${name} aan ${activityId}`);
                
                // Voeg deelnemer toe aan lokale opslag
                if (storage.addParticipant(activityId, name)) {
                    // Update de UI direct
                    addParticipantToUI(participantsList, name);
                }
                
                // Reset input veld
                nameInput.value = '';
            }
        });
    });
    
    // Top 5 populairste activiteiten bijwerken
    function updateTopActivities() {
        const activities = [];
        const likesData = storage.getLikes();
        
        // Verwerk likes data naar activities array
        Object.keys(likesData).forEach(activityId => {
            const likes = likesData[activityId] || 0;
            
            try {
                // Vind de activiteitstitel
                const activityElement = document.querySelector(`[data-activity="${activityId}"]`);
                if (activityElement) {
                    const contentElement = activityElement.closest('.activity-content');
                    if (contentElement) {
                        const titleElement = contentElement.querySelector('.activity-title');
                        const iconElement = contentElement.querySelector('.activity-icon');
                        
                        if (titleElement && iconElement) {
                            activities.push({
                                id: activityId,
                                title: titleElement.textContent,
                                icon: iconElement.textContent,
                                likes: likes
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Fout bij verwerken van activiteit ${activityId}:`, error);
            }
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
    }
    
    // Initialiseer alle deelnemerslijsten bij het laden van de pagina
    initializeParticipantLists();
    
    // Initiële update van top activiteiten
    updateTopActivities();
    
    console.log("Script volledig geladen en geïnitialiseerd");
});
