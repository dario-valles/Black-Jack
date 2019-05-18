// Fisrst release before Codeworks Bootcamp starts
// Hope I'll have time tpo refactor after BootCamp adding observables and applying all learned things

const imagePath = `./img/cards/`
let deck
let computer = new Player()
let human = new Player()

$('#play').click(() => {
  newGame()
  $('.welcome').addClass('welcome-out')
})

$('#hit').click(() => {
  animations.disableButtons(true)
  gameRules.receiveCard(deck, human)

  if (gameRules.playerHasPassed(human)) {
    computer.wins++
    sleep(2000).then(() => endGame('You Loose'))
  } else {
    sleep(2000).then(() => animations.disableButtons(false))
  }
})
$('#stay').click(() => runComputer())

function newGame () {
  inicialice()

  setTimeout(() => {
    $('.welcome').css('display', 'none')
    animations.start(deck)
    gameRules.receiveCard(deck, human)
    sleep(1000).then(() => gameRules.receiveCard(deck, computer))
    sleep(2000).then(() => gameRules.receiveCard(deck, human))
    sleep(2100).then(() => {
      if (gameRules.playerHasBlackJack(human)) {
        animations.disableButtons(true)
        if (gameRules.playerHasBlackJack(computer)) {
          computer.wins++
          sleep(2000).then(() => endGame('You Loose'))
        } else {
          human.wins++
          sleep(2000).then(() => endGame('You Win'))
        }
      }
      sleep(2000).then(() => animations.disableButtons(false))
    })
  }, 1200)
}

function inicialice () {
  deck = baseDeck()

  human.initialize()
  human.positionX = 65
  human.positionY = 62

  computer.initialize()
  computer.positionX = 65
  computer.positionY = 25
  computer.isHuman = false
}

function runComputer () {
  const playerValue = gameRules.calculateCardsValue(human)
  let computerValue = gameRules.calculateCardsValue(computer)

  animations.disableButtons(true)

  if (gameRules.playerHasBlackJack(computer)) {
    computer.wins += 1
    sleep(1000).then(() => endGame('You Win - Black Jack'))
  }

  sleep(1990).then(() => gameRules.receiveCard(deck, computer))
  sleep(2000).then(() => {
    if (gameRules.playerHasPassed(computer)) {
      human.wins++
      sleep(1000).then(() => endGame('You Win'))
    } else {
      computerValue = gameRules.calculateCardsValue(computer)
      if (computerValue >= 17) {
        if (computerValue >= playerValue) {
          computer.wins++
          sleep(1000).then(() => endGame('You Lose'))
        } else {
          human.wins++
          sleep(1000).then(() => endGame('You Win'))
        }
      } else {
        runComputer()
      }
    }
  })
}
// Pendiente
// class Player {
//   constructor(playerName currentCards, positionX, positionY, isHuman) {
//     this.playerName = playerName;
//     this.wins = 0;

//   }
// }

