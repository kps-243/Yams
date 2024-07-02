import Dice from './de.js';
import Player from './player.js';
import ScoreBoard from './scoreBoard.js';

class YamsGame {
    constructor(playerNames) {
        this.players = playerNames.map(name => new Player(name));
        this.dice = Array.from({ length: 5 }, () => new Dice());
        this.currentTurn = 0;
    }

    rollDice() {
        this.dice.forEach(die => die.throw());
    }

    displayDice() {
        return this.dice.map(die => die.valeur);
    }

    currentPlayer() {
        return this.players[this.currentTurn % this.players.length];
    }

    nextTurn() {
        this.currentTurn++;
    }

    
}

export default YamsGame;