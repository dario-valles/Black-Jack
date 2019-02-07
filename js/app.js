function Player (playerName, wins, currentCards) {
  this.name = playerName;
  this.wins = wins;
  this.currentCards = currentCards;

  this.initialize = function () {
    this.wins = 0;
    this.currentCards = [];
  };
}

const baseDeck = () => {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
  const suits = ['diamon', 'club', 'heart', 'spade'];
  const imagePath = `./cards/`;

  const newDeck = () => {
    let deck = [];
    cards.forEach (card => {
      // let finalCard = [];
      suits.forEach (suit => {
        deck.push (card, suit, `${imagePath}_${card}.png`);
      });
    });
    return randomizeDeck (deck);
  };

  const randomizeDeck = deck => {
    let randomizedDeck = [];

    while (deck.length >= 1) {
      let randomNumber = Math.floor (Math.random () * (deck.length - 1));
      randomizedDeck.push (deck.splice (randomNumber, 1));
    }
    return randomizedDeck;
  };

  return randomizeDeck (newDeck ());
};

const gameRules = {
  tens: [10, 'jack', 'queen', 'king'],
  isAce: card => card === 1,

  receiveCard: function (deck, player) {
    return player.currentCards.push (deck.pop ());
  },

  playerCards: function (player) {
    let cards = [];
    player.currentCards.forEach (card => {
      cards.push (card[0]);
    });
    return cards;
  },

  playerHasBlackJack: function (player) {
    if (player.currentCards.length !== 2) return false;

    let cards = this.playerCards (player);

    return (
      cards.some (card => card === 1) &&
      cards.some (card => this.tens.includes (card))
    );
  },

  calculateCardsValue: function (player) {
    const cards = this.playerCards (player);
    let aces = 0;
    let total = 0;

    cards.forEach (card => {
      if (this.isAce (card)) {
        aces++;
      } else {
        total += this.tens.includes (card) ? 10 : card;
      }
    });

    if (aces) {
      if (total <= 10 && aces === 1) {
        return total + aces;
      }
    } else {
      return total;
    }
  },

  playerHasPassed: function (player) {
    return;
  },

  checkWin: function (player1, player2) {
    return;
  },
};

const newGame = baseDeck ();
let computer = new Player ('computer');
let human = new Player ('human');
// console.log (newGame);
computer.wins = 10;
// console.log (computer);
computer.initialize ();
computer.currentCards.push (['king', 'hearts']);
computer.currentCards.push ([1, 'hearts']);
computer.currentCards.push ([1, 'hearts']);
computer.currentCards.push ([2, 'hearts']);
// console.log(gameRules.playerHasBlackJack(computer));
console.log (gameRules.calculateCardsValue (computer));
gameRules.receiveCard (newGame, computer);
// console.log (computer.currentCards[0]);
// console.log(gameRules.isAce(10));

$ ('.btn-white').click (function () {
  setTimeout (() => $ ('.welcome').css ('display', 'none'), 1200);
  $ ('.welcome').addClass ('welcome-out');
});
