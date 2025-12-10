// CRACKJACK - Game Configuration
// Roguelike Dungeon Crawler Edition

// Version and Changelog
const VERSION = {
    number: '1.0.0',
    date: '2024-12-10',
    changelog: [
        {
            version: '1.0.0',
            date: '2024-12-10',
            title: 'Initial Release',
            changes: [
                'Full roguelike blackjack experience with 7 floors',
                'Satan and 6 unique floor bosses',
                'Perk and relic system with 15+ upgrades',
                'Side bets: Perfect Pairs and 21+3',
                'Random events and shop system',
                'Card tracker and scoreboard',
                'Retro pixel art aesthetic with CSS-only characters',
                'Custom music support'
            ]
        }
    ]
};

const CONFIG = {
    STARTING_MONEY: 1000,
    ESCAPE_GOAL: 10000,
    SHUFFLE_THRESHOLD: 20,
    
    // Floor settings
    TOTAL_FLOORS: 7,
    ROOMS_PER_FLOOR: [3, 3, 4, 4, 5, 5, 6],
    MIN_BET_PER_FLOOR: [10, 25, 50, 100, 150, 200, 500],
    
    // Perk system
    WINS_FOR_UPGRADE: 3,  // Wins needed to pick an upgrade
    
    // Side bet milestones for perks
    SIDE_BET_MILESTONES: {
        wins: [3, 7, 12, 20],      // Number of side bet wins for perks
        earnings: [200, 500, 1000, 2500] // Total earnings from side bets for perks
    },
    
    SUITS: ['♠', '♥', '♦', '♣'],
    VALUES: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
};

// Room types and their weights per floor
const ROOM_WEIGHTS = {
    // [normal, elite, event, shop, rest, treasure, gamble]
    1: { normal: 50, elite: 5, event: 25, shop: 10, rest: 5, treasure: 5, gamble: 0 },
    2: { normal: 45, elite: 10, event: 20, shop: 10, rest: 5, treasure: 5, gamble: 5 },
    3: { normal: 40, elite: 15, event: 20, shop: 10, rest: 5, treasure: 5, gamble: 5 },
    4: { normal: 35, elite: 20, event: 15, shop: 10, rest: 5, treasure: 5, gamble: 10 },
    5: { normal: 30, elite: 25, event: 15, shop: 10, rest: 5, treasure: 5, gamble: 10 },
    6: { normal: 25, elite: 30, event: 15, shop: 10, rest: 5, treasure: 5, gamble: 10 },
    7: { normal: 20, elite: 35, event: 10, shop: 10, rest: 5, treasure: 5, gamble: 15 }
};

// Perks - can be purchased or selected after wins
const PERKS = [
    { id: 'peek', name: 'X-Ray Vision', icon: '👁️', desc: "See dealer's hidden card once per floor", uses: 1, maxUses: 1, cost: 3200, rarity: 'rare' },
    { id: 'lucky7', name: 'Lucky 7s', icon: '🍀', desc: '7s count as 8 for you', passive: true, cost: 2400, rarity: 'common' },
    { id: 'insurance', name: 'Insurance Fraud', icon: '💰', desc: '30% chance to get bet back on loss', passive: true, cost: 4000, rarity: 'uncommon' },
    { id: 'counter', name: 'Card Counter', icon: '🧠', desc: 'Shows bust probability', passive: true, cost: 1600, rarity: 'common' },
    { id: 'luckyCharm', name: 'Lucky Charm', icon: '🍀', desc: '+5% chance to win ties', passive: true, cost: 4800, rarity: 'rare' },
    { id: 'secondChance', name: 'Second Chance', icon: '🔄', desc: 'Undo last hit once per floor', uses: 1, maxUses: 1, cost: 3200, rarity: 'uncommon' },
    { id: 'doubleOrNothing', name: 'High Roller', icon: '🎲', desc: 'Wins pay 1.3x', passive: true, cost: 5600, rarity: 'rare' },
    { id: 'shield', name: 'Soul Shield', icon: '🛡️', desc: 'Survive one bust per floor', uses: 1, maxUses: 1, cost: 4000, rarity: 'uncommon' },
    { id: 'thief', name: 'Pickpocket', icon: '🤏', desc: 'Steal $75 on dealer bust', passive: true, cost: 2400, rarity: 'common' },
    { id: 'meditation', name: 'Zen Mind', icon: '🧘', desc: 'Gain $30 at start of each hand', passive: true, cost: 3200, rarity: 'uncommon' },
    { id: 'quickDraw', name: 'Quick Draw', icon: '⚡', desc: 'First hit each hand can\'t bust you', passive: true, cost: 6400, rarity: 'rare' },
    { id: 'greed', name: 'Greed', icon: '💎', desc: 'Blackjack pays 3x instead of 2.5x', passive: true, cost: 4800, rarity: 'uncommon' },
    { id: 'vampiric', name: 'Vampiric Touch', icon: '🧛', desc: 'Heal $25 on wins', passive: true, cost: 3200, rarity: 'common' },
    { id: 'lastStand', name: 'Last Stand', icon: '💪', desc: 'Win rate +20% when under $200', passive: true, cost: 2400, rarity: 'common' },
    { id: 'doubleDown', name: 'Double Agent', icon: '🕵️', desc: 'Double down costs only 50% extra', passive: true, cost: 4000, rarity: 'uncommon' }
];

