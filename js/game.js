// CRACKJACK - Main Game Class
// The world's most "fair" blackjack game

class CrackJack {
    constructor() {
        this.money = CONFIG.STARTING_MONEY;
        this.currentBet = 0;
        this.lastBet = 0;
        this.lastSideBetPP = 0;
        this.lastSideBet21Plus3 = 0;
        this.playerHand = [];
        this.dealerHand = [];
        this.gameInProgress = false;
        this.isProcessingAction = false;
        this.handsPlayed = 0;
        this.timesLost = 0;

        // Roguelike elements
        this.currentFloor = 1;
        this.winStreak = 0;
        this.winsNeededForUpgrade = CONFIG.WINS_FOR_UPGRADE;
        this.escapeGoal = CONFIG.ESCAPE_GOAL;
        this.activePerks = [];
        this.isBossFight = false;
        this.currentBoss = null;
        this.totalWins = 0;
        
        // Dealer perks (permanent abilities gained each floor)
        this.dealerPerks = [];
        this.allDealerPerks = typeof DEALER_PERKS !== 'undefined' ? DEALER_PERKS : [];
        
        // Split state
        this.isSplitHand = false;
        this.splitHands = [];
        this.splitBets = [];
        this.currentSplitHandIndex = 0;
        
        // Shop state
        this.shopInventory = [];
        
        // Side bets
        this.sideBetPP = 0;
        this.sideBet21Plus3 = 0;
        this.sideBetPayouts = {
            mixedPair: 5,
            coloredPair: 10,
            perfectPair: 25,
            flush: 5,
            straight: 10,
            threeOfAKind: 30,
            straightFlush: 40,
            suitedTrips: 100
        };
        
        // Chip-based betting system
        this.selectedChipValue = 10; // Default selected chip
        this.betHistory = []; // For undo functionality
        this.chipColors = {
            1: { color: '#808080', accent: '#a0a0a0' },
            5: { color: '#dc3545', accent: '#ff6b7a' },
            10: { color: '#0d6efd', accent: '#5a9cff' },
            25: { color: '#198754', accent: '#3cb879' },
            100: { color: '#000000', accent: '#333333' },
            500: { color: '#6f42c1', accent: '#9969e0' }
        };

        // Data from config
        this.allPerks = PERKS;
        this.bosses = BOSSES;
        this.suits = CONFIG.SUITS;
        this.values = CONFIG.VALUES;
        this.SHUFFLE_THRESHOLD = CONFIG.SHUFFLE_THRESHOLD;
        
        // Deck
        this.deck = [];

        // Messages
        this.brokeMessages = MESSAGES.broke;
        this.winMessages = MESSAGES.win;
        this.loseMessages = MESSAGES.lose;
        this.bustMessages = MESSAGES.bust;
        this.dealerBlackjackMessages = MESSAGES.dealerBlackjack;
        this.multiCard21Messages = MESSAGES.multiCard21;

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.renderHistoryList();
    }

    initializeElements() {
        this.moneyDisplay = document.getElementById('money');
        this.currentBetDisplay = document.getElementById('current-bet');
        this.dealerHandEl = document.getElementById('dealer-hand');
        this.playerHandEl = document.getElementById('player-hand');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.playerScoreEl = document.getElementById('player-score');
        this.messageEl = document.getElementById('message');
        this.bettingControls = document.getElementById('betting-controls');
        this.gameControls = document.getElementById('game-controls');
        this.dealBtn = document.getElementById('deal-btn');
        this.hitBtn = document.getElementById('hit-btn');
        this.standBtn = document.getElementById('stand-btn');
        this.doubleBtn = document.getElementById('double-btn');
        this.splitBtn = document.getElementById('split-btn');
        
        // Side bets elements
        this.sideBetsSection = document.getElementById('side-bets-section');
        this.sideBetsTotalEl = document.getElementById('side-bets-total');
        
        this.brokePopup = document.getElementById('broke-popup');
        this.brokeMessageEl = document.getElementById('broke-message');
        this.restartBtn = document.getElementById('restart-btn');
        this.rebetSection = document.getElementById('rebet-section');
        this.sameBetBtn = document.getElementById('same-bet-btn');
        this.rebetAmountEl = document.getElementById('rebet-amount');
        this.currentFloorEl = document.getElementById('current-floor');
        this.winStreakEl = document.getElementById('win-streak');
        this.winsNeededEl = document.getElementById('wins-needed');
        this.escapeGoalEl = document.getElementById('escape-goal');
        this.activeUpgradesEl = document.getElementById('active-upgrades');
        this.upgradePopup = document.getElementById('upgrade-popup');
        this.upgradeOptionsEl = document.getElementById('upgrade-options');
        this.bossPopup = document.getElementById('boss-popup');
        this.bossPortraitEl = document.getElementById('boss-portrait');
        this.bossNameEl = document.getElementById('boss-name');
        this.bossDescEl = document.getElementById('boss-description');
        this.bossRuleEl = document.getElementById('boss-rule');
        this.bossFightBtn = document.getElementById('boss-fight-btn');
        this.victoryPopup = document.getElementById('victory-popup');
        this.victoryStatsEl = document.getElementById('victory-stats');
        this.victoryRestartBtn = document.getElementById('victory-restart-btn');
        this.tableEl = document.querySelector('.table');
        this.scoreboardDealerEl = document.getElementById('scoreboard-dealer');
        this.scoreboardPlayerEl = document.getElementById('scoreboard-player');
        this.historyListEl = document.getElementById('history-list');
        this.roundHistory = [];
        this.deckAreaEl = document.getElementById('deck-area');
        this.deckPileEl = document.getElementById('deck-pile');
        this.deckCountEl = document.getElementById('deck-count');
        this.shuffleOverlay = document.getElementById('shuffle-overlay');
        this.cardTrackerEl = document.getElementById('card-tracker');
        
        // New roguelike elements
        this.eventPopup = document.getElementById('event-popup');
        this.shopPopup = document.getElementById('shop-popup');
        this.mapPopup = document.getElementById('map-popup');
        this.roomIndicator = document.getElementById('room-indicator');
        this.relicsDisplay = document.getElementById('relics-display');
        this.cursesDisplay = document.getElementById('curses-display');
        
        // Pre-round shop elements
        this.preRoundShopBtn = document.getElementById('pre-round-shop-btn');
        this.preRoundShopPopup = document.getElementById('pre-round-shop-popup');
        
        // Post-round choice popup
        this.postRoundPopup = document.getElementById('post-round-popup');
        this.postRoundStats = document.getElementById('post-round-stats');
        this.goToShopBtn = document.getElementById('go-to-shop-btn');
        this.skipShopBtn = document.getElementById('skip-shop-btn');
        
        // Floor complete popup
        this.floorCompletePopup = document.getElementById('floor-complete-popup');
        this.floorCompleteTitle = document.getElementById('floor-complete-title');
        this.floorCompleteMsg = document.getElementById('floor-complete-msg');
        this.dealerPerkReveal = document.getElementById('dealer-perk-reveal');
        this.dealerPerkIcon = document.getElementById('dealer-perk-icon');
        this.dealerPerkName = document.getElementById('dealer-perk-name');
        this.dealerPerkDesc = document.getElementById('dealer-perk-desc');
        this.nextFloorBtn = document.getElementById('next-floor-btn');
        this.preRoundShopItems = document.getElementById('pre-round-shop-items');
        this.preRoundShopMoney = document.getElementById('pre-round-shop-money');
        this.preRoundShopClose = document.getElementById('pre-round-shop-close');
        this.shopActivePerksListEl = document.getElementById('shop-active-perks-list');
        
        // Chip betting elements
        this.mainBetArea = document.getElementById('main-bet-area');
        this.ppBetArea = document.getElementById('pp-bet-area');
        this.plus3BetArea = document.getElementById('21plus3-bet-area');
        this.mainChipStack = document.getElementById('main-chip-stack');
        this.ppChipStack = document.getElementById('pp-chip-stack');
        this.plus3ChipStack = document.getElementById('21plus3-chip-stack');
        this.mainBetTotal = document.getElementById('main-bet-total');
        this.ppBetTotal = document.getElementById('pp-bet-total');
        this.plus3BetTotal = document.getElementById('21plus3-bet-total');
        this.undoBetBtn = document.getElementById('undo-bet-btn');
        this.clearBetsBtn = document.getElementById('clear-bets-btn');
        this.doubleBetBtn = document.getElementById('double-bet-btn');
        this.chipTray = document.querySelector('.chip-tray');
        
        // Ensure pre-round shop is hidden on init
        if (this.preRoundShopPopup) {
            this.preRoundShopPopup.classList.add('hidden');
        }
    }

