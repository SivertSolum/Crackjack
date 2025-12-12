// CRACKJACK - Audio System
// Web Audio API synthesized sounds and music controls

let bgMusic = null;
let musicEnabled = true;
let sfxEnabled = true;
let masterVolume = 0.3;
const MUSIC_MAX_VOLUME = 0.8;

// Web Audio API context
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function initAudio() {
    bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = masterVolume * MUSIC_MAX_VOLUME;
    }
    
    document.addEventListener('click', () => getAudioContext(), { once: true });
    
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', playClickSound);
    });
}

// ===== SYNTHESIZED SOUND EFFECTS =====

function playCardDealSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    
    gain.gain.setValueAtTime(masterVolume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
}

function playCardFlipSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);
    filter.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(masterVolume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
}

function playWinSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.value = freq;
        
        const startTime = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(masterVolume * 0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
    });
}

function playLoseSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    const notes = [392, 349.23, 293.66, 220]; // G4, F4, D4, A3
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        const startTime = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(masterVolume * 0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        
        osc.start(startTime);
        osc.stop(startTime + 0.35);
    });
}

function playChipSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    [0, 0.08].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        const baseFreq = i === 0 ? 2500 : 3200;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + delay + 0.1);
        
        gain.gain.setValueAtTime(masterVolume * 0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
    });
}

function playClickSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(masterVolume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
}

function playShuffleSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    for (let i = 0; i < 8; i++) {
        const delay = i * 0.06 + Math.random() * 0.02;
        
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let j = 0; j < bufferSize; j++) {
            data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500 + Math.random() * 1000;
        filter.Q.value = 2;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(masterVolume * 0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start(ctx.currentTime + delay);
    }
}

// ===== MUSIC CONTROLS =====

function toggleMusic() {
    if (!bgMusic) return;
    
    const btn = document.getElementById('music-toggle');
    const btnOpt = document.getElementById('music-toggle-opt');
    
    if (musicEnabled && !bgMusic.paused) {
        bgMusic.pause();
        if (btn) {
            btn.textContent = '🔇';
            btn.classList.remove('playing');
        }
        if (btnOpt) {
            btnOpt.textContent = 'OFF';
            btnOpt.classList.add('off');
        }
        musicEnabled = false;
    } else {
        bgMusic.play().catch(e => console.log('Music play failed:', e));
        if (btn) {
            btn.textContent = '🔊';
            btn.classList.add('playing');
        }
        if (btnOpt) {
            btnOpt.textContent = 'ON';
            btnOpt.classList.remove('off');
        }
        musicEnabled = true;
    }
}

function setVolume(value) {
    masterVolume = value / 100;
    if (bgMusic) {
        bgMusic.volume = masterVolume * MUSIC_MAX_VOLUME;
    }
}

function toggleSfx() {
    const btn = document.getElementById('sfx-toggle-opt');
    sfxEnabled = !sfxEnabled;
    if (btn) {
        btn.textContent = sfxEnabled ? 'ON' : 'OFF';
        btn.classList.toggle('off', !sfxEnabled);
    }
}

function loadCustomMusic(file) {
    if (!file || !bgMusic) return;
    
    const url = URL.createObjectURL(file);
    bgMusic.src = url;
    bgMusic.load();
    
    if (musicEnabled) {
        bgMusic.play().catch(e => console.log('Custom audio play failed:', e));
    }
    
    console.log('%c🎵 Custom music loaded: ' + file.name, 'color: gold;');
}

// ===== ADDITIONAL SOUND EFFECTS =====

function playEventSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    // Mystical chime sound
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc2.type = 'triangle';
    osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
    osc2.frequency.setValueAtTime(659, ctx.currentTime); // E5
    
    gain.gain.setValueAtTime(masterVolume * 0.15, ctx.currentTime);
    gain.gain.exponentialDecayTo = 0.01;
    gain.gain.setValueAtTime(masterVolume * 0.15, ctx.currentTime);
    gain.gain.exponentialDecayTo = 0.01;
    
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.1);
    
    gain.gain.exponentialDecayTo = 0.001;
    gain.gain.setTargetAtTime(0.001, ctx.currentTime + 0.3, 0.1);
    
    osc.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.6);
}

function playHealSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    // Sparkle heal sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(masterVolume * 0.1, ctx.currentTime);
    gain.gain.setTargetAtTime(0.001, ctx.currentTime + 0.2, 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
}

function playUpgradeSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    // Triumphant upgrade sound
    [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(masterVolume * 0.08, ctx.currentTime + i * 0.1 + 0.05);
        gain.gain.setTargetAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15, 0.05);
        
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
}

function playTreasureSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    // Coin jingle
    [880, 988, 1175, 1319].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(masterVolume * 0.1, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.setTargetAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1, 0.03);
        
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
}

function playCurseSound() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    
    // Ominous curse sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(masterVolume * 0.12, ctx.currentTime);
    gain.gain.setTargetAtTime(0.001, ctx.currentTime + 0.3, 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
}

// Generic playSound function for event system
function playSound(type) {
    switch(type) {
        case 'event': playEventSound(); break;
        case 'win': playWinSound(); break;
        case 'lose': playLoseSound(); break;
        case 'heal': playHealSound(); break;
        case 'upgrade': playUpgradeSound(); break;
        case 'treasure': playTreasureSound(); break;
        case 'curse': playCurseSound(); break;
        case 'chip': playChipSound(); break;
        case 'card': playCardDealSound(); break;
        case 'flip': playCardFlipSound(); break;
        case 'shuffle': playShuffleSound(); break;
        default: playClickSound();
    }
}

