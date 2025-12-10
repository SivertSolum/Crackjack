// CRACKJACK - Main Game Class
// Roguelike Dungeon Crawler Edition

class CrackJack {
    constructor() {
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
        this.splitHands = []; // Array of hands when split
        this.splitBets = [];  // Bet for each split hand
        this.currentSplitHand = 0; // Which hand is currently being played
        this.splitHandEls = []; // DOM elements for split hands
        
        // Side bets
        this.sideBetPP = 0;      // Perfect Pairs bet
        this.sideBet21Plus3 = 0; // 21+3 bet
        this.lastSideBetPP = 0;
        this.lastSideBet21Plus3 = 0;
        this.sideBetsEnabled = true;
        
        // Side bet payouts
        this.sideBetPayouts = {
            perfectPair: 25,    // Same suit, same value
            coloredPair: 12,    // Same color, different suit
            mixedPair: 5,       // Different color
            suitedTrips: 100,   // Three of a kind, same suit
            straightFlush: 40,  // Sequential, same suit
            threeOfAKind: 30,   // Three of a kind
            straight: 10,       // Sequential
            flush: 5            // Same suit
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

        // Extra lives (phoenix feather, etc.)
        this.extraLives = 0;
        
        // Shop inventory (3 random perks, refreshed between rounds)
        this.shopInventory = [];

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
        this.preRoundShopItems = document.getElementById('pre-round-shop-items');
        this.preRoundShopMoney = document.getElementById('pre-round-shop-money');
        this.preRoundShopClose = document.getElementById('pre-round-shop-close');
        this.shopActivePerksListEl = document.getElementById('shop-active-perks-list');
    }

    bindEvents() {
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.placeBet(e.target.closest('.bet-btn')));
        });
        
        // Pre-round shop
        if (this.preRoundShopBtn) {
            this.preRoundShopBtn.addEventListener('click', () => this.showPreRoundShop());
        }
        if (this.preRoundShopClose) {
            this.preRoundShopClose.addEventListener('click', () => this.hidePreRoundShop());
        }

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

    // === FLOOR & ROOM GENERATION ===
    
    generateFloorRooms(floor) {
        const numRooms = CONFIG.ROOMS_PER_FLOOR[floor - 1] || 4;
        const weights = ROOM_WEIGHTS[floor] || ROOM_WEIGHTS[1];
        const rooms = [];
        
        // First room is always normal to ease players in
        rooms.push({ type: 'normal', completed: false });
        
        // Generate middle rooms based on weights
        for (let i = 1; i < numRooms; i++) {
            const roomType = this.weightedRandom(weights);
            rooms.push({ type: roomType, completed: false, data: this.generateRoomData(roomType, floor) });
        }
        
        // Last room is always the boss
        rooms.push({ type: 'boss', completed: false, data: this.getBossForFloor(floor) });
        
        return rooms;
    }
    
    weightedRandom(weights) {
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return type;
        }
        return 'normal';
    }
    
    generateRoomData(roomType, floor) {
        switch (roomType) {
            case 'elite':
                return this.allElites[Math.floor(Math.random() * this.allElites.length)];
            case 'event':
                return this.allEvents[Math.floor(Math.random() * this.allEvents.length)];
            case 'shop':
                return this.generateShopInventory(floor);
            case 'rest':
                return REST_OPTIONS;
            case 'treasure':
                return this.generateTreasure();
            case 'gamble':
                return GAMBLE_GAMES[Math.floor(Math.random() * GAMBLE_GAMES.length)];
            default:
                return null;
        }
    }
    
    generateShopInventory(floor) {
        const items = Object.entries(SHOP_ITEMS);
        const shopItems = [];
        const numItems = 4 + Math.floor(Math.random() * 2);
        const priceMultiplier = 1 + (floor - 1) * 0.15;
        
        // Shuffle and pick items
        const shuffled = items.sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(numItems, shuffled.length); i++) {
            const [key, item] = shuffled[i];
            shopItems.push({
                ...item,
                id: key,
                cost: Math.floor(item.baseCost * priceMultiplier)
            });
        }
        
        // Add a random perk to the shop
        const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
        if (availablePerks.length > 0) {
            const perk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
            shopItems.push({
                ...perk,
                type: 'perk',
                cost: Math.floor(perk.cost * priceMultiplier)
            });
        }
        
        return shopItems;
    }
    
    generateTreasure() {
        const totalWeight = TREASURE_REWARDS.reduce((a, b) => a + b.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const reward of TREASURE_REWARDS) {
            random -= reward.weight;
            if (random <= 0) {
                if (reward.type === 'money') {
                    return { type: 'money', value: Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min };
                }
                return reward;
            }
        }
        return TREASURE_REWARDS[0];
    }
    
    getBossForFloor(floor) {
        const bossIndex = Math.min(floor - 1, this.bosses.length - 1);
        return this.bosses[bossIndex];
    }
    
    // === ROOM NAVIGATION ===
    
    enterRoom(roomIndex) {
        if (roomIndex >= this.roomsOnFloor.length) return;
        
        this.currentRoom = roomIndex;
        const room = this.roomsOnFloor[roomIndex];
        
        // Clear any pending states
        this.gameInProgress = false;
        this.isEliteFight = false;
        
        this.updateRoomDisplay();
        
        const roomIcons = {
            normal: '🃏',
            elite: '⚔️',
            event: '❓',
            shop: '🛒',
            rest: '🏕️',
            treasure: '📦',
            gamble: '🎰',
            boss: '👹'
        };
        
        
        switch (room.type) {
            case 'normal':
                this.startNormalRoom();
                break;
            case 'elite':
                this.startEliteRoom(room.data);
                break;
            case 'event':
                this.showEvent(room.data);
                break;
            case 'shop':
                this.showShop(room.data);
                break;
            case 'rest':
                this.showRestSite(room.data);
                break;
            case 'treasure':
                this.openTreasure(room.data);
                break;
            case 'gamble':
                this.showGambleRoom(room.data);
                break;
            case 'boss':
                this.triggerBossFight();
                break;
            default:
                // Unknown room type, treat as normal
                this.startNormalRoom();
                break;
        }
    }
    
    completeCurrentRoom() {
        // Simplified: just reset for the next round
        this.resetForNewRound();
    }
    
    startNormalRoom() {
        // Reset any lingering states
        this.gameInProgress = false;
        this.bettingControls.classList.remove('hidden');
        this.gameControls.classList.add('hidden');
        
        this.showMessage(`🃏 Floor ${this.currentFloor}, Room ${this.currentRoom + 1} - Place your bet!`);
        this.resetForNewRound();
        this.updateDisplay();
    }
    
    startEliteRoom(elite) {
        this.currentElite = elite;
        this.isEliteFight = true;
        this.tableEl.classList.add('elite-mode');
        
        // Show elite announcement
        this.showEliteAnnouncement(elite);
    }
    
    showEliteAnnouncement(elite) {
        // Reuse boss popup for elites
        if (!this.bossPopup || !this.bossPortraitEl || !this.bossNameEl || !this.bossDescEl || !this.bossRuleEl || !this.bossFightBtn) {
            this.showMessage(`⚔️ ELITE FIGHT: ${elite.name}! - ${elite.rule} ⚔️`, 'lose');
            this.resetForNewRound();
            return;
        }
        
        this.bossPortraitEl.textContent = elite.icon;
        this.bossNameEl.textContent = elite.name;
        this.bossDescEl.textContent = elite.desc;
        this.bossRuleEl.textContent = '⚠️ ' + elite.rule;
        this.bossFightBtn.textContent = '⚔️ CHALLENGE ⚔️';
        
        this.bossPopup.classList.remove('hidden');
        
        // Change button handler temporarily
        this.bossFightBtn.onclick = () => {
            this.bossPopup.classList.add('hidden');
            this.bossFightBtn.onclick = () => this.startBossFight();
            this.bossFightBtn.textContent = '⚔️ FIGHT ⚔️';
            this.showMessage(`⚔️ ELITE FIGHT: ${elite.name}! ⚔️`, 'lose');
            this.resetForNewRound();
        };
    }
    
    // === EVENT SYSTEM ===
    
    showEvent(event) {
        if (!this.eventPopup) {
            // Fallback: show in message area
            this.showEventFallback(event);
            return;
        }
        
        // Build event UI
        const content = this.eventPopup.querySelector('.event-content') || this.eventPopup;
        content.innerHTML = `
            <div class="event-header">
                <span class="event-icon">${event.icon}</span>
                <h2>${event.name}</h2>
            </div>
            <p class="event-desc">${event.desc}</p>
            <div class="event-choices">
                ${event.choices.map((choice, i) => `
                    <button class="event-choice-btn" data-choice="${i}">
                        ${choice.text}
                        ${choice.cost > 0 ? `<span class="choice-cost">(-$${choice.cost})</span>` : ''}
                        ${choice.cost === 'perk' ? `<span class="choice-cost">(Trade Perk)</span>` : ''}
                        ${choice.cost === 'curse' ? `<span class="choice-cost">(+Curse)</span>` : ''}
                    </button>
                `).join('')}
            </div>
        `;
        
        // Bind choice buttons
        content.querySelectorAll('.event-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choiceIndex = parseInt(e.target.closest('.event-choice-btn').dataset.choice);
                this.handleEventChoice(event, event.choices[choiceIndex]);
            });
        });
        
        this.eventPopup.classList.remove('hidden');
    }
    
    showEventFallback(event) {
        // Show event in message area for now
        const choiceText = event.choices.map((c, i) => `${i + 1}. ${c.text}`).join(' | ');
        this.showMessage(`${event.icon} ${event.name}: ${event.desc}<br><small>${choiceText}</small>`);
        
        // Store event for later processing (would need keyboard input)
        this.pendingEvent = event;
        this.completeCurrentRoom();
    }
    
    handleEventChoice(event, choice) {
        if (this.eventPopup) this.eventPopup.classList.add('hidden');
        
        // Handle cost
        if (typeof choice.cost === 'number' && choice.cost > 0) {
            if (this.money < choice.cost) {
                this.showMessage("You can't afford that!");
                return;
            }
            this.money -= choice.cost;
        } else if (choice.cost === 'curse') {
            this.addRandomCurse();
        } else if (choice.cost === 'perk') {
            if (this.activePerks.length === 0) {
                this.showMessage("You have no perks to trade!");
                return;
            }
            this.removeRandomPerk();
        } else if (choice.cost === 'health') {
            if (this.money < choice.costValue) {
                this.showMessage("You can't afford that!");
                return;
            }
            this.money -= choice.costValue;
        }
        
        // Handle reward
        if (choice.reward) {
            this.grantReward(choice.reward);
        }
        
        this.runStats.eventsCompleted++;
        this.updateDisplay();
        this.completeCurrentRoom();
    }
    
    grantReward(reward) {
        switch (reward.type) {
            case 'money':
                const amount = reward.value === 'random' 
                    ? Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min
                    : reward.value;
                this.money += amount;
                this.showMessage(`💰 Gained $${amount}!`, 'win');
                break;
                
            case 'perk':
                const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
                if (availablePerks.length > 0) {
                    let perk;
                    if (reward.value === 'rare') {
                        perk = availablePerks.filter(p => p.rarity === 'rare')[0] || availablePerks[0];
                    } else if (reward.value === 'common') {
                        perk = availablePerks.filter(p => p.rarity === 'common')[0] || availablePerks[0];
                    } else {
                        perk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
                    }
                    this.addPerk(perk);
                    this.showMessage(`✨ Gained perk: ${perk.icon} ${perk.name}!`, 'win');
                }
                break;
                
            case 'relic':
                const availableRelics = this.allRelics.filter(r => !this.hasRelic(r.id));
                if (availableRelics.length > 0) {
                    const relic = availableRelics[Math.floor(Math.random() * availableRelics.length)];
                    this.addRelic(relic);
                    this.runStats.relicsFound++;
                    this.showMessage(`🏆 Found relic: ${relic.icon} ${relic.name}!`, 'win');
                }
                break;
                
            case 'removeCurse':
                if (this.activeCurses.length > 0) {
                    const curse = this.activeCurses.pop();
                    this.runStats.cursesRemoved++;
                    this.showMessage(`✨ Curse removed: ${curse.icon} ${curse.name}!`, 'win');
                } else {
                    this.showMessage("No curses to remove!");
                }
                break;
                
            case 'blessing':
                // Temporary buff
                this.money += 50;
                this.showMessage("✨ You feel blessed! +$50", 'win');
                break;
                
            case 'gamble':
                // Handle mini-games
                this.handleGambleReward(reward.value);
                break;
                
            case 'cursedChest':
                // 50/50 good or bad
                if (Math.random() < 0.5) {
                    this.grantReward({ type: 'relic', value: 'random' });
                } else {
                    this.addRandomCurse();
                    this.showMessage("💀 The chest was a mimic! You've been cursed!", 'lose');
                }
                break;
        }
        
        this.updateDisplay();
        this.updateRoguelikeDisplay();
    }
    
    // === SHOP SYSTEM ===
    
    showShop(inventory) {
        if (!this.shopPopup) {
            this.showShopFallback(inventory);
            return;
        }
        
        const content = this.shopPopup.querySelector('.shop-content') || this.shopPopup;
        content.innerHTML = `
            <h2>🛒 SHOP</h2>
            <p class="shop-money">Your money: <span class="gold">$${this.money}</span></p>
            <div class="shop-items">
                ${inventory.map((item, i) => `
                    <div class="shop-item ${this.money < item.cost ? 'unaffordable' : ''}" data-index="${i}">
                        <span class="item-icon">${item.icon}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-desc">${item.desc}</span>
                        <span class="item-cost">$${item.cost}</span>
                    </div>
                `).join('')}
            </div>
            <button class="shop-leave-btn">Leave Shop</button>
        `;
        
        content.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.shop-item').dataset.index);
                this.buyShopItem(inventory, index);
            });
        });
        
        content.querySelector('.shop-leave-btn').addEventListener('click', () => {
            this.shopPopup.classList.add('hidden');
            this.completeCurrentRoom();
        });
        
        this.shopPopup.classList.remove('hidden');
    }
    
    showShopFallback(inventory) {
        this.showMessage("🛒 Shop: Items available! (Shop UI coming soon)");
        this.completeCurrentRoom();
    }
    
    buyShopItem(inventory, index) {
        const item = inventory[index];
        if (!item || this.money < item.cost) {
            this.showMessage("You can't afford that!");
            return;
        }
        
        this.money -= item.cost;
        
        switch (item.type) {
            case 'heal':
                this.money += item.value;
                this.showMessage(`${item.icon} Restored $${item.value}!`, 'win');
                break;
            case 'perk':
                this.addPerk(item);
                break;
            case 'removeCurse':
                this.grantReward({ type: 'removeCurse', value: 1 });
                break;
            case 'randomPerk':
                this.grantReward({ type: 'perk', value: 'random' });
                break;
            case 'randomRelic':
                this.grantReward({ type: 'relic', value: 'random' });
                break;
            case 'extraLife':
                this.extraLives++;
                this.showMessage("🔥 Phoenix Down acquired! You can revive once.", 'win');
                break;
        }
        
        // Remove bought item
        inventory.splice(index, 1);
        
        // Refresh shop display
        this.showShop(inventory);
    }
    
    // === PRE-ROUND SHOP ===
    
    showPreRoundShop() {
        if (!this.preRoundShopPopup) return;
        
        // Update money display
        if (this.preRoundShopMoney) {
            this.preRoundShopMoney.textContent = `$${this.money}`;
        }
        
        // Generate shop items - perks available for purchase
        this.renderPreRoundShopItems();
        
        // Show active perks
        this.renderActivePerksInShop();
        
        this.preRoundShopPopup.classList.remove('hidden');
    }
    
    hidePreRoundShop() {
        if (this.preRoundShopPopup) {
            this.preRoundShopPopup.classList.add('hidden');
        }
    }
    
    refreshShopInventory() {
        // Get perks the player doesn't own yet
        const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
        
        // Shuffle and pick 3 random perks
        const shuffled = availablePerks.sort(() => Math.random() - 0.5);
        this.shopInventory = shuffled.slice(0, 3);
    }
    
    renderPreRoundShopItems() {
        if (!this.preRoundShopItems) return;
        
        // If shop inventory is empty or all items are owned, refresh it
        if (this.shopInventory.length === 0 || this.shopInventory.every(p => this.hasPerk(p.id))) {
            this.refreshShopInventory();
        }
        
        // Build display from current shop inventory
        const shopPerks = this.shopInventory.map(perk => ({
            ...perk,
            owned: this.hasPerk(perk.id),
            affordable: this.money >= perk.cost
        }));
        
        // If no perks available (player owns all), show message
        if (shopPerks.length === 0) {
            this.preRoundShopItems.innerHTML = '<div class="shop-empty">You own all available perks!</div>';
            return;
        }
        
        this.preRoundShopItems.innerHTML = shopPerks.map(perk => `
            <button class="perk-shop-item ${!perk.affordable && !perk.owned ? 'unaffordable' : ''} ${perk.owned ? 'owned' : ''}" 
                 data-perk-id="${perk.id}" data-cost="${perk.cost}" ${perk.owned ? 'disabled' : ''}>
                <div class="perk-icon">${perk.icon}</div>
                <div class="perk-name">${perk.name}</div>
                <div class="perk-desc">${perk.desc}</div>
                <div class="perk-cost">${perk.owned ? '✓ OWNED' : '$' + perk.cost}</div>
            </button>
        `).join('');
        
        // Add click handlers
        this.preRoundShopItems.querySelectorAll('.perk-shop-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const perkId = e.currentTarget.dataset.perkId;
                this.buyPerkFromShop(perkId);
            });
        });
    }
    
    buyPerkFromShop(perkId) {
        const perk = this.allPerks.find(p => p.id === perkId);
        if (!perk) return;
        
        // Check if already owned
        if (this.hasPerk(perkId)) {
            this.showMessage("You already own this perk!", 'lose');
            return;
        }
        
        // Check if can afford
        if (this.money < perk.cost) {
            this.showMessage(`Not enough money! Need $${perk.cost}`, 'lose');
            return;
        }
        
        // Purchase the perk
        this.money -= perk.cost;
        this.addPerk(perk);
        
        // Play sound and show message
        if (typeof playWinSound === 'function') playWinSound();
        this.showMessage(`${perk.icon} Purchased ${perk.name}!`, 'win');
        
        // Refresh displays
        this.updateDisplay();
        this.renderPreRoundShopItems();
        this.renderActivePerksInShop();
        
        if (this.preRoundShopMoney) {
            this.preRoundShopMoney.textContent = `$${this.money}`;
        }
    }
    
    renderActivePerksInShop() {
        if (!this.shopActivePerksListEl) return;
        
        if (this.activePerks.length === 0) {
            this.shopActivePerksListEl.innerHTML = '<span style="color: #666;">None yet... buy some perks!</span>';
            return;
        }
        
        this.shopActivePerksListEl.innerHTML = this.activePerks.map(perk => `
            <span class="active-perk-badge" title="${perk.desc}">${perk.icon} ${perk.name}</span>
        `).join('');
    }
    
    // === REST SITE ===
    
    showRestSite(options) {
        // Show rest options in message area for now
        const optionText = options.map(o => `${o.icon} ${o.name}`).join(' | ');
        this.showMessage(`🏕️ Rest Site: ${optionText}<br><small>Choose wisely...</small>`);
        
        // For now, just heal
        this.money += 150;
        this.showMessage("😴 You rest and recover $150.", 'win');
        this.updateDisplay();
        this.completeCurrentRoom();
    }
    
    // === TREASURE ===
    
    openTreasure(treasure) {
        this.showMessage("📦 Opening treasure chest...");
        
        setTimeout(() => {
            if (treasure.type === 'curse') {
                this.addRandomCurse();
                this.showMessage("💀 It was a mimic! Cursed!", 'lose');
            } else if (treasure.type === 'nothing') {
                this.showMessage("📦 The chest was empty...");
            } else {
                this.grantReward(treasure);
            }
            this.completeCurrentRoom();
        }, 1000);
    }
    
    // === GAMBLE ROOM ===
    
    showGambleRoom(game) {
        this.showMessage(`🎰 ${game.name}: ${game.desc}<br>Place your bet to play!`);
        this.pendingGamble = game;
        this.resetForNewRound();
    }
    
    handleGambleReward(gameType) {
        switch (gameType) {
            case 'highCard':
                // Draw two cards, higher wins
                const playerCard = Math.floor(Math.random() * 13) + 1;
                const dealerCard = Math.floor(Math.random() * 13) + 1;
                if (playerCard > dealerCard) {
                    this.money += 200;
                    this.showMessage(`🎴 You drew ${playerCard}, dealer drew ${dealerCard}. You win $200!`, 'win');
                } else {
                    this.showMessage(`🎴 You drew ${playerCard}, dealer drew ${dealerCard}. You lose!`, 'lose');
                }
                break;
            case 'easyWin':
                // 80% win chance
                if (Math.random() < 0.8) {
                    this.money += 300;
                    this.showMessage("🍺 The drunk loses! You win $300!", 'win');
                } else {
                    this.showMessage("🍺 Somehow the drunk won...", 'lose');
                }
                break;
        }
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
    
    updateDeckDisplay() {
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

    // === PERK/RELIC/CURSE MANAGEMENT ===
    
    hasPerk(perkId) {
        return this.activePerks.some(p => p.id === perkId);
    }

    getPerk(perkId) {
        return this.activePerks.find(p => p.id === perkId);
    }
    
    addPerk(perk) {
        const newPerk = { ...perk };
        if (newPerk.maxUses) {
            newPerk.uses = newPerk.maxUses;
        }
        this.activePerks.push(newPerk);
        this.updateRoguelikeDisplay();
    }
    
    removeRandomPerk() {
        if (this.activePerks.length > 0) {
            const index = Math.floor(Math.random() * this.activePerks.length);
            const removed = this.activePerks.splice(index, 1)[0];
            this.showMessage(`Lost perk: ${removed.icon} ${removed.name}`, 'lose');
        }
    }
    
    hasRelic(relicId) {
        return this.activeRelics.some(r => r.id === relicId);
    }
    
    getRelic(relicId) {
        return this.activeRelics.find(r => r.id === relicId);
    }
    
    addRelic(relic) {
        const newRelic = { ...relic };
        if (newRelic.maxUses) {
            newRelic.uses = newRelic.maxUses;
        }
        this.activeRelics.push(newRelic);
        this.updateRoguelikeDisplay();
    }
    
    hasCurse(curseId) {
        return this.activeCurses.some(c => c.id === curseId);
    }
    
    addRandomCurse() {
        const availableCurses = this.allCurses.filter(c => !this.hasCurse(c.id));
        if (availableCurses.length > 0) {
            const curse = availableCurses[Math.floor(Math.random() * availableCurses.length)];
            this.activeCurses.push({ ...curse });
            this.showMessage(`💀 Cursed: ${curse.icon} ${curse.name} - ${curse.desc}`, 'lose');
            this.updateRoguelikeDisplay();
        }
    }
    
    // === SIDE BET PERKS ===
    
    hasSideBetPerk(perkId) {
        return this.sideBetStats.unlockedPerks.includes(perkId);
    }
    
    checkSideBetMilestones() {
        const milestones = CONFIG.SIDE_BET_MILESTONES;
        if (!milestones || !this.allSideBetPerks) return;
        
        for (const perk of this.allSideBetPerks) {
            // Skip already unlocked
            if (this.hasSideBetPerk(perk.id)) continue;
            
            let shouldUnlock = false;
            
            if (perk.milestone === 'wins' && this.sideBetStats.totalWins >= perk.threshold) {
                shouldUnlock = true;
            } else if (perk.milestone === 'earnings' && this.sideBetStats.totalEarnings >= perk.threshold) {
                shouldUnlock = true;
            }
            
            if (shouldUnlock) {
                this.sideBetStats.unlockedPerks.push(perk.id);
                this.showSideBetPerkUnlock(perk);
            }
        }
    }
    
    showSideBetPerkUnlock(perk) {
        // Show unlock notification
        const popup = document.createElement('div');
        popup.className = 'side-bet-perk-unlock';
        popup.innerHTML = `
            <div class="perk-unlock-title">🎰 SIDE BET PERK UNLOCKED!</div>
            <div class="perk-unlock-icon">${perk.icon}</div>
            <div class="perk-unlock-name">${perk.name}</div>
            <div class="perk-unlock-desc">${perk.desc}</div>
            <div class="perk-unlock-milestone">${perk.milestone === 'wins' ? `${perk.threshold} Side Bet Wins` : `$${perk.threshold} Earnings`}</div>
        `;
        document.body.appendChild(popup);
        
        // Play sound
        if (typeof playWinSound === 'function') playWinSound();
        
        // Remove after delay
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
        
        // Update display
        this.updateRoguelikeDisplay();
    }
    
    getMinBet() {
        let minBet = CONFIG.MIN_BET_PER_FLOOR[this.currentFloor - 1] || 10;
        
        // Elite modifiers
        if (this.isEliteFight && this.currentElite?.ability === 'minBet') {
            minBet = Math.max(minBet, this.currentElite.value);
        }
        
        return minBet;
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

        const amount = btn.dataset.amount;
        let bet;

        if (amount === 'all') {
            bet = this.money;
        } else {
            bet = parseInt(amount);
        }

        const minBet = this.getMinBet();
        if (bet < minBet) {
            this.showMessage(`Minimum bet on Floor ${this.currentFloor}: $${minBet}`);
            return;
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
        if (this.lastBet <= 0) return;

        const minBet = this.getMinBet();
        let betAmount = Math.max(this.lastBet, minBet);

        if (betAmount > this.money) {
            if (this.money > 0) {
                this.currentBet = this.money;
                this.showMessage(`Can't afford $${betAmount}, going all in with $${this.money}! 💸`);
            } else {
                this.showMessage("You're broke! No rebet for you!");
                return;
            }
        } else {
            this.currentBet = betAmount;
        }

        this.currentBetDisplay.textContent = `$${this.currentBet}`;
        this.deal();
    }

    // === GAME ACTIONS ===

    async deal() {
        // Lucky Start perk: free $10 side bet each hand (randomly PP or 21+3)
        if (this.hasSideBetPerk('luckyStart')) {
            if (this.sideBetPP === 0 && this.sideBet21Plus3 === 0) {
                // Add free side bet if player hasn't placed any
                if (Math.random() < 0.5) {
                    this.sideBetPP = 10;
                    this.showMessage("🌟 Lucky Start: Free $10 Perfect Pairs bet!");
                } else {
                    this.sideBet21Plus3 = 10;
                    this.showMessage("🌟 Lucky Start: Free $10 21+3 bet!");
                }
                this.updateSideBetsDisplay();
            }
        }
        
        // Calculate total bet including side bets
        let totalSideBets = this.sideBetPP + this.sideBet21Plus3;
        
        // Side Insurance perk: 20% off side bets
        let sideBetDiscount = 0;
        if (this.hasSideBetPerk('sideInsurance') && totalSideBets > 0) {
            sideBetDiscount = Math.floor(totalSideBets * 0.2);
            totalSideBets -= sideBetDiscount;
        }
        
        const totalRequired = this.currentBet + totalSideBets;
        
        if (this.currentBet <= 0 || totalRequired > this.money) return;

        // Apply per-hand costs (curses)
        if (this.hasCurse('heavyDebt')) {
            const cost = 25;
            this.money -= cost;
            this.showMessage(`💸 Heavy Debt: -$${cost}`);
            this.updateDisplay();
        }
        
        // Zen Mind perk: gain money at start of hand
        if (this.hasPerk('meditation')) {
            this.money += 30;
            this.showMessage("🧘 Zen Mind: +$30");
            this.updateDisplay();
        }

        await this.checkAndReshuffle();

        this.lastBet = this.currentBet;
        this.lastSideBetPP = this.sideBetPP;
        this.lastSideBet21Plus3 = this.sideBet21Plus3;
        
        // Deduct main bet and side bets (with discount applied)
        this.money -= this.currentBet;
        this.money -= totalSideBets;
        if (sideBetDiscount > 0) {
            this.showMessage(`🛟 Side Insurance: Saved $${sideBetDiscount}!`);
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
        
        // Normal deal: 2 cards each
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());
        
        // Boss: Satan starts with 3 cards
        if (this.isBossFight && this.currentBoss?.dealerCards === 3) {
            this.dealerHand.push(this.drawCard());
        }

        await this.animateDeal();

        // Evaluate side bets immediately after deal
        if (this.sideBetPP > 0 || this.sideBet21Plus3 > 0) {
            await this.evaluateSideBets();
        }

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
        
        // Check if split is possible
        if (this.splitBtn) {
            this.splitBtn.disabled = !this.canSplit();
        }
        
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
        
        // Extra card for 3-card dealer
        if (this.dealerHand.length > 2) {
            playCardDealSound();
            this.dealerHandEl.appendChild(this.createCardElement(this.dealerHand[2], true));
            await this.delay(250);
        }

        this.updateScores(true);
    }

    async hit() {
        if (!this.gameInProgress) return;

        this.doubleBtn.disabled = true;
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        const card = this.drawCard();
        
        // Handle split hands
        if (this.isSplit) {
            this.splitHands[this.currentSplitHand].push(card);
            playCardDealSound();
            this.renderSplitHands(this.currentSplitHand); // Only animate the current hand
            
            const score = this.calculateScore(this.splitHands[this.currentSplitHand], true);
            
            if (score > 21) {
                this.showMessage(`Hand ${this.currentSplitHand + 1} BUSTS at ${score}! 💥`, 'lose');
                await this.delay(400);
                await this.handleSplitHandComplete(false);
            } else if (score === 21) {
                this.showMessage(`Hand ${this.currentSplitHand + 1} hits 21!`);
                await this.delay(400);
                await this.handleSplitHandComplete(true);
            }
            return;
        }
        
        // Normal (non-split) hand
        this.playerHand.push(card);
        
        // Boss: Countess hits cost money
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

        // Quick Draw perk: first hit can't bust
        const isFirstHit = this.playerHand.length === 3;
        if (score > 21 && isFirstHit && this.hasPerk('quickDraw')) {
            this.playerHand.pop();
            this.playerHandEl.removeChild(cardEl);
            this.updateScores(true);
            this.showMessage("⚡ Quick Draw saved you from busting!");
            return;
        }

        if (score > 21) {
            // Shield perk
            const shield = this.getPerk('shield');
            if (shield && shield.uses > 0) {
                shield.uses--;
                this.playerHand.pop();
                this.playerHandEl.removeChild(cardEl);
                this.updateScores(true);
                this.updateRoguelikeDisplay();
                this.showMessage("🛡️ Soul Shield saved you from busting!", 'win');
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
            this.stand();
        }
    }

    async double() {
        if (!this.gameInProgress || this.money < this.currentBet) return;
        
        // Can't double after split (only on first two cards)
        if (this.isSplit) {
            const currentHand = this.splitHands[this.currentSplitHand];
            if (currentHand.length > 2) return;
        }

        // Double Agent perk: costs only 50%
        const doubleCost = this.hasPerk('doubleDown') ? Math.floor(this.currentBet * 0.5) : this.currentBet;
        
        this.money -= doubleCost;
        
        if (this.isSplit) {
            this.splitBets[this.currentSplitHand] += doubleCost;
        } else {
            this.currentBet += doubleCost;
            this.currentBetDisplay.textContent = `$${this.currentBet}`;
        }
        this.updateDisplay();

        this.showMessage("Doubling down? Bold move, cotton. 💀");

        const card = this.drawCard();
        
        if (this.isSplit) {
            this.splitHands[this.currentSplitHand].push(card);
            this.renderSplitHands(this.currentSplitHand); // Only animate the current hand
        } else {
            this.playerHand.push(card);
            this.playerHandEl.appendChild(this.createCardElement(card));
        }
        
        await this.delay(400);
        
        const hand = this.isSplit ? this.splitHands[this.currentSplitHand] : this.playerHand;
        const score = this.calculateScore(hand, true);
        this.updateScores(true);

        if (score > 21) {
            if (!this.isSplit) {
                const cardEl = this.playerHandEl.lastChild;
                cardEl.classList.add('rigged');
            }
            playLoseSound();
            this.showMessage(this.getRandomMessage(this.bustMessages) + " (2x pain!)", 'lose');
            
            if (this.isSplit) {
                await this.handleSplitHandComplete(false);
            } else {
                await this.revealDealerCard();
                const dealerScore = this.calculateScore(this.dealerHand);
                this.addToHistory(score, dealerScore, 'loss');
                this.endRound(false);
            }
        } else {
            await this.stand();
        }
    }

    // Check if player can split their hand
    canSplit() {
        if (this.isSplit) return false; // Already split
        if (this.playerHand.length !== 2) return false; // Must have exactly 2 cards
        if (this.money < this.currentBet) return false; // Need enough money for second bet
        
        // Check if both cards have the same value
        const card1Value = this.getCardValue(this.playerHand[0], 0);
        const card2Value = this.getCardValue(this.playerHand[1], 0);
        
        // For face cards, they all count as 10, so K-K, K-Q, etc. can split
        // Aces can always split with aces
        return card1Value === card2Value;
    }

    async split() {
        if (!this.gameInProgress || !this.canSplit()) return;

        this.showMessage("✂️ Splitting your hand! Double the risk, double the fun!");
        
        // Deduct bet for second hand
        this.money -= this.currentBet;
        this.updateDisplay();

        // Set up split state
        this.isSplit = true;
        this.splitHands = [
            [this.playerHand[0]], // First hand gets first card
            [this.playerHand[1]]  // Second hand gets second card
        ];
        this.splitBets = [this.currentBet, this.currentBet];
        this.currentSplitHand = 0;

        // Deal one card to each split hand
        await this.delay(300);
        this.splitHands[0].push(this.drawCard());
        playCardDealSound();
        this.renderSplitHands(0); // Animate first hand
        
        await this.delay(300);
        this.splitHands[1].push(this.drawCard());
        playCardDealSound();
        this.renderSplitHands(1); // Animate second hand

        // Disable split button (can't split again)
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        // Check if first hand is 21 (auto-stand)
        const firstScore = this.calculateScore(this.splitHands[0], true);
        if (firstScore === 21) {
            this.showMessage("21 on first hand! Moving to second hand...");
            await this.delay(500);
            await this.handleSplitHandComplete(true);
        } else {
            this.showMessage(`Playing Hand 1 (${firstScore}). Hit or Stand?`);
            this.updateSplitHandHighlight();
        }
    }

    renderSplitHands(animateHandIndex = -1) {
        // Clear player hand area and show split hands
        this.playerHandEl.innerHTML = '';
        this.playerHandEl.classList.add('split-hands-container');

        for (let i = 0; i < this.splitHands.length; i++) {
            const hand = this.splitHands[i];
            const handDiv = document.createElement('div');
            handDiv.className = 'split-hand';
            handDiv.id = `split-hand-${i}`;
            
            if (i === this.currentSplitHand && this.gameInProgress) {
                handDiv.classList.add('active');
            }

            const label = document.createElement('div');
            label.className = 'split-hand-label';
            label.textContent = `Hand ${i + 1} ($${this.splitBets[i]})`;
            handDiv.appendChild(label);

            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'split-hand-cards';
            
            for (let cardIndex = 0; cardIndex < hand.length; cardIndex++) {
                const card = hand[cardIndex];
                const cardEl = this.createCardElement(card);
                
                // Only animate the last card of the hand that just received a new card
                const isNewCard = (i === animateHandIndex && cardIndex === hand.length - 1);
                if (!isNewCard) {
                    cardEl.classList.remove('dealing');
                }
                
                cardsDiv.appendChild(cardEl);
            }
            handDiv.appendChild(cardsDiv);

            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'split-hand-score';
            const score = this.calculateScore(hand, true);
            scoreDiv.textContent = `Score: ${score}`;
            if (score > 21) {
                scoreDiv.style.color = '#ff4444';
                scoreDiv.textContent = `BUST (${score})`;
            }
            handDiv.appendChild(scoreDiv);

            this.playerHandEl.appendChild(handDiv);
        }

        this.updateScores(true);
    }

    updateSplitHandHighlight() {
        for (let i = 0; i < this.splitHands.length; i++) {
            const handEl = document.getElementById(`split-hand-${i}`);
            if (handEl) {
                handEl.classList.toggle('active', i === this.currentSplitHand);
            }
        }
    }

    async handleSplitHandComplete(wasSuccessful) {
        // Mark current hand as complete
        const currentHandEl = document.getElementById(`split-hand-${this.currentSplitHand}`);
        if (currentHandEl) {
            currentHandEl.classList.remove('active');
            currentHandEl.classList.add('completed');
        }

        // Move to next hand
        this.currentSplitHand++;

        if (this.currentSplitHand < this.splitHands.length) {
            // More hands to play
            await this.delay(500);
            this.updateSplitHandHighlight();
            
            const nextScore = this.calculateScore(this.splitHands[this.currentSplitHand], true);
            if (nextScore === 21) {
                this.showMessage(`Hand ${this.currentSplitHand + 1} is 21! Auto-stand.`);
                await this.delay(500);
                await this.handleSplitHandComplete(true);
            } else {
                this.showMessage(`Playing Hand ${this.currentSplitHand + 1} (${nextScore}). Hit or Stand?`);
                // Re-enable buttons for new hand
                this.hitBtn.disabled = false;
                this.standBtn.disabled = false;
                // Can double on split hand if it has 2 cards and enough money
                const canDoubleOnSplit = this.splitHands[this.currentSplitHand].length === 2 && 
                                         this.money >= this.splitBets[this.currentSplitHand];
                this.doubleBtn.disabled = !canDoubleOnSplit;
            }
        } else {
            // All hands complete, resolve against dealer
            await this.resolveSplitRound();
        }
    }

    async resolveSplitRound() {
        await this.revealDealerCard();
        
        let dealerScore = this.calculateScore(this.dealerHand);
        let standThreshold = 17;
        
        // Boss modifiers
        if (this.isBossFight && this.currentBoss?.dealerStandsOn) {
            standThreshold = this.currentBoss.dealerStandsOn;
        }
        if (this.isBossFight && this.currentBoss?.dealerHitsSoft17) {
            const hasAce = this.dealerHand.some(c => c.value === 'A');
            if (dealerScore === 17 && hasAce) {
                standThreshold = 18;
            }
        }

        // Dealer draws
        while (dealerScore < standThreshold) {
            this.showMessage(`Dealer hits on ${dealerScore}...`);
            await this.delay(500);

            const card = this.drawCard();
            this.dealerHand.push(card);
            playCardDealSound();
            this.dealerHandEl.appendChild(this.createCardElement(card));
            this.updateScores();
            await this.delay(500);
            
            dealerScore = this.calculateScore(this.dealerHand);
            if (dealerScore >= standThreshold && dealerScore <= 21) {
                this.showMessage(`Dealer stands on ${dealerScore}. 🛑`);
                await this.delay(400);
                break;
            } else if (dealerScore > 21) {
                this.showMessage(`Dealer BUSTS at ${dealerScore}! 💥`);
                await this.delay(400);
                break;
            }
        }

        // Resolve each split hand
        let totalWinnings = 0;
        let totalLosses = 0;
        let resultsMessage = '';

        for (let i = 0; i < this.splitHands.length; i++) {
            const hand = this.splitHands[i];
            const bet = this.splitBets[i];
            const playerScore = this.calculateScore(hand, true);
            
            let result;
            if (playerScore > 21) {
                // Already busted
                result = 'loss';
                totalLosses += bet;
            } else if (dealerScore > 21) {
                // Dealer busted, player wins
                result = 'win';
                totalWinnings += bet * 2;
            } else if (playerScore > dealerScore) {
                result = 'win';
                totalWinnings += bet * 2;
            } else if (playerScore < dealerScore) {
                result = 'loss';
                totalLosses += bet;
            } else {
                result = 'push';
                totalWinnings += bet; // Return bet
            }

            resultsMessage += `Hand ${i + 1}: ${result.toUpperCase()} (${playerScore} vs ${dealerScore}) `;
            this.addToHistory(playerScore, dealerScore, result);
        }

        // Update money
        this.money += totalWinnings;
        this.updateDisplay();

        // Show results
        const netResult = totalWinnings - (this.splitBets[0] + this.splitBets[1]);
        if (netResult > 0) {
            playWinSound();
            this.showMessage(`✂️ Split Results: +$${netResult}! ${resultsMessage}`, 'win');
            this.endRound(true);
        } else if (netResult < 0) {
            playLoseSound();
            this.showMessage(`✂️ Split Results: -$${Math.abs(netResult)}. ${resultsMessage}`, 'lose');
            this.endRound(false);
        } else {
            playChipSound();
            this.showMessage(`✂️ Split Results: Break even. ${resultsMessage}`);
            this.endRound(null);
        }
    }

    // === SIDE BETS ===
    
    placeSideBet(btn) {
        if (this.gameInProgress) return;
        
        const type = btn.dataset.type;
        const amount = parseInt(btn.dataset.amount);
        
        // Deselect other buttons of the same type
        const container = type === 'pp' ? document.getElementById('pp-buttons') : document.getElementById('21plus3-buttons');
        container.querySelectorAll('.side-bet-btn').forEach(b => b.classList.remove('active'));
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
        const total = this.sideBetPP + this.sideBet21Plus3;
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
        
        // Check if values match (for face cards and 10s, they must be exact match)
        const value1 = card1.value;
        const value2 = card2.value;
        
        if (value1 !== value2) return null;
        
        // Perfect Pair - same suit
        if (card1.suit === card2.suit) {
            return {
                type: 'perfectPair',
                name: 'PERFECT PAIR',
                emoji: '👯',
                payout: this.sideBetPayouts.perfectPair
            };
        }
        
        // Colored Pair - same color (both red or both black)
        const redSuits = ['♥', '♦'];
        const isCard1Red = redSuits.includes(card1.suit);
        const isCard2Red = redSuits.includes(card2.suit);
        
        if (isCard1Red === isCard2Red) {
            return {
                type: 'coloredPair',
                name: 'COLORED PAIR',
                emoji: '🎨',
                payout: this.sideBetPayouts.coloredPair
            };
        }
        
        // Mixed Pair - different colors
        return {
            type: 'mixedPair',
            name: 'MIXED PAIR',
            emoji: '👫',
            payout: this.sideBetPayouts.mixedPair
        };
    }
    
    check21Plus3(playerHand, dealerHand) {
        if (playerHand.length < 2 || dealerHand.length < 1) return null;
        
        const cards = [playerHand[0], playerHand[1], dealerHand[0]];
        
        // Get numeric values for straight checking
        const valueOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const values = cards.map(c => valueOrder.indexOf(c.value));
        const suits = cards.map(c => c.suit);
        
        // Check conditions
        const allSameSuit = suits[0] === suits[1] && suits[1] === suits[2];
        const allSameValue = cards[0].value === cards[1].value && cards[1].value === cards[2].value;
        
        // Check for straight
        const sortedValues = [...values].sort((a, b) => a - b);
        const isSequential = (sortedValues[2] - sortedValues[1] === 1 && sortedValues[1] - sortedValues[0] === 1);
        // Special case: A-2-3 or Q-K-A
        const isLowStraight = sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2;
        const isHighStraight = sortedValues[0] === 0 && sortedValues[1] === 11 && sortedValues[2] === 12;
        const isStraight = isSequential || isLowStraight || isHighStraight;
        
        // Suited Trips - three of a kind, same suit
        if (allSameValue && allSameSuit) {
            return {
                type: 'suitedTrips',
                name: 'SUITED TRIPS',
                emoji: '🔥',
                payout: this.sideBetPayouts.suitedTrips
            };
        }
        
        // Straight Flush
        if (isStraight && allSameSuit) {
            return {
                type: 'straightFlush',
                name: 'STRAIGHT FLUSH',
                emoji: '🌟',
                payout: this.sideBetPayouts.straightFlush
            };
        }
        
        // Three of a Kind
        if (allSameValue) {
            return {
                type: 'threeOfAKind',
                name: 'THREE OF A KIND',
                emoji: '🎰',
                payout: this.sideBetPayouts.threeOfAKind
            };
        }
        
        // Straight
        if (isStraight) {
            return {
                type: 'straight',
                name: 'STRAIGHT',
                emoji: '📈',
                payout: this.sideBetPayouts.straight
            };
        }
        
        // Flush
        if (allSameSuit) {
            return {
                type: 'flush',
                name: 'FLUSH',
                emoji: '💎',
                payout: this.sideBetPayouts.flush
            };
        }
        
        return null;
    }
    
    async evaluateSideBets() {
        const results = [];
        let totalWinnings = 0;
        let anySideBetWon = false;
        
        // Calculate side bet bonuses from perks
        let ppBonus = 1.0;
        let plus3Bonus = 1.0;
        
        if (this.hasSideBetPerk('pairHunter')) ppBonus += 0.25;
        if (this.hasSideBetPerk('pokerFace')) plus3Bonus += 0.25;
        if (this.hasSideBetPerk('sideMaster')) {
            ppBonus += 0.50;
            plus3Bonus += 0.50;
        }
        if (this.hasSideBetPerk('doubleDown21')) {
            // Extra bonus for straight flush handled below
        }
        
        // Perfect Streak bonus
        const streakBonus = this.hasSideBetPerk('perfectStreak') ? 
            1 + (this.sideBetStats.currentStreak * 0.10) : 1;
        
        // Check Perfect Pairs
        if (this.sideBetPP > 0) {
            const ppResult = this.checkPerfectPairs(this.playerHand);
            if (ppResult) {
                let winnings = this.sideBetPP * ppResult.payout * ppBonus * streakBonus;
                winnings = Math.floor(winnings);
                totalWinnings += winnings;
                anySideBetWon = true;
                results.push({
                    bet: 'Perfect Pairs',
                    result: ppResult,
                    wagered: this.sideBetPP,
                    won: winnings
                });
            } else {
                results.push({
                    bet: 'Perfect Pairs',
                    result: null,
                    wagered: this.sideBetPP,
                    won: 0
                });
            }
        }
        
        // Check 21+3
        if (this.sideBet21Plus3 > 0) {
            const plus3Result = this.check21Plus3(this.playerHand, this.dealerHand);
            if (plus3Result) {
                let multiplier = plus3Bonus * streakBonus;
                // Extra bonus for straight flush with doubleDown21 perk
                if (this.hasSideBetPerk('doubleDown21') && plus3Result.name === 'Straight Flush') {
                    multiplier *= 3;
                }
                let winnings = this.sideBet21Plus3 * plus3Result.payout * multiplier;
                winnings = Math.floor(winnings);
                totalWinnings += winnings;
                anySideBetWon = true;
                results.push({
                    bet: '21+3',
                    result: plus3Result,
                    wagered: this.sideBet21Plus3,
                    won: winnings
                });
            } else {
                results.push({
                    bet: '21+3',
                    result: null,
                    wagered: this.sideBet21Plus3,
                    won: 0
                });
            }
        }
        
        // Side Insurance perk: refund 25% of lost side bets
        if (this.hasSideBetPerk('sideShow') && !anySideBetWon) {
            if (Math.random() < 0.25) {
                const refund = Math.floor((this.sideBetPP + this.sideBet21Plus3) * 1);
                totalWinnings += refund;
                this.showMessage(`🎪 Side Show: Side bet refunded! +$${refund}`, 'win');
            }
        }
        
        // Update side bet stats
        if (anySideBetWon) {
            this.sideBetStats.totalWins++;
            this.sideBetStats.totalEarnings += totalWinnings;
            this.sideBetStats.currentStreak++;
            
            // Check for milestone unlocks
            this.checkSideBetMilestones();
        } else if (this.sideBetPP > 0 || this.sideBet21Plus3 > 0) {
            // Had side bets but lost them all
            this.sideBetStats.currentStreak = 0;
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
                // Winner! Show popup
                const popup = document.createElement('div');
                popup.className = 'side-bet-result win';
                popup.innerHTML = `
                    <div class="side-bet-result-title">${result.result.emoji} ${result.bet} WINS!</div>
                    <div class="side-bet-result-detail">${result.result.name} (${result.result.payout}:1)</div>
                    <div class="side-bet-result-payout">+$${result.won}</div>
                `;
                document.body.appendChild(popup);
                playWinSound();
                
                await this.delay(1500);
                popup.remove();
            }
            // No popup for losses - silently deducted
        }
    }

    async stand() {
        if (!this.gameInProgress) return;

        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.doubleBtn.disabled = true;

        // Handle split hands
        if (this.isSplit) {
            const score = this.calculateScore(this.splitHands[this.currentSplitHand], true);
            this.showMessage(`Hand ${this.currentSplitHand + 1} stands on ${score}.`);
            await this.delay(400);
            await this.handleSplitHandComplete(true);
            return;
        }

        await this.revealDealerCard();
        
        let dealerScore = this.calculateScore(this.dealerHand);
        let standThreshold = 17;
        
        // Boss modifiers
        if (this.isBossFight && this.currentBoss?.dealerStandsOn) {
            standThreshold = this.currentBoss.dealerStandsOn;
        }
        if (this.isBossFight && this.currentBoss?.dealerHitsSoft17) {
            // Dealer hits on soft 17
            const hasSoft17 = this.dealerHand.some(c => c.value === 'A') && dealerScore === 17;
            if (hasSoft17) standThreshold = 18;
        }
        
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

        // Golden Horseshoe relic: pushes become wins
        const pushIsWin = this.hasRelic('goldenHorseshoe');

        if (dealerScore > 21) {
            playWinSound();
            this.showMessage(this.getRandomMessage(this.winMessages), 'win');
            
            // Pickpocket perk
            if (this.hasPerk('thief')) {
                this.money += 75;
                this.showMessage("🤏 Pickpocket: +$75!");
            }
            
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
            // Push
            if (pushIsWin) {
                playWinSound();
                this.showMessage("🧲 Golden Horseshoe turns the push into a WIN!", 'win');
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
    }

    async revealDealerCard() {
        const faceDownCards = this.dealerHandEl.querySelectorAll('.face-down');
        
        for (let i = 0; i < faceDownCards.length; i++) {
            const faceDownCard = faceDownCards[i];
            playCardFlipSound();
            faceDownCard.classList.remove('face-down');
            const card = this.dealerHand[i + 1]; // +1 because first card is already shown
            const isRed = ['♥', '♦'].includes(card.suit);
            faceDownCard.classList.add(isRed ? 'red' : 'black');
            faceDownCard.classList.add('rigged');
            faceDownCard.innerHTML = `
                <div class="card-corner">${card.value}${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div class="card-corner bottom">${card.value}${card.suit}</div>
            `;
            await this.delay(200);
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
            
            // Greed perk: Blackjack pays 3x
            if (isBlackjack && this.hasPerk('greed')) {
                payout = this.currentBet * 3;
            }
            
            // High Roller perk: 1.3x multiplier
            if (this.hasPerk('doubleOrNothing')) {
                payout *= 1.3;
            }
            
            // Vampiric perk: heal on win
            if (this.hasPerk('vampiric')) {
                this.money += 25;
            }
            
            // Devil's Dice relic: 10% double payout
            if (this.hasRelic('devilsDice') && Math.random() < 0.1) {
                payout *= 2;
                this.showMessage("🎲 Devil's Dice: DOUBLE PAYOUT!");
            }
            
            // Boss multipliers
            if (this.isBossFight && this.currentBoss?.multiplierWin) {
                payout = this.currentBet * this.currentBoss.multiplierWin;
            }
            
            // Elite multipliers
            if (this.isEliteFight && this.currentElite?.ability === 'compound') {
                payout = this.currentBet * this.currentElite.value;
            }
            
            // Curse: reduced win
            if (this.hasCurse('taxed')) {
                payout *= 0.8;
            }
            
            this.money += Math.floor(payout);
            this.winStreak++;
            this.totalWins++;
            this.runStats.handsWon++;
            this.runStats.moneyEarned += Math.floor(payout);
            
            // Check victory
            if (this.money >= this.escapeGoal) {
                this.showVictoryScreen();
                return;
            }
            
            // Handle boss/elite defeat
            if (this.isBossFight) {
                this.defeatBoss();
                return;
            }
            
            if (this.isEliteFight) {
                this.defeatElite();
                return;
            }
            
        } else if (playerWon === false) {
            this.timesLost++;
            this.winStreak = 0;
            this.runStats.handsLost++;
            this.runStats.moneyLost += this.currentBet;
            
            // Insurance perk
            if (this.hasPerk('insurance') && Math.random() < 0.3) {
                this.money += this.currentBet;
                this.showMessage("💰 Insurance Fraud activated! Bet returned!", 'win');
            }
            
            // Rabbit's Foot relic: first loss refunded
            const rabbitFoot = this.getRelic('rabbitFoot');
            if (rabbitFoot && rabbitFoot.uses > 0) {
                rabbitFoot.uses--;
                this.money += this.currentBet;
                this.showMessage("🐰 Rabbit's Foot: First loss refunded!", 'win');
            }
            
            // Boss loss multiplier
            if (this.isBossFight && this.currentBoss?.multiplierLose) {
                const extraLoss = this.currentBet * (this.currentBoss.multiplierLose - 1);
                this.money -= extraLoss;
            }
            
            // Elite compound loss
            if (this.isEliteFight && this.currentElite?.ability === 'compound') {
                const extraLoss = this.currentBet * (this.currentElite.value - 1);
                this.money -= extraLoss;
            }
            
            // Reset boss/elite fight on loss
            if (this.isBossFight) {
                this.isBossFight = false;
                this.currentBoss = null;
                this.tableEl.classList.remove('boss-mode');
            }
            if (this.isEliteFight) {
                this.isEliteFight = false;
                this.currentElite = null;
                this.tableEl.classList.remove('elite-mode');
            }
        }

        this.updateDisplay();
        this.updateRoguelikeDisplay();

        // Schedule next round or room progression
        setTimeout(() => {
            if (this.money <= 0) {
                this.handleBroke();
            } else {
                // Check for upgrade on win streak
                const winsNeeded = CONFIG.WINS_FOR_UPGRADE || 3;
                if (playerWon && this.winStreak >= winsNeeded && !this.isBossFight && !this.isEliteFight) {
                    this.showMessage(`🎉 ${winsNeeded} WIN STREAK! Pick an upgrade!`, 'win');
                    setTimeout(() => this.showUpgradeSelection(), 500);
                } else {
                    // Simple progression: reset for new round
                    this.resetForNewRound();
                }
            }
        }, 1500);
    }

    defeatBoss() {
        this.isBossFight = false;
        this.currentBoss = null;
        this.tableEl.classList.remove('boss-mode');
        this.floorsCleared++;
        this.runStats.bossesDefeated++;
        
        // Grant boss reward
        const boss = this.bosses[Math.min(this.currentFloor - 1, this.bosses.length - 1)];
        if (boss.reward) {
            this.showMessage(`🎉 BOSS DEFEATED! Reward incoming!`, 'win');
            setTimeout(() => this.grantReward(boss.reward), 1000);
        }
        
        // Move to next floor
        this.currentFloor++;
        this.currentRoom = 0;
        this.winStreak = 0;
        
        // Lucky Chip relic: bonus at floor start
        if (this.hasRelic('luckyChip')) {
            this.money += 100;
            this.showMessage("🪙 Lucky Chip: +$100 for the new floor!");
        }
        
        // Reset per-floor uses
        this.resetFloorUses();
        
        // Generate new floor
        if (this.currentFloor <= CONFIG.TOTAL_FLOORS) {
            this.roomsOnFloor = this.generateFloorRooms(this.currentFloor);
            const floorMsg = MESSAGES.newFloor[Math.floor(Math.random() * MESSAGES.newFloor.length)];
            setTimeout(() => {
                this.showMessage(floorMsg.replace('{floor}', this.currentFloor));
                this.updateRoguelikeDisplay();
                this.enterRoom(0);
            }, 2500);
        } else {
            // Beat the game!
            this.showVictoryScreen();
        }
    }
    
    defeatElite() {
        this.isEliteFight = false;
        this.runStats.elitesDefeated++;
        
        // Grant random reward
        const rewards = [
            { type: 'money', value: 150 + this.currentFloor * 50 },
            { type: 'relic', value: 'random' },
            { type: 'perk', value: 'random' }
        ];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        this.showMessage(`⚔️ ELITE DEFEATED! Reward incoming!`, 'win');
        setTimeout(() => {
            this.grantReward(reward);
            this.currentElite = null;
            this.tableEl.classList.remove('elite-mode');
            this.completeCurrentRoom();
        }, 1000);
    }
    
    resetFloorUses() {
        // Reset perk uses
        this.activePerks.forEach(perk => {
            if (perk.maxUses) {
                perk.uses = perk.maxUses;
            }
        });
        
        // Reset relic uses
        this.activeRelics.forEach(relic => {
            if (relic.maxUses) {
                relic.uses = relic.maxUses;
            }
        });
    }
    
    handleBroke() {
        // Phoenix Feather relic: revive once
        const phoenix = this.getRelic('phoenixFeather');
        if (phoenix && phoenix.uses > 0) {
            phoenix.uses--;
            this.money = 500;
            this.showMessage("🔥 Phoenix Feather revives you with $500!", 'win');
            this.updateDisplay();
            this.resetForNewRound();
            return;
        }
        
        // Extra lives from shop
        if (this.extraLives > 0) {
            this.extraLives--;
            this.money = 500;
            this.showMessage("🔥 Extra life used! Revived with $500!", 'win');
            this.updateDisplay();
            this.resetForNewRound();
            return;
        }
        
        this.showBrokeScreen();
    }

    // === ROGUELIKE METHODS ===

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
        this.addPerk(perk);
        this.upgradePopup.classList.add('hidden');
        this.winStreak = 0;
        this.updateRoguelikeDisplay();
        
        // Continue to next room
        this.completeCurrentRoom();
    }

    triggerBossFight() {
        const bossIndex = Math.min(this.currentFloor - 1, this.bosses.length - 1);
        const boss = this.bosses[bossIndex];
        
        if (!this.bossPopup || !this.bossPortraitEl || !this.bossNameEl || !this.bossDescEl || !this.bossRuleEl) {
            this.currentBoss = boss;
            this.startBossFight();
            return;
        }
        
        this.bossPortraitEl.textContent = boss.icon;
        this.bossNameEl.textContent = boss.name;
        this.bossDescEl.textContent = boss.desc;
        this.bossRuleEl.textContent = '⚠️ ' + boss.rule;
        
        this.bossPopup.classList.remove('hidden');
        this.currentBoss = boss;
    }

    startBossFight() {
        this.bossPopup.classList.add('hidden');
        this.isBossFight = true;
        this.tableEl.classList.add('boss-mode');
        
        this.showMessage(`⚔️ BOSS FIGHT: ${this.currentBoss.name}! ⚔️`, 'lose');
        this.resetForNewRound();
    }

    showVictoryScreen() {
        this.victoryStatsEl.innerHTML = `
            Floors Cleared: ${this.floorsCleared}<br>
            Hands Won: ${this.runStats.handsWon}<br>
            Final Fortune: $${this.money}<br>
            Perks: ${this.activePerks.length} | Relics: ${this.activeRelics.length}<br>
            Bosses Defeated: ${this.runStats.bossesDefeated}<br>
            Elites Defeated: ${this.runStats.elitesDefeated}
        `;
        this.victoryPopup.classList.remove('hidden');
    }

    updateRoguelikeDisplay() {
        if (this.currentFloorEl) this.currentFloorEl.textContent = this.currentFloor;
        if (this.winStreakEl) this.winStreakEl.textContent = this.winStreak;
        
        // Update room indicator
        this.updateRoomDisplay();
        
        // Update perks display
        if (this.activeUpgradesEl) {
            const hasPerks = this.activePerks.length > 0;
            const hasRelics = this.activeRelics.length > 0;
            const hasSideBetPerks = this.sideBetStats.unlockedPerks.length > 0;
            
            if (!hasPerks && !hasRelics && !hasSideBetPerks) {
                this.activeUpgradesEl.innerHTML = 'None yet...';
            } else {
                let html = '';
                
                // Regular Perks
                html += this.activePerks.map(p => 
                    `<span class="perk-badge">${p.icon} ${p.name}${p.maxUses ? ` (${p.uses})` : ''}</span>`
                ).join('');
                
                // Relics
                html += this.activeRelics.map(r => 
                    `<span class="perk-badge relic">${r.icon} ${r.name}${r.maxUses ? ` (${r.uses})` : ''}</span>`
                ).join('');
                
                // Side Bet Perks (permanent unlocks)
                if (hasSideBetPerks && this.allSideBetPerks) {
                    const unlockedSideBetPerks = this.allSideBetPerks.filter(p => 
                        this.sideBetStats.unlockedPerks.includes(p.id)
                    );
                    html += unlockedSideBetPerks.map(p => 
                        `<span class="perk-badge side-bet">${p.icon} ${p.name}</span>`
                    ).join('');
                }
                
                this.activeUpgradesEl.innerHTML = html;
            }
        }
        
        // Update curses display
        if (this.cursesDisplay && this.activeCurses.length > 0) {
            this.cursesDisplay.innerHTML = this.activeCurses.map(c => 
                `<span class="curse-badge">${c.icon} ${c.name}</span>`
            ).join('');
            this.cursesDisplay.classList.remove('hidden');
        } else if (this.cursesDisplay) {
            this.cursesDisplay.classList.add('hidden');
        }
    }
    
    updateRoomDisplay() {
        if (!this.roomIndicator) {
            return;
        }
        
        if (!this.roomsOnFloor || this.roomsOnFloor.length === 0) {
            return;
        }
        
        const roomIcons = {
            normal: '🃏',
            elite: '⚔️',
            event: '❓',
            shop: '🛒',
            rest: '🏕️',
            treasure: '📦',
            gamble: '🎰',
            boss: '👹'
        };
        
        let html = `<span class="floor-label">F${this.currentFloor}</span>`;
        
        this.roomsOnFloor.forEach((room, i) => {
            const isCurrent = i === this.currentRoom;
            const isCompleted = room.completed;
            const icon = roomIcons[room.type] || '?';
            
            html += `<span class="room-node ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}">${icon}</span>`;
            if (i < this.roomsOnFloor.length - 1) {
                html += `<span class="room-connector">—</span>`;
            }
        });
        
        this.roomIndicator.innerHTML = html;
    }

    // === UI HELPERS ===

    resetForNewRound() {
        // Reset game state
        this.gameInProgress = false;
        this.currentBet = 0;
        this.currentBetDisplay.textContent = '$0';
        
        // Reset split state
        this.isSplit = false;
        this.splitHands = [];
        this.splitBets = [];
        this.currentSplitHand = 0;
        this.splitHandEls = [];
        
        // Refresh shop inventory with new random perks
        this.refreshShopInventory();
        
        // Side bets persist but update display
        this.updateSideBetsDisplay();
        
        // Show betting controls, hide game controls
        this.bettingControls.classList.remove('hidden');
        this.gameControls.classList.add('hidden');
        
        // Reset button states
        this.dealBtn.disabled = true;
        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;
        this.doubleBtn.disabled = false;
        if (this.splitBtn) this.splitBtn.disabled = true;
        
        // Clear bet selections
        document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('selected'));
        this.messageEl.classList.remove('win', 'lose');
        
        // Clear cards and remove split container class
        this.dealerHandEl.innerHTML = '';
        this.playerHandEl.innerHTML = '';
        this.playerHandEl.classList.remove('split-hands-container');
        this.dealerScoreEl.textContent = '';
        this.playerScoreEl.textContent = '';
        this.clearScoreboard();
        
        // Update min bet display
        const minBet = this.getMinBet();
        
        // Show rebet option if applicable
        if (this.lastBet > 0 && this.money > 0 && this.rebetSection && this.rebetAmountEl) {
            this.rebetSection.classList.remove('hidden');
            const rebetAmount = Math.max(Math.min(this.lastBet, this.money), minBet);
            this.rebetAmountEl.textContent = `$${rebetAmount}`;
        } else if (this.rebetSection) {
            this.rebetSection.classList.add('hidden');
        }
        
        // Update displays
        this.updateDisplay();
        this.updateRoguelikeDisplay();
    }

    showBrokeScreen() {
        this.brokeMessageEl.textContent = this.getRandomMessage(this.brokeMessages);
        this.brokePopup.classList.remove('hidden');
    }

    restart() {
        this.money = CONFIG.STARTING_MONEY;
        this.currentBet = 0;
        this.lastBet = 0;
        this.handsPlayed = 0;
        this.timesLost = 0;
        this.playerHand = [];
        this.dealerHand = [];
        this.gameInProgress = false;
        
        // Reset roguelike state
        this.currentFloor = 1;
        this.currentRoom = 0;
        this.winStreak = 0;
        this.totalWins = 0;
        this.floorsCleared = 0;
        this.activePerks = [];
        this.activeRelics = [];
        this.activeCurses = [];
        this.isBossFight = false;
        this.isEliteFight = false;
        this.currentBoss = null;
        this.currentElite = null;
        this.extraLives = 0;
        
        // Reset run stats
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
        
        // Reset side bet stats (perks persist across runs as unlocks)
        this.sideBetStats.totalWins = 0;
        this.sideBetStats.totalEarnings = 0;
        this.sideBetStats.currentStreak = 0;
        // Note: unlockedPerks persist as permanent unlocks

        // Close all popups
        this.brokePopup.classList.add('hidden');
        this.victoryPopup.classList.add('hidden');
        this.upgradePopup.classList.add('hidden');
        this.bossPopup.classList.add('hidden');
        if (this.eventPopup) this.eventPopup.classList.add('hidden');
        if (this.shopPopup) this.shopPopup.classList.add('hidden');
        this.rebetSection.classList.add('hidden');
        this.tableEl.classList.remove('boss-mode', 'elite-mode');
        this.dealerHandEl.innerHTML = '';
        this.playerHandEl.innerHTML = '';
        this.dealerScoreEl.textContent = '';
        this.playerScoreEl.textContent = '';
        
        this.roundHistory = [];
        this.clearScoreboard();
        
        // Initialize deck and generate first floor
        this.initializeDeck();
        this.roomsOnFloor = this.generateFloorRooms(1);
        
        // Reset side bets
        this.sideBetPP = 0;
        this.sideBet21Plus3 = 0;
        this.initializeSideBetButtons();
        
        this.resetForNewRound();
        this.updateDisplay();
        this.updateRoguelikeDisplay();
        
        // Enter first room
        this.enterRoom(0);
    }

    updateDisplay() {
        if (this.moneyDisplay) this.moneyDisplay.textContent = `$${this.money}`;

        if (this.money < 100) {
            this.moneyDisplay?.classList.add('losing');
        } else {
            this.moneyDisplay?.classList.remove('losing');
        }
    }

    updateScores(hideDealer = false) {
        let playerScore;
        
        // Handle split hands
        if (this.isSplit && this.splitHands.length > 0) {
            const currentHand = this.splitHands[this.currentSplitHand];
            playerScore = currentHand ? this.calculateScore(currentHand, true) : 0;
            
            if (this.playerScoreEl) {
                if (this.hasCurse('paranoid')) {
                    this.playerScoreEl.textContent = `Hand ${this.currentSplitHand + 1}: ???`;
                } else {
                    this.playerScoreEl.textContent = `Hand ${this.currentSplitHand + 1}: ${playerScore}`;
                }
            }
        } else {
            playerScore = this.calculateScore(this.playerHand, true);
            
            // Curse: hidden score
            if (this.playerScoreEl) {
                if (this.hasCurse('paranoid')) {
                    this.playerScoreEl.textContent = `Score: ???`;
                } else {
                    this.playerScoreEl.textContent = `Score: ${playerScore}`;
                }
            }
        }

        let dealerScore;
        let visibleDealerScore;
        if (hideDealer) {
            visibleDealerScore = this.dealerHand && this.dealerHand.length > 0 ? this.getCardValue(this.dealerHand[0], 0) : 0;
            if (this.dealerScoreEl) this.dealerScoreEl.textContent = `Score: ${visibleDealerScore} + ?`;
            dealerScore = visibleDealerScore;
        } else {
            dealerScore = this.calculateScore(this.dealerHand);
            if (this.dealerScoreEl) this.dealerScoreEl.textContent = `Score: ${dealerScore}`;
        }
        
        this.updateScoreboard(playerScore, hideDealer ? visibleDealerScore : dealerScore, hideDealer);
    }
    
    updateScoreboard(playerScore, dealerScore, hideDealer = false) {
        if (!this.scoreboardPlayerEl || !this.scoreboardDealerEl) {
            return;
        }
        
        try {
            this.scoreboardPlayerEl.textContent = playerScore > 0 ? playerScore : '--';
            
            if (hideDealer && this.dealerHand && this.dealerHand.length > 0) {
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
        } catch (e) {
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
        if (!this.historyListEl) return;
        
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
        if (this.scoreboardPlayerEl) this.scoreboardPlayerEl.textContent = '--';
        if (this.scoreboardDealerEl) this.scoreboardDealerEl.textContent = '--';
        this.scoreboardPlayerEl?.classList.remove('winning', 'losing', 'tied');
        this.scoreboardDealerEl?.classList.remove('winning', 'losing', 'tied');
        this.renderHistoryList();
    }

    showMessage(msg, type = '') {
        if (!this.messageEl) return;
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

