// CRACKJACK - Game Configuration
// All game data, perks, bosses, and messages

const CONFIG = {
    STARTING_MONEY: 1000,
    ESCAPE_GOAL: 10000,
    WINS_FOR_UPGRADE: 3,
    SHUFFLE_THRESHOLD: 20,
    
    SUITS: ['♠', '♥', '♦', '♣'],
    VALUES: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
};

const PERKS = [
    { id: 'peek', name: 'X-Ray Vision', icon: '👁️', desc: "See dealer's hidden card (1x per round)", uses: 1, maxUses: 1 },
    { id: 'lucky7', name: 'Lucky 7s', icon: '🍀', desc: '7s count as 8 for you', passive: true },
    { id: 'insurance', name: 'Insurance Fraud', icon: '💰', desc: '30% chance to get bet back on loss', passive: true },
    { id: 'counter', name: 'Card Counter', icon: '🧠', desc: 'Shows bust probability', passive: true },
    { id: 'lessFucked', name: 'Bribe', icon: '🤝', desc: 'Reduces rig level by 20%', passive: true },
    { id: 'secondChance', name: 'Second Chance', icon: '🔄', desc: 'Undo last hit once per round', uses: 1, maxUses: 1 },
    { id: 'doubleOrNothing', name: 'High Roller', icon: '🎲', desc: 'Wins pay 1.5x', passive: true },
    { id: 'shield', name: 'Soul Shield', icon: '🛡️', desc: 'Survive one bust per floor', uses: 1, maxUses: 1 },
    { id: 'thief', name: 'Pickpocket', icon: '🤏', desc: 'Steal $50 on dealer bust', passive: true },
    { id: 'meditation', name: 'Zen Mind', icon: '🧘', desc: 'Start each hand at 20 or less +$25', passive: true }
];

const BOSSES = [
    { id: 'pitboss', name: 'THE PIT BOSS', icon: '👔', desc: '"I run this floor."', rule: 'Dealer stands on 18+ instead of 17+', dealerStandsOn: 18 },
    { id: 'ladyluck', name: 'LADY LUCK', icon: '🎭', desc: '"Luck is just math you don\'t understand."', rule: 'All cards are face-down until you stand', hideCards: true },
    { id: 'loanshark', name: 'THE LOAN SHARK', icon: '🦈', desc: '"Let\'s make this interesting..."', rule: 'WIN = 3x payout, LOSE = 2x loss', multiplierWin: 3, multiplierLose: 2 },
    { id: 'countess', name: 'THE COUNTESS', icon: '🧛', desc: '"Your blood... I mean money..."', rule: 'Lose $50 every time you hit', hitCost: 50 },
    { id: 'satan', name: 'SATAN HIMSELF', icon: '👹', desc: '"You dare challenge ME?!"', rule: 'Dealer starts with 3 cards. 80% rig level.', dealerCards: 3, forceRig: 0.8 }
];

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
    ]
};