    bindEvents() {
        // Chip selection
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => this.selectChip(e.target.closest('.chip')));
        });
        
        // Bet area clicks
        if (this.mainBetArea) {
            this.mainBetArea.addEventListener('click', () => this.placeChipOnArea('main'));
        }
        if (this.ppBetArea) {
            this.ppBetArea.addEventListener('click', () => this.placeChipOnArea('pp'));
        }
        if (this.plus3BetArea) {
            this.plus3BetArea.addEventListener('click', () => this.placeChipOnArea('21plus3'));
        }
        
        // Undo, Clear, and Double buttons
        if (this.undoBetBtn) {
            this.undoBetBtn.addEventListener('click', () => this.undoLastBet());
        }
        if (this.clearBetsBtn) {
            this.clearBetsBtn.addEventListener('click', () => this.clearAllBets());
        }
        if (this.doubleBetBtn) {
            this.doubleBetBtn.addEventListener('click', () => this.doubleBets());
        }
        
        // Select default chip (10)
        this.initializeChipSelection();
        
        // Pre-round shop (now shows automatically after each round)
        if (this.preRoundShopClose) {
            this.preRoundShopClose.addEventListener('click', () => this.hidePreRoundShop());
        }
        
        // Post-round choice buttons
        if (this.goToShopBtn) {
            this.goToShopBtn.addEventListener('click', () => {
                this.hidePostRoundPopup();
                this.showPreRoundShop();
            });
        }
        if (this.skipShopBtn) {
            this.skipShopBtn.addEventListener('click', () => {
                this.hidePostRoundPopup();
            });
        }
        
        // Floor complete button
        if (this.nextFloorBtn) {
            this.nextFloorBtn.addEventListener('click', () => {
                this.hideFloorCompletePopup();
                this.advanceToNextFloor();
            });
        }
        
        // Prevent popup backdrop clicks from closing - only close via buttons
        document.querySelectorAll('.popup').forEach(popup => {
            // Stop clicks on popup content from bubbling to backdrop
            const content = popup.querySelector('.popup-content');
            if (content) {
                content.addEventListener('click', (e) => e.stopPropagation());
            }
        });

        this.dealBtn.addEventListener('click', () => this.deal());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
        this.doubleBtn.addEventListener('click', () => this.double());
        if (this.splitBtn) this.splitBtn.addEventListener('click', () => this.split());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.sameBetBtn.addEventListener('click', () => this.rebetLastBet());
        this.bossFightBtn.addEventListener('click', () => this.startBossFight());
        this.victoryRestartBtn.addEventListener('click', () => this.restart());
    }

    // === DECK MANAGEMENT ===
    
    createFullDeck() {
        const deck = [];
        for (const suit of this.suits) {
            for (const value of this.values) {
                deck.push({ suit, value });
            }
        }
        return deck;
    }
    
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
    
    initializeDeck() {
        this.deck = this.shuffleDeck(this.createFullDeck());
        this.updateDeckDisplay();
        this.resetCardTracker();
    }
    
    async checkAndReshuffle() {
        if (this.deck.length <= this.SHUFFLE_THRESHOLD) {
            await this.performReshuffle();
        }
    }
    
    async performReshuffle() {
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
    }
    
    drawCardFromDeck() {
        if (this.deck.length === 0) {
            this.deck = this.shuffleDeck(this.createFullDeck());
            this.resetCardTracker();
        }
        const card = this.deck.pop();
        this.updateDeckDisplay();
        this.markCardPlayed(card);
        return card;
    }
    
    drawSpecificCard(targetValue) {
        const index = this.deck.findIndex(c => c.value === targetValue);
        if (index !== -1) {
            const card = this.deck.splice(index, 1)[0];
            this.updateDeckDisplay();
            return card;
        }
        return this.drawCardFromDeck();
    }
    
    updateDeckDisplay() {
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
    }
    
    pendingPlayedCards = [];
    
    markCardPlayed(card) {
        const cardKey = `${card.value}${card.suit}`;
        this.pendingPlayedCards.push(cardKey);
    }
    
    commitPlayedCards() {
        this.pendingPlayedCards.forEach(cardKey => {
            const trackerCard = document.querySelector(`.tracker-card[data-card="${cardKey}"]`);
            if (trackerCard) {
                trackerCard.classList.add('played');
            }
        });
        this.pendingPlayedCards = [];
    }
    
    resetCardTracker() {
        document.querySelectorAll('.tracker-card').forEach(card => {
            card.classList.remove('played');
        });
        this.pendingPlayedCards = [];
    }

    // === CARD LOGIC ===

    getCardValue(card, currentScore = 0) {
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        if (card.value === 'A') {
            return (currentScore + 11 <= 21) ? 11 : 1;
        }
        return parseInt(card.value);
    }

    calculateScore(hand, isPlayer = false) {
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
            } else {
                score += parseInt(card.value);
            }
        }

        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }

    getRandomSuit() {
        return this.suits[Math.floor(Math.random() * this.suits.length)];
    }

    createCard(value) {
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
    }

    drawCard() {
        return this.drawCardFromDeck();
    }

    createCardElement(card, faceDown = false) {
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
    }

    // === BETTING ===

    placeBet(btn) {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;

        const amount = btn.dataset.amount;
        let bet;

        if (amount === 'all') {
            bet = this.money;
        } else {
            bet = parseInt(amount);
        }

        if (bet > this.money) {
            this.showMessage("Nice try, but you can't bet money you don't have. Yet.");
            return;
        }

        if (bet <= 0) {
            this.showMessage("You need money to lose money!");
            return;
        }

        document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        playChipSound();
        this.currentBet = bet;
        this.currentBetDisplay.textContent = `$${bet}`;
        this.dealBtn.disabled = false;
        
        if (amount === 'all') {
            this.showMessage("Going all in? Bold. Stupid, but bold. 🎲");
        } else {
            this.showMessage(`$${bet} on the line. The dealer is warming up...`);
        }
    }

    sameBet() {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        if (this.lastBet <= 0) return;

        if (this.lastBet > this.money) {
            if (this.money > 0) {
                this.currentBet = this.money;
                this.showMessage(`Can't afford $${this.lastBet}, going all in with $${this.money}! 💸`);
            } else {
                this.showMessage("You're broke! No rebet for you!");
                return;
            }
        } else {
            this.currentBet = this.lastBet;
        }

        this.currentBetDisplay.textContent = `$${this.currentBet}`;
        this.deal();
    }

    // === CHIP-BASED BETTING ===
    
    initializeChipSelection() {
        // Select the $10 chip by default
        const defaultChip = document.querySelector('.chip[data-value="10"]');
        if (defaultChip) {
            defaultChip.classList.add('selected');
            this.selectedChipValue = 10;
        }
    }
    
    selectChip(chipEl) {
        if (this.gameInProgress) return;
        
        // Remove selection from all chips
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        
        // Select clicked chip
        chipEl.classList.add('selected');
        this.selectedChipValue = parseInt(chipEl.dataset.value);
        
        playChipSound();
    }
    
    placeChipOnArea(areaType) {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        
        const chipValue = this.selectedChipValue;
        
        // Check if player has enough money
        const totalBets = this.currentBet + this.sideBetPP + this.sideBet21Plus3;
        if (totalBets + chipValue > this.money) {
            this.showMessage("Not enough chips! You can't bet what you don't have.");
            return;
        }
        
        // Add chip to appropriate area
        if (areaType === 'main') {
            this.currentBet += chipValue;
            this.betHistory.push({ type: 'main', value: chipValue });
            this.renderChipStack(this.mainChipStack, this.currentBet);
            this.mainBetTotal.textContent = `$${this.currentBet}`;
        } else if (areaType === 'pp') {
            this.sideBetPP += chipValue;
            this.betHistory.push({ type: 'pp', value: chipValue });
            this.renderChipStack(this.ppChipStack, this.sideBetPP);
            this.ppBetTotal.textContent = `$${this.sideBetPP}`;
        } else if (areaType === '21plus3') {
            this.sideBet21Plus3 += chipValue;
            this.betHistory.push({ type: '21plus3', value: chipValue });
            this.renderChipStack(this.plus3ChipStack, this.sideBet21Plus3);
            this.plus3BetTotal.textContent = `$${this.sideBet21Plus3}`;
        }
        
        playChipSound();
        this.updateBettingButtons();
        
        if (areaType === 'main') {
            this.showMessage(`$${this.currentBet} on the line. Click DEAL when ready!`);
        } else {
            const sideName = areaType === 'pp' ? 'Perfect Pairs' : '21+3';
            const sideAmount = areaType === 'pp' ? this.sideBetPP : this.sideBet21Plus3;
            this.showMessage(`$${sideAmount} on ${sideName}. Feeling lucky?`);
        }
    }
    
    renderChipStack(stackEl, totalAmount) {
        if (!stackEl) return;
        
        stackEl.innerHTML = '';
        
        if (totalAmount <= 0) return;
        
        // Calculate chips to display (show actual chip breakdown)
        const chipValues = [500, 100, 25, 10, 5, 1];
        const chipsToShow = [];
        let remaining = totalAmount;
        
        for (const value of chipValues) {
            while (remaining >= value && chipsToShow.length < 10) { // Max 10 chips shown
                chipsToShow.push(value);
                remaining -= value;
            }
        }
        
        // Render chips in stack (bottom to top)
        chipsToShow.reverse().forEach((value, index) => {
            const chipColors = this.chipColors[value] || { color: '#888', accent: '#aaa' };
            const chipEl = document.createElement('div');
            chipEl.className = 'chip-in-stack';
            chipEl.style.setProperty('--chip-color', chipColors.color);
            chipEl.style.bottom = `${index * 4}px`; // Stack offset
            chipEl.style.zIndex = index;
            chipEl.innerHTML = `<span>${value}</span>`;
            stackEl.appendChild(chipEl);
        });
    }
    
    undoLastBet() {
        if (this.gameInProgress) return;
        if (this.betHistory.length === 0) return;
        
        const lastBet = this.betHistory.pop();
        
        if (lastBet.type === 'main') {
            this.currentBet -= lastBet.value;
            this.renderChipStack(this.mainChipStack, this.currentBet);
            this.mainBetTotal.textContent = `$${this.currentBet}`;
        } else if (lastBet.type === 'pp') {
            this.sideBetPP -= lastBet.value;
            this.renderChipStack(this.ppChipStack, this.sideBetPP);
            this.ppBetTotal.textContent = `$${this.sideBetPP}`;
        } else if (lastBet.type === '21plus3') {
            this.sideBet21Plus3 -= lastBet.value;
            this.renderChipStack(this.plus3ChipStack, this.sideBet21Plus3);
            this.plus3BetTotal.textContent = `$${this.sideBet21Plus3}`;
        }
        
        playChipSound();
        this.updateBettingButtons();
        this.showMessage("Chip removed. Second thoughts?");
    }
    
    clearAllBets() {
        if (this.gameInProgress) return;
        
        this.currentBet = 0;
        this.sideBetPP = 0;
        this.sideBet21Plus3 = 0;
        this.betHistory = [];
        
        // Clear all chip stacks
        if (this.mainChipStack) this.mainChipStack.innerHTML = '';
        if (this.ppChipStack) this.ppChipStack.innerHTML = '';
        if (this.plus3ChipStack) this.plus3ChipStack.innerHTML = '';
        
        // Reset totals
        if (this.mainBetTotal) this.mainBetTotal.textContent = '$0';
        if (this.ppBetTotal) this.ppBetTotal.textContent = '$0';
        if (this.plus3BetTotal) this.plus3BetTotal.textContent = '$0';
        
        this.updateBettingButtons();
        this.showMessage("All bets cleared. Starting fresh!");
    }
    
    rebetLastBet() {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        if (this.lastBet <= 0) return;
        
        // Clear current bets first
        this.clearAllBets();
        
        // Calculate total last bet including side bets
        const totalLastBet = this.lastBet + this.lastSideBetPP + this.lastSideBet21Plus3;
        
        // Check if we can afford all the last bets
        if (totalLastBet > this.money) {
            this.showMessage(`Can't afford last bets totaling $${totalLastBet}!`);
            return;
        }
        
        // Place the main bet
        this.currentBet = this.lastBet;
        this.betHistory.push({ type: 'main', value: this.lastBet });
        this.renderChipStack(this.mainChipStack, this.currentBet);
        if (this.mainBetTotal) this.mainBetTotal.textContent = `$${this.currentBet}`;
        
        // Place PP side bet if there was one
        if (this.lastSideBetPP > 0) {
            this.sideBetPP = this.lastSideBetPP;
            this.betHistory.push({ type: 'pp', value: this.lastSideBetPP });
            this.renderChipStack(this.ppChipStack, this.sideBetPP);
            if (this.ppBetTotal) this.ppBetTotal.textContent = `$${this.sideBetPP}`;
        }
        
        // Place 21+3 side bet if there was one
        if (this.lastSideBet21Plus3 > 0) {
            this.sideBet21Plus3 = this.lastSideBet21Plus3;
            this.betHistory.push({ type: '21plus3', value: this.lastSideBet21Plus3 });
            this.renderChipStack(this.plus3ChipStack, this.sideBet21Plus3);
            if (this.plus3BetTotal) this.plus3BetTotal.textContent = `$${this.sideBet21Plus3}`;
        }
        
        this.updateBettingButtons();
        
        // Show appropriate message
        let msg = `Rebet: $${this.lastBet}`;
        if (this.lastSideBetPP > 0) msg += ` + PP $${this.lastSideBetPP}`;
        if (this.lastSideBet21Plus3 > 0) msg += ` + 21+3 $${this.lastSideBet21Plus3}`;
        msg += `. Click DEAL!`;
        this.showMessage(msg);
    }
    
    updateBettingButtons() {
        const hasBets = this.currentBet > 0;
        const hasAnyBets = hasBets || this.sideBetPP > 0 || this.sideBet21Plus3 > 0;
        const totalBets = this.currentBet + this.sideBetPP + this.sideBet21Plus3;
        const canDouble = hasAnyBets && (totalBets * 2) <= this.money;
        
        if (this.dealBtn) {
            this.dealBtn.disabled = !hasBets;
        }
        if (this.undoBetBtn) {
            this.undoBetBtn.disabled = this.betHistory.length === 0;
        }
        if (this.clearBetsBtn) {
            this.clearBetsBtn.disabled = !hasAnyBets;
        }
        if (this.doubleBetBtn) {
            this.doubleBetBtn.disabled = !canDouble;
        }
    }
    
    doubleBets() {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        
        const totalBets = this.currentBet + this.sideBetPP + this.sideBet21Plus3;
        const doubledTotal = totalBets * 2;
        
        if (doubledTotal > this.money) {
            this.showMessage("Not enough chips to double!");
            return;
        }
        
        if (totalBets === 0) {
            this.showMessage("No bets to double!");
            return;
        }
        
        // Double the main bet
        if (this.currentBet > 0) {
            this.betHistory.push({ type: 'main', value: this.currentBet });
            this.currentBet *= 2;
            this.renderChipStack(this.mainChipStack, this.currentBet);
            if (this.mainBetTotal) this.mainBetTotal.textContent = `$${this.currentBet}`;
        }
        
        // Double PP side bet
        if (this.sideBetPP > 0) {
            this.betHistory.push({ type: 'pp', value: this.sideBetPP });
            this.sideBetPP *= 2;
            this.renderChipStack(this.ppChipStack, this.sideBetPP);
            if (this.ppBetTotal) this.ppBetTotal.textContent = `$${this.sideBetPP}`;
        }
        
        // Double 21+3 side bet
        if (this.sideBet21Plus3 > 0) {
            this.betHistory.push({ type: '21plus3', value: this.sideBet21Plus3 });
            this.sideBet21Plus3 *= 2;
            this.renderChipStack(this.plus3ChipStack, this.sideBet21Plus3);
            if (this.plus3BetTotal) this.plus3BetTotal.textContent = `$${this.sideBet21Plus3}`;
        }
        
        playChipSound();
        this.updateBettingButtons();
        this.showMessage(`Doubled! Total bet now $${doubledTotal}. Feeling lucky?`);
    }

    // === GAME ACTIONS ===

    isPopupOpen() {
        // Check if any popup is currently visible
        const popups = document.querySelectorAll('.popup:not(.hidden)');
        return popups.length > 0;
    }

    async deal() {
        // Don't deal if a popup is open
        if (this.isPopupOpen()) return;
        
        // Lucky Start perk: free $10 side bet each hand (randomly PP or 21+3)
        if (this.hasSideBetPerk && this.hasSideBetPerk('luckyStart')) {
            if (this.sideBetPP === 0 && this.sideBet21Plus3 === 0) {
                // Add free side bet if player hasn't placed any
                if (Math.random() < 0.5) {
                    this.sideBetPP = 10;
                    this.showMessage("🌟 Lucky Start: Free $10 Perfect Pairs bet!");
                } else {
                    this.sideBet21Plus3 = 10;
                    this.showMessage("🌟 Lucky Start: Free $10 21+3 bet!");
                }
                if (this.updateSideBetsDisplay) this.updateSideBetsDisplay();
            }
        }
        
        // Calculate total bet including side bets
        let totalSideBets = (this.sideBetPP || 0) + (this.sideBet21Plus3 || 0);
        
        // Side Insurance perk: 20% off side bets
        let sideBetDiscount = 0;
        if (this.hasSideBetPerk && this.hasSideBetPerk('sideInsurance') && totalSideBets > 0) {
            sideBetDiscount = Math.floor(totalSideBets * 0.2);
            totalSideBets -= sideBetDiscount;
        }
        
        const totalRequired = this.currentBet + totalSideBets;
        const minBet = this.getMinBet();
        
        if (this.currentBet <= 0 || totalRequired > this.money) return;
        
        // Check minimum bet for current floor
        if (this.currentBet < minBet) {
            this.showMessage(`Minimum bet on Floor ${this.currentFloor} is $${minBet}!`);
            return;
        }

        // Apply per-hand costs (curses)
        if (this.hasCurse && this.hasCurse('heavyDebt')) {
            const cost = 25;
            this.money -= cost;
            this.showMessage(`💸 Heavy Debt: -$${cost}`);
            this.updateDisplay();
        }
        
        // Zen Mind perk: gain money at start of hand
        if (this.hasPerk && this.hasPerk('meditation')) {
            this.money += 30;
            this.showMessage("🧘 Zen Mind: +$30");
            this.updateDisplay();
        }

        await this.checkAndReshuffle();

        // Save bets for rebet functionality
        this.lastBet = this.currentBet;
        this.lastSideBetPP = this.sideBetPP;
        this.lastSideBet21Plus3 = this.sideBet21Plus3;
        
        this.money -= this.currentBet;
        
        // Subtract side bets from player's money
        if (totalSideBets > 0) {
            this.money -= totalSideBets;
            if (sideBetDiscount > 0) {
                this.showMessage(`🛡️ Side Insurance: Saved $${sideBetDiscount} on side bets!`);
            }
        }
        
        this.updateDisplay();

        this.gameInProgress = true;
        this.bettingControls.classList.add('hidden');
        this.gameControls.classList.remove('hidden');

        this.playerHand = [];
        this.dealerHand = [];
        this.dealerHandEl.innerHTML = '';
        this.playerHandEl.innerHTML = '';

        this.showMessage("Dealing... 🃏");

        await this.delay(300);
        
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());

        await this.animateDeal();

        const playerScore = this.calculateScore(this.playerHand, true);
        const dealerScore = this.calculateScore(this.dealerHand);

        if (dealerScore === 21) {
            await this.revealDealerCard();
            playLoseSound();
            this.showMessage(this.getRandomMessage(this.dealerBlackjackMessages), 'lose');
            this.addToHistory(playerScore, dealerScore, 'loss');
            this.endRound(false, true);
            return;
        }

        if (playerScore === 21) {
            await this.revealDealerCard();
            playWinSound();
            this.showMessage("BLACKJACK! Wait, YOU got it?! *suspicious shuffling*", 'win');
            this.addToHistory(playerScore, dealerScore, 'win');
            this.endRound(true, true);
            return;
        }

        this.doubleBtn.disabled = this.money < this.currentBet;
        
        // Reset split state
        this.isSplitHand = false;
        this.splitHands = [];
        this.splitBets = [];
        this.currentSplitHandIndex = 0;
        
        // Update split button
        this.updateSplitButton();
        
        // Evaluate side bets after initial deal
        await this.evaluateSideBets();
        
        this.showMessage("Your move, genius. 🤔");
        this.updateScores(true);
    }

    async animateDeal() {
        playCardDealSound();
        this.playerHandEl.appendChild(this.createCardElement(this.playerHand[0]));
        await this.delay(250);
        
        playCardDealSound();
        this.dealerHandEl.appendChild(this.createCardElement(this.dealerHand[0]));
        await this.delay(250);
        
        playCardDealSound();
        this.playerHandEl.appendChild(this.createCardElement(this.playerHand[1]));
        await this.delay(250);
        
        playCardDealSound();
        this.dealerHandEl.appendChild(this.createCardElement(this.dealerHand[1], true));
        await this.delay(250);

        this.updateScores(true);
    }

    async hit() {
        if (!this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        if (this.isProcessingAction) return;
        
        this.isProcessingAction = true;
        this.hitBtn.disabled = true;
        this.doubleBtn.disabled = true;
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        // Handle split hands
        if (this.isSplitHand) {
            await this.hitSplitHand();
            this.isProcessingAction = false;
            this.hitBtn.disabled = false;
            return;
        }
        
        const card = this.drawCard();
        this.playerHand.push(card);
        
        if (this.isBossFight && this.currentBoss?.hitCost) {
            this.money -= this.currentBoss.hitCost;
            this.showMessage(`💸 The Countess drains $${this.currentBoss.hitCost}!`, 'lose');
            this.updateDisplay();
        }
        
        playCardDealSound();
        const cardEl = this.createCardElement(card);
        this.playerHandEl.appendChild(cardEl);

        const score = this.calculateScore(this.playerHand, true);
        this.updateScores(true);

        if (score > 21) {
            const shield = this.getPerk('shield');
            if (shield && shield.uses > 0) {
                shield.uses--;
                this.playerHand.pop();
                this.playerHandEl.removeChild(cardEl);
                this.updateScores(true);
                this.updateRoguelikeDisplay();
                this.showMessage("🛡️ Soul Shield saved you from busting!", 'win');
                this.isProcessingAction = false;
                this.hitBtn.disabled = false;
                return;
            }
            
            await this.delay(400);
            cardEl.classList.add('rigged');
            playLoseSound();
            this.showMessage(this.getRandomMessage(this.bustMessages), 'lose');
            await this.revealDealerCard();
            const dealerScore = this.calculateScore(this.dealerHand);
            this.addToHistory(score, dealerScore, 'loss');
            this.endRound(false);
        } else if (score === 21) {
            this.showMessage("21! Let's see the dealer's response...");
            await this.delay(400);
            // Reset processing flag before calling stand
            this.isProcessingAction = false;
            await this.stand();
        } else {
            // Re-enable hit button for next action
            this.isProcessingAction = false;
            this.hitBtn.disabled = false;
        }
    }
    
    async hitSplitHand() {
        const card = this.drawCard();
        this.splitHands[this.currentSplitHandIndex].push(card);
        
        playCardDealSound();
        this.renderSplitHands(this.currentSplitHandIndex);
        this.updateSplitScores();
        
        const score = this.calculateScore(this.splitHands[this.currentSplitHandIndex], true);
        
        if (score > 21) {
            await this.delay(400);
            this.showMessage(`Hand ${this.currentSplitHandIndex + 1} BUSTS! 💥`);
            await this.delay(500);
            
            // Move to next hand or resolve
            if (this.currentSplitHandIndex === 0) {
                this.currentSplitHandIndex = 1;
                this.renderSplitHands();
                this.showMessage("Now playing Hand 2...");
                // Re-enable buttons for hand 2
                this.hitBtn.disabled = false;
                this.standBtn.disabled = false;
                this.isProcessingAction = false;
            } else {
                // Both hands done, resolve
                await this.resolveSplitHands();
            }
        } else if (score === 21) {
            await this.delay(400);
            this.showMessage(`Hand ${this.currentSplitHandIndex + 1} has 21!`);
            await this.standSplitHand();
        }
    }

    async double() {
        if (!this.gameInProgress || this.money < this.currentBet) return;
        if (this.isPopupOpen()) return;
        if (this.isProcessingAction) return;
        
        this.isProcessingAction = true;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.doubleBtn.disabled = true;
        if (this.splitBtn) this.splitBtn.disabled = true;

        this.money -= this.currentBet;
        this.currentBet *= 2;
        this.currentBetDisplay.textContent = `$${this.currentBet}`;
        this.updateDisplay();

        this.showMessage("Doubling down? Bold move, cotton. 💀");

        const card = this.drawCard();
        this.playerHand.push(card);
        playCardDealSound();
        this.playerHandEl.appendChild(this.createCardElement(card));
        
        await this.delay(400);
        
        const score = this.calculateScore(this.playerHand, true);
        this.updateScores(true);

        if (score > 21) {
            const cardEl = this.playerHandEl.lastChild;
            cardEl.classList.add('rigged');
            playLoseSound();
            this.showMessage(this.getRandomMessage(this.bustMessages) + " (2x pain!)", 'lose');
            await this.revealDealerCard();
            const dealerScore = this.calculateScore(this.dealerHand);
            this.addToHistory(score, dealerScore, 'loss');
            this.endRound(false);
        } else {
            // After doubling, player must stand - dealer plays
            this.isProcessingAction = false;
            await this.stand();
        }
    }

    // === SIDE BETS ===
    
    placeSideBet(btn) {
        if (this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        
        const type = btn.dataset.type;
        const amount = parseInt(btn.dataset.amount);
        
        // Deselect other buttons of the same type
        const container = type === 'pp' ? document.getElementById('pp-buttons') : document.getElementById('21plus3-buttons');
        if (container) {
            container.querySelectorAll('.side-bet-btn').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');
        
        // Set the bet
        if (type === 'pp') {
            this.sideBetPP = amount;
        } else if (type === '21plus3') {
            this.sideBet21Plus3 = amount;
        }
        
        this.updateSideBetsDisplay();
    }
    
    updateSideBetsDisplay() {
        const total = (this.sideBetPP || 0) + (this.sideBet21Plus3 || 0);
        if (this.sideBetsTotalEl) {
            this.sideBetsTotalEl.textContent = `$${total}`;
        }
    }
    
    initializeSideBetButtons() {
        // Set OFF as active for both side bets
        document.querySelectorAll('.side-bet-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.amount === '0') {
                btn.classList.add('active');
            }
        });
        this.updateSideBetsDisplay();
    }
    
    checkPerfectPairs(hand) {
        if (hand.length < 2) return null;
        
        const card1 = hand[0];
        const card2 = hand[1];
        
        const value1 = card1.value;
        const value2 = card2.value;
        
        if (value1 !== value2) return null;
        
        if (card1.suit === card2.suit) {
            return { type: 'perfectPair', name: 'PERFECT PAIR', emoji: '👯', payout: this.sideBetPayouts.perfectPair };
        }
        
        const redSuits = ['♥', '♦'];
        const isCard1Red = redSuits.includes(card1.suit);
        const isCard2Red = redSuits.includes(card2.suit);
        
        if (isCard1Red === isCard2Red) {
            return { type: 'coloredPair', name: 'COLORED PAIR', emoji: '🎨', payout: this.sideBetPayouts.coloredPair };
        }
        
        return { type: 'mixedPair', name: 'MIXED PAIR', emoji: '👫', payout: this.sideBetPayouts.mixedPair };
    }
    
    check21Plus3(playerHand, dealerHand) {
        if (playerHand.length < 2 || dealerHand.length < 1) return null;
        
        const cards = [playerHand[0], playerHand[1], dealerHand[0]];
        const valueOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const values = cards.map(c => valueOrder.indexOf(c.value));
        const suits = cards.map(c => c.suit);
        
        const allSameSuit = suits[0] === suits[1] && suits[1] === suits[2];
        const allSameValue = cards[0].value === cards[1].value && cards[1].value === cards[2].value;
        
        const sortedValues = [...values].sort((a, b) => a - b);
        const isSequential = (sortedValues[2] - sortedValues[1] === 1 && sortedValues[1] - sortedValues[0] === 1);
        const isLowStraight = sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2;
        const isHighStraight = sortedValues[0] === 0 && sortedValues[1] === 11 && sortedValues[2] === 12;
        const isStraight = isSequential || isLowStraight || isHighStraight;
        
        if (allSameValue && allSameSuit) return { type: 'suitedTrips', name: 'SUITED TRIPS', emoji: '🔥', payout: this.sideBetPayouts.suitedTrips };
        if (isStraight && allSameSuit) return { type: 'straightFlush', name: 'STRAIGHT FLUSH', emoji: '🌟', payout: this.sideBetPayouts.straightFlush };
        if (allSameValue) return { type: 'threeOfAKind', name: 'THREE OF A KIND', emoji: '🎰', payout: this.sideBetPayouts.threeOfAKind };
        if (isStraight) return { type: 'straight', name: 'STRAIGHT', emoji: '📈', payout: this.sideBetPayouts.straight };
        if (allSameSuit) return { type: 'flush', name: 'FLUSH', emoji: '💎', payout: this.sideBetPayouts.flush };
        
        return null;
    }
    
    async evaluateSideBets() {
        if (!this.sideBetPP && !this.sideBet21Plus3) return;
        
        const results = [];
        let totalWinnings = 0;
        let anySideBetWon = false;
        
        let ppBonus = 1.0, plus3Bonus = 1.0;
        if (this.hasSideBetPerk && this.hasSideBetPerk('pairHunter')) ppBonus += 0.25;
        if (this.hasSideBetPerk && this.hasSideBetPerk('pokerFace')) plus3Bonus += 0.25;
        if (this.hasSideBetPerk && this.hasSideBetPerk('sideMaster')) { ppBonus += 0.50; plus3Bonus += 0.50; }
        
        const streakBonus = (this.hasSideBetPerk && this.hasSideBetPerk('perfectStreak') && this.sideBetStats) ? 
            1 + (this.sideBetStats.currentStreak * 0.10) : 1;
        
        if (this.sideBetPP > 0) {
            const ppResult = this.checkPerfectPairs(this.playerHand);
            if (ppResult) {
                let winnings = Math.floor(this.sideBetPP * ppResult.payout * ppBonus * streakBonus);
                totalWinnings += winnings;
                anySideBetWon = true;
                results.push({ bet: 'Perfect Pairs', result: ppResult, wagered: this.sideBetPP, won: winnings });
            } else {
                results.push({ bet: 'Perfect Pairs', result: null, wagered: this.sideBetPP, won: 0 });
            }
        }
        
        if (this.sideBet21Plus3 > 0) {
            const plus3Result = this.check21Plus3(this.playerHand, this.dealerHand);
            if (plus3Result) {
                let multiplier = plus3Bonus * streakBonus;
                if (this.hasSideBetPerk && this.hasSideBetPerk('doubleDown21') && plus3Result.name === 'Straight Flush') multiplier *= 3;
                let winnings = Math.floor(this.sideBet21Plus3 * plus3Result.payout * multiplier);
                totalWinnings += winnings;
                anySideBetWon = true;
                results.push({ bet: '21+3', result: plus3Result, wagered: this.sideBet21Plus3, won: winnings });
            } else {
                results.push({ bet: '21+3', result: null, wagered: this.sideBet21Plus3, won: 0 });
            }
        }
        
        if (this.sideBetStats) {
            if (anySideBetWon) {
                this.sideBetStats.totalWins++;
                this.sideBetStats.totalEarnings += totalWinnings;
                this.sideBetStats.currentStreak++;
                if (this.checkSideBetMilestones) this.checkSideBetMilestones();
            } else {
                this.sideBetStats.currentStreak = 0;
            }
        }
        
        if (results.length > 0) {
            this.money += totalWinnings;
            this.updateDisplay();
            await this.showSideBetResults(results);
        }
    }
    
    async showSideBetResults(results) {
        for (const result of results) {
            if (result.result) {
                const popup = document.createElement('div');
                popup.className = 'side-bet-result win';
                popup.innerHTML = `
                    <div class="side-bet-result-title">${result.result.emoji} ${result.bet} WINS!</div>
                    <div class="side-bet-result-detail">${result.result.name} (${result.result.payout}:1)</div>
                    <div class="side-bet-result-payout">+$${result.won}</div>
                `;
                document.body.appendChild(popup);
                if (typeof playWinSound === 'function') playWinSound();
                
                await this.delay(1500);
                popup.remove();
            }
        }
    }

    async stand() {
        if (!this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        if (this.isProcessingAction) return;
        
        this.isProcessingAction = true;

        // Handle split hands
        if (this.isSplitHand) {
            await this.standSplitHand();
            return;
        }

        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.doubleBtn.disabled = true;
        if (this.splitBtn) this.splitBtn.disabled = true;

        await this.revealDealerCard();
        
        let dealerScore = this.calculateScore(this.dealerHand);
        const standThreshold = (this.isBossFight && this.currentBoss?.dealerStandsOn) ? this.currentBoss.dealerStandsOn : 17;
        
        if (dealerScore >= standThreshold) {
            this.showMessage("Dealer stands on " + dealerScore + ". 🛑");
            await this.delay(800);
        } else {
            this.showMessage("Dealer must hit... 🎴");
            await this.delay(600);
            
            while (this.calculateScore(this.dealerHand) < standThreshold) {
                const card = this.drawCard();
                this.dealerHand.push(card);
                playCardDealSound();
                const cardEl = this.createCardElement(card);
                this.dealerHandEl.appendChild(cardEl);
                this.updateScores();
                await this.delay(500);
                
                const newScore = this.calculateScore(this.dealerHand);
                if (newScore >= standThreshold && newScore <= 21) {
                    this.showMessage("Dealer stands on " + newScore + ". 🛑");
                    await this.delay(400);
                    break;
                } else if (newScore > 21) {
                    this.showMessage("Dealer BUSTS at " + newScore + "! 💥");
                    await this.delay(400);
                    break;
                }
            }
        }

        await this.resolveRound();
    }

    async resolveRound() {
        const playerScore = this.calculateScore(this.playerHand, true);
        const dealerScore = this.calculateScore(this.dealerHand);
        const dealerCardCount = this.dealerHand.length;

        await this.delay(400);

        if (dealerScore > 21) {
            playWinSound();
            this.showMessage(this.getRandomMessage(this.winMessages), 'win');
            this.addToHistory(playerScore, dealerScore, 'win');
            this.endRound(true);
        } else if (dealerScore === 21 && dealerCardCount > 2) {
            playLoseSound();
            const msg = this.getRandomMessage(this.multiCard21Messages).replace('{count}', dealerCardCount);
            this.showMessage(msg, 'lose');
            this.addToHistory(playerScore, dealerScore, 'loss');
            this.endRound(false);
        } else if (dealerScore > playerScore) {
            playLoseSound();
            this.showMessage(this.getRandomMessage(this.loseMessages), 'lose');
            this.addToHistory(playerScore, dealerScore, 'loss');
            this.endRound(false);
        } else if (playerScore > dealerScore) {
            playWinSound();
            this.showMessage(this.getRandomMessage(this.winMessages), 'win');
            this.addToHistory(playerScore, dealerScore, 'win');
            this.endRound(true);
        } else {
            playChipSound();
            this.showMessage("Push! The dealer considers this a moral victory. 🤷", 'lose');
            this.addToHistory(playerScore, dealerScore, 'push');
            this.money += this.currentBet;
            this.endRound(null);
        }
    }

    async revealDealerCard() {
        const faceDownCard = this.dealerHandEl.querySelector('.face-down');
        if (faceDownCard) {
            playCardFlipSound();
            faceDownCard.classList.remove('face-down');
            const card = this.dealerHand[1];
            const isRed = ['♥', '♦'].includes(card.suit);
            faceDownCard.classList.add(isRed ? 'red' : 'black');
            faceDownCard.classList.add('rigged');
            faceDownCard.innerHTML = `
                <div class="card-corner">${card.value}${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div class="card-corner bottom">${card.value}${card.suit}</div>
            `;
        }
        this.updateScores();
        await this.delay(400);
    }

    endRound(playerWon, isBlackjack = false) {
        this.gameInProgress = false;
        this.handsPlayed++;
        this.commitPlayedCards();

        let payout = 0;
        
        if (playerWon === true) {
            payout = isBlackjack ? this.currentBet * 2.5 : this.currentBet * 2;
            
            if (this.hasPerk('doubleOrNothing')) {
                payout *= 1.5;
            }
            
            if (this.isBossFight && this.currentBoss?.multiplierWin) {
                payout = this.currentBet * this.currentBoss.multiplierWin;
            }
            
            this.money += Math.floor(payout);
            this.winStreak++;
            this.totalWins++;
            
            if (this.money >= this.escapeGoal) {
                this.showVictoryScreen();
                return;
            }
            
            // Check for floor completion (win streak reached)
            if (this.winStreak >= this.winsNeededForUpgrade) {
                setTimeout(() => this.showUpgradeSelection(), 1500);
                return;
            }
            
        } else if (playerWon === false) {
            this.timesLost++;
            this.winStreak = 0;
            
            if (this.hasPerk('insurance') && Math.random() < 0.3) {
                this.money += this.currentBet;
                this.showMessage("Insurance Fraud activated! Bet returned!", 'win');
            }
        }

        this.updateDisplay();
        this.updateRoguelikeDisplay();

        setTimeout(() => {
            if (this.money <= 0) {
                this.showBrokeScreen();
            } else {
                this.resetForNewRound();
            }
        }, 1800);
    }

    // === ROGUELIKE METHODS ===

    hasPerk(perkId) {
        return this.activePerks.some(p => p.id === perkId);
    }

    getPerk(perkId) {
        return this.activePerks.find(p => p.id === perkId);
    }

    showUpgradeSelection() {
        const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
        const shuffled = availablePerks.sort(() => Math.random() - 0.5);
        const choices = shuffled.slice(0, 3);

        this.upgradeOptionsEl.innerHTML = '';
        
        choices.forEach(perk => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="upgrade-icon">${perk.icon}</div>
                <div class="upgrade-name">${perk.name}</div>
                <div class="upgrade-desc">${perk.desc}</div>
            `;
            card.addEventListener('click', () => this.selectUpgrade(perk));
            this.upgradeOptionsEl.appendChild(card);
        });

        this.upgradePopup.classList.remove('hidden');
    }

    selectUpgrade(perk) {
        const newPerk = { ...perk };
        if (newPerk.maxUses) {
            newPerk.uses = newPerk.maxUses;
        }
        this.activePerks.push(newPerk);
        
        this.upgradePopup.classList.add('hidden');
        this.winStreak = 0;
        this.updateRoguelikeDisplay();
        
        // Grant dealer a new perk and show floor complete popup
        const dealerPerk = this.grantDealerPerk();
        this.showFloorCompletePopup(dealerPerk);
    }

    showVictoryScreen() {
        this.victoryStatsEl.innerHTML = `
            Floors Cleared: ${this.currentFloor}<br>
            Total Wins: ${this.totalWins}<br>
            Final Fortune: $${this.money}<br>
            Perks Collected: ${this.activePerks.length}
        `;
        this.victoryPopup.classList.remove('hidden');
    }

    updateRoguelikeDisplay() {
        this.currentFloorEl.textContent = this.currentFloor;
        this.winStreakEl.textContent = this.winStreak;
        this.winsNeededEl.textContent = this.winsNeededForUpgrade;
        
        if (this.activePerks.length === 0) {
            this.activeUpgradesEl.innerHTML = 'None yet...';
        } else {
            this.activeUpgradesEl.innerHTML = this.activePerks.map(p => 
                `<span class="perk-badge">${p.icon} ${p.name}${p.maxUses ? ` (${p.uses})` : ''}</span>`
            ).join('');
        }
    }

    // === PRE-ROUND SHOP ===
    
    showPreRoundShop() {
        if (!this.preRoundShopPopup) return;
        if (this.gameInProgress) return;
        
        this.refreshShopInventory();
        this.renderPreRoundShopItems();
        this.renderActivePerksInShop();
        this.preRoundShopMoney.textContent = `$${this.money}`;
        this.preRoundShopPopup.classList.remove('hidden');
    }
    
    hidePreRoundShop() {
        if (this.preRoundShopPopup) {
            this.preRoundShopPopup.classList.add('hidden');
        }
        // Make sure money display is up to date after shopping
        this.updateDisplay();
    }
    
    refreshShopInventory() {
        // Get available perks (ones player doesn't already have)
        const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
        
        // Shuffle and pick 3
        const shuffled = availablePerks.sort(() => Math.random() - 0.5);
        this.shopInventory = shuffled.slice(0, 3);
    }
    
    renderPreRoundShopItems() {
        if (!this.preRoundShopItems) return;
        
        this.preRoundShopItems.innerHTML = '';
        
        if (!this.shopInventory || this.shopInventory.length === 0) {
            this.preRoundShopItems.innerHTML = '<p class="shop-empty">No perks available!</p>';
            return;
        }
        
        this.shopInventory.forEach((perk, index) => {
            const canAfford = this.money >= perk.cost;
            const btn = document.createElement('button');
            btn.className = `perk-shop-item ${canAfford ? '' : 'cannot-afford'}`;
            btn.innerHTML = `
                <span class="perk-icon">${perk.icon}</span>
                <span class="perk-name">${perk.name}</span>
                <span class="perk-desc">${perk.desc}</span>
                <span class="perk-cost ${canAfford ? 'affordable' : 'expensive'}">$${perk.cost}</span>
            `;
            
            if (canAfford) {
                btn.addEventListener('click', () => this.buyPerkFromShop(index));
            } else {
                btn.disabled = true;
            }
            
            this.preRoundShopItems.appendChild(btn);
        });
    }
    
    buyPerkFromShop(index) {
        const perk = this.shopInventory[index];
        if (!perk || this.money < perk.cost) return;
        
        // Deduct cost
        this.money -= perk.cost;
        
        // Add perk
        const newPerk = { ...perk };
        if (newPerk.maxUses) {
            newPerk.uses = newPerk.maxUses;
        }
        this.activePerks.push(newPerk);
        
        // Remove from shop inventory
        this.shopInventory.splice(index, 1);
        
        // Update displays
        this.updateDisplay();
        this.updateRoguelikeDisplay();
        this.preRoundShopMoney.textContent = `$${this.money}`;
        this.renderPreRoundShopItems();
        this.renderActivePerksInShop();
        
        // Play sound
        if (typeof playChipSound === 'function') playChipSound();
        
        this.showMessage(`🎉 Purchased ${perk.name}!`);
    }
    
    renderActivePerksInShop() {
        if (!this.shopActivePerksListEl) return;
        
        if (this.activePerks.length === 0) {
            this.shopActivePerksListEl.innerHTML = 'None yet...';
        } else {
            this.shopActivePerksListEl.innerHTML = this.activePerks.map(p => 
                `<span class="perk-badge">${p.icon} ${p.name}</span>`
            ).join(' ');
        }
    }

    // === SPLIT FUNCTIONALITY ===
    
    canSplit() {
        if (this.playerHand.length !== 2) return false;
        if (this.money < this.currentBet) return false;
        if (this.isSplitHand) return false;
        
        const val1 = this.playerHand[0].value;
        const val2 = this.playerHand[1].value;
        
        // Get numeric value for comparison (10, J, Q, K all have value 10)
        const getNumericValue = (value) => {
            if (['J', 'Q', 'K'].includes(value)) return 10;
            if (value === 'A') return 11;
            return parseInt(value);
        };
        
        const numVal1 = getNumericValue(val1);
        const numVal2 = getNumericValue(val2);
        
        // Can split if same numeric value (allows 10-J, K-Q, etc.)
        return numVal1 === numVal2;
    }
    
    updateSplitButton() {
        if (this.splitBtn) {
            this.splitBtn.disabled = !this.canSplit();
        }
    }
    
    async split() {
        if (!this.canSplit()) return;
        if (!this.gameInProgress) return;
        if (this.isPopupOpen()) return;
        
        // Deduct additional bet for second hand
        this.money -= this.currentBet;
        this.updateDisplay();
        
        // Create two hands
        this.splitHands = [
            [this.playerHand[0]],
            [this.playerHand[1]]
        ];
        this.splitBets = [this.currentBet, this.currentBet];
        this.currentSplitHandIndex = 0;
        this.isSplitHand = true;
        
        // Deal one card to each hand
        const card1 = this.drawCard();
        const card2 = this.drawCard();
        this.splitHands[0].push(card1);
        this.splitHands[1].push(card2);
        
        // Disable split button
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        // Render split hands
        this.renderSplitHands(0);
        
        playCardDealSound();
        await this.delay(300);
        
        this.renderSplitHands(1);
        playCardDealSound();
        
        this.showMessage("✂️ Hand split! Play Hand 1 first.");
        this.updateSplitScores();
    }
    
    renderSplitHands(animateHandIndex = -1) {
        this.playerHandEl.innerHTML = '';
        this.playerHandEl.classList.add('split-mode');
        
        this.splitHands.forEach((hand, handIndex) => {
            const handContainer = document.createElement('div');
            handContainer.className = `split-hand ${handIndex === this.currentSplitHandIndex ? 'active' : ''}`;
            handContainer.innerHTML = `<div class="split-hand-label">Hand ${handIndex + 1}</div>`;
            
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'split-cards';
            
            hand.forEach((card, cardIndex) => {
                const cardEl = this.createCardElement(card);
                // Only animate the last card of the animating hand
                if (handIndex === animateHandIndex && cardIndex === hand.length - 1) {
                    cardEl.classList.add('dealing');
                }
                cardsContainer.appendChild(cardEl);
            });
            
            handContainer.appendChild(cardsContainer);
            this.playerHandEl.appendChild(handContainer);
        });
    }
    
    updateSplitScores() {
        const scores = this.splitHands.map(h => this.calculateScore(h, true));
        this.playerScoreEl.textContent = `H1: ${scores[0]} | H2: ${scores[1]}`;
    }
    
    async standSplitHand() {
        this.showMessage(`Hand ${this.currentSplitHandIndex + 1} stands.`);
        await this.delay(500);
        
        if (this.currentSplitHandIndex === 0) {
            this.currentSplitHandIndex = 1;
            this.renderSplitHands();
            this.showMessage("Now playing Hand 2...");
            // Re-enable buttons for hand 2
            this.hitBtn.disabled = false;
            this.standBtn.disabled = false;
            this.isProcessingAction = false;
        } else {
            // Both hands done, resolve against dealer
            await this.resolveSplitHands();
        }
    }
    
    async resolveSplitHands() {
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.doubleBtn.disabled = true;
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        // Reveal dealer and play
        await this.revealDealerCard();
        
        let dealerScore = this.calculateScore(this.dealerHand);
        const standThreshold = 17;
        
        while (dealerScore < standThreshold) {
            const card = this.drawCard();
            this.dealerHand.push(card);
            playCardDealSound();
            const cardEl = this.createCardElement(card);
            this.dealerHandEl.appendChild(cardEl);
            await this.delay(500);
            dealerScore = this.calculateScore(this.dealerHand);
        }
        
        this.updateScores();
        
        // Resolve each hand
        let totalWinnings = 0;
        let wins = 0;
        let losses = 0;
        
        for (let i = 0; i < this.splitHands.length; i++) {
            const handScore = this.calculateScore(this.splitHands[i], true);
            const bet = this.splitBets[i];
            
            if (handScore > 21) {
                losses++;
                // Already lost
            } else if (dealerScore > 21 || handScore > dealerScore) {
                wins++;
                totalWinnings += bet * 2;
            } else if (handScore === dealerScore) {
                // Push - return bet
                totalWinnings += bet;
            } else {
                losses++;
            }
        }
        
        this.money += totalWinnings;
        
        // Determine overall result
        if (wins > losses) {
            playWinSound();
            this.showMessage(`✂️ Split WIN! ${wins} wins, ${losses} losses. +$${totalWinnings}`, 'win');
            this.winStreak++;
            this.totalWins++;
            this.endRound(true);
        } else if (losses > wins) {
            playLoseSound();
            this.showMessage(`✂️ Split LOSS. ${wins} wins, ${losses} losses.`, 'lose');
            this.winStreak = 0;
            this.timesLost++;
            this.endRound(false);
        } else {
            playChipSound();
            this.showMessage(`✂️ Split PUSH. ${wins} wins, ${losses} losses.`);
            this.endRound(null);
        }
        
        // Reset split state
        this.isSplitHand = false;
        this.splitHands = [];
        this.splitBets = [];
    }

    // === UI HELPERS ===

    resetForNewRound() {
        this.currentBet = 0;
        this.sideBetPP = 0;
        this.sideBet21Plus3 = 0;
        this.betHistory = [];
        this.bettingControls.classList.remove('hidden');
        this.gameControls.classList.add('hidden');
        this.dealBtn.disabled = true;
        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;
        this.doubleBtn.disabled = false;
        this.isProcessingAction = false;
        if (this.splitBtn) this.splitBtn.disabled = true;
        this.messageEl.classList.remove('win', 'lose');
        
        // Clear chip stacks
        if (this.mainChipStack) this.mainChipStack.innerHTML = '';
        if (this.ppChipStack) this.ppChipStack.innerHTML = '';
        if (this.plus3ChipStack) this.plus3ChipStack.innerHTML = '';
        
        // Reset bet totals
        if (this.mainBetTotal) this.mainBetTotal.textContent = '$0';
        if (this.ppBetTotal) this.ppBetTotal.textContent = '$0';
        if (this.plus3BetTotal) this.plus3BetTotal.textContent = '$0';
        
        // Update buttons
        this.updateBettingButtons();
        
        this.dealerHandEl.innerHTML = '';
        this.playerHandEl.innerHTML = '';
        this.playerHandEl.classList.remove('split-mode');
        this.dealerScoreEl.textContent = '';
        this.playerScoreEl.textContent = '';
        this.clearScoreboard();
        
        // Reset split state
        this.isSplitHand = false;
        this.splitHands = [];
        this.splitBets = [];
        this.currentSplitHandIndex = 0;
        
        // Refresh shop inventory for next round
        this.refreshShopInventory();
        
        if (this.lastBet > 0 && this.money > 0) {
            const totalRebet = this.lastBet + this.lastSideBetPP + this.lastSideBet21Plus3;
            if (totalRebet <= this.money) {
                this.showMessage(`Click bet areas or REBET for $${totalRebet} total!`);
            } else {
                this.showMessage(`Place your bet! (Last bet was $${totalRebet})`);
            }
        } else {
            this.showMessage("Place your bet, if you dare... 💰");
        }
        
        // Update the money display
        this.updateDisplay();
        
        // Show post-round choice (but not on first round or if broke)
        if (this.handsPlayed > 0 && this.money > 0) {
            this.showPostRoundPopup();
        }
    }
    
    getMinBet() {
        const floorIndex = Math.min(this.currentFloor - 1, CONFIG.MIN_BET_PER_FLOOR.length - 1);
        return CONFIG.MIN_BET_PER_FLOOR[floorIndex];
    }
    
    showPostRoundPopup() {
        if (!this.postRoundPopup) return;
        
        const minBet = this.getMinBet();
        this.postRoundStats.innerHTML = `
            Money: $${this.money}<br>
            Floor ${this.currentFloor} - Min Bet: $${minBet}<br>
            Wins: ${this.totalWins} | Streak: ${this.winStreak}/${this.winsNeededForUpgrade}
        `;
        
        this.postRoundPopup.classList.remove('hidden');
    }
    
    hidePostRoundPopup() {
        if (this.postRoundPopup) {
            this.postRoundPopup.classList.add('hidden');
        }
        // Ensure money display is current
        this.updateDisplay();
    }
    
    showFloorCompletePopup(newPerk) {
        if (!this.floorCompletePopup) return;
        
        this.floorCompleteTitle.textContent = `FLOOR ${this.currentFloor} COMPLETE!`;
        this.floorCompleteMsg.textContent = `You've conquered this floor, but the dealer grows stronger...`;
        
        if (newPerk) {
            this.dealerPerkReveal.style.display = 'block';
            this.dealerPerkIcon.textContent = newPerk.icon;
            this.dealerPerkName.textContent = newPerk.name;
            this.dealerPerkDesc.textContent = newPerk.desc;
        } else {
            this.dealerPerkReveal.style.display = 'none';
        }
        
        this.floorCompletePopup.classList.remove('hidden');
    }
    
    hideFloorCompletePopup() {
        if (this.floorCompletePopup) {
            this.floorCompletePopup.classList.add('hidden');
        }
    }
    
    advanceToNextFloor() {
        this.currentFloor++;
        this.winStreak = 0;
        const newMinBet = this.getMinBet();
        this.showMessage(`Welcome to Floor ${this.currentFloor}! Min bet: $${newMinBet}`);
        this.updateRoguelikeDisplay();
        this.resetForNewRound();
    }
    
    grantDealerPerk() {
        // Get a random perk the dealer doesn't already have
        const availablePerks = this.allDealerPerks.filter(
            p => !this.dealerPerks.find(dp => dp.id === p.id)
        );
        
        if (availablePerks.length === 0) return null;
        
        const newPerk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
        this.dealerPerks.push(newPerk);
        return newPerk;
    }

    showBrokeScreen() {
        this.brokeMessageEl.textContent = this.getRandomMessage(this.brokeMessages);
        this.brokePopup.classList.remove('hidden');
    }

    restart() {
        this.money = CONFIG.STARTING_MONEY;
        this.currentBet = 0;
        this.lastBet = 0;
        this.lastSideBetPP = 0;
        this.lastSideBet21Plus3 = 0;
        this.handsPlayed = 0;
        this.timesLost = 0;
        this.playerHand = [];
        this.dealerHand = [];
        this.gameInProgress = false;
        
        this.currentFloor = 1;
        this.winStreak = 0;
        this.totalWins = 0;
        this.activePerks = [];
        this.dealerPerks = [];
        this.isBossFight = false;
        this.currentBoss = null;

        this.brokePopup.classList.add('hidden');
        if (this.postRoundPopup) this.postRoundPopup.classList.add('hidden');
        if (this.floorCompletePopup) this.floorCompletePopup.classList.add('hidden');
        this.victoryPopup.classList.add('hidden');
        this.upgradePopup.classList.add('hidden');
        this.bossPopup.classList.add('hidden');
        if (this.eventPopup) this.eventPopup.classList.add('hidden');
        if (this.shopPopup) this.shopPopup.classList.add('hidden');
        if (this.preRoundShopPopup) this.preRoundShopPopup.classList.add('hidden');
        this.rebetSection.classList.add('hidden');
        this.tableEl.classList.remove('boss-mode');
        this.dealerHandEl.innerHTML = '';
        this.playerHandEl.innerHTML = '';
        this.dealerScoreEl.textContent = '';
        this.playerScoreEl.textContent = '';
        
        this.roundHistory = [];
        this.clearScoreboard();
        
        this.initializeDeck();
        
        this.resetForNewRound();
        this.updateDisplay();
        this.updateRoguelikeDisplay();
        
        this.showMessage("New run! Escape with $10,000 to win! 🎰");
    }

    updateDisplay() {
        this.moneyDisplay.textContent = `$${this.money}`;

        if (this.money < 100) {
            this.moneyDisplay.classList.add('losing');
        } else {
            this.moneyDisplay.classList.remove('losing');
        }
    }

    updateScores(hideDealer = false) {
        const playerScore = this.calculateScore(this.playerHand, true);
        this.playerScoreEl.textContent = `Score: ${playerScore}`;

        let dealerScore;
        let visibleDealerScore;
        if (hideDealer) {
            visibleDealerScore = this.getCardValue(this.dealerHand[0], 0);
            this.dealerScoreEl.textContent = `Score: ${visibleDealerScore} + ?`;
            dealerScore = visibleDealerScore;
        } else {
            dealerScore = this.calculateScore(this.dealerHand);
            this.dealerScoreEl.textContent = `Score: ${dealerScore}`;
        }
        
        this.updateScoreboard(playerScore, hideDealer ? visibleDealerScore : dealerScore, hideDealer);
    }
    
    updateScoreboard(playerScore, dealerScore, hideDealer = false) {
        this.scoreboardPlayerEl.textContent = playerScore > 0 ? playerScore : '--';
        
        if (hideDealer) {
            const visibleScore = this.getCardValue(this.dealerHand[0], 0);
            this.scoreboardDealerEl.textContent = visibleScore + '+?';
        } else {
            this.scoreboardDealerEl.textContent = dealerScore > 0 ? dealerScore : '--';
        }
        
        this.scoreboardPlayerEl.classList.remove('winning', 'losing', 'tied');
        this.scoreboardDealerEl.classList.remove('winning', 'losing', 'tied');
        
        if (playerScore > 0 && dealerScore > 0 && !hideDealer) {
            if (playerScore > 21) {
                this.scoreboardPlayerEl.classList.add('losing');
            } else if (dealerScore > 21) {
                this.scoreboardDealerEl.classList.add('losing');
                this.scoreboardPlayerEl.classList.add('winning');
            } else if (playerScore > dealerScore) {
                this.scoreboardPlayerEl.classList.add('winning');
                this.scoreboardDealerEl.classList.add('losing');
            } else if (dealerScore > playerScore) {
                this.scoreboardDealerEl.classList.add('winning');
                this.scoreboardPlayerEl.classList.add('losing');
            } else {
                this.scoreboardPlayerEl.classList.add('tied');
                this.scoreboardDealerEl.classList.add('tied');
            }
        }
    }
    
    addToHistory(playerScore, dealerScore, result) {
        const resultClass = result === 'win' ? 'win' : result === 'loss' ? 'loss' : 'push';
        const resultSymbol = result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T';
        
        this.roundHistory.unshift({
            player: playerScore,
            dealer: dealerScore,
            result: resultClass,
            symbol: resultSymbol
        });
        
        if (this.roundHistory.length > 20) {
            this.roundHistory.pop();
        }
        
        this.renderHistoryList();
    }
    
    renderHistoryList() {
        let html = '';
        
        for (let i = 0; i < this.roundHistory.length; i++) {
            const h = this.roundHistory[i];
            const roundNum = this.roundHistory.length - i;
            html += `<span class="history-item ${h.result}">#${roundNum.toString().padStart(2, '0')} ${h.symbol}: ${h.player} vs ${h.dealer}</span>`;
        }
        
        for (let i = this.roundHistory.length; i < 20; i++) {
            const slotNum = 20 - i;
            html += `<span class="history-item placeholder">#${slotNum.toString().padStart(2, '0')} --------</span>`;
        }
        
        this.historyListEl.innerHTML = html;
    }
    
    clearScoreboard() {
        this.scoreboardPlayerEl.textContent = '--';
        this.scoreboardDealerEl.textContent = '--';
        this.scoreboardPlayerEl.classList.remove('winning', 'losing', 'tied');
        this.scoreboardDealerEl.classList.remove('winning', 'losing', 'tied');
        this.renderHistoryList();
    }

    showMessage(msg, type = '') {
        this.messageEl.innerHTML = `<p>${msg}</p>`;
        this.messageEl.classList.remove('win', 'lose');
        if (type) {
            this.messageEl.classList.add(type);
        }
    }

    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}