// Side Bet Perks - unlocked via side bet milestones
const SIDE_BET_PERKS = [
    // Wins-based unlocks
    { id: 'pairHunter', name: 'Pair Hunter', icon: '👯', desc: 'Perfect Pairs pay +25% more', passive: true, milestone: 'wins', threshold: 3, rarity: 'common' },
    { id: 'pokerFace', name: 'Poker Face', icon: '🎭', desc: '21+3 bets pay +25% more', passive: true, milestone: 'wins', threshold: 7, rarity: 'uncommon' },
    { id: 'sideShow', name: 'Side Show', icon: '🎪', desc: 'Side bet losses refunded 25% of the time', passive: true, milestone: 'wins', threshold: 12, rarity: 'rare' },
    { id: 'sideMaster', name: 'Side Bet Master', icon: '🏆', desc: 'All side bets pay +50% more', passive: true, milestone: 'wins', threshold: 20, rarity: 'legendary' },
    // Earnings-based unlocks
    { id: 'luckyStart', name: 'Lucky Start', icon: '🌟', desc: 'Free $10 side bet each hand', passive: true, milestone: 'earnings', threshold: 200, rarity: 'common' },
    { id: 'sideInsurance', name: 'Side Insurance', icon: '🛟', desc: 'Side bets cost 20% less', passive: true, milestone: 'earnings', threshold: 500, rarity: 'uncommon' },
    { id: 'doubleDown21', name: 'Double Down 21', icon: '♠️', desc: '21+3 Straight Flush pays 3x more', passive: true, milestone: 'earnings', threshold: 1000, rarity: 'rare' },
    { id: 'perfectStreak', name: 'Perfect Streak', icon: '✨', desc: 'Consecutive side bet wins give +10% bonus each', passive: true, milestone: 'earnings', threshold: 2500, rarity: 'legendary' }
];

// Relics - permanent powerful effects found during runs
const RELICS = [
    { id: 'luckyChip', name: 'Lucky Chip', icon: '🪙', desc: 'Start each floor with +$100', passive: true, rarity: 'common' },
    { id: 'devilsDice', name: "Devil's Dice", icon: '🎲', desc: '10% chance for double payout', passive: true, rarity: 'rare' },
    { id: 'snakeEyes', name: 'Snake Eyes', icon: '🐍', desc: '2s count as 3s for you', passive: true, rarity: 'common' },
    { id: 'aceInHole', name: 'Ace in the Hole', icon: '🃏', desc: 'Start with an ace in hand once per floor', uses: 1, maxUses: 1, rarity: 'legendary' },
    { id: 'bloodPact', name: 'Blood Pact', icon: '🩸', desc: 'Pay $50 to peek at next card', usable: true, rarity: 'uncommon' },
    { id: 'goldenHorseshoe', name: 'Golden Horseshoe', icon: '🧲', desc: 'Pushes become wins', passive: true, rarity: 'legendary' },
    { id: 'rabbitFoot', name: "Rabbit's Foot", icon: '🐰', desc: 'First loss each floor refunds bet', uses: 1, maxUses: 1, rarity: 'rare' },
    { id: 'cursedMirror', name: 'Cursed Mirror', icon: '🪞', desc: 'Copy boss abilities (risky)', passive: true, rarity: 'legendary' },
    { id: 'heavyWallet', name: 'Heavy Wallet', icon: '👛', desc: '+5% win chance per $1000 held', passive: true, rarity: 'uncommon' },
    { id: 'gamblersBane', name: "Gambler's Bane", icon: '☠️', desc: 'All-in bets pay 2x', passive: true, rarity: 'rare' },
    { id: 'phoenixFeather', name: 'Phoenix Feather', icon: '🔥', desc: 'Once per run: Revive at $500 if broke', uses: 1, maxUses: 1, rarity: 'legendary' },
    { id: 'cardShark', name: 'Card Shark', icon: '🦈', desc: 'See top card of deck', passive: true, rarity: 'rare' }
];

