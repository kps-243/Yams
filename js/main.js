import YamsGame from "./classes/YamsGame.js";
import ScoreBoard from "./classes/scoreBoard.js";
import Dice from "./classes/de.js"
import Player from "./classes/player.js";


const buttons = {
    brelan: document.querySelector('#buttonBrelan'),
    carre: document.querySelector('#buttonCarre'),
    fullHouse: document.querySelector('#buttonFullHouse'),
    petiteSuite: document.querySelector('#buttonPetiteSuite'),
    grandeSuite: document.querySelector('#buttonGrandeSuite'),
    yams: document.querySelector('#buttonYams'),
    chance: document.querySelector('#buttonChance'),
    as: document.querySelector('#buttonAs'),
    deux: document.querySelector('#buttonDeux'),
    trois: document.querySelector('#buttonTrois'),
    quatre: document.querySelector('#buttonQuatre'),
    cinq: document.querySelector('#buttonCinq'),
    six: document.querySelector('#buttonSix')
};

const game = new YamsGame(["Alice", "Bob"]);


document.getElementById("rollButton").addEventListener("click", () => {
    game.rollDice();
});




game.dice.map(de => de.updateDiceImage)


console.log(`Rolled dice: ${game.displayDice()}`);
const player = game.currentPlayer();
console.log(`It's ${player.name}'s turn`);

// Example of recording a score
const scoreBoard = new ScoreBoard;

let valeur = game.dice.reduce((acc, de) => acc + de.valeur, 0);

const valeurs = game.dice.map(de => de.valeur);
const compte = {};


valeurs.forEach(valeur => {
    if (compte[valeur]) {
        compte[valeur]++;
    } else {
        compte[valeur] = 1;
    }
});

for (let valeur in compte) {
    if (compte[valeur] === 3) {
        buttons.brelan.style.display = "block";
        buttons.brelan.addEventListener("click", addBrelan);
    }

    if (compte[valeur] === 4) {
        buttons.carre.style.display = "block";
        buttons.carre.addEventListener("click", addCarre);
    }

    if (isFullHouse(compte)) {
        buttons.fullHouse.style.display = "block";
        buttons.fullHouse.addEventListener("click", addFullHouse);
    }

    if (isPetiteSuite(compte)) {
        buttons.petiteSuite.style.display = "block";
        buttons.petiteSuite.addEventListener("click", addPetiteSuite);
    }

    if (isGrandeSuite(compte)) {
        buttons.grandeSuite.style.display = "block";
        buttons.grandeSuite.addEventListener("click", addGrandeSuite);
    }

    if (compte[valeur] === 5) {
        buttons.yams.style.display = "block";
        buttons.yams.addEventListener("click", addYams);
    }
    if (valeur === 1) {
        buttons.as.style.display = "block";
        buttons.un.addEventListener("click", () => addScore(1));
    }
    if (valeur == 2) {
        buttons.deux.style.display = "block";
        buttons.deux.addEventListener("click", () => addScore(2));
    }
    if (valeur == 3) {
        buttons.trois.style.display = "block";
        buttons.trois.addEventListener("click", () => addScore(3));
    }
    if (valeur == 4) {
        buttons.quatre.style.display = "block";
        buttons.quatre.addEventListener("click", () => addScore(4));
    }
    if (valeur == 5) {
        buttons.cinq.style.display = "block";
        buttons.cinq.addEventListener("click", () => addScore(5));
    }
    if (valeur == 6) {
        buttons.six.style.display = "block";
        buttons.six.addEventListener("click", () => addScore(6));
    }

    // La chance est toujours disponible
    buttons.chance.style.display = "block";
    buttons.chance.addEventListener("click", addChance);
}

function addBrelan() {
    scoreBoard.recordScore("brelan", 30);
}

function addCarre() {
    scoreBoard.recordScore("carre", 40);
}

function addFullHouse() {
    scoreBoard.recordScore("fullHouse", 35);
}

function addPetiteSuite() {
    scoreBoard.recordScore("petiteSuite", 20);
}

function addGrandeSuite() {
    scoreBoard.recordScore("grandeSuite", 25);
}

function addYams() {
    scoreBoard.recordScore("yams", 50);
}

if (valeur === 1) {
    buttons.as.style.display = "block";
    buttons.un.addEventListener("click", () => addScore(1));
}
if (valeur == 2) {
    buttons.deux.style.display = "block";
    buttons.deux.addEventListener("click", () => addScore(2));
}
if (valeur == 3) {
    buttons.trois.style.display = "block";
    buttons.trois.addEventListener("click", () => addScore(3));
}
if (valeur == 4) {
    buttons.quatre.style.display = "block";
    buttons.quatre.addEventListener("click", () => addScore(4));
}
if (valeur == 5) {
    buttons.cinq.style.display = "block";
    buttons.cinq.addEventListener("click", () => addScore(5));
}
if (valeur == 6) {
    buttons.six.style.display = "block";
    buttons.six.addEventListener("click", () => addScore(6));
}


function addChance() {
    let total = 0;
    for (let valeur in compte) {
        total += valeur * compte[valeur];
    }
    scoreBoard.recordScore("chance", total);
}

function isFullHouse(compte) {
    let hasThree = false;
    let hasTwo = false;
    for (let valeur in compte) {
        if (compte[valeur] === 3) hasThree = true;
        if (compte[valeur] === 2) hasTwo = true;
    }
    return hasThree && hasTwo;
}

function isPetiteSuite(compte) {
    const suites = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    return suites.some(suite => suite.every(num => compte[num] >= 1));
}

function isGrandeSuite(compte) {
    const suites = [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6]
    ];
    return suites.some(suite => suite.every(num => compte[num] >= 1));
}

function addScore(valeur) {
    let total = valeur * compte[valeur];
    scoreBoard.recordScore(valeur, total);
}

console.log(`${player.name}'s lower section score: ${scoreBoard.totalLowerSection()}`); // Display lower section total
console.log(`${player.name}'s upper section score: ${scoreBoard.totalUpperSection()}`); // Display upper section total
console.log(`${player.name}'s total score: ${scoreBoard.totalScore()}`); // Display total score

game.nextTurn();

console.log(game.currentPlayer());
