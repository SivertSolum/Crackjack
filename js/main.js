// CRACKJACK - Main Entry Point
// Initializes the game and sets up event listeners

// Viewport scaling for proportional UI
function updateGameScale() {
    const wrapper = document.getElementById('game-scale-wrapper');
    if (!wrapper) return;
    
    const baseWidth = 1200;
    const baseHeight = 800;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate scale to fit while maintaining aspect ratio
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Apply scale transform
    wrapper.style.transform = `translateX(-50%) scale(${scale})`;
    
    // Adjust wrapper position for centering vertically when there's extra space
    if (scaleY > scaleX) {
        const extraHeight = (windowHeight - (baseHeight * scale)) / 2;
        wrapper.style.top = `${extraHeight}px`;
    } else {
        wrapper.style.top = '0px';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize viewport scaling
    updateGameScale();
    window.addEventListener('resize', updateGameScale);
    
    // Initialize audio system
    initAudio();
    
    // Menu event listeners
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('options-btn').addEventListener('click', showOptions);
    document.getElementById('howto-btn').addEventListener('click', showHowTo);
    document.getElementById('options-back-btn').addEventListener('click', hideOptions);
    document.getElementById('howto-back-btn').addEventListener('click', hideHowTo);
    
    // Changelog event listeners
    const changelogBtn = document.getElementById('changelog-btn');
    const changelogBackBtn = document.getElementById('changelog-back-btn');
    if (changelogBtn) {
        changelogBtn.addEventListener('click', showChangelog);
    }
    if (changelogBackBtn) {
        changelogBackBtn.addEventListener('click', hideChangelog);
    }
    
    // Initialize version display
    updateVersionDisplay();
    
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
    
    // Menu button
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', backToMenu);
    }
    
    console.log('%c🎰 CRACKJACK LOADED 🎰', 'font-size: 24px; color: gold; background: purple;');
    console.log('%cNow with MORE ways to lose!', 'font-size: 12px; color: red;');
});

