// CRACKJACK - Deck Management
// Deck operations, card logic, and card tracking

// Deck Management
CrackJack.prototype.createFullDeck = function() {
    const deck = [];
    for (const suit of this.suits) {
        for (const value of this.values) {
            deck.push({ suit, value });
        }
    }
    return deck;
};

CrackJack.prototype.shuffleDeck = function(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

CrackJack.prototype.initializeDeck = function() {
    this.deck = this.shuffleDeck(this.createFullDeck());
    this.updateDeckDisplay();
    this.resetCardTracker();
};

CrackJack.prototype.checkAndReshuffle = async function() {
    if (this.deck.length <= this.SHUFFLE_THRESHOLD) {
        await this.performReshuffle();
    }
};

CrackJack.prototype.performReshuffle = async function() {
    if (this.shuffleOverlay) this.shuffleOverlay.classList.remove('hidden');
    if (this.deckAreaEl) this.deckAreaEl.classList.add('shuffling');
    
    playShuffleSound();
    await this.delay(1500);
    
    this.deck = this.shuffleDeck(this.createFullDeck());
    this.updateDeckDisplay();
    this.resetCardTracker();
    
    await this.delay(500);
    if (this.deckAreaEl) this.deckAreaEl.classList.remove('shuffling');
    if (this.shuffleOverlay) this.shuffleOverlay.classList.add('hidden');
};

CrackJack.prototype.drawCardFromDeck = function() {
    if (this.deck.length === 0) {
        this.deck = this.shuffleDeck(this.createFullDeck());
        this.resetCardTracker();
    }
    const card = this.deck.pop();
    this.updateDeckDisplay();
    this.markCardPlayed(card);
    return card;
};

CrackJack.prototype.drawCard = function() {
    return this.drawCardFromDeck();
};

CrackJack.prototype.updateDeckDisplay = function() {
    if (!this.deckCountEl || !this.deckPileEl) {
        return;
    }
    
    this.deckCountEl.textContent = this.deck.length;
    this.deckPileEl.innerHTML = '';
    
    const cardsToShow = Math.min(15, Math.ceil(this.deck.length / 4));
    
    for (let i = 0; i < cardsToShow; i++) {
        const cardEl = document.createElement('div');
        cardEl.className = 'deck-card';
        
        const rotation = (Math.random() - 0.5) * 30;
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = i * 2;
        
        cardEl.style.transform = `translate(${offsetX}px, ${-offsetY}px) rotate(${rotation}deg)`;
        cardEl.style.zIndex = i;
        
        this.deckPileEl.appendChild(cardEl);
    }
    
    if (this.deck.length <= 10) {
        this.deckCountEl.style.color = '#ff3333';
    } else if (this.deck.length <= this.SHUFFLE_THRESHOLD) {
        this.deckCountEl.style.color = '#ff6600';
    } else {
        this.deckCountEl.style.color = '#ffd700';
    }
};

// Card Tracking
CrackJack.prototype.pendingPlayedCards = [];

CrackJack.prototype.markCardPlayed = function(card) {
    const cardKey = `${card.value}${card.suit}`;
    this.pendingPlayedCards.push(cardKey);
};

CrackJack.prototype.commitPlayedCards = function() {
    this.pendingPlayedCards.forEach(cardKey => {
        const trackerCard = document.querySelector(`.tracker-card[data-card="${cardKey}"]`);
        if (trackerCard) {
            trackerCard.classList.add('played');
        }
    });
    this.pendingPlayedCards = [];
};

CrackJack.prototype.resetCardTracker = function() {
    document.querySelectorAll('.tracker-card').forEach(card => {
        card.classList.remove('played');
    });
    this.pendingPlayedCards = [];
};

// Card Value & Score Calculation
CrackJack.prototype.getCardValue = function(card, currentScore = 0) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') {
        return (currentScore + 11 <= 21) ? 11 : 1;
    }
    return parseInt(card.value);
};

CrackJack.prototype.calculateScore = function(hand, isPlayer = false) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else if (card.value === '7' && isPlayer && this.hasPerk('lucky7')) {
            score += 8;
        } else if (card.value === '2' && isPlayer && this.hasRelic('snakeEyes')) {
            score += 3;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
};

CrackJack.prototype.getRandomSuit = function() {
    return this.suits[Math.floor(Math.random() * this.suits.length)];
};

CrackJack.prototype.createCard = function(value) {
    const index = this.deck.findIndex(c => c.value === value);
    if (index !== -1) {
        const card = this.deck.splice(index, 1)[0];
        this.updateDeckDisplay();
        this.markCardPlayed(card);
        return card;
    }
    const fallbackCard = { suit: this.getRandomSuit(), value };
    this.markCardPlayed(fallbackCard);
    return fallbackCard;
};

CrackJack.prototype.createCardElement = function(card, faceDown = false) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card dealing';
    
    if (faceDown) {
        cardEl.classList.add('face-down');
        return cardEl;
    }

    const isRed = ['♥', '♦'].includes(card.suit);
    cardEl.classList.add(isRed ? 'red' : 'black');

    cardEl.innerHTML = `
        <div class="card-corner">${card.value}${card.suit}</div>
        <div class="card-center">${card.suit}</div>
        <div class="card-corner bottom">${card.value}${card.suit}</div>
    `;

    return cardEl;
};

