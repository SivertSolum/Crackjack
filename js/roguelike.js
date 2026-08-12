// EVIL CASINO - Roguelike map, contracts, rooms, bosses
// Extends EvilCasino after game.js loads

Object.assign(EvilCasino.prototype, {
    initRoguelikeRun() {
        this.floorMap = null;
        this.currentRoom = null;
        this.roomMode = null; // 'combat' | 'map' | 'encounter'
        this.combatCleared = false;
        this.activeCurses = this.activeCurses || [];
        this.activeRelics = this.activeRelics || [];
        this.floorMoneyStart = this.money;
        this.floorWins = 0;
        this.floorLosses = 0;
        this.floorEliteClears = 0;
        this.contract = null;
        this.contractProgress = 0;
        this.contractFailed = false;
        this.contractComplete = false;
        this.bossDeck = this.shuffleBossDeck();
        this.currentFloorBoss = null;
        this.jesterHandRule = null;
        this.bookieDeclaration = null;
        this.isEliteFight = false;
        this.currentElite = null;
        this.awaitingRoomReturn = false;
        this.twinDealerHand2 = null;

        this.cacheRoguelikeElements();
        this.beginFloor(1);
    },

    cacheRoguelikeElements() {
        this.floorMapEl = document.getElementById('floor-map');
        this.floorMapNodesEl = document.getElementById('floor-map-nodes');
        this.floorMapTitleEl = document.getElementById('floor-map-title');
        this.floorMapContractEl = document.getElementById('floor-map-contract');
        this.contractHudEl = document.getElementById('contract-progress');
        this.dealerSpriteMount = document.getElementById('dealer-sprite-mount');
        this.dealerTitleEl = document.querySelector('.dealer-title');
        this.restPopup = document.getElementById('rest-popup');
        this.treasurePopup = document.getElementById('treasure-popup');
        this.gamblePopup = document.getElementById('gamble-popup');
        this.declarePopup = document.getElementById('declare-popup');
        this.roomIndicatorEl = document.getElementById('room-indicator');

        const mapClose = document.getElementById('floor-map-close');
        // Map is mandatory between rooms — no close without selection

        document.getElementById('declare-hit-btn')?.addEventListener('click', () => {
            this.bookieDeclaration = 'hit';
            this.hideDeclarePopup();
            this.deal();
        });
        document.getElementById('declare-stand-btn')?.addEventListener('click', () => {
            this.bookieDeclaration = 'stand';
            this.hideDeclarePopup();
            this.deal();
        });
    },

    shuffleBossDeck() {
        const ids = BOSSES.map(b => b.id);
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }
        return ids;
    },

    drawFloorBoss() {
        if (this.currentFloor >= CONFIG.TOTAL_FLOORS) {
            return { ...SATAN_BOSS };
        }
        const id = this.bossDeck.shift();
        const boss = BOSSES.find(b => b.id === id);
        return boss ? { ...boss } : { ...BOSSES[0] };
    },

    beginFloor(floor) {
        this.currentFloor = floor;
        this.winStreak = 0;
        this.floorWins = 0;
        this.floorLosses = 0;
        this.floorEliteClears = 0;
        this.contractFailed = false;
        this.contractComplete = false;
        this.contractProgress = 0;
        this.isBossFight = false;
        this.isEliteFight = false;
        this.currentBoss = null;
        this.combatCleared = false;

        if (typeof this.hasRelic === 'function' && this.hasRelic('luckyChip')) {
            this.money += 100;
        }
        this.floorMoneyStart = this.money;

        this.currentFloorBoss = this.drawFloorBoss();
        this.assignContract();
        this.floorMap = FloorMap.generate(floor);
        this.setDealerSprite('house');
        this.updateRoguelikeDisplay();
        this.showMessage(`Floor ${floor}: ${this.contract.icon} ${this.contract.name}`);
        this.showFloorMap();
    },

    assignContract() {
        if (this.currentFloor >= CONFIG.TOTAL_FLOORS) {
            this.contract = { ...FLOOR_7_CONTRACT, progress: 0 };
            return;
        }
        const pool = CONTRACTS.filter(c => {
            // Elite contract only if map might have elites — always allow, weights handle it
            return true;
        });
        const pick = pool[Math.floor(Math.random() * pool.length)];
        let target = pick.target;
        if (pick.type === 'netGain') {
            target = 100 + this.currentFloor * 50;
        }
        this.contract = {
            ...pick,
            target,
            progress: 0,
            losses: 0
        };
    },

    getContractLabel() {
        if (!this.contract) return '—';
        const c = this.contract;
        let desc = c.desc
            .replace('{target}', c.target)
            .replace('{fail}', c.failAt || 3)
            .replace('${target}', `$${c.target}`);
        if (c.type === 'netGain') desc = `Net +$${c.target} this floor`;
        if (c.type === 'winsBeforeLosses') {
            return `${c.icon} ${c.name}: ${this.floorWins}/${c.target} wins (${this.floorLosses}/${c.failAt} losses)`;
        }
        if (c.type === 'netGain') {
            const net = this.money - this.floorMoneyStart;
            return `${c.icon} ${c.name}: $${net} / $${c.target}`;
        }
        if (c.type === 'clearElite') {
            return `${c.icon} ${c.name}: ${this.floorEliteClears}/${c.target}`;
        }
        if (c.type === 'totalWins') {
            return `${c.icon} ${c.name}: ${this.floorWins}/${c.target}`;
        }
        if (c.type === 'winBlackjack' || c.type === 'winSplit' || c.type === 'defeatBoss') {
            return `${c.icon} ${c.name}: ${this.contractComplete ? 'DONE' : '0/1'}`;
        }
        return `${c.icon} ${desc}`;
    },

    updateContractFromHand(playerWon, isBlackjack = false) {
        if (!this.contract || this.contractComplete || this.isBossFight) return;

        if (playerWon === true) {
            this.floorWins++;
            if (this.contract.type === 'winBlackjack' && isBlackjack) {
                this.contractComplete = true;
            }
            if (this.contract.type === 'winSplit' && this.isSplitHand) {
                this.contractComplete = true;
            }
            if (this.contract.type === 'winsBeforeLosses' && this.floorWins >= this.contract.target) {
                this.contractComplete = true;
            }
            if (this.contract.type === 'totalWins' && this.floorWins >= this.contract.target) {
                this.contractComplete = true;
            }
        } else if (playerWon === false) {
            this.floorLosses++;
            if (this.contract.type === 'winsBeforeLosses' && this.floorLosses >= this.contract.failAt) {
                this.failContract();
                return;
            }
        }

        if (this.contract.type === 'netGain') {
            const net = this.money - this.floorMoneyStart;
            if (net >= this.contract.target) this.contractComplete = true;
        }

        if (this.contractComplete) {
            this.showMessage(`📜 Contract complete! Survive the boss to clear the floor.`);
        }
        this.updateRoguelikeDisplay();
    },

    refreshContractStatus() {
        if (!this.contract || this.contractComplete) return;
        if (this.contract.type === 'netGain') {
            const net = this.money - this.floorMoneyStart;
            if (net >= this.contract.target) this.contractComplete = true;
        }
        if (this.contract.type === 'winsBeforeLosses' && this.floorWins >= this.contract.target) {
            this.contractComplete = true;
        }
        if (this.contract.type === 'totalWins' && this.floorWins >= this.contract.target) {
            this.contractComplete = true;
        }
        if (this.contract.type === 'clearElite' && this.floorEliteClears >= this.contract.target) {
            this.contractComplete = true;
        }
        this.updateRoguelikeDisplay();
    },

    failContract(reason) {
        this.contractFailed = true;
        this.showMessage(reason || '📜 Contract FAILED. Satan claims your soul...', 'lose');
        setTimeout(() => this.showBrokeScreen(), 1400);
    },

    showFloorMap() {
        if (!this.floorMapEl || !this.floorMap) return;
        this.roomMode = 'map';
        this.hideTableForMap(true);
        if (this.floorMapTitleEl) {
            this.floorMapTitleEl.textContent = `FLOOR ${this.currentFloor} MAP`;
        }
        if (this.floorMapContractEl) {
            const status = this.contractComplete ? '✓ DONE — ' : '⚠ Must finish before boss clear — ';
            this.floorMapContractEl.textContent = status + this.getContractLabel();
            this.floorMapContractEl.classList.toggle('anim-contract-done', this.contractComplete);
        }
        this.renderFloorMap();
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.floorMapEl);
        } else {
            this.floorMapEl.classList.remove('hidden');
        }
    },

    hideFloorMap() {
        if (!this.floorMapEl) return;
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.closePopup(this.floorMapEl);
        } else {
            this.floorMapEl.classList.add('hidden');
        }
        this.hideTableForMap(false);
    },

    hideTableForMap(hide) {
        const gc = document.getElementById('game-container');
        if (!gc) return;
        if (hide) gc.classList.add('map-focus');
        else gc.classList.remove('map-focus');
    },

    renderFloorMap() {
        if (!this.floorMapNodesEl || !this.floorMap) return;
        const map = this.floorMap;
        this.floorMapNodesEl.innerHTML = '';

        map.columns.forEach((col, colIndex) => {
            const colEl = document.createElement('div');
            colEl.className = 'map-column';
            col.forEach(node => {
                const btn = document.createElement('button');
                btn.className = 'map-node';
                btn.dataset.type = node.type;
                if (node.completed) {
                    btn.classList.add('completed');
                    if (node.id === this._justCompletedNodeId) {
                        btn.classList.add('anim-node-complete');
                    }
                }
                if (node.available) btn.classList.add('available');
                if (node.type === 'boss' && !this.contractComplete && this.contract?.type !== 'defeatBoss') {
                    btn.classList.add('contract-risk');
                }
                if (node.id === map.currentNodeId) btn.classList.add('current');

                const icon = (typeof ROOM_ICONS !== 'undefined' && ROOM_ICONS[node.type]) || '•';
                const label = node.type === 'boss'
                    ? (this.currentFloorBoss?.name || 'BOSS')
                    : node.type.toUpperCase();
                btn.innerHTML = `<span class="map-node-icon">${icon}</span><span class="map-node-label">${label}</span>`;

                if (node.available) {
                    btn.addEventListener('click', () => this.enterMapNode(node.id));
                } else {
                    btn.disabled = true;
                }
                colEl.appendChild(btn);
            });
            this.floorMapNodesEl.appendChild(colEl);

            if (colIndex < map.columns.length - 1) {
                const spacer = document.createElement('div');
                spacer.className = 'map-connector';
                if (this._justCompletedNodeId && col.some(n => n.id === this._justCompletedNodeId)) {
                    spacer.classList.add('anim-connector-lit');
                }
                spacer.textContent = '›';
                this.floorMapNodesEl.appendChild(spacer);
            }
        });

        this._justCompletedNodeId = null;

        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.staggerChildren(this.floorMapNodesEl, '.map-column', 'anim-map-column-enter', 80);
        }
    },

    enterMapNode(nodeId) {
        const node = FloorMap.findNode(this.floorMap, nodeId);
        if (!node || !node.available) return;

        this.currentRoom = node;
        this.hideFloorMap();
        this.startRoom(node);
    },

    startRoom(node) {
        this.combatCleared = false;
        this.isBossFight = false;
        this.isEliteFight = false;
        this.currentElite = null;
        if (this.tableEl) this.tableEl.classList.remove('boss-mode', 'elite-mode');

        switch (node.type) {
            case 'start':
                this.finishCurrentRoom();
                break;
            case 'normal':
                this.startCombatRoom('normal');
                break;
            case 'elite':
                this.startEliteRoom();
                break;
            case 'shop':
                this.setDealerSprite('house');
                this.showPreRoundShop();
                this.showMessage('🛒 Shop — buy perks, then close to continue.');
                break;
            case 'event':
                this.showRandomEvent();
                break;
            case 'rest':
                this.showRestSite();
                break;
            case 'treasure':
                this.showTreasureRoom();
                break;
            case 'gamble':
                this.showGambleRoom();
                break;
            case 'boss':
                this.showBossAnnouncement();
                break;
            default:
                this.startCombatRoom('normal');
        }
    },

    startCombatRoom(kind) {
        this.roomMode = 'combat';
        this.combatCleared = false;
        this.setDealerSprite(kind === 'elite' ? 'elite' : 'house');
        this.showMessage(kind === 'elite'
            ? `⚔️ Elite fight! Beat the dealer to clear the room.`
            : `🃏 Win a hand to clear this room.`);
        this.resetForNewRound(true);
    },

    startEliteRoom() {
        this.isEliteFight = true;
        if (typeof ELITES !== 'undefined' && ELITES.length) {
            this.currentElite = ELITES[Math.floor(Math.random() * ELITES.length)];
        }
        if (this.tableEl) this.tableEl.classList.add('elite-mode');
        this.startCombatRoom('elite');
        if (this.currentElite) {
            this.showMessage(`⚔️ ${this.currentElite.name}: ${this.currentElite.rule}`);
        }
    },

    finishCurrentRoom() {
        if (this.tableEl) this.tableEl.classList.remove('boss-mode', 'elite-mode');
        this.isEliteFight = false;
        this.isBossFight = false;
        this.currentElite = null;

        if (!this.currentRoom || !this.floorMap) {
            this.showFloorMap();
            return;
        }
        if (this.currentRoom.type === 'elite' && this.combatCleared) {
            this.floorEliteClears++;
            if (this.contract?.type === 'clearElite' && this.floorEliteClears >= this.contract.target) {
                this.contractComplete = true;
                FloorMap.unlockBoss(this.floorMap);
            }
            // Elite reward: perk choice
            this.offerRoomPerkReward(() => {
                this._justCompletedNodeId = this.currentRoom.id;
                FloorMap.completeNode(this.floorMap, this.currentRoom.id, true);
                this.currentRoom = null;
                this.updateRoguelikeDisplay();
                this.showFloorMap();
            });
            return;
        }

        this._justCompletedNodeId = this.currentRoom.id;
        FloorMap.completeNode(this.floorMap, this.currentRoom.id, true);
        this.currentRoom = null;
        this.updateRoguelikeDisplay();
        this.showFloorMap();
    },

    offerRoomPerkReward(onDone) {
        const availablePerks = this.allPerks.filter(p => !this.hasPerk(p.id));
        if (availablePerks.length === 0) {
            onDone();
            return;
        }
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
            card.addEventListener('click', () => {
                const newPerk = { ...perk };
                if (newPerk.maxUses) newPerk.uses = newPerk.maxUses;
                this.activePerks.push(newPerk);
                if (typeof GameAnimations !== 'undefined') {
                    GameAnimations.closePopup(this.upgradePopup);
                } else {
                    this.upgradePopup.classList.add('hidden');
                }
                this.updateRoguelikeDisplay();
                onDone();
            });
            this.upgradeOptionsEl.appendChild(card);
        });
        const skip = document.createElement('button');
        skip.className = 'menu-btn';
        skip.textContent = 'Skip Reward';
        skip.style.marginTop = '12px';
        skip.addEventListener('click', () => {
            if (typeof GameAnimations !== 'undefined') {
                GameAnimations.closePopup(this.upgradePopup);
            } else {
                this.upgradePopup.classList.add('hidden');
            }
            onDone();
        });
        this.upgradeOptionsEl.appendChild(skip);
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.upgradePopup);
            GameAnimations.staggerChildren(this.upgradeOptionsEl, '.upgrade-card', 'anim-popup-enter', 80);
        } else {
            this.upgradePopup.classList.remove('hidden');
        }
    },

    // === BOSS ===
    showBossAnnouncement() {
        const boss = this.currentFloorBoss;
        this.currentBoss = boss;
        if (this.bossPortraitEl) {
            this.bossPortraitEl.innerHTML = DealerSprites.get(boss.sprite || boss.id);
        }
        if (this.bossNameEl) this.bossNameEl.textContent = boss.name;
        if (this.bossDescEl) this.bossDescEl.textContent = boss.desc;
        let rule = `RULE: ${boss.rule}`;
        if (!this.contractComplete && this.contract?.type !== 'defeatBoss') {
            rule += `\n⚠ Contract incomplete — beat them anyway and you still forfeit.`;
        }
        if (this.bossRuleEl) this.bossRuleEl.textContent = rule;
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.bossPopup);
            GameAnimations.staggerPopupContent(this.bossPopup, '.boss-portrait, .boss-content h2, .boss-description, .boss-rule, #boss-fight-btn', 'anim-popup-enter', 60);
        } else {
            this.bossPopup.classList.remove('hidden');
        }
    },

    startBossFight() {
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.closePopup(this.bossPopup);
        } else {
            this.bossPopup.classList.add('hidden');
        }
        this.isBossFight = true;
        this.currentBoss = this.currentFloorBoss;
        this.roomMode = 'combat';
        this.combatCleared = false;
        this.jesterHandRule = null;
        this.bookieDeclaration = null;
        if (this.tableEl) this.tableEl.classList.add('boss-mode');
        this.setDealerSprite(this.currentBoss.sprite || this.currentBoss.id, this.currentBoss);
        this.showMessage(`⚔️ ${this.currentBoss.name} — ${this.currentBoss.rule}`);
        this.resetForNewRound(true);
    },

    onBossDefeated() {
        const boss = this.currentBoss;
        this.isBossFight = false;
        if (this.tableEl) this.tableEl.classList.remove('boss-mode');

        // Satan finale — beating him is the win
        if (boss?.id === 'satan' || boss?.reward?.type === 'victory') {
            this.contractComplete = true;
            this.showVictoryScreen();
            return;
        }

        if (this.contract?.type === 'defeatBoss') {
            this.contractComplete = true;
        }

        // Floor payout from the winning hand already applied — refresh bankroll contracts
        this.refreshContractStatus();

        // Contract is judged after the boss is down
        if (!this.contractComplete) {
            this.failContract(
                `📜 You beat ${boss?.name || 'the boss'}, but the contract was incomplete. Soul forfeited.`
            );
            return;
        }

        this.grantBossReward(boss);
        const dealerPerk = this.grantDealerPerk();
        this.showFloorCompletePopup(dealerPerk);
    },

    grantBossReward(boss) {
        if (!boss?.reward) return;
        const r = boss.reward;
        if (r.type === 'money') {
            this.money += r.value;
            this.showMessage(`Boss reward: +$${r.value}`);
        } else if (r.type === 'perk') {
            this.grantRandomPerk('random');
        } else if (r.type === 'relic') {
            this.grantRandomRelic();
        } else if (r.type === 'removeCurse') {
            this.activeCurses = [];
            this.showMessage('✨ All curses purged!');
        }
        this.updateDisplay();
    },

    // Called from floor complete button — override advance
    advanceToNextFloorFromMap() {
        this.hideFloorCompletePopup();
        if (this.currentFloor >= CONFIG.TOTAL_FLOORS) {
            this.showVictoryScreen();
            return;
        }
        this.beginFloor(this.currentFloor + 1);
    },

    // === SPRITES ===
    setDealerSprite(id, boss = null) {
        if (!this.dealerSpriteMount) {
            const header = document.querySelector('.dealer-section .section-header');
            if (header) {
                let mount = document.getElementById('dealer-sprite-mount');
                if (!mount) {
                    mount = document.createElement('div');
                    mount.id = 'dealer-sprite-mount';
                    const old = header.querySelector('.satan-container');
                    if (old) old.replaceWith(mount);
                    else header.prepend(mount);
                }
                this.dealerSpriteMount = mount;
            }
        }
        if (this.dealerSpriteMount) {
            const spriteId = id === 'elite' ? 'house' : id;
            this.dealerSpriteMount.innerHTML = DealerSprites.get(spriteId);
            if (id === 'elite') {
                this.dealerSpriteMount.classList.add('elite-tint');
            } else {
                this.dealerSpriteMount.classList.remove('elite-tint');
            }
        }
        if (this.dealerTitleEl) {
            this.dealerTitleEl.innerHTML = DealerSprites.titleFor(id, boss);
        }
    },

    // === REST / TREASURE / GAMBLE ===
    showRestSite() {
        if (!this.restPopup) {
            this.money += 150;
            this.showMessage('😴 Rest: +$150');
            this.updateDisplay();
            this.finishCurrentRoom();
            return;
        }
        const optionsEl = document.getElementById('rest-options');
        optionsEl.innerHTML = '';
        (REST_OPTIONS || []).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'event-choice-btn';
            btn.innerHTML = `${opt.icon} ${opt.name}<span class="choice-cost">${opt.desc}</span>`;
            btn.addEventListener('click', () => {
                this.applyRestOption(opt);
                if (typeof GameAnimations !== 'undefined') {
                    GameAnimations.closePopup(this.restPopup);
                } else {
                    this.restPopup.classList.add('hidden');
                }
                this.finishCurrentRoom();
            });
            optionsEl.appendChild(btn);
        });
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.restPopup);
        } else {
            this.restPopup.classList.remove('hidden');
        }
    },

    applyRestOption(opt) {
        if (opt.effect === 'heal') {
            this.money += opt.value;
            this.showMessage(`😴 Restored $${opt.value}`);
        } else if (opt.effect === 'randomPerk') {
            this.grantRandomPerk('common');
        } else if (opt.effect === 'upgradePerk') {
            this.showMessage('🧘 You meditated... (feeling slightly luckier)');
            this.money += 50;
        } else if (opt.effect === 'gamble') {
            if (Math.random() < 0.5) {
                this.money += opt.win;
                this.showMessage(`🎰 Won $${opt.win}!`);
            } else {
                this.money = Math.max(0, this.money - opt.lose);
                this.showMessage(`🎰 Lost $${opt.lose}...`);
            }
        }
        this.updateDisplay();
        if (this.money <= 0) this.showBrokeScreen();
    },

    showTreasureRoom() {
        const rewards = TREASURE_REWARDS || [{ type: 'money', min: 100, max: 300, weight: 100 }];
        const total = rewards.reduce((s, r) => s + r.weight, 0);
        let roll = Math.random() * total;
        let picked = rewards[0];
        for (const r of rewards) {
            roll -= r.weight;
            if (roll <= 0) { picked = r; break; }
        }
        let msg = '';
        if (picked.type === 'money') {
            const amt = Math.floor(Math.random() * (picked.max - picked.min + 1)) + picked.min;
            this.money += amt;
            msg = `💎 Treasure! +$${amt}`;
        } else if (picked.type === 'perk') {
            this.grantRandomPerk('random');
            msg = '💎 Found a perk!';
        } else if (picked.type === 'relic') {
            this.grantRandomRelic();
            msg = '💎 Found a relic!';
        } else if (picked.type === 'curse') {
            this.addRandomCurse();
            msg = '👻 Mimic! You gained a curse!';
        } else {
            msg = '💨 Empty chest...';
        }
        if (this.treasurePopup) {
            document.getElementById('treasure-result').textContent = msg;
            if (typeof GameAnimations !== 'undefined') {
                GameAnimations.openPopup(this.treasurePopup);
            } else {
                this.treasurePopup.classList.remove('hidden');
            }
            document.getElementById('treasure-continue-btn').onclick = () => {
                if (typeof GameAnimations !== 'undefined') {
                    GameAnimations.closePopup(this.treasurePopup);
                } else {
                    this.treasurePopup.classList.add('hidden');
                }
                this.updateDisplay();
                this.finishCurrentRoom();
            };
        } else {
            this.showMessage(msg);
            this.updateDisplay();
            setTimeout(() => this.finishCurrentRoom(), 1000);
        }
    },

    showGambleRoom() {
        const games = GAMBLE_GAMES || [{ id: 'coinFlip', name: 'Coin Flip', odds: 0.5 }];
        if (!this.gamblePopup) {
            const bet = Math.min(50, this.money);
            if (Math.random() < 0.5) {
                this.money += bet;
                this.showMessage(`🎰 Won $${bet}!`);
            } else {
                this.money -= bet;
                this.showMessage(`🎰 Lost $${bet}`);
            }
            this.updateDisplay();
            this.finishCurrentRoom();
            return;
        }
        const el = document.getElementById('gamble-options');
        el.innerHTML = '';
        games.forEach(g => {
            const btn = document.createElement('button');
            btn.className = 'event-choice-btn';
            const stake = Math.min(50 * this.currentFloor, Math.floor(this.money / 2) || 0);
            btn.innerHTML = `${g.icon || '🎲'} ${g.name}<span class="choice-cost">Stake $${stake} — ${g.desc}</span>`;
            btn.disabled = stake <= 0;
            btn.addEventListener('click', () => {
                this.money -= stake;
                const win = Math.random() < (g.odds || 0.5);
                if (win) {
                    const payout = Math.floor(stake * (g.multiplier || 2));
                    this.money += payout;
                    this.showMessage(`🎰 Won $${payout}!`);
                } else {
                    this.showMessage(`🎰 Lost $${stake}`);
                }
                if (typeof GameAnimations !== 'undefined') {
                    GameAnimations.closePopup(this.gamblePopup);
                } else {
                    this.gamblePopup.classList.add('hidden');
                }
                this.updateDisplay();
                if (this.money <= 0) this.showBrokeScreen();
                else this.finishCurrentRoom();
            });
            el.appendChild(btn);
        });
        const skip = document.createElement('button');
        skip.className = 'event-choice-btn';
        skip.textContent = 'Leave';
        skip.addEventListener('click', () => {
            if (typeof GameAnimations !== 'undefined') {
                GameAnimations.closePopup(this.gamblePopup);
            } else {
                this.gamblePopup.classList.add('hidden');
            }
            this.finishCurrentRoom();
        });
        el.appendChild(skip);
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.gamblePopup);
        } else {
            this.gamblePopup.classList.remove('hidden');
        }
    },

    hideDeclarePopup() {
        if (!this.declarePopup) return;
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.closePopup(this.declarePopup);
        } else {
            this.declarePopup.classList.add('hidden');
        }
    },

    showDeclarePopup() {
        if (!this.declarePopup) return;
        if (typeof GameAnimations !== 'undefined') {
            GameAnimations.openPopup(this.declarePopup);
        } else {
            this.declarePopup.classList.remove('hidden');
        }
    },

    hasRelic(id) {
        return (this.activeRelics || []).some(r => r.id === id);
    },

    // Soft 17 helper
    isSoftScore(hand) {
        let total = 0;
        let aces = 0;
        for (const card of hand) {
            if (card.value === 'A') { aces++; total += 11; }
            else if (['K', 'Q', 'J'].includes(card.value)) total += 10;
            else total += parseInt(card.value, 10);
        }
        while (total > 21 && aces > 0) { total -= 10; aces--; }
        return aces > 0 && total <= 21;
    }
});
