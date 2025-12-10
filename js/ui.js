// CRACKJACK - UI System
// Menu navigation and UI helpers

function showMainMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('music-controls').classList.add('hidden');
    document.getElementById('scoreboard').classList.add('hidden');
    const cardTracker = document.getElementById('card-tracker');
    if (cardTracker) cardTracker.classList.add('hidden');
<<<<<<< Updated upstream
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.classList.add('hidden');
=======
    const topLeftBtns = document.getElementById('top-left-buttons');
    if (topLeftBtns) topLeftBtns.classList.add('hidden');
    
    // Update version number display
    updateVersionDisplay();
>>>>>>> Stashed changes
}

function hideMainMenu() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('music-controls').classList.remove('hidden');
    document.getElementById('scoreboard').classList.remove('hidden');
    const cardTracker = document.getElementById('card-tracker');
    if (cardTracker) cardTracker.classList.remove('hidden');
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.classList.remove('hidden');
}

function showOptions() {
    document.getElementById('options-menu').classList.remove('hidden');
}

function hideOptions() {
    document.getElementById('options-menu').classList.add('hidden');
}

function showHowTo() {
    document.getElementById('howto-menu').classList.remove('hidden');
}

function hideHowTo() {
    document.getElementById('howto-menu').classList.add('hidden');
}

function startGame() {
    hideMainMenu();
    
    // Try to start music on user interaction
    if (bgMusic && musicEnabled) {
        bgMusic.play().catch(e => console.log('Music autoplay blocked:', e));
        const btn = document.getElementById('music-toggle');
        if (btn) {
            btn.textContent = '🔊';
            btn.classList.add('playing');
        }
    }
    
    if (!window.game) {
        window.game = new CrackJack();
        window.game.initializeDeck();
    }
}

// Version and Changelog functions
function updateVersionDisplay() {
    const versionEl = document.getElementById('version-number');
    if (versionEl && typeof VERSION !== 'undefined') {
        versionEl.textContent = `v${VERSION.number}`;
    }
}

function showChangelog() {
    const changelogMenu = document.getElementById('changelog-menu');
    const entriesContainer = document.getElementById('changelog-entries');
    
    if (!changelogMenu || !entriesContainer) return;
    
    // Clear existing entries
    entriesContainer.innerHTML = '';
    
    // Populate changelog entries
    if (typeof VERSION !== 'undefined' && VERSION.changelog) {
        VERSION.changelog.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'changelog-entry';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'changelog-header';
            
            const versionSpan = document.createElement('span');
            versionSpan.className = 'changelog-version';
            versionSpan.textContent = `v${entry.version}`;
            
            const dateSpan = document.createElement('span');
            dateSpan.className = 'changelog-date';
            dateSpan.textContent = entry.date;
            
            headerDiv.appendChild(versionSpan);
            headerDiv.appendChild(dateSpan);
            
            const titleP = document.createElement('p');
            titleP.className = 'changelog-title';
            titleP.textContent = entry.title;
            
            const changesList = document.createElement('ul');
            changesList.className = 'changelog-changes';
            
            entry.changes.forEach(change => {
                const li = document.createElement('li');
                li.textContent = change;
                changesList.appendChild(li);
            });
            
            entryDiv.appendChild(headerDiv);
            entryDiv.appendChild(titleP);
            entryDiv.appendChild(changesList);
            entriesContainer.appendChild(entryDiv);
        });
    }
    
    changelogMenu.classList.remove('hidden');
}

function hideChangelog() {
    const changelogMenu = document.getElementById('changelog-menu');
    if (changelogMenu) {
        changelogMenu.classList.add('hidden');
    }
}