function Player (playerName, wins, currentCards, positionX, positionY, isHuman) {
  this.name = playerName
  this.wins = wins || 0
  this.currentCards = currentCards
  this.positionX = positionX
  this.positionY = positionY
  this.isHuman = true

  this.initialize = function () {
    this.currentCards = []
  };
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function baseDeck () {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king']
  const suits = ['diamond', 'club', 'heart', 'spade']
  // Positions in % from mat: x = right, y = top
  const startPositionX = 35
  const startPositionY = 35

  const newDeck = () => {
    const deck = []

    cards.forEach(card => {
      suits.forEach(suit => {
        deck.push({
          card: card,
          suit: suit,
          cardId: 0,
          image: `${imagePath}${suit}_${card}.png`,
          positionX: startPositionX,
          positionY: startPositionY
        })
      })
    })
    return randomizeDeck(deck)
  };

  const randomizeDeck = deck => {
    let randomizedDeck = []

    while (deck.length >= 1) {
      let randomNumber = Math.floor(Math.random() * (deck.length - 1))
      randomizedDeck = randomizedDeck.concat(deck.splice(randomNumber, 1))
    }
    return randomizedDeck
  };

  return randomizeDeck(newDeck())
}

const gameRules = {
  tens: [10, 'jack', 'queen', 'king'],
  isAce: card => card === 1,

  receiveCard: function (deck, player, flip = true) {
    let card = deck.pop()
    animations.moveCard(card, flip, player)
    player.currentCards.push(card)
  },

  playerCards: function (player) {
    let cards = []
    player.currentCards.forEach(card => {
      cards.push(card.card)
    })
    return cards
  },

  playerHasBlackJack: function (player) {
    if (player.currentCards.length !== 2) return false

    let cards = this.playerCards(player)

    return (
      cards.some(card => card === 1) &&
      cards.some(card => this.tens.includes(card))
    )
  },

  calculateCardsValue: function (player) {
    const cards = this.playerCards(player)
    let aces = 0
    let total = 0

    cards.forEach(card => {
      if (this.isAce(card)) {
        aces++
      } else {
        total += this.tens.includes(card) ? 10 : card
      }
    })

    if (aces) {
      if (total <= 10 && aces === 1) {
        return total + 11
      } else {
        return total + aces
      }
    } else {
      return total
    }
  },

  playerHasPassed: function (player) {
    return this.calculateCardsValue(player) > 21
  },

  checkWin: function (player1, player2) {}
}

const animations = {
  initialRotation: 0,
  rotate: -180 / 52,
  backCardImage: imagePath + 'back-aqua.png',
  cardWidth: 6.5,

  setInitialPosition: function (deck) {
    if (computer.wins > 0 || human.wins > 0) {
      $('.cards').remove()
    }

    deck.forEach((card, index) => {
      card.cardId = index
      $('.game-mat').append(
        () =>
          `<img src=${this.backCardImage} id="${card.cardId}" class="cards"/>` // class="${card.cardId}"/>`
      )
      $(`#${card.cardId}`).css({
        position: 'absolute',
        width: `${this.cardWidth}rem`,
        right: `${card.positionX}%`,
        top: `${card.positionY}%`,
        transform: `rotate(-90deg)`
      })
    })
  },

  start: function (deck) {
    let move = 0.2
    let moveY = 0

    this.setInitialPosition(deck)
    deck.forEach((card, index) => {
      card.positionX += Math.log(move) * 2
      card.positionY += moveY
      this.initialRotation += index <= 100 ? this.rotate : -this.rotate
      move += index >= 25 ? -0.2 : 0.2
      moveY += 0.35
      $(`#${card.cardId}`).animate(
        {
          right: `${card.positionX}%`,
          top: `${card.positionY}%`
        },
        300
      )
      $(`#${card.cardId}`).css({
        transform: `rotate(${this.initialRotation}deg)`
      })
    })
  },

  moveCard: function (card, flip, player) {
    $(`#${card.cardId}`).css('transform', 'rotate(0deg)')
    $(`#${card.cardId}`).animate(
      {
        right: player.positionX + '%',
        top: player.positionY + '%'
      },
      1000,
      () => {
        if (flip) $(`#${card.cardId}`).attr('src', card.image)
      }
    )
    player.positionX -= 1.5
  },

  disableButtons: function (disabled) {
    $('#hit').attr('disabled', disabled)
    $('#stay').attr('disabled', disabled)
  }
}

const endGame = message => {
  $('.result')
    .html(message)
    .animate(
      {
        fontSize: '30rem',
        opacity: '.9',
        left: '3rem'
      },
      2000,
      function () {
        $('.result')
          .html('')
          .css({
            fontSize: '.1rem',
            top: '3rem',
            opacity: 0,
            left: '30rem'
          })
      }
    )
  $('#computer-score').html(computer.wins)
  $('#human-score').html(human.wins)

  newGame()
};
