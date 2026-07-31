// EVIL CASINO - CSS sprite HTML builders (Satan pattern)

const DealerSprites = {
    houseDealer() {
        return `
        <div class="dealer-sprite house-dealer-container" data-sprite="house">
            <div class="house-dealer">
                <div class="hd-visor"></div>
                <div class="hd-head">
                    <div class="hd-eyes">
                        <div class="hd-eye left"><div class="hd-pupil"></div></div>
                        <div class="hd-eye right"><div class="hd-pupil"></div></div>
                    </div>
                    <div class="hd-nose"></div>
                    <div class="hd-mouth"></div>
                </div>
                <div class="hd-bowtie"></div>
                <div class="hd-collar"></div>
            </div>
        </div>`;
    },

    pitboss() {
        return `
        <div class="dealer-sprite boss-sprite pitboss-container" data-sprite="pitboss">
            <div class="pitboss">
                <div class="pb-hair"></div>
                <div class="pb-head">
                    <div class="pb-glasses"></div>
                    <div class="pb-eyes">
                        <div class="pb-eye"></div><div class="pb-eye"></div>
                    </div>
                    <div class="pb-mouth"></div>
                </div>
                <div class="pb-clipboard"></div>
            </div>
        </div>`;
    },

    ladyluck() {
        return `
        <div class="dealer-sprite boss-sprite ladyluck-container" data-sprite="ladyluck">
            <div class="ladyluck">
                <div class="ll-hair"></div>
                <div class="ll-head">
                    <div class="ll-blindfold"></div>
                    <div class="ll-coin"></div>
                    <div class="ll-smile"></div>
                </div>
            </div>
        </div>`;
    },

    loanshark() {
        return `
        <div class="dealer-sprite boss-sprite loanshark-container" data-sprite="loanshark">
            <div class="loanshark">
                <div class="ls-fin"></div>
                <div class="ls-head">
                    <div class="ls-eyes"><div class="ls-eye"></div><div class="ls-eye"></div></div>
                    <div class="ls-teeth"></div>
                </div>
            </div>
        </div>`;
    },

    countess() {
        return `
        <div class="dealer-sprite boss-sprite countess-container" data-sprite="countess">
            <div class="countess">
                <div class="ct-hair"></div>
                <div class="ct-head">
                    <div class="ct-eyes"><div class="ct-eye"></div><div class="ct-eye"></div></div>
                    <div class="ct-fangs"><div></div><div></div></div>
                </div>
                <div class="ct-drop"></div>
            </div>
        </div>`;
    },

    twins() {
        return `
        <div class="dealer-sprite boss-sprite twins-container" data-sprite="twins">
            <div class="twins">
                <div class="tw-head left">
                    <div class="tw-eye"></div>
                    <div class="tw-mouth"></div>
                </div>
                <div class="tw-head right">
                    <div class="tw-eye"></div>
                    <div class="tw-mouth"></div>
                </div>
                <div class="tw-collar"></div>
            </div>
        </div>`;
    },

    grandmaster() {
        return `
        <div class="dealer-sprite boss-sprite grandmaster-container" data-sprite="grandmaster">
            <div class="grandmaster">
                <div class="gm-crown"></div>
                <div class="gm-head">
                    <div class="gm-monocle"></div>
                    <div class="gm-eyes"><div class="gm-eye"></div><div class="gm-eye"></div></div>
                    <div class="gm-mouth"></div>
                </div>
            </div>
        </div>`;
    },

    croupier() {
        return `
        <div class="dealer-sprite boss-sprite croupier-container" data-sprite="croupier">
            <div class="croupier">
                <div class="cr-hat"></div>
                <div class="cr-head">
                    <div class="cr-eyes"><div class="cr-eye"></div><div class="cr-eye"></div></div>
                    <div class="cr-mustache"></div>
                </div>
                <div class="cr-chip"></div>
            </div>
        </div>`;
    },

    hangman() {
        return `
        <div class="dealer-sprite boss-sprite hangman-container" data-sprite="hangman">
            <div class="hangman">
                <div class="hg-noose"></div>
                <div class="hg-head">
                    <div class="hg-eyes"><div class="hg-eye"></div><div class="hg-eye"></div></div>
                    <div class="hg-frown"></div>
                </div>
            </div>
        </div>`;
    },

    jester() {
        return `
        <div class="dealer-sprite boss-sprite jester-container" data-sprite="jester">
            <div class="jester">
                <div class="js-hat"><div class="js-bell l"></div><div class="js-bell r"></div></div>
                <div class="js-head">
                    <div class="js-eyes"><div class="js-eye"></div><div class="js-eye"></div></div>
                    <div class="js-grin"></div>
                </div>
            </div>
        </div>`;
    },

    bookie() {
        return `
        <div class="dealer-sprite boss-sprite bookie-container" data-sprite="bookie">
            <div class="bookie">
                <div class="bk-head">
                    <div class="bk-eyes"><div class="bk-eye"></div><div class="bk-eye"></div></div>
                    <div class="bk-cig"></div>
                    <div class="bk-mouth"></div>
                </div>
                <div class="bk-ledger"></div>
            </div>
        </div>`;
    },

    widow() {
        return `
        <div class="dealer-sprite boss-sprite widow-container" data-sprite="widow">
            <div class="widow">
                <div class="wd-veil"></div>
                <div class="wd-head">
                    <div class="wd-eyes"><div class="wd-eye"></div><div class="wd-eye"></div></div>
                    <div class="wd-lips"></div>
                </div>
                <div class="wd-spider"></div>
            </div>
        </div>`;
    },

    auditor() {
        return `
        <div class="dealer-sprite boss-sprite auditor-container" data-sprite="auditor">
            <div class="auditor">
                <div class="au-glasses"></div>
                <div class="au-head">
                    <div class="au-eyes"><div class="au-eye"></div><div class="au-eye"></div></div>
                    <div class="au-mouth"></div>
                </div>
                <div class="au-clipboard"></div>
            </div>
        </div>`;
    },

    satan() {
        return `
        <div class="dealer-sprite boss-sprite satan-mount" data-sprite="satan">
            <div class="satan-container">
                <div class="satan">
                    <div class="horns">
                        <div class="horn left"></div>
                        <div class="horn right"></div>
                    </div>
                    <div class="satan-head">
                        <div class="satan-eyes">
                            <div class="eye left"><div class="pupil"></div></div>
                            <div class="eye right"><div class="pupil"></div></div>
                        </div>
                        <div class="satan-nose"></div>
                        <div class="satan-mouth">
                            <div class="fang left"></div>
                            <div class="fang right"></div>
                        </div>
                    </div>
                    <div class="goatee"></div>
                </div>
                <div class="flames" style="display:flex">
                    <div class="flame f1"></div>
                    <div class="flame f2"></div>
                    <div class="flame f3"></div>
                </div>
            </div>
        </div>`;
    },

    get(id) {
        if (id === 'house' || id === 'elite') return this.houseDealer();
        if (typeof this[id] === 'function') return this[id]();
        return this.houseDealer();
    },

    titleFor(id, boss) {
        if (boss) return `${boss.name}<br><span class="satan-subtitle">${boss.rule}</span>`;
        if (id === 'elite') return `ELITE DEALER<br><span class="satan-subtitle">HOUSE ENFORCER</span>`;
        return `HOUSE DEALER<br><span class="satan-subtitle">DEFINITELY FAIR</span>`;
    }
};
