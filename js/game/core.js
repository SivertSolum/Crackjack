// CRACKJACK - Core Game Class
// Main class definition with constructor and initialization

class CrackJack {
    constructor() {
        // Basic game state
        this.money = CONFIG.STARTING_MONEY;
        this.currentBet = 0;
        this.lastBet = 0;
        this.playerHand = [];
        this.dealerHand = [];
        this.gameInProgress = false;
        this.handsPlayed = 0;
        this.timesLost = 0;
        
        // Split mechanic
        this.isSplit = false;
        this.splitHands = [];
        this.splitBets = [];
        this.currentSplitHand = 0;
        this.splitHandEls = [];
        
        // Side bets
        this.sideBetPP = 0;
        this.sideBet21Plus3 = 0;
        this.lastSideBetPP = 0;
        this.lastSideBet21Plus3 = 0;
        this.sideBetsEnabled = true;
        
        // Side bet payouts
        this.sideBetPayouts = {
            perfectPair: 25,
            coloredPair: 12,
            mixedPair: 5,
            suitedTrips: 100,
            straightFlush: 40,
            threeOfAKind: 30,
            straight: 10,
            flush: 5
        };

        // Roguelike elements
        this.currentFloor = 1;
        this.currentRoom = 0;
        this.roomsOnFloor = [];
        this.winStreak = 0;
        this.escapeGoal = CONFIG.ESCAPE_GOAL;
        this.activePerks = [];
        this.activeRelics = [];
        this.activeCurses = [];
        this.isBossFight = false;
        this.isEliteFight = false;
        this.currentBoss = null;
        this.currentElite = null;
        this.totalWins = 0;
        this.floorsCleared = 0;
        
        // Run stats
        this.runStats = {
            handsWon: 0,
            handsLost: 0,
            moneyEarned: 0,
            moneyLost: 0,
            eventsCompleted: 0,
            elitesDefeated: 0,
            bossesDefeated: 0,
            relicsFound: 0,
            cursesRemoved: 0
        };
        
        // Side bet tracking
        this.sideBetStats = {
            totalWins: 0,
            totalEarnings: 0,
            currentStreak: 0,
            unlockedPerks: []
        };

        // Extra lives
        this.extraLives = 0;

        // Data from config
        this.allPerks = PERKS;
        this.allSideBetPerks = typeof SIDE_BET_PERKS !== 'undefined' ? SIDE_BET_PERKS : [];
        this.allRelics = RELICS;
        this.allCurses = CURSES;
        this.allElites = ELITES;
        this.bosses = BOSSES;
        this.allEvents = EVENTS;
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

        // History
        this.roundHistory = [];

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
        this.deckAreaEl = document.getElementById('deck-area');
        this.deckPileEl = document.getElementById('deck-pile');
        this.deckCountEl = document.getElementById('deck-count');
        this.shuffleOverlay = document.getElementById('shuffle-overlay');
        this.cardTrackerEl = document.getElementById('card-tracker');
        
        // Roguelike elements
        this.eventPopup = document.getElementById('event-popup');
        this.shopPopup = document.getElementById('shop-popup');
        this.mapPopup = document.getElementById('map-popup');
        this.roomIndicator = document.getElementById('room-indicator');
        this.relicsDisplay = document.getElementById('relics-display');
        this.cursesDisplay = document.getElementById('curses-display');
    }

    bindEvents() {
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.placeBet(e.target.closest('.bet-btn')));
        });

        this.dealBtn.addEventListener('click', () => this.deal());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
        this.doubleBtn.addEventListener('click', () => this.double());
        if (this.splitBtn) this.splitBtn.addEventListener('click', () => this.split());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.sameBetBtn.addEventListener('click', () => this.sameBet());
        this.bossFightBtn.addEventListener('click', () => this.startBossFight());
        this.victoryRestartBtn.addEventListener('click', () => this.restart());
        
        // Side bet buttons
        document.querySelectorAll('.side-bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.placeSideBet(e.target));
        });
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    weightedRandom(weights) {
        const entries = Object.entries(weights);
        const total = entries.reduce((sum, [_, weight]) => sum + weight, 0);
        let random = Math.random() * total;
        
        for (const [type, weight] of entries) {
            random -= weight;
            if (random <= 0) return type;
        }
        return entries[0][0];
    }
}

