import Die from './Die.js';
import Player from './Player.js';

class YamsGame {
    constructor(playerNames) {
        this.players = playerNames.map(name => new Player(name));
        this.dice = Array.from({ length: 5 }, () => new Die());
        this.currentTurn = 0;
    }

    rollDice() {
        this.dice.forEach(die => die.roll());
    }

    displayDice() {
        return this.dice.map(die => die.value);
    }

    currentPlayer() {
        return this.players[this.currentTurn % this.players.length];
    }

    nextTurn() {
        this.currentTurn++;
    }
}

export default YamsGame;