// Curses - negative effects that accumulate
const CURSES = [
    { id: 'badLuck', name: 'Bad Luck', icon: '🖤', desc: 'Lose $10 extra on losses', effect: 'extraLoss', value: 10 },
    { id: 'heavyDebt', name: 'Heavy Debt', icon: '📜', desc: 'Lose $25 per hand', effect: 'perHandCost', value: 25 },
    { id: 'shaky', name: 'Shaky Hands', icon: '😰', desc: 'Can\'t stand on 17-19', effect: 'mustHit', value: 19 },
    { id: 'marked', name: 'Marked Cards', icon: '🎯', desc: 'Dealer sees your cards', effect: 'dealerSees', value: true },
    { id: 'taxed', name: 'Casino Tax', icon: '💸', desc: 'Wins pay 20% less', effect: 'reducedWin', value: 0.2 },
    { id: 'paranoid', name: 'Paranoid', icon: '👀', desc: 'Can\'t see your score', effect: 'hiddenScore', value: true },
    { id: 'impatient', name: 'Impatient', icon: '⏰', desc: 'Must decide within 5 seconds', effect: 'timer', value: 5 },
    { id: 'poorEyesight', name: 'Poor Eyesight', icon: '👓', desc: 'Card suits are hidden', effect: 'hiddenSuits', value: true }
];

// Elite dealers - mini-bosses
const ELITES = [
    { id: 'cardShark', name: 'THE CARD SHARK', icon: '🦈', desc: '"I smell fear..."', rule: 'Draws from bottom of deck', ability: 'bottomDraw' },
    { id: 'timekeeper', name: 'THE TIMEKEEPER', icon: '⏰', desc: '"Time is money, literally."', rule: 'You have 10 seconds per decision', ability: 'timer', value: 10 },
    { id: 'collector', name: 'THE COLLECTOR', icon: '🏺', desc: '"Your relics... give them."', rule: 'Lose a random relic if you lose', ability: 'stealRelic' },
    { id: 'mirror', name: 'THE MIRROR', icon: '🪞', desc: '"I am you, but better."', rule: 'Copies your hand values', ability: 'mirrorHand' },
    { id: 'highRoller', name: 'HIGH ROLLER', icon: '🎰', desc: '"Go big or go home!"', rule: 'Minimum bet is $300', ability: 'minBet', value: 300 },
    { id: 'trickster', name: 'THE TRICKSTER', icon: '🃏', desc: '"Nothing is what it seems!"', rule: 'Card values randomly shift ±1', ability: 'shiftValues' },
    { id: 'banker', name: 'THE BANKER', icon: '🏦', desc: '"Interest compounds quickly."', rule: 'Lose: pay 1.5x. Win: get 1.5x', ability: 'compound', value: 1.5 },
    { id: 'phantom', name: 'THE PHANTOM', icon: '👻', desc: '"Now you see me..."', rule: 'Dealer\'s cards all face-down', ability: 'hiddenDealer' }
];

