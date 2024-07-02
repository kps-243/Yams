import Player from "./player.js";
import YamsGame from "./YamsGame.js";

class ScoreBoard {
    constructor(YamsGame) {
        this.game = YamsGame;
        this.scores = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            brelan: null,
            square: null,
            full: null,
            smallStraight: null,
            largeStraight: null,
            yams: null,
            chance: null
        };
    }

    recordScore(category, points) {
        if (this.scores[category] === null) { // Vérifie si la catégorie est déjà marquée
            this.scores[category] = points; // Enregistre le score
        } else {
            console.log(`Category ${category} already scored.`); // Message si la catégorie est déjà marquée
        }
    }

    totalUpperSection() {
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        return upperCategories.reduce((total, category) => total + (this.scores[category] || 0), 0);
    }

    totalLowerSection() {
        const lowerCategories = ['brelan', 'square', 'full', 'smallStraight', 'largeStraight', 'yams', 'chance'];
        return lowerCategories.reduce((total, category) => total + (this.scores[category] || 0), 0);
    }

    totalScore() {
        return this.totalUpperSection() + this.totalLowerSection();
    }

    afficheGrid()
    {
        console.log(this.game);
            // Obtenir le nombre de joueurs
            const numberOfPlayers = parseInt(document.getElementById('number-of-players').value);
            // Sélectionner le conteneur de la grille
            const container = document.getElementById('grid-container');
            // Vider le conteneur de la grille avant de générer une nouvelle grille
            container.innerHTML = '';
        
            // Créer la grille
            const grid = document.createElement('div');
            grid.className = 'grid text-center bg-[#F5F3E2] ';
            grid.style.gridTemplateColumns = `repeat(${numberOfPlayers + 1}, minmax(0, 1fr))`;
        
            // Termes pour la colonne statique
            const staticTerms = [
                'Yams', 'As', '2', '3', '4', '5', '6', 'Total Partiel', 'Bonus', 'Total 1', 'Brelan',
                'Petite suite', 'Grande suite', 'Full', 'Carré', 'Chance', 'Yam', 'Total 2', 'Score final',
            ];
        
            // Créer la colonne statique
            const staticCol = document.createElement('div');
            staticCol.className = 'border p-4 rounded';
        
            staticTerms.forEach(term => {
                const row = document.createElement('div');
                row.className = 'border-y flex items-center justify-center'; // Centrer le contenu horizontalement et verticalement
                row.style.minHeight = '66px'; // Définir une hauteur minimale
                row.textContent = term;
                staticCol.appendChild(row);
            });
        
            grid.appendChild(staticCol);
        
            // Générer les colonnes dynamiques pour chaque joueur
            for (let i = 0; i < numberOfPlayers; i++) {
                const col = document.createElement('div');
                col.className = 'border p-4 rounded';
            
                const playerHeader = document.createElement('div');
                playerHeader.className = 'text-center font-bold border-y py-2 flex items-center justify-center';
                playerHeader.style.minHeight = '66px'; // Définir une hauteur minimale
                playerHeader.textContent = `${this.game}`;
                col.appendChild(playerHeader);
            
                // Générer les lignes pour chaque joueur
                staticTerms.forEach(term => {
                    const row = document.createElement('div');
                    row.className = 'border-y flex items-center justify-center text-gray-100 hover:text-black transition-all cursor-pointer'; // Centrer le contenu horizontalement et verticalement
                    row.style.minHeight = '66px'; // Définir une hauteur minimale
                    row.textContent = '0'; // Ajout de 0 dans chaque case des joueurs
                    col.appendChild(row);
                });
                grid.appendChild(col);
            }
            container.appendChild(grid);
        };
    }

export default ScoreBoard;
