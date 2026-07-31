// EVIL CASINO - Perks, Relics & Curses
// Perk, relic, and curse management system

// Perk Management
EvilCasino.prototype.hasPerk = function(perkId) {
    return this.activePerks.some(p => p.id === perkId);
};

EvilCasino.prototype.getPerk = function(perkId) {
    return this.activePerks.find(p => p.id === perkId);
};

EvilCasino.prototype.addPerk = function(perk) {
    const newPerk = { ...perk };
    if (newPerk.maxUses) {
        newPerk.uses = newPerk.maxUses;
    }
    this.activePerks.push(newPerk);
    this.updateRoguelikeDisplay();
};

EvilCasino.prototype.removeRandomPerk = function() {
    if (this.activePerks.length > 0) {
        const index = Math.floor(Math.random() * this.activePerks.length);
        const removed = this.activePerks.splice(index, 1)[0];
        this.showMessage(`Lost perk: ${removed.icon} ${removed.name}`, 'lose');
    }
};

// Relic Management
EvilCasino.prototype.hasRelic = function(relicId) {
    return this.activeRelics.some(r => r.id === relicId);
};

EvilCasino.prototype.getRelic = function(relicId) {
    return this.activeRelics.find(r => r.id === relicId);
};

EvilCasino.prototype.addRelic = function(relic) {
    const newRelic = { ...relic };
    if (newRelic.maxUses) {
        newRelic.uses = newRelic.maxUses;
    }
    this.activeRelics.push(newRelic);
    this.updateRoguelikeDisplay();
};

// Curse Management
EvilCasino.prototype.hasCurse = function(curseId) {
    return this.activeCurses.some(c => c.id === curseId);
};

EvilCasino.prototype.addRandomCurse = function() {
    const availableCurses = this.allCurses.filter(c => !this.hasCurse(c.id));
    if (availableCurses.length > 0) {
        const curse = availableCurses[Math.floor(Math.random() * availableCurses.length)];
        this.activeCurses.push({ ...curse });
        this.showMessage(`💀 Cursed: ${curse.icon} ${curse.name} - ${curse.desc}`, 'lose');
        this.updateRoguelikeDisplay();
    }
};

