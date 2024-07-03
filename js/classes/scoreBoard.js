import Player from "./player.js";
import YamsGame from "./YamsGame.js";

class ScoreBoard {
    constructor(YamsGame) {
        this.players = [];
        this.game = YamsGame;
    }

    recordScore(playerIndex, category, points) {
        const player = this.players[playerIndex];
        if (player.grille[category] === null) {
            player.grille[category] = points;
        } else {
            console.log(`Category ${category} already scored for player ${player.name}.`);
        }
    }

    totalUpperSection(player) {
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        return upperCategories.reduce((total, category) => total + (player.grille[category] || 0), 0);
    }

    totalLowerSection(player) {
        const lowerCategories = ['brelan', 'square', 'full', 'smallStraight', 'largeStraight', 'yams', 'chance'];
        return lowerCategories.reduce((total, category) => total + (player.grille[category] || 0), 0);
    }

    totalScore(player) {
        return this.totalUpperSection(player) + this.totalLowerSection(player);
    }

    startGame(numberOfPlayers) {
        this.players = [];

        for (let i = 0; i < numberOfPlayers; i++) {
            const playerName = document.getElementById(`player-${i}`).value;
            this.players.push(new Player(playerName));
        }

        this.afficheGrid(numberOfPlayers);
    }

    generatePlayerInputs() {
        const numberOfPlayers = parseInt(document.getElementById('number-of-players').value);
        const playerInputsContainer = document.getElementById('generate-player-inputs');

        playerInputsContainer.innerHTML = '';

        for (let i = 0; i < numberOfPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Player ${i + 1} name`;
            input.id = `player-${i}`;
            playerInputsContainer.appendChild(input);
        }

        const startGameButton = document.createElement('button');
        startGameButton.className = "lg:px-6 px-4 py-2 h-fit bg-blue-500 rounded-[75px] flex items-center text-white gap-4 hover:bg-[#F5F3E2] hover:text-black transition-all";
        startGameButton.textContent = 'Start Game';
        playerInputsContainer.appendChild(startGameButton);
        startGameButton.addEventListener("click", () => {
            this.startGame(numberOfPlayers);
        });
    }

    afficheGrid(numberOfPlayers) {
        const container = document.getElementById('grid-container');
        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'grid text-center bg-[#F5F3E2]';
        grid.style.gridTemplateColumns = `repeat(${numberOfPlayers + 1}, minmax(0, 1fr))`;

        const staticTerms = [
            'Yams', 'As', '2', '3', '4', '5', '6', 'Total Partiel', 'Bonus', 'Total 1', 'Brelan',
            'Petite suite', 'Grande suite', 'Full', 'Carré', 'Chance', 'Yam', 'Total 2', 'Score final',
        ];

        const staticCol = document.createElement('div');
        staticCol.className = 'border p-4 rounded';

        staticTerms.forEach(term => {
            const row = document.createElement('div');
            row.className = 'border-y flex items-center justify-center';
            row.style.minHeight = '66px';
            row.textContent = term;
            staticCol.appendChild(row);
        });

        grid.appendChild(staticCol);

        for (let i = 0; i < numberOfPlayers; i++) {
            const col = document.createElement('div');
            col.className = 'border p-4 rounded';

            const playerHeader = document.createElement('div');
            playerHeader.className = 'text-center font-bold border-y py-2 flex items-center justify-center';
            playerHeader.style.minHeight = '66px';
            playerHeader.textContent = this.players[i].name;
            col.appendChild(playerHeader);

            staticTerms.forEach(term => {
                const row = document.createElement('div');
                row.className = 'border-y flex items-center justify-center text-gray-100 hover:text-black transition-all cursor-pointer';
                row.style.minHeight = '66px';
                row.textContent = '0';

                // Ajouter un écouteur d'événement pour chaque cellule
                row.addEventListener('click', () => {
                    const points = prompt(`Enter points for ${term} for player ${this.players[i].name}:`);
                    this.recordScore(i, term.toLowerCase(), parseInt(points, 10));
                    row.textContent = points;
                });

                col.appendChild(row);
            });

            grid.appendChild(col);
        }

        container.appendChild(grid);
    }
}

export default ScoreBoard;
