// CRACKJACK - Side Bets System
// Perfect Pairs, 21+3, and side bet perk system

// Side Bet Placement
CrackJack.prototype.placeSideBet = function(btn) {
    if (this.gameInProgress) return;
    
    const type = btn.dataset.type;
    const amount = parseInt(btn.dataset.amount);
    
    const container = type === 'pp' ? document.getElementById('pp-buttons') : document.getElementById('21plus3-buttons');
    container.querySelectorAll('.side-bet-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (type === 'pp') {
        this.sideBetPP = amount;
    } else if (type === '21plus3') {
        this.sideBet21Plus3 = amount;
    }
    
    this.updateSideBetsDisplay();
};

CrackJack.prototype.updateSideBetsDisplay = function() {
    const total = this.sideBetPP + this.sideBet21Plus3;
    if (this.sideBetsTotalEl) {
        this.sideBetsTotalEl.textContent = `$${total}`;
    }
};

CrackJack.prototype.initializeSideBetButtons = function() {
    document.querySelectorAll('.side-bet-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.amount === '0') {
            btn.classList.add('active');
        }
    });
    this.updateSideBetsDisplay();
};

// Perfect Pairs Check
CrackJack.prototype.checkPerfectPairs = function(hand) {
    if (hand.length < 2) return null;
    
    const card1 = hand[0];
    const card2 = hand[1];
    
    if (card1.value !== card2.value) return null;
    
    // Perfect Pair - same suit
    if (card1.suit === card2.suit) {
        return {
            type: 'perfectPair',
            name: 'PERFECT PAIR',
            emoji: '👯',
            payout: this.sideBetPayouts.perfectPair
        };
    }
    
    // Colored Pair - same color
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
    
    // Mixed Pair
    return {
        type: 'mixedPair',
        name: 'MIXED PAIR',
        emoji: '👫',
        payout: this.sideBetPayouts.mixedPair
    };
};

// 21+3 Check
CrackJack.prototype.check21Plus3 = function(playerHand, dealerHand) {
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
    
    if (allSameValue && allSameSuit) {
        return { type: 'suitedTrips', name: 'SUITED TRIPS', emoji: '🔥', payout: this.sideBetPayouts.suitedTrips };
    }
    if (isStraight && allSameSuit) {
        return { type: 'straightFlush', name: 'STRAIGHT FLUSH', emoji: '🌟', payout: this.sideBetPayouts.straightFlush };
    }
    if (allSameValue) {
        return { type: 'threeOfAKind', name: 'THREE OF A KIND', emoji: '🎰', payout: this.sideBetPayouts.threeOfAKind };
    }
    if (isStraight) {
        return { type: 'straight', name: 'STRAIGHT', emoji: '📈', payout: this.sideBetPayouts.straight };
    }
    if (allSameSuit) {
        return { type: 'flush', name: 'FLUSH', emoji: '💎', payout: this.sideBetPayouts.flush };
    }
    
    return null;
};

// Evaluate Side Bets
CrackJack.prototype.evaluateSideBets = async function() {
    const results = [];
    let totalWinnings = 0;
    let anySideBetWon = false;
    
    // Calculate bonuses from perks
    let ppBonus = 1.0;
    let plus3Bonus = 1.0;
    
    if (this.hasSideBetPerk('pairHunter')) ppBonus += 0.25;
    if (this.hasSideBetPerk('pokerFace')) plus3Bonus += 0.25;
    if (this.hasSideBetPerk('sideMaster')) {
        ppBonus += 0.50;
        plus3Bonus += 0.50;
    }
    
    const streakBonus = this.hasSideBetPerk('perfectStreak') ? 
        1 + (this.sideBetStats.currentStreak * 0.10) : 1;
    
    // Check Perfect Pairs
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
    
    // Check 21+3
    if (this.sideBet21Plus3 > 0) {
        const plus3Result = this.check21Plus3(this.playerHand, this.dealerHand);
        if (plus3Result) {
            let multiplier = plus3Bonus * streakBonus;
            if (this.hasSideBetPerk('doubleDown21') && plus3Result.name === 'Straight Flush') {
                multiplier *= 3;
            }
            let winnings = Math.floor(this.sideBet21Plus3 * plus3Result.payout * multiplier);
            totalWinnings += winnings;
            anySideBetWon = true;
            results.push({ bet: '21+3', result: plus3Result, wagered: this.sideBet21Plus3, won: winnings });
        } else {
            results.push({ bet: '21+3', result: null, wagered: this.sideBet21Plus3, won: 0 });
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
        this.checkSideBetMilestones();
    } else if (this.sideBetPP > 0 || this.sideBet21Plus3 > 0) {
        this.sideBetStats.currentStreak = 0;
    }
    
    if (results.length > 0) {
        this.money += totalWinnings;
        this.updateDisplay();
        await this.showSideBetResults(results);
    }
};

// Show Side Bet Results
CrackJack.prototype.showSideBetResults = async function(results) {
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
            playWinSound();
            
            await this.delay(1500);
            popup.remove();
        }
    }
};

// Side Bet Perks
CrackJack.prototype.hasSideBetPerk = function(perkId) {
    return this.sideBetStats.unlockedPerks.includes(perkId);
};

CrackJack.prototype.checkSideBetMilestones = function() {
    const milestones = CONFIG.SIDE_BET_MILESTONES;
    if (!milestones || !this.allSideBetPerks) return;
    
    for (const perk of this.allSideBetPerks) {
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
};

CrackJack.prototype.showSideBetPerkUnlock = function(perk) {
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
    
    if (typeof playWinSound === 'function') playWinSound();
    
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
    
    this.updateRoguelikeDisplay();
};

