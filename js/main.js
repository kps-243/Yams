import YamsGame from "./classes/YamsGame.js";
import ScoreBoard from "./classes/scoreBoard.js";
import Dice from "./classes/de.js"
import Player from "./classes/player.js";

const game = new YamsGame(["Alice", "Bob"]);


game.rollDice();

console.log(`Rolled dice: ${game.displayDice()}`);
const player = game.currentPlayer();
console.log(`It's ${player.name}'s turn`);

// Example of recording a score
const scoreBoard = new ScoreBoard;

let valeur = game.dice.reduce((acc, de) => acc + de.valeur, 0);

const valeurs = game.dice.map(de => de.valeur);
const compte = {};

// Compter le nombre de fois que chaque valeur apparaît
valeurs.forEach(valeur => {
    if (compte[valeur]) {
        compte[valeur]++;
    } else {
        compte[valeur] = 1;
    }
});
for (let valeur in compte) {
    if (compte[valeur] === 3) {
        scoreBoard.recordScore("brelan", 15);
    }
}


scoreBoard.recordScore("chance", valeur);

console.log(`${player.name}'s upper section score: ${scoreBoard.totalUpperSection()}`); // Display upper section total
console.log(`${player.name}'s lower section score: ${scoreBoard.totalLowerSection()}`); // Display lower section total
console.log(`${player.name}'s total score: ${scoreBoard.totalScore()}`); // Display total score

game.nextTurn();

console.log(game.currentPlayer());
