import * as THREE from "three";
import { TextureLoader } from "three";

// Scène et caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

// Ajouter le renderer au container
const container = document.getElementById("threejs-container");
container.appendChild(renderer.domElement);

// Charger les textures des dés
const loader = new TextureLoader();
const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice1.png") }),
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice2.png") }),
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice3.png") }),
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice4.png") }),
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice5.png") }),
    new THREE.MeshBasicMaterial({ map: loader.load("../image/dice6.png") }),
];

// Créer des dés avec des positions espacées
const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
const diceMeshes = [];

for (let i = 0; i < 5; i++) {
    const dice = new THREE.Mesh(diceGeometry, materials);
    dice.position.set(i * 2 - 4, 0.5, 0);
    scene.add(dice);
    diceMeshes.push(dice);
}

// Créer le plateau circulaire
const circleGeometry = new THREE.CircleGeometry(7, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 }); // Vert foncé pour le plateau
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.rotation.x = -Math.PI / 2;
scene.add(circle);

// Positionner la caméra au-dessus du plateau
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

let isRolling = false;
let stopRollTimeout;

// Fonction pour lancer les dés
function rollDice() {
    isRolling = true;
    diceInstances.forEach((dice) => dice.roll());
    clearTimeout(stopRollTimeout);
    stopRollTimeout = setTimeout(stopRolling, 3000);
}

function stopRolling() {
    isRolling = false;
    diceInstances.forEach((dice, index) => {
        setDiceFinalPosition(diceMeshes[index], dice.value);
    });
}

function setDiceFinalPosition(diceMesh, value) {
    switch (value) {
        case 1:
            diceMesh.rotation.set(0, 0, Math.PI / 2);
            break;
        case 2:
            diceMesh.rotation.set(0, 0, -Math.PI / 2);
            break;
        case 3:
            diceMesh.rotation.set(0, 0, 0);
            break;
        case 4:
            diceMesh.rotation.set(Math.PI, 0, 0);
            break;
        case 5:
            diceMesh.rotation.set(-Math.PI / 2, 0, 0);
            break;
        case 6:
            diceMesh.rotation.set(Math.PI / 2, 0, Math.PI / 2);
            break;
    }
}

function animate() {
    if (isRolling) {
        diceMeshes.forEach((diceMesh) => {
            diceMesh.rotation.x += 0.1;
            diceMesh.rotation.y += 0.05;
        });
    }
    renderer.render(scene, camera);
}

// Classe Die (mise à jour pour inclure les dés 3D)
class Die {
    constructor(mesh) {
        this.value = 1;
        this.locked = false;
        this.mesh = mesh;
    }

    roll() {
        if (!this.locked) {
            this.value = Math.floor(Math.random() * 6) + 1;
        }
    }

    toggleLock() {
        this.locked = !this.locked;
    }
}

// Initialiser les dés 3D
const diceInstances = diceMeshes.map(mesh => new Die(mesh));

// Gestion du bouton de lancer
document.getElementById('rollButton').onclick = rollDice;


class Player {
    constructor(name) {
        this.name = name;
        this.scoreSheet = {
            as: null,
            deux: null,
            trois: null,
            quatre: null,
            cinq: null,
            six: null,
            brelan: null,
            carre: null,
            fullHouse: null,
            petiteSuite: null,
            grandeSuite: null,
            yams: null,
            chance: null
        };
    }

    addScore(category, score) {
        this.scoreSheet[category] = score;
    }

    getTotalScore() {
        return Object.values(this.scoreSheet).reduce((acc, score) => acc + (score || 0), 0);
    }

    getAvailableCategories() {
        return Object.keys(this.scoreSheet).filter(category => this.scoreSheet[category] === null);
    }
}

class YamsGame {
    constructor(players) {
        this.players = players.map(name => new Player(name));
        this.currentPlayerIndex = 0;
        this.dice = diceInstances;
        this.round = 1;
        this.maxRounds = 13;
        this.rolls = 0;
        this.initializeScoreboard();
        this.updateCurrentPlayerDisplay();
        this.addDieClickEvents();
        this.updateSuggestions();
    }