// Bosses - one per floor, increasing difficulty
const BOSSES = [
    { 
        id: 'pitboss', 
        name: 'THE PIT BOSS', 
        icon: '👔', 
        desc: '"I run this floor."', 
        rule: 'Dealer stands on 18+',
        dealerStandsOn: 18,
        reward: { type: 'money', value: 200 }
    },
    { 
        id: 'ladyluck', 
        name: 'LADY LUCK', 
        icon: '🎭', 
        desc: '"Luck is just math you don\'t understand."', 
        rule: 'All cards face-down until stand',
        hideCards: true,
        reward: { type: 'perk', value: 1 }
    },
    { 
        id: 'loanshark', 
        name: 'THE LOAN SHARK', 
        icon: '🦈', 
        desc: '"Let\'s make this interesting..."', 
        rule: 'Win = 2.5x, Lose = 2x loss',
        multiplierWin: 2.5,
        multiplierLose: 2,
        reward: { type: 'relic', value: 1 }
    },
    { 
        id: 'countess', 
        name: 'THE COUNTESS', 
        icon: '🧛', 
        desc: '"Your blood... I mean money..."', 
        rule: 'Lose $75 every time you hit',
        hitCost: 75,
        reward: { type: 'money', value: 500 }
    },
    { 
        id: 'twins', 
        name: 'THE TWINS', 
        icon: '👯', 
        desc: '"Two heads are better than one."', 
        rule: 'Must beat TWO dealer hands',
        doubleDealer: true,
        reward: { type: 'removeCurse', value: 'all' }
    },
    { 
        id: 'dealer', 
        name: 'THE GRANDMASTER', 
        icon: '🎩', 
        desc: '"I taught Satan everything he knows."', 
        rule: 'Dealer always hits soft 17',
        dealerHitsSoft17: true,
        reward: { type: 'relic', value: 1 }
    },
    { 
        id: 'satan', 
        name: 'SATAN HIMSELF', 
        icon: '👹', 
        desc: '"You dare challenge ME?!"', 
        rule: 'Dealer starts with 3 cards',
        dealerCards: 3,
        reward: { type: 'victory', value: true }
    }
];

// Random events
const EVENTS = [
    {
        id: 'mysteriousStranger',
        name: 'Mysterious Stranger',
        icon: '🕴️',
        desc: 'A cloaked figure approaches with a proposition...',
        choices: [
            { text: '💰 Pay $100 for a secret', cost: 100, reward: { type: 'relic', value: 'random' } },
            { text: '🚶 Walk away', cost: 0, reward: null },
            { text: '🤝 Trade a perk', cost: 'perk', reward: { type: 'relic', value: 'random' } }
        ]
    },
    {
        id: 'devilDeal',
        name: "Devil's Deal",
        icon: '😈',
        desc: 'The devil offers you power... at a price.',
        choices: [
            { text: '🩸 Take curse, gain rare perk', cost: 'curse', reward: { type: 'perk', value: 'rare' } },
            { text: '💎 Take curse, gain $500', cost: 'curse', reward: { type: 'money', value: 500 } },
            { text: '❌ Decline', cost: 0, reward: null }
        ]
    },
    {
        id: 'lostWallet',
        name: 'Lost Wallet',
        icon: '👛',
        desc: 'You find a wallet on the ground!',
        choices: [
            { text: '🤑 Take the money ($50-200)', cost: 0, reward: { type: 'money', value: 'random', min: 50, max: 200 } },
            { text: '😇 Return it (karma)', cost: 0, reward: { type: 'removeCurse', value: 'random' } },
            { text: '🔍 Search for owner', cost: 0, reward: { type: 'event', value: 'random' } }
        ]
    },
    {
        id: 'cardGambler',
        name: 'Card Gambler',
        icon: '🃏',
        desc: '"Pick a card, any card! Win big or lose big!"',
        choices: [
            { text: '🎴 High Card ($100 bet)', cost: 100, reward: { type: 'gamble', value: 'highCard' } },
            { text: '🎴 Suit Match ($50 bet)', cost: 50, reward: { type: 'gamble', value: 'suitMatch' } },
            { text: '🚫 No thanks', cost: 0, reward: null }
        ]
    },
    {
        id: 'cursedChest',
        name: 'Cursed Chest',
        icon: '📦',
        desc: 'An ominous chest beckons you...',
        choices: [
            { text: '🔓 Open it (risky)', cost: 0, reward: { type: 'cursedChest', value: true } },
            { text: '🔥 Burn it', cost: 0, reward: { type: 'money', value: 25 } },
            { text: '🚪 Leave it', cost: 0, reward: null }
        ]
    },
    {
        id: 'fortuneTeller',
        name: 'Fortune Teller',
        icon: '🔮',
        desc: '"I see your future... for a small fee."',
        choices: [
            { text: '💵 Pay $75 - See boss ability', cost: 75, reward: { type: 'bossReveal', value: true } },
            { text: '💵 Pay $50 - See next 3 cards', cost: 50, reward: { type: 'peekDeck', value: 3 } },
            { text: '🙅 Pass', cost: 0, reward: null }
        ]
    },
    {
        id: 'blackMarket',
        name: 'Black Market',
        icon: '🕳️',
        desc: 'Shady dealers offer forbidden wares...',
        choices: [
            { text: '🗡️ Buy cursed relic ($0)', cost: 0, reward: { type: 'cursedRelic', value: true } },
            { text: '💀 Sell health for relic', cost: 'health', costValue: 200, reward: { type: 'relic', value: 'random' } },
            { text: '🚶 Leave', cost: 0, reward: null }
        ]
    },
    {
        id: 'blessedShrine',
        name: 'Blessed Shrine',
        icon: '⛩️',
        desc: 'A holy place untouched by the casino\'s corruption.',
        choices: [
            { text: '🙏 Pray (remove curse)', cost: 0, reward: { type: 'removeCurse', value: 'random' } },
            { text: '💝 Donate $100', cost: 100, reward: { type: 'blessing', value: true } },
            { text: '😤 Defile it (gain $200, gain curse)', cost: 'curse', reward: { type: 'money', value: 200 } }
        ]
    },
    {
        id: 'drunkGambler',
        name: 'Drunk Gambler',
        icon: '🍺',
        desc: '"*hic* I\'ll bet you anything!"',
        choices: [
            { text: '🃏 Play him for $150', cost: 150, reward: { type: 'gamble', value: 'easyWin' } },
            { text: '🤝 Help him home', cost: 0, reward: { type: 'perk', value: 'common' } },
            { text: '👋 Ignore', cost: 0, reward: null }
        ]
    },
    {
        id: 'breakingNews',
        name: 'Breaking News!',
        icon: '📺',
        desc: 'The casino announces a special event!',
        choices: [
            { text: '🎉 Join the tournament', cost: 0, reward: { type: 'tournament', value: true } },
            { text: '📺 Just watch', cost: 0, reward: { type: 'money', value: 50 } }
        ]
    }
];

