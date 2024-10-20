// Utility function to create a deck and shuffle it
export function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
  
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
  
    return deck.sort(() => Math.random() - 0.5); // Shuffle the deck
  }
  
  // Calculate the hand value considering Ace as either 1 or 11
  export function calculateHandValue(hand: any) {
    let value = 0;
    let aces = 0;
  
    for (let card of hand) {
      if (['K', 'Q', 'J'].includes(card.value)) {
        value += 10;
      } else if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += parseInt(card.value);
      }
    }
  
    while (aces > 0 && value > 21) {
      value -= 10;
      aces -= 1;
    }
  
    return value;
  }
  