    initializeScoreboard() {
        const tbody = document.getElementById('scoreboardBody');
        tbody.innerHTML = '';
        this.players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.id = `player${index}`;
            row.innerHTML = `
                <td>${player.name}</td>
                <td id="player${index}-as" data-category="as"></td>
                <td id="player${index}-deux" data-category="deux"></td>
                <td id="player${index}-trois" data-category="trois"></td>
                <td id="player${index}-quatre" data-category="quatre"></td>
                <td id="player${index}-cinq" data-category="cinq"></td>
                <td id="player${index}-six" data-category="six"></td>
                <td id="player${index}-brelan" data-category="brelan"></td>
                <td id="player${index}-carre" data-category="carre"></td>
                <td id="player${index}-fullHouse" data-category="fullHouse"></td>
                <td id="player${index}-petiteSuite" data-category="petiteSuite"></td>
                <td id="player${index}-grandeSuite" data-category="grandeSuite"></td>
                <td id="player${index}-yams" data-category="yams"></td>
                <td id="player${index}-chance" data-category="chance"></td>
                <td id="player${index}-total"></td>
            `;
            tbody.appendChild(row);
        });

        tbody.querySelectorAll('td[data-category]').forEach(cell => {
            cell.addEventListener('click', () => {
                this.markScore(cell);
            });
        });
    }

    addDieClickEvents() {
        document.querySelectorAll('.die').forEach((dieElement, index) => {
            dieElement.addEventListener('click', () => {
                this.dice[index].toggleLock();
                dieElement.classList.toggle('locked');
            });
        });
    }

    rollDice() {
        this.dice.forEach(die => die.roll());
        this.updateDiceDisplay();
        this.updateSuggestions();
    }

    updateDiceDisplay() {
        this.dice.forEach((die, index) => {
            const dieElement = document.getElementById(`die${index}`);
            dieElement.textContent = die.getValue();
            dieElement.classList.toggle('locked', die.locked);
        });
    }

    getDiceValues() {
        return this.dice.map(die => die.getValue());
    }

    countDiceValues() {
        const counts = Array(6).fill(0);
        this.dice.forEach(die => counts[die.getValue() - 1]++);
        return counts;
    }

    calculateScore(category) {
        const values = this.getDiceValues();
        const counts = this.countDiceValues();

        switch (category) {
            case 'as': return counts[0] * 1;
            case 'deux': return counts[1] * 2;
            case 'trois': return counts[2] * 3;
            case 'quatre': return counts[3] * 4;
            case 'cinq': return counts[4] * 5;
            case 'six': return counts[5] * 6;
            case 'brelan':
                return counts.some(count => count >= 3) ? 30 : 0;
            case 'carre':
                return counts.some(count => count >= 4) ? 40 : 0;
            case 'fullHouse':
                return counts.includes(3) && counts.includes(2) ? 35 : 0;
            case 'petiteSuite':
                return ([0, 1, 2, 3].every(i => counts[i] >= 1) ||
                        [1, 2, 3, 4].every(i => counts[i] >= 1) ||
                        [2, 3, 4, 5].every(i => counts[i] >= 1)) ? 20 : 0;
            case 'grandeSuite':
                return ([0, 1, 2, 3, 4].every(i => counts[i] === 1) ||
                        [1, 2, 3, 4, 5].every(i => counts[i] === 1)) ? 25 : 0;
            case 'yams':
                return counts.some(count => count === 5) ? 50 : 0;
            case 'chance':
                return values.reduce((acc, value) => acc + value, 0);
            default:
                return 0;
        }
    }

    playRound() {
        this.rolls = 0;
        this.resetDice();

        const rollButton = document.getElementById('rollButton');

        rollButton.onclick = () => {
            if (this.rolls < 3) {
                this.rollDice();
                this.rolls++;
                if (this.rolls === 3) {
                    document.getElementById('message').textContent = "Vous avez utilisé vos trois tours.";
                }
            }
        };
    }

    markScore(cell) {
        const category = cell.dataset.category;
        const player = this.players[this.currentPlayerIndex];
        if (!player.scoreSheet[category]) {
            const score = this.calculateScore(category);
            player.addScore(category, score);
            this.updateScoreboard();
            this.nextPlayer();
        } else {
            alert("Cette catégorie a déjà été utilisée. Choisissez-en une autre.");
        }
    }

    updateScoreboard() {
        this.players.forEach((player, index) => {
            Object.keys(player.scoreSheet).forEach(category => {
                document.getElementById(`player${index}-${category}`).textContent = player.scoreSheet[category];
            });
            document.getElementById(`player${index}-total`).textContent = player.getTotalScore();
        });
    }

    resetDice() {
        this.dice.forEach(die => die.reset());
        this.updateDiceDisplay();
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        document.getElementById('message').textContent = "";
        this.updateCurrentPlayerDisplay();
        this.updateSuggestions();
        if (this.currentPlayerIndex === 0) {
            this.round++;
        }
        if (this.isGameOver()) {
            const winner = this.getWinner();
            alert(`Le gagnant est ${winner.name} avec un score de ${winner.getTotalScore()}`);
        } else {
            this.playRound();
        }
    }

    isGameOver() {
        return this.round > this.maxRounds;
    }

    getWinner() {
        return this.players.reduce((winner, player) => (player.getTotalScore() > winner.getTotalScore() ? player : winner));
    }

    updateCurrentPlayerDisplay() {
        document.getElementById('currentPlayer').textContent = `Joueur actuel : ${this.players[this.currentPlayerIndex].name}`;
    }

    updateSuggestions() {
        const player = this.players[this.currentPlayerIndex];
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';
        const availableCategories = player.getAvailableCategories();
        const counts = this.countDiceValues();
        const values = this.getDiceValues();

        const possibleCategories = availableCategories.filter(category => {
            switch (category) {
                case 'as': return values.includes(1);
                case 'deux': return values.includes(2);
                case 'trois': return values.includes(3);
                case 'quatre': return values.includes(4);
                case 'cinq': return values.includes(5);
                case 'six': return values.includes(6);
                case 'brelan': return counts.some(count => count >= 3);
                case 'carre': return counts.some(count => count >= 4);
                case 'fullHouse': return counts.includes(3) && counts.includes(2);
                case 'petiteSuite': return ([0, 1, 2, 3].every(i => counts[i] >= 1) ||
                                            [1, 2, 3, 4].every(i => counts[i] >= 1) ||
                                            [2, 3, 4, 5].every(i => counts[i] >= 1));
                case 'grandeSuite': return ([0, 1, 2, 3, 4].every(i => counts[i] === 1) ||
                                            [1, 2, 3, 4, 5].every(i => counts[i] === 1));
                case 'yams': return counts.some(count => count === 5);
                case 'chance': return true;
                default: return false;
            }
        });

        possibleCategories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.onclick = () => {
                const score = this.calculateScore(category);
                player.addScore(category, score);
                this.updateScoreboard();
                this.nextPlayer();
            };
            suggestionsList.appendChild(li);
        });
    }

    start() {
        this.playRound();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('setupButton').onclick = () => {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const playerInputs = document.getElementById('playerInputs');
        playerInputs.innerHTML = '';
        for (let i = 0; i < numPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Nom du joueur ${i + 1}`;
            input.id = `player${i}`;
            input.classList.add('border', 'ml-2');
            playerInputs.appendChild(input);
        }
        document.getElementById('startButton').style.display = 'block';
        playerInputs.style.display = 'block';
        document.getElementById('setupButton').style.display = 'none'
    };

    document.getElementById('startButton').onclick = () => {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const players = [];
        for (let i = 0; i < numPlayers; i++) {
            const playerName = document.getElementById(`player${i}`).value;
            if (playerName) {
                players.push(playerName);
            }
        }

        if (players.length === numPlayers) {
            document.getElementById('setup').style.display = 'none';
            document.getElementById('game').style.display = 'block';
            const game = new YamsGame(players);
            game.start();
        } else {
            alert("Veuillez entrer les noms de tous les joueurs.");
        }
    };
});