// Shop items (base prices, scaled by floor)
const SHOP_ITEMS = {
    healSmall: { name: 'First Aid', icon: '🩹', desc: 'Restore $100', type: 'heal', value: 100, baseCost: 75 },
    healMedium: { name: 'Medical Kit', icon: '💊', desc: 'Restore $250', type: 'heal', value: 250, baseCost: 175 },
    healLarge: { name: 'Surgery', icon: '🏥', desc: 'Restore $500', type: 'heal', value: 500, baseCost: 350 },
    removeCurse: { name: 'Exorcism', icon: '✨', desc: 'Remove a curse', type: 'removeCurse', value: 1, baseCost: 150 },
    randomPerk: { name: 'Mystery Perk', icon: '❓', desc: 'Random perk', type: 'randomPerk', value: 1, baseCost: 200 },
    randomRelic: { name: 'Mystery Relic', icon: '🎁', desc: 'Random relic', type: 'randomRelic', value: 1, baseCost: 400 },
    extraLife: { name: 'Phoenix Down', icon: '🔥', desc: 'Revive once if broke', type: 'extraLife', value: 1, baseCost: 500 },
    deckPeek: { name: 'Marked Cards', icon: '👁️', desc: 'See next 5 cards', type: 'deckPeek', value: 5, baseCost: 100 },
    reduceBet: { name: 'VIP Pass', icon: '🎫', desc: 'Halve min bet this floor', type: 'reduceBet', value: 0.5, baseCost: 100 },
    refreshShop: { name: 'New Stock', icon: '🔄', desc: 'Refresh shop items', type: 'refresh', value: 1, baseCost: 50 }
};

