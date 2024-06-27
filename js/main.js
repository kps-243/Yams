import YamsGame from "./classes/YamsGame";
import ScoreBoard from "./classes/scoreBoard";
import Dice from "./classes/de"
import Player from "./classes/player";

const game = new YamsGame(["Alice", "Bob"]);

game.rollDice();
console.log(`Rolled dice: ${game.displayDice()}`);
const player = game.currentPlayer();
console.log(`It's ${player.name}'s turn`);

// Example of recording a score
const scoreBoard = game.currentScoreBoard();
scoreBoard.recordScore('chance', 15); // Record 15 points in the "chance" category

console.log(`${player.name}'s upper section score: ${scoreBoard.totalUpperSection()}`); // Display upper section total
console.log(`${player.name}'s lower section score: ${scoreBoard.totalLowerSection()}`); // Display lower section total
console.log(`${player.name}'s total score: ${scoreBoard.totalScore()}`); // Display total score

game.nextTurn();
