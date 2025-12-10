// CRACKJACK - Betting System
// Bet placement, same bet, and bet validation

CrackJack.prototype.getMinBet = function() {
    let minBet = CONFIG.MIN_BET_PER_FLOOR[this.currentFloor - 1] || 10;
    
    // Elite modifiers
    if (this.isEliteFight && this.currentElite?.ability === 'minBet') {
        minBet = Math.max(minBet, this.currentElite.value);
    }
    
    return minBet;
};

CrackJack.prototype.placeBet = function(btn) {
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
};

CrackJack.prototype.sameBet = function() {
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
};

