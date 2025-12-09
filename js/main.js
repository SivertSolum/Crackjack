// CRACKJACK - Main Entry Point
// Initializes the game and sets up event listeners

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio system
    initAudio();
    
    // Menu event listeners
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('options-btn').addEventListener('click', showOptions);
    document.getElementById('howto-btn').addEventListener('click', showHowTo);
    document.getElementById('options-back-btn').addEventListener('click', hideOptions);
    document.getElementById('howto-back-btn').addEventListener('click', hideHowTo);
    
    // Options event listeners
    document.getElementById('music-toggle-opt').addEventListener('click', toggleMusic);
    document.getElementById('sfx-toggle-opt').addEventListener('click', toggleSfx);
    document.getElementById('volume-slider').addEventListener('input', (e) => setVolume(e.target.value));
    document.getElementById('custom-music').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            loadCustomMusic(e.target.files[0]);
        }
    });
    
    // In-game music controls
    const musicToggle = document.getElementById('music-toggle');
    const volumeSliderGame = document.getElementById('volume-slider-game');
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    if (volumeSliderGame) {
        volumeSliderGame.addEventListener('input', (e) => setVolume(e.target.value));
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (window.game) {
                window.game.restart();
            }
        });
    }
    
    console.log('%c🎰 CRACKJACK LOADED 🎰', 'font-size: 24px; color: gold; background: purple;');
    console.log('%cNow with MORE ways to lose!', 'font-size: 12px; color: red;');
});