// Rest site options
const REST_OPTIONS = [
    { id: 'rest', name: 'Rest', icon: '😴', desc: 'Recover $150', effect: 'heal', value: 150 },
    { id: 'meditate', name: 'Meditate', icon: '🧘', desc: 'Upgrade a random perk', effect: 'upgradePerk', value: 1 },
    { id: 'train', name: 'Train', icon: '💪', desc: 'Gain a common perk', effect: 'randomPerk', value: 'common' },
    { id: 'gamble', name: 'Gamble', icon: '🎰', desc: 'Win $300 or lose $100', effect: 'gamble', win: 300, lose: 100 }
];

// Treasure rewards
const TREASURE_REWARDS = [
    { type: 'money', min: 100, max: 300, weight: 40 },
    { type: 'perk', value: 'random', weight: 25 },
    { type: 'relic', value: 'random', weight: 15 },
    { type: 'curse', value: 'random', weight: 10 }, // Mimic!
    { type: 'nothing', value: null, weight: 10 } // Empty
];

// Gamble room games
const GAMBLE_GAMES = [
    { id: 'coinFlip', name: 'Coin Flip', icon: '🪙', desc: '50/50 - Double or nothing', odds: 0.5 },
    { id: 'diceRoll', name: 'Dice Roll', icon: '🎲', desc: 'Roll 4+ to win 1.5x', odds: 0.5, multiplier: 1.5 },
    { id: 'wheelSpin', name: 'Wheel of Fortune', icon: '🎡', desc: 'Spin for prizes!', special: 'wheel' },
    { id: 'slots', name: 'Slot Machine', icon: '🎰', desc: 'Match symbols to win big!', special: 'slots' }
];

// Messages
const MESSAGES = {
    broke: [
        "The house always wins, and by 'house' we mean MY house. Thanks for the mortgage payment!",
        "Your wallet called. It filed for divorce.",
        "Congratulations! You've unlocked the 'Complete Financial Ruin' achievement!",
        "Fun fact: The dealer's kids just got a new PlayStation. Thanks!",
        "Maybe gambling isn't for you. Have you tried crying?",
        "Your credit score just sent its condolences.",
        "Plot twist: The cards were printed by the dealer's cousin.",
        "The good news: You can't lose any more money. The bad news: Everything else.",
        "This is why your parents wanted you to be a doctor.",
        "Don't worry, bankruptcy builds character! (It doesn't)"
    ],
    
    win: [
        "Wait, that wasn't supposed to happen... *checks code*",
        "ERROR 404: Dealer victory not found. Enjoy it while it lasts.",
        "The dealer is currently crying in the bathroom.",
        "You won?! The algorithm must be broken. Don't get used to it.",
        "Congratulations! You've delayed your inevitable defeat!",
        "The RNG hamster must have sneezed. Lucky you!"
    ],
    
    lose: [
        "Working as intended. 😈",
        "The dealer sends his regards.",
        "Did you really think you had a chance?",
        "Another satisfied customer! (We're satisfied, not you)",
        "The dealer winks at you menacingly.",
        "Your money is in a better place now. (Our pockets)"
    ],
    
    bust: [
        "BUST! The dealer didn't even have to cheat this time!",
        "Over 21! Your cards betrayed you. (We paid them)",
        "Busted! The house thanks you for your generous donation.",
        "💥 BOOM! There goes your bet!",
        "You played yourself. Literally.",
        "The house thanks you for your generous donation."
    ],
    
    dealerBlackjack: [
        "BLACKJACK! What are the odds?! (Very high, actually)",
        "Natural 21! The dealer is just built different.",
        "Wow, another blackjack! Must be the dealer's lucky day! (Every day is)",
        "Blackjack! The cards really love the dealer. Wonder why. 🤔"
    ],
    
    multiCard21: [
        "21 with {count} cards! The dealer has SKILLS! 🎯",
        "{count}-card 21! That's not luck, that's DESTINY!",
        "Dealer hits 21 with {count} cards! *chef's kiss* 👨‍🍳"
    ],
    
    floorComplete: [
        "Floor cleared! The elevator beckons upward...",
        "You survived! But can you survive what's next?",
        "Victory! The casino trembles at your luck.",
        "Floor beaten! Satan is getting nervous..."
    ],
    
    newFloor: [
        "Welcome to Floor {floor}. The stakes get higher.",
        "Floor {floor}. The air feels heavier here.",
        "You've reached Floor {floor}. Turn back? Ha, no exits.",
        "Floor {floor}. The dealers here don't play nice."
    ]
};

