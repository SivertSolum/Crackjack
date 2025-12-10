// CRACKJACK - UI System
// Menu navigation and UI helpers

function showMainMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('music-controls').classList.add('hidden');
    document.getElementById('scoreboard').classList.add('hidden');
    const cardTracker = document.getElementById('card-tracker');
    if (cardTracker) cardTracker.classList.add('hidden');
    const topLeftBtns = document.getElementById('top-left-buttons');
    if (topLeftBtns) topLeftBtns.classList.add('hidden');
}

function hideMainMenu() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('music-controls').classList.remove('hidden');
    document.getElementById('scoreboard').classList.remove('hidden');
    const cardTracker = document.getElementById('card-tracker');
    if (cardTracker) cardTracker.classList.remove('hidden');
    const topLeftBtns = document.getElementById('top-left-buttons');
    if (topLeftBtns) topLeftBtns.classList.remove('hidden');
}

function backToMenu() {
    // Reset game state and show main menu
    if (window.game) {
        window.game.restart();
    }
    showMainMenu();
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

