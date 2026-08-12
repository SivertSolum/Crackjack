// EVIL CASINO - Shared animation helpers
const GameAnimations = {
    _floaterCount: 0,
    _maxFloaters: 3,

    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    getScaleWrapper() {
        return document.getElementById('game-scale-wrapper');
    },

    playAnimation(el, className, opts = {}) {
        if (!el) return Promise.resolve();
        const durationMs = opts.durationMs || 400;
        if (this.prefersReducedMotion()) return Promise.resolve();

        return new Promise(resolve => {
            const cleanup = () => {
                el.classList.remove(className);
                el.removeEventListener('animationend', onEnd);
                resolve();
            };
            const onEnd = (e) => {
                if (e.target !== el) return;
                cleanup();
            };
            el.addEventListener('animationend', onEnd);
            el.classList.add(className);
            setTimeout(cleanup, durationMs + 50);
        });
    },

    flashElement(el, className, durationMs = 400) {
        if (!el || this.prefersReducedMotion()) return Promise.resolve();
        el.classList.add(className);
        return this.delay(durationMs).then(() => {
            el.classList.remove(className);
        });
    },

    getAnchorPosition(anchorEl) {
        const wrapper = this.getScaleWrapper();
        if (!anchorEl || !wrapper) return { left: 600, top: 40 };
        const anchorRect = anchorEl.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const scale = wrapperRect.width / 1200 || 1;
        return {
            left: (anchorRect.left - wrapperRect.left) / scale + anchorRect.width / 2 / scale,
            top: (anchorRect.top - wrapperRect.top) / scale
        };
    },

    spawnFloater(text, anchorEl, type = 'gain') {
        if (this.prefersReducedMotion()) return null;
        if (this._floaterCount >= this._maxFloaters) return null;

        const wrapper = this.getScaleWrapper();
        if (!wrapper) return null;

        const floater = document.createElement('div');
        floater.className = 'anim-floater anim-floater--' + (type === 'loss' ? 'loss' : 'gain');
        floater.textContent = text;

        const pos = this.getAnchorPosition(anchorEl || document.getElementById('money'));
        floater.style.left = pos.left + 'px';
        floater.style.top = pos.top + 'px';

        wrapper.appendChild(floater);
        this._floaterCount++;

        const cleanup = () => {
            if (floater.parentNode) floater.parentNode.removeChild(floater);
            this._floaterCount = Math.max(0, this._floaterCount - 1);
        };
        floater.addEventListener('animationend', cleanup);
        setTimeout(cleanup, 1200);

        return floater;
    },

    animateMoneyChange(delta, anchorEl) {
        if (!delta) return;
        const moneyEl = document.getElementById('money');
        if (!moneyEl) return;

        const flashClass = delta > 0 ? 'anim-flash-gain' : 'anim-flash-loss';
        this.flashElement(moneyEl, flashClass, 400);

        const sign = delta > 0 ? '+' : '';
        this.spawnFloater(sign + '$' + Math.abs(delta), anchorEl || moneyEl, delta > 0 ? 'gain' : 'loss');
    },

    staggerChildren(parent, selector, className, delayMs = 80) {
        if (!parent) return Promise.resolve();
        const children = parent.querySelectorAll(selector);
        if (!children.length) return Promise.resolve();
        if (this.prefersReducedMotion()) return Promise.resolve();

        const tasks = [];
        children.forEach((child, i) => {
            tasks.push(
                this.delay(i * delayMs).then(() => this.playAnimation(child, className, { durationMs: 350 }))
            );
        });
        return Promise.all(tasks);
    },

    openPopup(popupEl, opts = {}) {
        if (!popupEl) return Promise.resolve();
        popupEl.classList.remove('hidden');
        popupEl.classList.remove('popup-closing');

        const content = popupEl.querySelector('.popup-content') || popupEl;
        if (!this.prefersReducedMotion()) {
            content.classList.remove('anim-popup-exit');
            return this.playAnimation(content, 'anim-popup-enter', { durationMs: opts.durationMs || 280 });
        }
        return Promise.resolve();
    },

    closePopup(popupEl, opts = {}) {
        if (!popupEl) return Promise.resolve();
        const content = popupEl.querySelector('.popup-content') || popupEl;

        if (this.prefersReducedMotion()) {
            popupEl.classList.add('hidden');
            return Promise.resolve();
        }

        popupEl.classList.add('popup-closing');
        return this.playAnimation(content, 'anim-popup-exit', { durationMs: opts.durationMs || 220 })
            .then(() => {
                popupEl.classList.add('hidden');
                popupEl.classList.remove('popup-closing');
                content.classList.remove('anim-popup-exit');
            });
    },

    buildCardFace(card) {
        const isRed = ['♥', '♦'].includes(card.suit);
        return {
            html: `
                <div class="card-corner">${card.value}${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div class="card-corner bottom">${card.value}${card.suit}</div>
            `,
            colorClass: isRed ? 'red' : 'black'
        };
    },

    flipCard(faceDownEl, card, opts = {}) {
        if (!faceDownEl || !card) return Promise.resolve();

        const swapFace = () => {
            faceDownEl.classList.remove('face-down', 'hidden-by-boss');
            const face = this.buildCardFace(card);
            faceDownEl.classList.add(face.colorClass);
            if (opts.rigged) faceDownEl.classList.add('rigged');
            faceDownEl.innerHTML = face.html;
        };

        if (this.prefersReducedMotion()) {
            swapFace();
            return Promise.resolve();
        }

        if (typeof playCardFlipSound === 'function') playCardFlipSound();

        faceDownEl.classList.add('anim-flip');
        setTimeout(swapFace, 150);

        return new Promise(resolve => {
            const finish = () => {
                faceDownEl.classList.remove('anim-flip');
                resolve();
            };
            faceDownEl.addEventListener('animationend', finish, { once: true });
            setTimeout(finish, 350);
        });
    },

    async flipCardsSequence(cardEls, cards, opts = {}) {
        if (!cardEls || !cards || !cardEls.length) return;
        const stagger = opts.staggerMs || 150;
        if (this.prefersReducedMotion()) {
            cardEls.forEach((el, i) => this.flipCard(el, cards[i], opts));
            return;
        }
        for (let i = 0; i < cardEls.length; i++) {
            await this.flipCard(cardEls[i], cards[i], opts);
            if (i < cardEls.length - 1) await this.delay(stagger);
        }
    },

    playRoundOutcome(tableEl, outcome, opts = {}) {
        if (!tableEl) return Promise.resolve();
        const durationMs = opts.durationMs || 600;

        tableEl.classList.remove('round-win', 'round-lose', 'round-push');
        if (outcome === 'win') tableEl.classList.add('round-win');
        else if (outcome === 'loss') tableEl.classList.add('round-lose');
        else if (outcome === 'push') tableEl.classList.add('round-push');

        const playerCards = opts.playerCards || [];
        const dealerCards = opts.dealerCards || [];

        playerCards.forEach(c => c.classList.remove('winner-glow', 'loser-dim'));
        dealerCards.forEach(c => c.classList.remove('winner-glow', 'loser-dim'));

        if (outcome === 'win') {
            playerCards.forEach(c => c.classList.add('winner-glow'));
            dealerCards.forEach(c => c.classList.add('loser-dim'));
        } else if (outcome === 'loss') {
            playerCards.forEach(c => c.classList.add('loser-dim'));
            dealerCards.forEach(c => c.classList.add('winner-glow'));
        }

        if (opts.splitContainers) {
            opts.splitContainers.forEach(el => el.classList.remove('winner', 'loser'));
            if (outcome === 'win') opts.splitContainers.forEach(el => el.classList.add('winner'));
            else if (outcome === 'loss') opts.splitContainers.forEach(el => el.classList.add('loser'));
        }

        if (this.prefersReducedMotion()) return Promise.resolve();
        return this.delay(durationMs);
    },

    clearRoundOutcome(tableEl) {
        if (!tableEl) return;
        tableEl.classList.remove('round-win', 'round-lose', 'round-push', 'jester-tint', 'anim-table-shake');
        document.querySelectorAll('.card.winner-glow, .card.loser-dim').forEach(c => {
            c.classList.remove('winner-glow', 'loser-dim');
        });
        document.querySelectorAll('.split-hand.winner, .split-hand.loser').forEach(c => {
            c.classList.remove('winner', 'loser');
        });
    },

    shakeTable(tableEl) {
        if (!tableEl) return Promise.resolve();
        return this.playAnimation(tableEl, 'anim-table-shake', { durationMs: 400 });
    },

    staggerPopupContent(popupEl, selector, className, delayMs) {
        if (!popupEl) return Promise.resolve();
        return this.staggerChildren(popupEl, selector, className, delayMs);
    }
};
